# Obsidian / Notion 个人知识库对接与渲染规范 (PKM Integration Spec)

本规范定义了生成的视频学习文档如何完美兼容并融入 **Obsidian、Logseq、Notion** 等现代双链笔记与个人知识管理系统。

---

## 1. YAML Frontmatter 标准字段规约

每篇生成的 Markdown 文档头部必须包含以下键值对，以便 Obsidian Dataview 插件进行自动化表格索引与看板聚合：

| 字段名 | 类型 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| `title` | string | 视频完整或提炼标题 | `"分布式事务全景架构拆解"` |
| `source_url` | string | 原始网页地址 | `"https://www.bilibili.com/video/BV1xx..."` |
| `platform` | enum | 平台来源 | `Bilibili` \| `YouTube` \| `X` \| `Local` |
| `author` | string | UP主 / 博主 / 机构名称 | `"架构师老张"` |
| `duration` | string | 视频时长 | `"28:45"` |
| `date` | date | 归档提取日期 (YYYY-MM-DD) | `2026-10-12` |
| `type` | enum | 文档形态 | `video-verbatim-slice` \| `video-deep-synthesis` |
| `tags` | list | 分类标签 | `[学习笔记/架构设计, 视频切片]` |
| `status` | enum | 阅读与复习状态 | `未读` \| `研读中` \| `已归档` |

---

## 2. 时间戳超链接与播放器跳播联动 (Deep Linking)

在 Obsidian 中配合 `obsidian-media-notes` 或 `Media Extended` 插件，时间戳格式可直接激活播放器定位：

1. **标准时间戳标签**：
   - 使用统一的反引号加粗格式：`**`[05:23]`**`
2. **Obsidian Media Extended 语法**：
   - 当引用本地或嵌入视频时，可通过锚点跳转：
     `![[video.mp4#t=05:23]]`
3. **YouTube 原生时间戳 URL 锚点**：
   - 网页跳转直连：`https://youtube.com/watch?v=xxx&t=323s`
4. **Bilibili 原生时间戳 URL 锚点**：
   - 网页跳转直连：`https://www.bilibili.com/video/BV1xxx?t=323`

---

## 3. Obsidian Dataview 自动聚合脚本示例

在你的知识库根目录或看板页面中，新建一个 `视频学习看板.md`，粘贴以下 Dataview 脚本即可实时聚合所有已归档的视频切片与深度总结：

````markdown
```dataview
TABLE 
  author AS "讲师/UP主", 
  platform AS "平台", 
  duration AS "时长", 
  type AS "模式", 
  date AS "归档日期"
FROM #视频切片 OR #学习笔记/深度研读
SORT date DESC
```
````

---

## 4. 视觉高亮与 GitHub/Obsidian Callout 规范

在文档中强烈建议使用标准 Callout 语法提升视觉层级：

- `> [!NOTE]`：概念注解、背景补充
- `> [!TIP]`：高效学习建议、快速定位技巧
- `> [!IMPORTANT]`：讲师强调的核心必背心法
- `> [!WARNING]`：工业级踩坑点与容易忽略的隐性影响
- `> [!CAUTION]`：高危反模式与生产事故隐患
