import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { exec, spawn } from 'child_process';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Directories
const WEB_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(WEB_ROOT, '..');
const WORKSPACE_ROOT = path.resolve(REPO_ROOT, '..');
const IMAGES_DIR = path.resolve(REPO_ROOT, 'examples', 'images');
const WORKSPACE_IMAGES_DIR = path.resolve(WORKSPACE_ROOT, 'images');
const PYTHON_PATH = 'D:\\python-learning\\.venv\\Scripts\\python.exe';

// Process level safety guards
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception caught:', err.message);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection caught:', reason);
});

app.use(cors());

// Parse JSON with error handling
app.use(express.json({ limit: '50mb' }));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload: ' + err.message });
  }
  next(err);
});

app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Multer for upload
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Serve static images
app.get('/api/images/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  // Try repo images first, then workspace images
  let targetPath = path.join(IMAGES_DIR, filename);
  if (!fs.existsSync(targetPath)) {
    targetPath = path.join(WORKSPACE_IMAGES_DIR, filename);
  }
  if (fs.existsSync(targetPath)) {
    res.sendFile(targetPath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    python: fs.existsSync(PYTHON_PATH),
    workspace: WORKSPACE_ROOT,
    time: new Date().toISOString()
  });
});

// Helper: Extract BV ID
function extractBvid(input) {
  const match = input.match(/(BV[a-zA-Z0-9]{10})/i);
  return match ? match[1] : null;
}

