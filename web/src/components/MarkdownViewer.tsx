import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { MermaidBlock } from './MermaidBlock';
import { Copy, Check, Terminal, ExternalLink, Info, AlertTriangle, Lightbulb, ShieldAlert } from 'lucide-react';

interface MarkdownViewerProps {
  content: string;
  onTimestampClick?: (timestamp: string) => void;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, onTimestampClick }) => {
  // Pre-process content: rewrite image paths
  // Converts `./images/01_title...` to `/api/images/01_title...`
  const processedContent = content.replace(/\(\.\/images\/([^)]+)\)/g, '(/api/images/$1)');

  return (
    <div className="prose prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent text-slate-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && lang === 'mermaid') {
              return <MermaidBlock chart={codeString} />;
            }

            if (!inline) {
              return <CodeBlock code={codeString} language={lang} />;
            }

            // Inline code: check if it's a timestamp like 09:50 or [00:00 - 05:20]
            const isTimestamp = /^(\d{1,2}:\d{2}(?::\d{2})?)/.test(codeString.replace(/[\[\]]/g, ''));
            if (isTimestamp && onTimestampClick) {
              const cleanTs = codeString.replace(/[\[\]]/g, '').split('-')[0].trim();
              return (
                <button
                  onClick={() => onTimestampClick(cleanTs)}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-1 rounded bg-brand-950/80 border border-brand-500/40 text-brand-300 hover:bg-brand-900/60 hover:text-brand-100 font-mono text-xs transition-colors cursor-pointer"
                  title="点击跳转至此时间戳"
                >
                  ⏱️ {codeString}
                </button>
              );
            }

            return (
              <code className="px-1.5 py-0.5 rounded bg-slate-800/80 text-brand-300 font-mono text-xs border border-slate-700/50" {...props}>
                {children}
              </code>
            );
          },

          blockquote({ children }: any) {
            // Check for Obsidian callouts
            // We can inspect the children structure or render styled quote
            return (
              <blockquote className="my-4 border-l-4 border-brand-500/80 bg-slate-900/40 px-4 py-2 rounded-r-xl italic text-slate-300">
                {children}
              </blockquote>
            );
          },

          table({ children }: any) {
            return (
              <div className="my-6 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40 shadow-sm">
                <table className="w-full text-left border-collapse text-sm">{children}</table>
              </div>
            );
          },
          thead({ children }: any) {
            return <thead className="bg-slate-800/60 border-b border-slate-700 text-slate-200 font-semibold">{children}</thead>;
          },
          th({ children }: any) {
            return <th className="p-3 text-xs uppercase tracking-wider">{children}</th>;
          },
          td({ children }: any) {
            return <td className="p-3 border-b border-slate-800/60 text-slate-300">{children}</td>;
          },

          h1({ children }: any) {
            return <h1 className="text-2xl font-bold text-white mt-8 mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">{children}</h1>;
          },
          h2({ children }: any) {
            return <h2 className="text-xl font-bold text-slate-100 mt-6 mb-3 pb-1 border-b border-slate-800/60 flex items-center gap-2">{children}</h2>;
          },
          h3({ children }: any) {
            return <h3 className="text-lg font-semibold text-brand-300 mt-5 mb-2">{children}</h3>;
          },
          h4({ children }: any) {
            return <h4 className="text-base font-semibold text-slate-200 mt-4 mb-2">{children}</h4>;
          },

          img({ src, alt }: any) {
            let imgSrc = src;
            if (imgSrc && imgSrc.startsWith('./images/')) {
              imgSrc = '/api/images/' + imgSrc.replace('./images/', '');
            }
            return (
              <div className="my-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-lg group">
                <img
                  src={imgSrc}
                  alt={alt || '幻灯片截帧'}
                  className="w-full max-h-[480px] object-contain bg-slate-950 transition-transform duration-300 group-hover:scale-[1.01]"
                  loading="lazy"
                />
                {alt && (
                  <div className="px-4 py-2 bg-slate-900/90 text-xs text-slate-400 border-t border-slate-800 flex items-center justify-between">
                    <span>🖼️ {alt}</span>
                    <a href={imgSrc} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline flex items-center gap-1">
                      查看原图 <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          },

          a({ href, children }: any) {
            return (
              <a
                href={href}
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors"
              >
                {children}
              </a>
            );
          },

          ul({ children }: any) {
            return <ul className="my-3 space-y-1.5 list-disc list-inside">{children}</ul>;
          },
          ol({ children }: any) {
            return <ol className="my-3 space-y-1.5 list-decimal list-inside">{children}</ol>;
          },
          li({ children }: any) {
            return <li className="text-slate-300 text-sm leading-relaxed">{children}</li>;
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

// Subcomponent: CodeBlock with copy button
const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/70 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-brand-400" />
          <span className="font-mono uppercase font-semibold text-slate-300">{language || 'text'}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-200 hover:text-white transition-all text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed text-slate-200">
        <pre>{code}</pre>
      </div>
    </div>
  );
};
