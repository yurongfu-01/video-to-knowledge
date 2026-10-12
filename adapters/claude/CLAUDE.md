# Claude Code 平台适配指南 (Claude Code Harness Adaptor)

在 Anthropic Claude Code 环境下，本技能可作为项目专属规范或全局用户 Prompt 载入。

---

## 1. 配置方式

将本文件内容或规则追加至工作区根目录的 `CLAUDE.md`：

```markdown
## Video Learning & PKM Specification
When user shares any video link (Bilibili, YouTube, X/Twitter, podcasts) or transcript:
1. Automatically infer intent from natural language without requiring exact prefixes:
   - Verbatim / Slice Intent ("帮我切片", "不要改动原话", "提取字幕", "保留逐字稿"):
     -> Execute Mode A (High-fidelity verbatim slicing + transcript appendix).
   - Synthesis / Study Intent ("总结一下", "核心干货", "拆解架构", "做成学习笔记"):
     -> Execute Mode B (Six-section deep synthesis with Mermaid architecture & checklist).
   - Neutral / Casual Drop ("看看这个", or just raw link):
     -> Execute Smart Hybrid (Mode B deep synthesis + collapsed Mode A transcript appendix).
2. Always prepend valid YAML Frontmatter for Obsidian PKM.
3. Automatically capture user tags and categories mentioned in conversation.
```

---

## 2. 命令行与 Bash 工具配合

Claude Code 可直接运行：
```bash
python skills/video-to-knowledge/scripts/bilibili_extractor.py "https://www.bilibili.com/video/BV1xxxxxx"
```
提取字幕流后，通过 Claude 3.5 Sonnet / Opus 强大的长上下文进行高保真分段与深度研读。