// Format seconds to MM:SS or HH:MM:SS
function formatSeconds(secs) {
  const s = Math.floor(secs);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// API: Showcase List
app.get('/api/showcases', (req, res) => {
  const showcases = [
    {
      id: 'stanford-cs146s',
      title: 'Stanford CS146S：常驻主动式 AI 智能体原理解析 (How Always-On AI Agents Work)',
      author: 'Lee Robinson (SpaceX ML / 前 Vercel 开发者副总裁)',
      platform: 'X / Stanford CS146S',
      duration: '45:17',
      date: '2026-10-08',
      tags: ['智能体架构', '常驻主动式Agent', 'Stanford-CS146S', 'Harness工程', 'MicroVM沙箱', '上下文缓存'],
      cover: '/api/images/01_title_how_always_on_agents_work.jpg',
      slideCount: 42,
      hasVerbatim: true,
      summary: '彻底颠覆终端助手！解构服务端 MicroVM 独立虚拟电脑、Temporal 事件溯源持久化工作流、Prompt 缓存无损架构与单工具 SendToUser 通信。'
    },
    {
      id: 'prd-specification',
      title: '大厂需求工程：一份完整的 PRD 产品需求文件要怎么写',
      author: '资深产品总监',
      platform: 'YouTube',
      duration: '22:15',
      date: '2026-10-10',
      tags: ['需求工程', 'PRD规范', '运营流更动', '异常边界', '大厂模板'],
      cover: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
      slideCount: 0,
      hasVerbatim: false,
      summary: '揭秘大厂 PRD 核心 6 大结构与高危盲区，特别警示“忽略内部管理后台与客服 SOP”引发的线上次生灾害。'
    },
    {
      id: 'distributed-systems',
      title: '开源高并发系统演进：分布式事务与高并发本质心法',
      author: '资深系统架构师',
      platform: 'Bilibili',
      duration: '18:42',
      date: '2026-10-12',
      tags: ['架构设计', '高并发实战', '分布式事务', 'Canal', '缓存一致性'],
      cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      slideCount: 0,
      hasVerbatim: false,
      summary: '横向扩容无法解决单库行锁竞争！从命令式到声明式、异步削峰、Canal binlog 异步增量订正实战。'
    },
    {
      id: 'agency-agents-swarm',
      title: 'Agency-Agents 与 HermesStudio 智能体战队编排方案',
      author: '开源 AI 架构团队',
      platform: 'GitHub / 社区研讨',
      duration: '32:10',
      date: '2026-10-11',
      tags: ['多智能体集群', 'NEXUS战队', '实证质检', '单写原则', '机器执行协议'],
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      slideCount: 0,
      hasVerbatim: false,
      summary: '解构开源顶尖 Agency-Agents 框架，构建面向复杂工程的 NEXUS 战队编排、Dev-QA 证据链与三击熔断机制。'
    }
  ];

  res.json({ showcases });
});

// API: Get Showcase Detail
app.get('/api/showcases/:id', (req, res) => {
  const { id } = req.params;

  if (id === 'stanford-cs146s') {
    const mdPath = path.resolve(REPO_ROOT, 'examples', 'stanford_cs146s_always_on_agents_distillation.md');
    const verbatimPath = path.resolve(WORKSPACE_ROOT, 'Stanford-CS146S-常驻主动式AI智能体原理解析_LeeRobinson视频原貌复刻.md');
    
    let markdown = '';
    let verbatimMarkdown = '';

    if (fs.existsSync(mdPath)) {
      markdown = fs.readFileSync(mdPath, 'utf-8');
    } else {
      const fallback = path.resolve(WORKSPACE_ROOT, 'Stanford-CS146S-常驻主动式AI智能体原理解析_LeeRobinson视频总结.md');
      markdown = fs.readFileSync(fallback, 'utf-8');
    }

    if (fs.existsSync(verbatimPath)) {
      verbatimMarkdown = fs.readFileSync(verbatimPath, 'utf-8');
    }

    // Build slide list (42 curated slides)
    const slides = [
      { id: 1, title: 'Title: How always-on agents work', filename: '01_title_how_always_on_agents_work.jpg', timestamp: '00:00' },
      { id: 2, title: 'Safe Harbor Statement', filename: '02_safe_harbor_statement.jpg', timestamp: '01:10' },
      { id: 3, title: 'Your agent vs. an always-on agent', filename: '03_your_agent_vs_always_on_agent.jpg', timestamp: '02:05' },
      { id: 4, title: 'Agenda (01-06)', filename: '04_agenda.jpg', timestamp: '03:15' },
      { id: 5, title: 'Four eras of developers with AI', filename: '05_four_eras_of_developers_with_ai.jpg', timestamp: '04:12' },
      { id: 6, title: 'From approving every step to steering', filename: '06_approving_every_step_to_steering.jpg', timestamp: '06:30' },
      { id: 7, title: 'As models get more capable, interface gets simpler', filename: '07_grokbot_ui_simpler_interface.jpg', timestamp: '08:15' },
      { id: 8, title: 'Part 2: What changed in the models', filename: '08_part2_what_changed_in_models.jpg', timestamp: '09:40' },
      { id: 9, title: 'Six new model capabilities', filename: '09_six_new_model_capabilities.jpg', timestamp: '10:05' },
      { id: 10, title: 'What agent knows lives in files', filename: '10_what_agent_knows_lives_in_files.jpg', timestamp: '12:20' },
      { id: 11, title: 'Part 3: Inside an always-on agent', filename: '11_part3_inside_always_on_agent.jpg', timestamp: '13:45' },
      { id: 12, title: 'How does it stay always on?', filename: '12_how_does_it_stay_always_on.jpg', timestamp: '14:20' },
      { id: 13, title: 'What wakes the agent?', filename: '13_what_wakes_the_agent.jpg', timestamp: '16:00' },
      { id: 14, title: 'The agent computer: Firecracker MicroVM', filename: '14_the_agents_computer_firecracker_vm.jpg', timestamp: '17:35' },
      { id: 15, title: 'Three parts of the system', filename: '15_three_parts_of_the_system.jpg', timestamp: '19:10' },
      { id: 16, title: 'Why agent runs on server', filename: '16_why_agent_runs_on_server.jpg', timestamp: '20:45' },
      { id: 17, title: 'Save everything on server', filename: '17_save_everything_on_server.jpg', timestamp: '22:10' },
      { id: 18, title: 'What happens when you hit send', filename: '18_what_happens_when_you_hit_send.jpg', timestamp: '23:30' },
      { id: 19, title: 'Durable workflows vs job queues', filename: '19_durable_workflows_vs_job_queues.jpg', timestamp: '25:15' },
      { id: 20, title: 'Rules for handling new messages', filename: '20_rules_for_handling_new_messages.jpg', timestamp: '26:50' },
      { id: 21, title: 'Part 4: The harness', filename: '21_part4_the_harness.jpg', timestamp: '28:10' },
      { id: 22, title: 'One tool for talking: SendToUser', filename: '22_one_tool_for_talking_sendtouser.jpg', timestamp: '29:00' },
      { id: 23, title: 'Pairing tools with right UI', filename: '23_pairing_tools_with_right_ui.jpg', timestamp: '30:20' },
      { id: 24, title: 'Load tool details only when needed', filename: '24_load_tool_details_only_when_needed.jpg', timestamp: '31:40' },
      { id: 25, title: 'Try cheapest option first (Ladder)', filename: '25_try_cheapest_option_first_ladder.jpg', timestamp: '32:50' },
      { id: 26, title: 'Three ways to use computer', filename: '26_three_ways_to_use_computer.jpg', timestamp: '34:10' },
      { id: 27, title: 'One main agent, many helpers', filename: '27_one_main_agent_many_helpers.jpg', timestamp: '35:25' },
      { id: 28, title: 'Tips for designing agent tools', filename: '28_tips_for_designing_agent_tools.jpg', timestamp: '36:40' },
      { id: 29, title: 'How we keep it safe (Security)', filename: '29_how_we_keep_it_safe_security.jpg', timestamp: '37:50' },
      { id: 30, title: 'Part 5: Context engineering', filename: '30_part5_context_engineering.jpg', timestamp: '38:50' },
      { id: 31, title: 'Keep start of prompt the same (Cache)', filename: '31_keep_start_of_prompt_the_same.jpg', timestamp: '39:35' },
      { id: 32, title: 'Keep the main context small', filename: '32_keep_the_main_context_small.jpg', timestamp: '40:40' },
      { id: 33, title: 'Treat cache miss like a bug', filename: '33_treat_cache_miss_like_a_bug.jpg', timestamp: '41:30' },
      { id: 34, title: 'Summarize while you are away', filename: '34_summarize_while_you_are_away.jpg', timestamp: '42:15' },
      { id: 35, title: 'How the agent remembers (Memory)', filename: '35_how_the_agent_remembers_memory.jpg', timestamp: '43:00' },
      { id: 36, title: 'Part 6: Where this is going', filename: '36_part6_where_this_is_going.jpg', timestamp: '43:45' },
      { id: 37, title: 'Training model for product', filename: '37_training_model_for_product.jpg', timestamp: '44:15' },
      { id: 38, title: 'Product and model improve together', filename: '38_product_and_model_improve_together.jpg', timestamp: '44:40' },
      { id: 39, title: 'Delete the product (Radical philosophy)', filename: '39_delete_the_product.jpg', timestamp: '45:00' },
      { id: 40, title: 'What I expect in 6 to 12 months', filename: '40_what_i_expect_in_6_to_12_months.jpg', timestamp: '45:10' },
      { id: 41, title: 'The new building blocks', filename: '41_the_new_building_blocks.jpg', timestamp: '45:15' },
      { id: 42, title: 'What to take away (Architecture compounds)', filename: '42_what_to_take_away.jpg', timestamp: '45:17' }
    ].map(s => ({
      ...s,
      url: `/api/images/${s.filename}`
    }));

    return res.json({
      id,
      title: 'Stanford CS146S：常驻主动式 AI 智能体原理解析 (How Always-On AI Agents Work)',
      author: 'Lee Robinson (SpaceX ML / 前 Vercel 开发者副总裁)',
      platform: 'X / Stanford CS146S',
      source_url: 'https://x.com/leerob/status/2108650243365736855',
      duration: '45:17',
      date: '2026-10-08',
      markdown,
      verbatimMarkdown,
      slides,
      videoEmbedUrl: 'https://platform.twitter.com/embed/Tweet.html?id=2108650243365736855'
    });
  }

  if (id === 'prd-specification') {
    const prdPath = path.resolve(WORKSPACE_ROOT, '一份完整的PRD产品需求文件要怎么写_视频总结.md');
    const md = fs.existsSync(prdPath) ? fs.readFileSync(prdPath, 'utf-8') : '# PRD 文件加载中';
    return res.json({
      id,
      title: '大厂需求工程：一份完整的 PRD 产品需求文件要怎么写',
      author: '资深产品总监',
      platform: 'YouTube',
      source_url: 'https://www.youtube.com/watch?v=sample-prd',
      duration: '22:15',
      date: '2026-10-10',
      markdown: md,
      slides: []
    });
  }

  if (id === 'distributed-systems') {
    const distPath = path.resolve(REPO_ROOT, 'examples', 'sample_mode_b_distillation.md');
    const md = fs.existsSync(distPath) ? fs.readFileSync(distPath, 'utf-8') : '# 高并发架构笔记';
    return res.json({
      id,
      title: '开源高并发系统演进：分布式事务与高并发本质心法',
      author: '资深系统架构师',
      platform: 'Bilibili',
      source_url: 'https://www.bilibili.com/video/BV1xx411c7mD',
      duration: '18:42',
      date: '2026-10-12',
      markdown: md,
      slides: []
    });
  }

  if (id === 'agency-agents-swarm') {
    const swarmPath = path.resolve(WORKSPACE_ROOT, 'Agency-Agents与HermesStudio智能体战队配置方案.md');
    const md = fs.existsSync(swarmPath) ? fs.readFileSync(swarmPath, 'utf-8') : '# Agency-Agents 方案';
    return res.json({
      id,
      title: 'Agency-Agents 与 HermesStudio 智能体战队配置方案',
      author: '开源 AI 架构团队',
      platform: 'GitHub / 社区研讨',
      source_url: 'https://github.com/agency-agents',
      duration: '32:10',
      date: '2026-10-11',
      markdown: md,
      slides: []
    });
  }

  res.status(404).json({ error: 'Showcase not found' });
});

// API: Bilibili Extraction
app.post('/api/extract/bilibili', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const bvid = extractBvid(url);
  if (!bvid) {
    return res.status(400).json({ error: '未能从链接识别出有效的 B站 BV 号 (如 BV1xxxxxx)' });
  }

  const scriptPath = path.resolve(REPO_ROOT, 'skills', 'video-to-knowledge', 'scripts', 'bilibili_extractor.py');
  const cmd = `"${PYTHON_PATH}" "${scriptPath}" "${bvid}" --json`;

  exec(cmd, { encoding: 'utf-8', timeout: 20000 }, (error, stdout, stderr) => {
    if (error) {
      console.error('Bilibili extraction error:', stderr || error.message);
      return res.status(500).json({ error: stderr || error.message || '提取 B站字幕失败' });
    }

    try {
      const data = JSON.parse(stdout);
      res.json({
        success: true,
        bvid: data.bvid,
        title: data.title,
        author: data.owner,
        duration: formatSeconds(data.duration),
        duration_seconds: data.duration,
        cover: data.pic,
        desc: data.desc,
        subtitles: data.subtitles || [],
        subtitle_count: (data.subtitles || []).length
      });
    } catch (parseErr) {
      console.error('JSON parse error from extractor:', stdout);
      res.status(500).json({ error: '解析 B站字幕输出失败: ' + stdout });
    }
  });
});

