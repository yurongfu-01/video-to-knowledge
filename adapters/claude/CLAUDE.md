# Claude Code 平台适配指南 (Claude Code Harness Adaptor)

在 Anthropic Claude Code 环境下，本技能可作为项目专属规范或全局用户 Prompt 载入。

---

## 1. 配置方式

将本文件内容或规则追加至工作区根目录的 `CLAUDE.md`：

```markdown
## Video Learning & PKM Specification
When processing video links (Bilibili, YouTube, X):
1. Distinguish user intent:
   - "复刻" / "切片": Execute Mode A (Verbatim timestamp slicing + transcript appendix).
   - "总结" / "学习资料": Execute Mode B (Six-section deep synthesis with Mermaid architecture & checklist).
2. Always prepend valid YAML Frontmatter for Obsidian PKM.
3. Keep raw facts untampered for Mode A; supply edge cases and engineering payloads for Mode B.
```

---

## 2. 命令行与 Bash 工具配合

Claude Code 可直接运行：
```bash
python skills/video-to-knowledge/scripts/bilibili_extractor.py "https://www.bilibili.com/video/BV1xxxxxx"
```
提取字幕流后，通过 Claude 3.5 Sonnet / Opus 强大的长上下文进行高保真分段与深度研读。
