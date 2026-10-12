#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bilibili 视频元数据与官方/AI 字幕提取器 (Bilibili Subtitle & Meta Extractor)
无需第三方重型依赖，使用 Python 标准库实现毫秒级字幕拉取与时间戳对齐。
"""

import sys
import re
import json
import urllib.request
import urllib.parse
from typing import Dict, List, Any, Optional

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

def format_timestamp(seconds: float) -> str:
    """将秒数格式化为 [MM:SS] 或 [HH:MM:SS]"""
    s = int(seconds)
    hours = s // 3600
    minutes = (s % 3600) // 60
    secs = s % 60
    if hours > 0:
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    return f"{minutes:02d}:{secs:02d}"

def extract_bvid(url_or_bvid: str) -> Optional[str]:
    """从链接或字符串中提取 BV 号"""
    match = re.search(r"(BV[a-zA-Z0-9]{10})", url_or_bvid, re.IGNORECASE)
    if match:
        return match.group(1)
    return None

def fetch_json(url: str) -> Dict[str, Any]:
    """通过标准库发送 GET 请求并解析 JSON"""
    req = urllib.request.Request(url, headers={
        "User-Agent": USER_AGENT,
        "Referer": "https://www.bilibili.com"
    })
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = resp.read().decode("utf-8")
        return json.loads(data)

def get_video_info(bvid: str) -> Dict[str, Any]:
    """获取视频基础信息与 CID"""
    view_url = f"https://api.bilibili.com/x/web-interface/view?bvid={bvid}"
    resp = fetch_json(view_url)
    if resp.get("code") != 0:
        raise RuntimeError(f"获取视频信息失败: {resp.get('message', '未知错误')}")
    data = resp["data"]
    return {
        "bvid": data["bvid"],
        "aid": data["aid"],
        "cid": data["cid"],
        "title": data["title"],
        "desc": data["desc"],
        "owner": data["owner"]["name"],
        "duration": data["duration"],
        "pic": data["pic"],
        "pubdate": data["pubdate"]
    }

def get_subtitles(bvid: str, cid: int) -> List[Dict[str, Any]]:
    """获取视频的官方或 AI 字幕列表"""
    player_url = f"https://api.bilibili.com/x/player/v2?bvid={bvid}&cid={cid}"
    resp = fetch_json(player_url)
    if resp.get("code") != 0:
        return []
    subtitle_info = resp.get("data", {}).get("subtitle", {})
    subtitles = subtitle_info.get("subtitles", [])
    return subtitles

def fetch_subtitle_body(sub_url: str) -> List[Dict[str, Any]]:
    """下载并解析字幕 JSON 正文"""
    if sub_url.startswith("//"):
        sub_url = "https:" + sub_url
    resp = fetch_json(sub_url)
    # B站字幕结构通常为 {"body": [{"from": 0.0, "to": 1.5, "content": "..."}]}
    return resp.get("body", [])

def main():
    if len(sys.argv) < 2:
        print("用法: python bilibili_extractor.py <B站视频链接或BV号> [--json | --markdown]")
        sys.exit(1)

    target = sys.argv[1]
    output_mode = sys.argv[2] if len(sys.argv) > 2 else "--markdown"

    bvid = extract_bvid(target)
    if not bvid:
        print(f"错误: 无法从 '{target}' 中识别出有效的 BV 号！", file=sys.stderr)
        sys.exit(1)

    try:
        info = get_video_info(bvid)
        subs = get_subtitles(bvid, info["cid"])
        
        body = []
        sub_lang = "无字幕"
        if subs:
            # 优先中文字幕
            selected_sub = subs[0]
            for s in subs:
                if "zh" in s.get("lan", "").lower():
                    selected_sub = s
                    break
            sub_lang = selected_sub.get("lan_doc", "默认字幕")
            sub_url = selected_sub.get("subtitle_url", "")
            if sub_url:
                body = fetch_subtitle_body(sub_url)

        if output_mode == "--json":
            output = {
                "meta": info,
                "subtitle_lang": sub_lang,
                "segments": [
                    {
                        "start": item["from"],
                        "end": item["to"],
                        "timestamp": format_timestamp(item["from"]),
                        "text": item["content"]
                    }
                    for item in body
                ]
            }
            print(json.dumps(output, ensure_ascii=False, indent=2))
        else:
            # Markdown 格式输出
            print(f"# {info['title']}")
            print(f"> **UP主**：{info['owner']}  ")
            print(f"> **时长**：{format_timestamp(info['duration'])} | **字幕状态**：{sub_lang}  ")
            print(f"> **源链接**：https://www.bilibili.com/video/{bvid}\n")
            print("## 视频简介")
            print(info['desc'].strip() + "\n")
            
            if body:
                print("## 原始逐字稿附录")
                for item in body:
                    ts = format_timestamp(item["from"])
                    print(f"- **[{ts}]** {item['content']}")
            else:
                print("*(提示: 该视频暂无官方/AI外挂字幕，建议使用本地 ASR 转录或贴入文稿)*")

    except Exception as e:
        print(f"提取过程出错: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
