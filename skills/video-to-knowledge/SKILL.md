---
name: video-to-knowledge
description: 通用视频学习与知识库沉淀工作流（Harness通用版·适配Antigravity/ClaudeCode/Codex/Hermes）。无论输入来自B站、YouTube、X还是本地音视频，支持【高保真原貌切片复刻】（零主观加工、结构化分段、原文字幕附录）与【六段式深度学习资料】（痛点解构、Mermaid架构图、高危盲区、实战载荷、准出清单），并直接输出适配Obsidian/Notion的YAML Frontmatter知识库卡片。
---

# Video-to-Knowledge 视频学习与知识库沉淀规范 (Harness 通用版)

本规范定义了各类主流 Agent Harness（包括 Antigravity、Claude Code、OpenAI Codex、Hermes/HermesStudio）在接收到音视频链接或文稿时，统一执行的标准化提取、切片、研读与知识库沉淀流程。

---

## 1. 核心定位与原则

1. **双模式精准分流**：
   - **模式 A【高保真原貌切片复刻档】**：零主观推演，零 AI 脑补。将视频按时间戳精准切片，忠实记录演讲者原话，文末保留完整逐字稿附录作为一手不可篡改事实源。
   - **模式 B【六段式深度学习研读案】**：去粗取精，直击本质。提炼底层心法、绘制 Mermaid 架构时序拓扑、主动补全工业级异常盲区，并沉淀可落地的 Checklist。
2. **知识库原生兼容 (PKM-Native)**：
   - 所有输出 Markdown 必须自带符合规范的 YAML Frontmatter 元数据，原生支持 Obsidian、Logseq、Notion 的 Dataview 自动聚合。
3. **跨 Harness 环境解耦 (Harness Agnostic)**：
   - 不依赖特定平台的私有 API；提供从终端脚本、API 查询到直接输入文稿的多级降级容灾。

---

## 2. 自然语言隐式触发与多层语义路由规约 (Natural Language Semantic Routing)

**静默自激活原则**：当用户在对话中发送任意主流音视频 URL（B站 `bilibili.com`/`b23.tv`、YouTube `youtube.com`/`youtu.be`、X/Twitter `x.com`/`twitter.com`、播客或本地视频），或直接贴入带时间戳的文稿段落，并表达学习、整理、切片、总结、做笔记意图时，**严禁要求用户记忆或输入特定前缀指令**，智能体自动依据自然语言语境进行意图分类与分流：

| 意图分类 | 核心语境与自然语言触发特征 | 典型用户日常表达样例 | 自动路由行为 | 产物规范引用 |
| :--- | :--- | :--- | :--- | :--- |
| **类别一：原貌切片复刻**<br>*(Fidelity & Slicing)* | 强调**一手事实、客观记录、原话无修改、时间轴切片、完整逐字稿**。 | • “帮我把这个视频切片一下，原话不要改动”<br>• “提取这个视频的字幕，分段整理好存进知识库”<br>• “还原一下这个演讲的逐字稿，带上时间戳”<br>• “这个视频纯复刻为文档，不要 AI 脑补总结” | 激活 **模式 A**：严格按时间戳分段，忠实还原讲师发言原意，文末附加全量逐字稿附录。 | [`references/VERBATIM_SLICE_TEMPLATE.md`](references/VERBATIM_SLICE_TEMPLATE.md) |
| **类别二：深度研读提炼**<br>*(Deep Synthesis)* | 强调**提炼干货、解构架构、核心心法、避坑指南、做成学习资料**。 | • “这个视频讲了什么核心干货？总结一下”<br>• “帮我拆解一下这个视频里的系统架构设计”<br>• “提炼成六段式学习笔记沉淀到 Obsidian”<br>• “有哪些工业级踩坑点？总结下讲师的心法和自检表” | 激活 **模式 B**：全景时间轴 + Mermaid 架构时序图 + 底层机理 + 高危反模式 + 实战载荷 + 自检清单。 | [`references/SIX_SECTION_TEMPLATE.md`](references/SIX_SECTION_TEMPLATE.md) |
| **类别三：缺省/模糊意图**<br>*(Smart Adaptive Hybrid)* | 用户仅贴入链接，或用极简口语表达（如“看看这个”、“学一下这个”）。 | • “https://www.bilibili.com/video/BV1xxxxxx”<br>• “看看这个视频：https://x.com/...”<br>• “帮我整理这个视频” | 激活 **智能融合模式**：正文输出模式 B 高密度研读，文末通过折叠块完整附带模式 A 一手时间戳字轨。 | 融合模式 (B为主体 + A为折叠附录) |

> 详细的自然语言测试用例与实体提取规范见 [`references/NATURAL_LANGUAGE_TRIGGER_SPEC.md`](references/NATURAL_LANGUAGE_TRIGGER_SPEC.md)。

---

## 3. 多源音视频提取协议 (Ingestion Protocol)

### 3.1 B站 (Bilibili)
1. **优先自动探测**：提取链接中的 BV 号，调用 `scripts/bilibili_extractor.py` 获取官方字幕与视频分段。
2. **无字幕/反爬降级**：若接口返回 412 或视频无官方字幕，提示用户通过网页端“展开文稿”一键复制文本，贴入后即可秒级格式化。

### 3.2 YouTube
1. **优先自动提取**：调用 YouTube Transcript API 或提取 `timedtext` 获得带时间戳的原文。
2. **备用机制**：配合 `yt-dlp --write-auto-sub` 提取 VTT 格式字幕。

### 3.3 X (Twitter)
1. **短视频/配推文**：结合推文正文上下文解析。
2. **长视频**：提取媒体流后通过 ASR 语音识别；或引导用户直接复制推文核心 Thread 内容。

---

## 4. 交付质量标准与质检门禁

任何生成的文档必须经过以下检查：
- [ ] **元数据完整性**：头部 YAML Frontmatter 必须包含 `title`, `source_url`, `platform`, `author`, `duration`, `tags`, `type`。
- [ ] **时间戳精准性**：切片时间戳必须真实有效，格式统一为 `[MM:SS]` 或 `[HH:MM:SS]`。
- [ ] **事实忠实度（模式 A）**：严禁出现幻觉或自行推演的结论，必须忠实还原原声原意。
- [ ] **工程载荷可用性（模式 B）**：必须包含可复制的 Mermaid 图表或配置文件，严禁通篇空洞废话。
- [ ] **知识库同步闭环**：在支持的本地环境中，执行同步命令（如 `python sync_to_desktop.py`）完成经验库归档。
