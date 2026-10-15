import React, { useState } from 'react';
import { BookOpen, Search, Clock, User, ArrowRight, Sparkles, Filter, Layers, Film } from 'lucide-react';

export interface ShowcaseItem {
  id: string;
  title: string;
  author: string;
  platform: string;
  duration: string;
  date: string;
  tags: string[];
  cover: string;
  slideCount: number;
  hasVerbatim: boolean;
  summary: string;
}

interface ShowcaseGridProps {
  showcases: ShowcaseItem[];
  onSelect: (id: string) => void;
}

export const ShowcaseGrid: React.FC<ShowcaseGridProps> = ({ showcases, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('全部');

  const allTags = ['全部', '智能体架构', '需求工程', '高并发实战', '多智能体集群'];

  const filtered = showcases.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTag = selectedTag === '全部' || item.tags.some(t => t.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-brand-400" />
            <span>精选工业级案例馆</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            预置硬核技术研读案例
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            涵盖名校公开课、大厂 PRD 工程规范、高并发分布式演进与前沿智能体集群。
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="搜索案例、讲师或关键词..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedTag === tag
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="group glass-panel rounded-2xl overflow-hidden border border-slate-800/90 hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all cursor-pointer flex flex-col justify-between"
          >
            {/* Image / Banner */}
            <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
              <img
                src={item.cover}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Badges on top */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/90 text-brand-300 border border-brand-500/40 backdrop-blur-md">
                  {item.platform}
                </span>
                {item.slideCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-950/90 text-indigo-200 border border-indigo-500/40 backdrop-blur-md flex items-center gap-1">
                    <Film className="w-2.5 h-2.5" />
                    {item.slideCount} 张原画幻灯片
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1 font-mono text-[11px] bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  <Clock className="w-3 h-3 text-brand-400" /> {item.duration}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <User className="w-3 h-3" /> {item.author}
                </span>
              </div>
            </div>

            {/* Content Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {item.summary}
                </p>
              </div>

              {/* Tags & Action */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>

                <span className="text-xs font-semibold text-brand-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>研读文档</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
