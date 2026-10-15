import React from 'react';
import { Layers, FileText, CheckCircle2, ShieldCheck, Zap, Download } from 'lucide-react';

export const SpecViewer: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-brand-400" />
          <span>行业级知识库工程标准</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          六段式深度学习资料规范 (Mode B Specification)
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          兼顾人类的高效理解认知与 AI 智能体（Agent）的机器级强约束，直击技术本质与高危工程盲区。
        </p>
      </div>

      {/* Six Section Architecture Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            num: '01',
            title: '元数据与全景时间轴',
            desc: '标准 YAML Frontmatter、Mermaid 脉络时间轴图与章节要义矩阵，秒级获取全篇上下文。',
            badge: '全局视野'
          },
          {
            num: '02',
            title: '为什么需要该方案？',
            desc: '深入解构物理现实约束（网络不可靠、并发死锁、内存成本）与传统解法的阿喀琉斯之踵。',
            badge: '设计哲学'
          },
          {
            num: '03',
            title: '核心机理与架构时序',
            desc: '系统拓扑架构图、Mermaid 顺序交互时序图、组件职责边界与关键数据流转闭环。',
            badge: '底层机理'
          },
          {
            num: '04',
            title: '高危工程盲区与反模式',
            desc: '防范幂等缺失、并发击穿、重试雪崩、提示词缓存击穿与内部运营客服 SOP 脱节等致命暗礁。',
            badge: '工业级防御'
          },
          {
            num: '05',
            title: '实战落地工程载荷',
            desc: '开箱即用的工程配置、YAML 编排清单、JSON Schema 协议或核心代码片段，杜绝口头空谈。',
            badge: '开箱即用'
          },
          {
            num: '06',
            title: '准出自检清单 (Pre-flight)',
            desc: '可逐项勾选的生产发布预检清单，覆盖业务对齐、异常分支、监控度量与 3 分钟熔断降级预案。',
            badge: '质量闭环'
          }
        ].map(item => (
          <div key={item.num} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-black text-brand-500/60">{item.num}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {item.badge}
              </span>
            </div>
            <h3 className="text-base font-bold text-white">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-400" />
          <span>模式 A（原貌复刻）与 模式 B（深度研读）对比矩阵</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-300 font-semibold">
                <th className="p-3">核心维度</th>
                <th className="p-3">模式 A：高保真原貌切片复刻档</th>
                <th className="p-3">模式 B：六段式深度学习资料</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-400">
              <tr>
                <td className="p-3 font-semibold text-slate-200">核心定位</td>
                <td className="p-3">一手不可篡改的事实源档案与字轨切片</td>
                <td className="p-3 text-brand-300 font-medium">高密度、面向落地的架构指南与工程载荷</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">加工原则</td>
                <td className="p-3">零主观加工、完全保留原话、去除结巴口癖</td>
                <td className="p-3">提炼顶层心法、主动补全盲区、绘制时序图</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">图表呈现</td>
                <td className="p-3">截取原视频帧与幻灯片</td>
                <td className="p-3 text-brand-300">Mermaid 推进时间轴 + 架构时序图 + 幻灯片原画</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">个人知识库</td>
                <td className="p-3">文末保留全量字幕，支持 Obsidian 模糊全文搜索</td>
                <td className="p-3">YAML Frontmatter 适配 Dataview 自动聚合看板</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-200">适用场景</td>
                <td className="p-3">学术引用、演讲取证、精确台词复盘</td>
                <td className="p-3 text-brand-300 font-medium">技术攻坚、系统重构、方案撰写与团队内训</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
