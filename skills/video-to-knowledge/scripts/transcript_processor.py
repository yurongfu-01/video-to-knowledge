#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
智能文稿分片与知识库格式化处理器 (Transcript Slicer & PKM Formatter)
将原始音视频字幕转化为标准结构化分段切片，并生成适配 Obsidian / Notion 的 YAML Frontmatter。
"""

import sys
import re
import json
from typing import List, Dict, Any

def parse_lines_to_segments(text: str) -> List[Dict[str, str]]:
    """
    解析带时间戳的文稿行，如:
    - [00:15] 各位同学好
    - 01:23 接下来我们看这个架构
    """
    segments = []
    pattern = re.compile(r"(?:\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?)\s*(.*)")
    for line in text.strip().splitlines():
        line = line.strip()
        if not line:
            continue
        m = pattern.search(line)
        if m:
            segments.append({
                "timestamp": m.group(1),
                "content": m.group(2).strip()
            })
        else:
            if segments:
                segments[-1]["content"] += " " + line
            else:
                segments.append({
                    "timestamp": "00:00",
                    "content": line
                })
    return segments

def generate_mode_a_skeleton(title: str, url: str, author: str, segments: List[Dict[str, str]]) -> str:
    """生成模式 A：高保真原貌切片复刻档骨架"""
    out = []
    out.append("---")
    out.append(f"title: \"{title}\"")
    out.append(f"source_url: \"{url}\"")
    out.append(f"author: \"{author}\"")
    out.append("type: \"video-slice-replication\"")
    out.append("tags:")
    out.append("  - 学习笔记/原貌切片")
    out.append("  - 视频复刻")
    out.append("status: \"已归档\"")
    out.append("---\n")
    out.append(f"# 原貌复刻档：{title}\n")
    out.append(f"> **源链接**：{url}  ")
    out.append(f"> **讲师/作者**：{author}  ")
    out.append("> **复刻准则**：零主观脑补、保持一手发言事实、结构化时间切片与完整附录。\n")
    out.append("---\n")
    out.append("## 目录索引 (Table of Contents)\n")
    
    # 简要切片目录
    for i, s in enumerate(segments[::max(1, len(segments)//8)]):
        out.append(f"- `[{s['timestamp']}]` 章节切片 {i+1}：{s['content'][:30]}...")
    
    out.append("\n---\n")
    out.append("## 详细结构化切片 (Detailed Timestamped Slices)\n")
    
    chunk_size = max(1, len(segments) // 6) if segments else 1
    for i in range(0, len(segments), chunk_size):
        chunk = segments[i:i+chunk_size]
        start_ts = chunk[0]["timestamp"]
        end_ts = chunk[-1]["timestamp"]
        out.append(f"### `[{start_ts} - {end_ts}]` 核心切片 {i//chunk_size + 1}\n")
        out.append("**【发言原意要点】**：")
        # 提取关键句
        summary_points = [c["content"] for c in chunk[:3]]
        for pt in summary_points:
            out.append(f"- {pt}")
        out.append("")
    
    out.append("---\n")
    out.append("## 附录：完整逐字文稿 (Verbatim Transcript)\n")
    for s in segments:
        out.append(f"- **`[{s['timestamp']}]`** {s['content']}")
    
    return "\n".join(out)

def main():
    if len(sys.argv) < 2:
        print("用法: python transcript_processor.py <文稿文件路径>")
        sys.exit(1)
    
    filepath = sys.argv[1]
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    segs = parse_lines_to_segments(content)
    skeleton = generate_mode_a_skeleton("示例文档", "https://...", "作者", segs)
    print(skeleton)

if __name__ == "__main__":
    main()
