# Antigravity 平台适配指南 (Antigravity Harness Adaptor)

在 Google Antigravity 环境下，`video-to-knowledge` 以全局 Skill 或项目工作区 Skill 的形态运行。

---

## 1. 激活与加载

* **全局安装位置**：`C:\Users\jiang\.gemini\config\skills\video-to-knowledge\SKILL.md`
* **工作区安装位置**：`<workspace_root>\.agents\skills\video-to-knowledge\SKILL.md`

### 自动激活与自然语言理解
在 Antigravity 环境下，无需用户输入 `/command` 或记忆固定前缀。只要用户的消息满足以下条件即可自动静默激活：
1. **输入特征**：包含 B站 (bilibili.com/b23.tv)、YouTube (youtube.com/youtu.be)、X (x.com/twitter.com) 等视频链接或文稿片段；
2. **意图特征**：表达了“切片”、“原貌”、“还原”、“总结”、“学一下”、“拆解架构”、“做成笔记”等诉求；
3. **自适应路由**：Antigravity 将根据用户口语特征自动在模式 A（原貌切片）与模式 B（六段式研读）之间精准分流。

---

## 2. 工具链配合

1. **终端执行**：调用 `run_command` 执行 `python scripts/bilibili_extractor.py <URL>` 抓取字幕。
2. **文件写入**：调用 `write_to_file` 将生成的 Markdown 笔记存入知识库目标目录。
3. **桌面同步闭环**：任务完成前调用 `python sync_to_desktop.py` 触发经验库同步。
