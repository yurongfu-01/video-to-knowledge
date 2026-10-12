# Antigravity 平台适配指南 (Antigravity Harness Adaptor)

在 Google Antigravity 环境下，`video-to-knowledge` 以全局 Skill 或项目工作区 Skill 的形态运行。

---

## 1. 激活与加载

* **全局安装位置**：`C:\Users\jiang\.gemini\config\skills\video-to-knowledge\SKILL.md`
* **工作区安装位置**：`<workspace_root>\.agents\skills\video-to-knowledge\SKILL.md`

当用户在对话中发送视频 URL 并带有“复刻/切片/总结/研读”等关键词时，Antigravity 自动激活本 Skill。

---

## 2. 工具链配合

1. **终端执行**：调用 `run_command` 执行 `python scripts/bilibili_extractor.py <URL>` 抓取字幕。
2. **文件写入**：调用 `write_to_file` 将生成的 Markdown 笔记存入知识库目标目录。
3. **桌面同步闭环**：任务完成前调用 `python sync_to_desktop.py` 触发经验库同步。
