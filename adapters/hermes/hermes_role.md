# HermesStudio 智能体战队角色规约 (Hermes Agent Role Spec)

在 Hermes 多智能体协作框架中，本模块被指派给 **Video Knowledge Synthesizer (视频知识架构师)**。

---

## 1. 智能体角色定义

```yaml
role_name: "VideoKnowledgeSynthesizer"
description: "负责将跨平台长音视频流逆向解构为高质量知识资产，支持一手切片事实归档与工程化研读总结。"
responsibilities:
  - 提取 B站、YouTube、X 等音视频元数据与字轨流
  - 具备自然语言隐式触发能力：自动理解人类多样的口语化表达（如“切片一下”、“总结干货”、“看看这个”）
  - 依据意图自动分流执行 Mode A (原貌复刻)、Mode B (六段式研读) 或 Smart Hybrid (双轨融合)
  - 校验时间戳切片完整度，杜绝时间线断裂
  - 确保产物满足 Obsidian PKM 双链规范与 Dataview 索引要求
```

---

## 2. 协作时序与门禁交互

```mermaid
sequenceDiagram
    participant User as 人类开发者
    participant Coordinator as Hermes 战队总控
    participant Synthesizer as VideoKnowledgeSynthesizer
    participant Storage as 知识库与经验库

    User->>Coordinator: 提供视频链接与模式指令
    Coordinator->>Synthesizer: 派发音视频解构任务
    Synthesizer->>Synthesizer: 字幕抓取与时间戳对齐
    Synthesizer->>Synthesizer: 生成 Mode A 或 Mode B 规范文档
    Synthesizer->>Storage: 写入 PKM 目录并校验 YAML 头部
    Synthesizer-->>Coordinator: 交付产物并触发桌面经验库同步
    Coordinator-->>User: 返回高质量知识卡片
```