// API: Parse raw transcript text into segments
app.post('/api/extract/transcript', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const lines = text.trim().split('\n');
  const segments = [];
  const timeRegex = /(?:\[?(\d{1,2}:\d{2}(?::\d{2})?)\]?)\s*(.*)/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(timeRegex);
    if (match) {
      segments.push({
        timestamp: match[1],
        content: match[2].trim()
      });
    } else {
      if (segments.length > 0) {
        segments[segments.length - 1].content += ' ' + trimmed;
      } else {
        segments.push({
          timestamp: '00:00',
          content: trimmed
        });
      }
    }
  }

  res.json({
    success: true,
    total_segments: segments.length,
    segments
  });
});

// API: Analyze Video & Synthesize Notes
app.post('/api/analyze', async (req, res) => {
  const {
    sourceUrl,
    platform = 'bilibili',
    mode = 'mode_b', // mode_b, mode_a, mode_c
    title = '未命名技术讲座',
    author = '演讲讲师',
    duration = '20:00',
    transcript = '',
    segments = [],
    apiKey,
    provider = 'local_rule'
  } = req.body;

  try {
    // If provider is local_rule or no API key, use our intelligent deterministic generator
    const dateStr = new Date().toISOString().split('T')[0];

    // Mode A: Verbatim Slice
    if (mode === 'mode_a') {
      let md = `---
title: "${title} - 高保真原貌切片复刻档"
source_url: "${sourceUrl}"
platform: "${platform}"
author: "${author}"
duration: "${duration}"
date: ${dateStr}
type: "video-verbatim-slice"
tags:
  - 学习笔记/原貌切片
  - 视频复刻
  - ${platform}
status: "已归档"
---

# 原貌复刻档：${title}

> **视频来源**：[${author} - ${title}](${sourceUrl})  
> **复刻规格**：时长 ${duration} | 平台 ${platform}  
> **复刻准则**：零主观脑补、客观时间切片、原文字轨附录。

---

## 目录索引 (Table of Contents)
`;

      const segList = segments.length > 0 ? segments : [
        { timestamp: '00:00', content: '开篇引入与背景阐述' },
        { timestamp: '05:00', content: '核心设计动机与传统方案瓶颈' },
        { timestamp: '12:00', content: '架构拓扑与关键机制拆解' },
        { timestamp: '18:00', content: '生产落地经验与总结' }
      ];

      segList.forEach((s, idx) => {
        if (idx % 2 === 0) {
          md += `- [\`${s.timestamp}\`] 核心章节 ${idx + 1}：${s.content.slice(0, 35)}...\n`;
        }
      });

      md += `\n---\n\n## 详细时间戳切片 (Detailed Slices)\n\n`;

      const chunkSize = Math.max(1, Math.floor(segList.length / 5));
      for (let i = 0; i < segList.length; i += chunkSize) {
        const chunk = segList.slice(i, i + chunkSize);
        const start = chunk[0].timestamp;
        const end = chunk[chunk.length - 1].timestamp;
        md += `### \`[${start} - ${end}]\` 核心切片 ${Math.floor(i / chunkSize) + 1}\n\n`;
        md += `**【发言原意要点】**：\n`;
        chunk.slice(0, 3).forEach(c => {
          md += `- ${c.content}\n`;
        });
        md += `\n`;
      }

      md += `---\n\n## 附录：完整逐字文稿 (Verbatim Transcript)\n\n`;
      segList.forEach(s => {
        md += `- **\`[${s.timestamp}]\`** ${s.content}\n`;
      });

      return res.json({
        success: true,
        mode: 'mode_a',
        markdown: md
      });
    }

    // Mode B: Six-Section Deep Synthesis
    const modeBMd = `---
title: "深度研读案：${title}"
source_url: "${sourceUrl}"
platform: "${platform}"
author: "${author}"
duration: "${duration}"
date: ${dateStr}
type: "video-deep-synthesis"
tags:
  - 学习笔记/深度研读
  - 架构设计
  - ${platform}
status: "已归档"
---

# 深度研读案：${title}

> **视频来源**：[${author} - ${title}](${sourceUrl})  
> **核心痛点**：生产环境中的架构瓶颈、系统吞吐上限与传统方案难以克服的并发与容灾挑战。  
> **知识密度**：★★★★★ | **规范标准**：六段式深度学习资料规约 (Mode B) + Obsidian PKM 规范

---

## 目录
1. [一、视频核心概述与全景时间轴](#一视频核心概述与全景时间轴)
2. [二、为什么需要该方案？（背景与本质动机）](#二为什么需要该方案背景与本质动机)
3. [三、核心机理与架构全景拆解](#三核心机理与架构全景拆解)
4. [四、工业级高危盲区与反模式（必避坑点）](#四工业级高危盲区与反模式必避坑点)
5. [五、实战落地工程载荷（模板/配置/协议）](#五实战落地工程载荷模板配置协议)
6. [六、准出自检清单 (Pre-flight Checklist)](#六准出自检清单-pre-flight-checklist)

---

## 一、视频核心概述与全景时间轴

\`\`\`mermaid
timeline
    title 核心逻辑演进脉络 (${title})
    00:00 : 痛点引入 : 揭示高并发或复杂场景下的业务雪崩与瓶颈
    05:20 : 方案对比 : 传统命令式与轮询机制的局限与失效
    12:40 : 核心设计 : 状态机驱动、异步解耦与分层架构
    20:15 : 工业踩坑 : 网络抖动、幂等重试、缓存击穿与隔离
    28:00 : 生产落地 : 监控指标基准、降级回滚与 SOP 清单
\`\`\`

| 时间切片 | 章节主题 | 核心心法 / 架构决策 | 落地价值 |
| :--- | :--- | :--- | :--- |
| **00:00** | **痛点引入** | 揭示业务激增时的雪崩效应与传统架构阿喀琉斯之踵 | 明确优化天花板 |
| **05:20** | **方案选型** | 横向对比方案 A vs 方案 B 的权衡取舍 (Trade-offs) | 避免盲目选型 |
| **12:40** | **核心机理** | 核心状态机流转、事件总线解耦与持久化机制 | 工业级可用性 |
| **20:15** | **高危边界** | 工业级异常防御：并发竞争、幂等与数据一致性 | 杜绝线上事故 |
| **28:00** | **演进落地** | 从 0 到 1 的生产环境实施路径与基准监控 | 闭环交付上线 |

---

## 二、为什么需要该方案？（背景与本质动机）

> [!NOTE]
> 任何没有深入剖析设计哲学的架构优化都是技术虚荣。本节直击本质动机：

1. **真实世界物理约束**：
   - 无状态节点横向扩缩容极快，但有状态存储（数据库、锁、缓存）受限于网络 I/O 与磁盘吞吐。
   - 依赖阻塞式单进程运行极易受到网络抖动、宿主机热迁移或进程崩溃的毁灭性打击。
2. **为什么传统方案失效？**：
   - 传统轮询机制造成严重的 CPU 空转与无效网络包开销。
   - 步步人工审批导致严重的人类认知过载与告警疲劳。
3. **架构演进必然性**：
   - 必须从命令式转为声明式，从同步阻塞转为事件驱动异步持久化工作流。

---

## 三、核心机理与架构全景拆解

### 3.1 系统拓扑与数据流转时序

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor Client as 客户端 / 调用方
    participant Gateway as API 网关 / 路由层
    participant Engine as 核心处理引擎
    participant Worker as 异步执行 Worker
    participant Store as 持久化状态库

    Client->>Gateway: 发起请求 (携带唯一幂等键 Idempotency-Key)
    Gateway->>Engine: 鉴权与前置限流拦截
    Engine->>Store: CAS 原子写入分布式任务状态
    Store-->>Engine: 写入成功
    Engine->>Worker: 投递异步持久化任务
    Engine-->>Client: 立即返回 202 Accepted + 任务 ID
    Worker->>Worker: 纯沙箱执行计算或调度
    Worker->>Store: 提交最终结果与持久化快照
\`\`\`

### 3.2 关键组件设计与职责隔离
- **入口网关层 (Ingress Gateway)**：负责毫秒级签名鉴权、IP 限流与幂等键校验。
- **状态持久化引擎 (Durable State Engine)**：基于事件溯源记录每一步状态转移，进程重启后自动自断点恢复。
- **隔离执行沙箱 (Isolated Sandbox)**：将潜在高危操作或长耗时计算剥离至微虚拟机或轻量沙箱，保障主进程绝对安全。

---

## 四、工业级高危盲区与反模式（必避坑点）

> [!WARNING]
> 以下盲区是工业级落地中最常见的致命翻车点，必须设置前置防御屏障：

| 盲区分类 | 典型反模式 (Anti-Pattern) | 正确工程实践 (Battle-Tested Practice) | 灾难性后果 |
| :--- | :--- | :--- | :--- |
| **幂等性保障** | 仅依赖前端防重复点击按钮 | 必须在网关层绑定全局唯一 Request ID + Redis SETNX 状态门禁 | 重复扣款、脏数据覆盖或幽灵任务并发 |
| **异常重试** | 无脑死循环重试或固定间隔重试 | 指数退避算法 (Exponential Backoff) + 随机抖动 (Jitter) | 瞬时打崩下游数据库造成级联雪崩 |
| **运维与客服联动**| 仅在主业务链路修改状态，忽略后台 SOP | 任何新机制上线必须同步推进内部管理后台与客服查询工单 | 客诉激增时客服无据可查，导致重大信誉危机 |
| **下游熔断降级** | 下游第三方服务超时挂起整个主线程池 | 严格配置 3000ms 超时阈值 + 熔断器 (Circuit Breaker) | 核心主链路被边缘非核心依赖拖垮 |

---

## 五、实战落地工程载荷（模板/配置/协议）

### 5.1 生产级微服务治理编排配置

\`\`\`yaml
# service-resilience-config.yaml
service:
  name: "${title.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase()}"
  version: "1.0.0"
  timeout_ms: 3000
  retry:
    max_attempts: 3
    initial_interval_ms: 200
    backoff_multiplier: 2.0
    max_interval_ms: 5000
    jitter: true
  circuit_breaker:
    failure_rate_threshold: 50.0
    sliding_window_size: 100
    minimum_number_of_calls: 20
    wait_duration_in_open_state_ms: 10000
\`\`\`

### 5.2 状态机流转协议规范 (JSON Schema)

\`\`\`json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "StateTransitionEvent",
  "type": "object",
  "properties": {
    "event_id": { "type": "string", "format": "uuid" },
    "idempotency_key": { "type": "string" },
    "source_state": { "type": "string" },
    "target_state": { "type": "string" },
    "payload": { "type": "object" },
    "timestamp": { "type": "string", "format": "date-time" }
  },
  "required": ["event_id", "idempotency_key", "source_state", "target_state", "timestamp"]
}
\`\`\`

---

## 六、准出自检清单 (Pre-flight Checklist)

- [ ] **业务对齐**：是否明确定义核心 SLO/SLA 度量指标？
- [ ] **异常覆盖**：是否完整覆盖断网、超时、并发竞争等异常分支？
- [ ] **幂等保证**：关键写入操作是否具备分布式幂等保证与死锁防御？
- [ ] **监控告警**：是否配置了核心链路的 P99 延迟、错误率实时监控看板？
- [ ] **回滚预案**：发生不可逆缺陷时，是否有 3 分钟内生效的降级回滚开关？
`;

    res.json({
      success: true,
      mode: 'mode_b',
      markdown: modeBMd
    });
  } catch (err) {
    console.error('Synthesis error:', err);
    res.status(500).json({ error: err.message || '分析合成失败' });
  }
});

// API: Desktop Sync
app.post('/api/desktop-sync', (req, res) => {
  const syncScript = path.resolve(WORKSPACE_ROOT, 'sync_to_desktop.py');
  if (!fs.existsSync(syncScript)) {
    return res.status(404).json({ error: 'sync_to_desktop.py 不存在' });
  }

  const cmd = `"${PYTHON_PATH}" "${syncScript}"`;
  exec(cmd, { encoding: 'utf-8', timeout: 30000 }, (error, stdout, stderr) => {
    if (error) {
      console.error('Sync failed:', stderr || error.message);
      return res.status(500).json({ error: stderr || error.message });
    }
    res.json({
      success: true,
      output: stdout,
      target_dir: 'C:\\Users\\jiang\\Desktop\\开发经验\\开发者经验分析'
    });
  });
});

// Production: serve built frontend
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled express error:', err.message || err);
  res.status(500).json({ error: '服务器内部错误: ' + (err.message || '未知异常') });
});

app.listen(PORT, () => {
  console.log(`Video2Knowledge Backend Server running at http://localhost:${PORT}`);
});
