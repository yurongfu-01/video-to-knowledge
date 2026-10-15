import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    darkMode: true,
    background: '#0f172a',
    mainBkg: '#1e293b',
    primaryColor: '#0e8ce9',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#38a8f8',
    lineColor: '#64748b',
    secondaryColor: '#334155',
    tertiaryColor: '#1e293b'
  }
});

interface MermaidBlockProps {
  chart: string;
}

export const MermaidBlock: React.FC<MermaidBlockProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      if (!chart.trim()) return;
      try {
        setHasError(false);
        const id = 'mermaid-' + Math.random().toString(36).substring(2, 9);
        const { svg } = await mermaid.render(id, chart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err) {
        console.warn('Mermaid render error:', err);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    renderChart();
    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (hasError) {
    return (
      <div className="my-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs overflow-x-auto">
        <div className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
          <span>⚠️ 图表语法预览</span>
        </div>
        <pre>{chart}</pre>
      </div>
    );
  }

  return (
    <div className="my-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 overflow-x-auto shadow-inner transition-all hover:border-brand-500/30">
      <div 
        ref={containerRef}
        className="mermaid-svg-container flex justify-center items-center min-h-[140px]"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
};
