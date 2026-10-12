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

## 2. 意图路由规约 (Intent Routing)

当用户输入音视频 URL 或文稿时，根据指令关键词自动路由到对应处理模式：

| 用户指令模式 | 触发关键词示例 | 输出规格 | 引用模板 |
| :--- | :--- | :--- | :--- |
| **模式 A：高保真原貌切片** | `复刻`、`切片`、`原貌`、`逐字还原`、`原样文档` | 时间戳章节目录 + 详细原貌要点切片 + 完整逐字稿附录 | `references/VERBATIM_SLICE_TEMPLATE.md` |
| **模式 B：六段式深度研读** | `总结`、`研读`、`学习资料`、`深度分析`、`提炼` | 元数据 + 全景时间轴 + 机理拆解 + 高危盲区 + 实战载荷 + 准出清单 | `references/SIX_SECTION_TEMPLATE.md` |
| **未明确指定** | 仅粘贴链接无其他修饰 | 默认先输出**模式 B 核心研读大纲**，并提示用户是否需要生成模式 A 完整逐字切片档。 | - |

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
