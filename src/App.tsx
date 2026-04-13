import { useState } from 'react';
import type { AnalysisResult } from './types';
import jsPDF from 'jspdf';

const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.PROD ? '' : 'http://localhost:3001');

// Header组件
function Header({ onShowHistory }: { onShowHistory: () => void }) {
  return (
    <header className="header" style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
      <div className="container header-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" className="logo" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', textDecoration: 'none' }}>
          <span style={{ color: 'var(--brand)' }}>GEO</span> 分析工具
        </a>
        <nav className="nav-links" style={{ display: 'flex', gap: '24px' }}>
          <button onClick={onShowHistory} style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>历史记录</button>
        </nav>
      </div>
    </header>
  );
}

// 历史记录面板组件
function HistoryPanel({ history, onClose, onAnalyze }: { history: any[]; onClose: () => void; onAnalyze: (url: string) => void }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 50) return '#3b82f6';
    return '#ef4444';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 按URL分组历史记录
  const groupedHistory = history.reduce((acc: Record<string, any[]>, record) => {
    const key = record.url;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(record);
    return acc;
  }, {});

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', maxWidth: '800px', width: '90%', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', background: 'transparent', color: 'var(--brand)', border: '2px solid var(--brand)', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>返回</button>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>历史记录</h2>
          <div style={{ width: '60px' }} />
        </div>
        
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {Object.keys(groupedHistory).length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>暂无历史记录</p>
          ) : (
            Object.entries(groupedHistory).map(([url, records]) => (
              <div key={url} style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                    {url}
                  </a>
                </div>
                
                {/* 趋势图 */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '12px', height: '60px', padding: '8px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)' }}>
                  {records.slice(0, 10).reverse().map((record: any) => (
                    <div key={record.savedAt || record.timestamp} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '100%', height: `${record.overallScore}%`, background: getScoreColor(record.overallScore), borderRadius: '4px 4px 0 0', minHeight: '4px' }} />
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{record.overallScore}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{formatDate(record.savedAt || record.timestamp).split(' ')[0]}</div>
                    </div>
                  ))}
                </div>

                {/* 记录列表 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {records.slice(0, 5).map((record: any) => (
                    <div key={record.savedAt || record.timestamp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: getScoreColor(record.overallScore), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px' }}>
                          {record.overallScore}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', color: 'var(--text)' }}>{formatDate(record.savedAt || record.timestamp)}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>GEO评分</div>
                        </div>
                      </div>
                      <button
                        onClick={() => onAnalyze(record.url)}
                        style={{ padding: '6px 12px', background: 'transparent', color: 'var(--brand)', border: '1px solid var(--brand)', borderRadius: 'var(--radius-sm)', fontSize: '12px', cursor: 'pointer' }}
                      >
                        重新分析
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Hero区域组件
function Hero({ onAnalyze, loading, progress, error: externalError }: { onAnalyze: (url: string, mode: string, depth: number) => void; loading: boolean; progress: any; error: string | null }) {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState('single_page');
  const [depth, setDepth] = useState(2);
  const [localError, setLocalError] = useState<string | null>(null);
  const displayError = externalError || localError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setLocalError('请输入网址');
      return;
    }

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    setLocalError(null);
    onAnalyze(finalUrl, mode, depth);
  };

  return (
    <section className="hero" style={{ textAlign: 'center', padding: '80px 0 60px' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>
        为 <span style={{ color: 'var(--brand)' }}>AI 搜索</span> 而优化
      </h1>
      <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.6' }}>
        全面的GEO分析工具：AI爬虫配置检查、内容可引用性评分、Schema生成、平台特定优化建议、关键词分析、多语言优化、内容新鲜度检测及A/B测试建议。
      </p>
      
      <form className="url-form" onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            className="url-input"
            placeholder="example.com（无需输入 http://）"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setLocalError(null);
            }}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 18px',
              background: 'var(--bg-inset)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text)',
            fontSize: '16px',
            outline: 'none',
          }}
        />
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'left' }}>
            自动添加 https:// 协议
          </div>
        </div>
        <button
          type="submit"
          className="btn-analyze"
          disabled={loading || !url.trim()}
          style={{
            padding: '14px 28px',
            background: loading || !url.trim() ? 'var(--border)' : 'var(--brand-light)',
            color: loading || !url.trim() ? 'var(--text-muted)' : 'var(--brand)',
            border: '2px solid var(--brand)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '16px',
            fontWeight: 600,
            cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !url.trim() ? 0.5 : 1,
          }}
        >
          {loading ? '分析中...' : '开始分析'}
        </button>
      </form>

      <fieldset className="options" style={{ border: 'none', maxWidth: '640px', margin: '16px auto 0', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <legend className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>分析选项</legend>
        <label className="option-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <input type="radio" name="mode" checked={mode === 'single_page'} onChange={() => setMode('single_page')} style={{ accentColor: 'var(--brand)' }} />
          单页分析
        </label>
        <label className="option-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <input type="radio" name="mode" checked={mode === 'full_site'} onChange={() => setMode('full_site')} style={{ accentColor: 'var(--brand)' }} />
          全站分析
        </label>
        {mode === 'full_site' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span>爬取深度:</span>
            <select 
              value={depth} 
              onChange={(e) => setDepth(parseInt(e.target.value))}
              style={{
                padding: '4px 8px',
                background: 'var(--bg-inset)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text)',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value="1">1层</option>
              <option value="2">2层</option>
              <option value="3">3层</option>
              <option value="4">4层</option>
              <option value="5">5层</option>
            </select>
          </div>
        )}
      </fieldset>

      {displayError && (
        <div className="error-box" style={{ maxWidth: '640px', margin: '20px auto', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: '8px' }}>错误</h3>
          <p style={{ color: 'var(--text)' }}>{displayError}</p>
        </div>
      )}
      {!displayError && loading && (
        <div className="progress-section" style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ width: '48px', height: '48px', border: '4px solid var(--border)', borderTopColor: 'var(--brand)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 24px' }}></div>
          <div className="progress-pct" style={{ fontSize: '36px', fontWeight: 700, color: 'var(--brand)' }}>
            {progress ? `分析中 ${progress.percentage}%` : '分析中...'}
          </div>
          <div className="progress-step" style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '12px' }}>
            {progress ? (
              <>
                正在分析: <span style={{ color: 'var(--text)', fontWeight: 500 }}>{progress.currentUrl}</span>
                <div style={{ marginTop: '8px', fontSize: '12px' }}>
                  已处理 {progress.processed} / {progress.estimated} 页面 (深度: {progress.depth})
                </div>
              </>
            ) : (
              '正在抓取网页并分析 GEO 指标'
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// 功能特性组件
function Features() {
  return (
    <section className="features" style={{ maxWidth: '1200px', margin: '0 auto 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
      <article className="dim-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>AI爬虫配置检查</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>检测14+个AI爬虫（GPTBot、ClaudeBot等）的robots.txt配置，确保AI搜索引擎可以访问您的站点</p>
      </article>
      <article className="dim-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>内容可引用性评分</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>分析段落长度、自包含性、事实密度，评估内容是否容易被AI搜索引擎引用</p>
      </article>
      <article className="dim-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>Schema生成器</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>自动生成Organization、Article、WebSite、FAQ等结构化数据，提升AI理解度</p>
      </article>
      <article className="dim-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>平台特定优化</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>针对ChatGPT、Perplexity、Google AIO、Claude提供定制化优化建议</p>
      </article>
      <article className="dim-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>关键词分析</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>提取Top关键词，分析搜索意图（信息/导航/交易/商业），优化内容策略</p>
      </article>
      <article className="dim-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>内容新鲜度检测</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>检测时间标记、版本信息、时效性关键词，AI偏好新鲜内容</p>
      </article>
      <article className="dim-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>多语言GEO优化</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>检测lang属性、hreflang标签、翻译质量，优化多语言站点</p>
      </article>
      <article className="dim-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>A/B测试建议</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>基于高优先级建议生成测试方案，包含假设、变体、指标、预期效果</p>
      </article>
    </section>
  );
}

// 分析结果组件页面
function AnalysisResult({ result, onBack }: { result: AnalysisResult; onBack: () => void }) {
  // 直接使用后端返回的dimensions数据
  const dimensions = result.dimensions || [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 50) return '#3b82f6';
    return '#ef4444';
  };

  const getGradeLabel = (score: number) => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    if (score >= 50) return '一般';
    return '需改进';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 50) return '#3b82f6';
    return '#ef4444';
  };

  const getPageTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      homepage: '首页',
      category: '分类页',
      article: '文章页',
      product: '产品页',
      about: '关于页',
      contact: '联系页',
      other: '其他页面'
    };
    return labels[type] || type;
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      zh: '中文',
      en: '英文',
      ja: '日文',
      ko: '韩文',
      es: '西班牙文',
      fr: '法文',
      de: '德文',
      ru: '俄文',
      ar: '阿拉伯文'
    };
    return labels[lang] || lang;
  };

  // 计算圆环进度
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (result.overallScore / 100) * circumference;

  // 计算各维度状态统计
  const totalItems = dimensions.reduce((sum, dim) => sum + dim.items.length, 0);
  const passItems = dimensions.reduce((sum, dim) => sum + dim.items.filter(i => i.status === 'pass').length, 0);
  const warningItems = dimensions.reduce((sum, dim) => sum + dim.items.filter(i => i.status === 'warning').length, 0);
  const failItems = dimensions.reduce((sum, dim) => sum + dim.items.filter(i => i.status === 'fail').length, 0);

  const exportJson = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `geo-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportHtml = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GEO 分析报告 - ${result.url}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #f9fafb;
      padding: 20px;
    }
    .report-container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    .report-header {
      background: var(--bg-inset);
      color: var(--text);
      padding: 40px;
    }
    .report-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
    .report-subtitle { font-size: 14px; opacity: 0.9; margin-bottom: 24px; }
    .report-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      font-size: 13px;
    }
    .section { padding: 40px; border-bottom: 1px solid var(--border); }
    .section-title { font-size: 20px; font-weight: 600; color: var(--text); margin-bottom: 24px; }
    .recommendation-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .recommendation-priority {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
      margin-bottom: 12px;
    }
    .recommendation-priority.high { background: rgba(220, 38, 38, 0.1); color: var(--danger); }
    .recommendation-priority.medium { background: rgba(217, 119, 6, 0.1); color: var(--warning); }
    .recommendation-priority.low { background: rgba(59, 130, 246, 0.1); color: var(--brand); }
    .recommendation-title { font-size: 16px; font-weight: 600; color: var(--text); margin-bottom: 8px; }
    .recommendation-description { color: var(--text-muted); font-size: 14px; margin-bottom: 12px; }
    .recommendation-action {
      background: var(--bg-inset);
      border-left: 3px solid var(--brand);
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <h1 class="report-title">GEO 分析报告</h1>
      <p class="report-subtitle">${result.url}</p>
      <div class="report-meta">
        <div><strong>分析时间:</strong> ${dateStr} ${timeStr}</div>
        <div><strong>综合评分:</strong> ${result.overallScore}</div>
        <div><strong>分析维度:</strong> ${dimensions.length} 个</div>
        <div><strong>检测项目:</strong> ${totalItems} 项</div>
      </div>
    </div>
    <div class="section">
      <h2 class="section-title">优化建议</h2>
      ${result.recommendations.map((rec: any) => `
        <div class="recommendation-card">
          <span class="recommendation-priority ${rec.priority}">
            ${rec.priority === 'high' ? '严重' : rec.priority === 'medium' ? '警告' : '建议'}
          </span>
          <div class="recommendation-title">${rec.title}</div>
          <p class="recommendation-description">${rec.description}</p>
          <div class="recommendation-action">${rec.action}</div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GEO分析报告_${result.url.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // 标题
    doc.setFontSize(24);
    doc.setTextColor(30, 30, 30);
    doc.text('GEO 分析报告', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // URL
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(result.url, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // 日期
    doc.setFontSize(10);
    doc.text(new Date(result.timestamp).toLocaleString('zh-CN'), pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // 综合评分
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text(`综合评分: ${Math.round(result.overallScore)}`, 20, yPosition);
    yPosition += 10;

    // 评分进度条
    doc.setFillColor(234, 88, 12);
    doc.rect(20, yPosition, pageWidth - 40, 8, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(20, yPosition, (pageWidth - 40) * (result.overallScore / 100), 8, 'F');
    yPosition += 20;

    // 维度分数
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text('维度分数', 20, yPosition);
    yPosition += 10;

    dimensions.forEach((dimension) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`${dimension.name}: ${Math.round(dimension.score)}`, 25, yPosition);
      yPosition += 7;

      // 进度条
      const scoreColor = dimension.score >= 80 ? [34, 197, 94] : dimension.score >= 60 ? [234, 179, 8] : dimension.score >= 50 ? [59, 130, 246] : [239, 68, 68];
      doc.setFillColor(229, 231, 235);
      doc.rect(25, yPosition, pageWidth - 50, 4, 'F');
      doc.setFillColor(scoreColor[0] as number, scoreColor[1] as number, scoreColor[2] as number);
      doc.rect(25, yPosition, (pageWidth - 50) * (dimension.score / 100), 4, 'F');
      yPosition += 10;
    });

    yPosition += 10;

    // 优化建议
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text('优化建议', 20, yPosition);
    yPosition += 10;

    result.recommendations.slice(0, 10).forEach((rec) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }

      // 优先级标签
      const priorityColor = rec.priority === 'high' ? [239, 68, 68] : rec.priority === 'medium' ? [249, 115, 22] : [59, 130, 246];
      doc.setFillColor(priorityColor[0] as number, priorityColor[1] as number, priorityColor[2] as number);
      doc.roundedRect(20, yPosition - 5, 30, 8, 1, 1, 'F');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      const priorityText = rec.priority === 'high' ? '严重' : rec.priority === 'medium' ? '警告' : '建议';
      doc.text(priorityText, 35, yPosition + 1, { align: 'center' });

      // 标题
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      const titleLines = doc.splitTextToSize(rec.title, pageWidth - 70);
      doc.text(titleLines, 58, yPosition + 1);
      yPosition += titleLines.length * 5 + 5;

      // 描述
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const descLines = doc.splitTextToSize(rec.description, pageWidth - 50);
      doc.text(descLines, 25, yPosition);
      yPosition += descLines.length * 4 + 8;
    });

    // 保存PDF
    doc.save(`GEO分析报告_${result.url.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`);
  };

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
      {/* 专业头部 */}
      <div style={{
        background: '#f3f4f6',
        color: '#1f2937',
        padding: '40px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '32px'
      }}>
        <button 
          onClick={onBack} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: '#1f2937', 
            fontSize: '14px', 
            marginBottom: '20px', 
            background: '#e5e7eb', 
            border: 'none', 
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          ← 返回
        </button>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>GEO 分析报告</h1>
        <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '24px' }}>{result.url}</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          fontSize: '13px'
        }}>
          <div><strong>分析时间:</strong> {new Date(result.timestamp).toLocaleString('zh-CN')}</div>
          <div><strong>分析维度:</strong> {dimensions.length} 个</div>
          <div><strong>检测项目:</strong> {totalItems} 项</div>
          <div><strong>通过率:</strong> {Math.round((passItems / totalItems) * 100)}%</div>
          {result.pageType && <div><strong>页面类型:</strong> {getPageTypeLabel(result.pageType.type)}</div>}
          {result.language && <div><strong>页面语言:</strong> {getLanguageLabel(result.language)}</div>}
          {result.renderingMode && <div><strong>渲染模式:</strong> {result.renderingMode.mode.toUpperCase()} ({result.renderingMode.framework})</div>}
        </div>
        {result.renderingMode && result.renderingMode.warnings && result.renderingMode.warnings.length > 0 && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: '#f59e0b1f', border: '1px solid #f59e0b', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: '#92400e' }}>
            <strong>⚠ 渲染模式警告：</strong>
            {result.renderingMode.warnings.map((w, i) => <div key={i} style={{ marginTop: '4px' }}>{w}</div>)}
          </div>
        )}
      </div>

      {/* 综合评分卡片 */}
      <div style={{ 
        background: 'var(--bg-card)', 
        border: '1px solid var(--border)', 
        borderRadius: 'var(--radius-md)', 
        padding: '40px',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
          {/* 圆形进度 */}
          <div style={{ position: 'relative', width: '220px', height: '220px' }}>
            <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="110" cy="110" r="90" fill="none" stroke="var(--border)" strokeWidth="12" />
              <circle
                cx="110" cy="110" r="90"
                fill="none"
                stroke={getScoreColor(result.overallScore)}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '64px', fontWeight: '700', color: 'var(--text)', lineHeight: '1' }}>
                {result.overallScore}
              </div>
              <div style={{ fontSize: '18px', color: getScoreColor(result.overallScore), fontWeight: '600', marginTop: '4px' }}>
                {getGradeLabel(result.overallScore)}
              </div>
            </div>
          </div>

          {/* 维度详情 */}
          <div style={{ flex: 1, minWidth: '280px', maxWidth: '400px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', marginBottom: '20px' }}>
              综合评分详情
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dimensions.map((dimension, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '500' }}>
                        {dimension.name}
                      </span>
                      <span style={{ fontSize: '14px', color: getScoreColor(dimension.score), fontWeight: '600' }}>
                        {Math.round(dimension.score)}
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${dimension.score}%`,
                        background: getScoreColor(dimension.score),
                        borderRadius: '3px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 状态分布 */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>
            检测项状态分布
          </h4>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>通过: {passItems} 项</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>警告: {warningItems} 项</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>失败: {failItems} 项</span>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-muted)' }}>
              总计: {totalItems} 项
            </div>
          </div>
          {/* 迷你状态条 */}
          <div style={{ marginTop: '16px', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ height: '100%', background: '#22c55e', width: `${(passItems / totalItems) * 100}%` }} />
            <div style={{ height: '100%', background: '#eab308', width: `${(warningItems / totalItems) * 100}%` }} />
            <div style={{ height: '100%', background: '#ef4444', width: `${(failItems / totalItems) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* 维度分析详情 */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginBottom: '20px' }}>
          维度分析详情
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {dimensions.map((dimension, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>{dimension.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>权重 {Math.round(dimension.weight * 100)}%</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: getScoreColor(dimension.score), lineHeight: '1' }}>
                    {Math.round(dimension.score)}
                  </div>
                  <div style={{ fontSize: '14px', color: getScoreGrade(dimension.score), fontWeight: '500', marginTop: '4px' }}>
                    {getGradeLabel(dimension.score)}
                  </div>
                </div>
              </div>
              <div style={{ height: '10px', background: 'var(--border)', borderRadius: '5px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{
                  height: '100%',
                  borderRadius: '5px',
                  width: `${dimension.score}%`,
                  background: getScoreColor(dimension.score)
                }} />
              </div>
              
              {/* 状态标签 */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {dimension.items.filter(item => item.status === 'pass').length > 0 && (
                  <div style={{ 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    background: '#22c55e15',
                    color: '#22c55e' 
                  }}>
                    通过 {dimension.items.filter(item => item.status === 'pass').length} 项
                  </div>
                )}
                {dimension.items.filter(item => item.status === 'warning').length > 0 && (
                  <div style={{ 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    background: '#eab30815',
                    color: '#eab308' 
                  }}>
                    警告 {dimension.items.filter(item => item.status === 'warning').length} 项
                  </div>
                )}
                {dimension.items.filter(item => item.status === 'fail').length > 0 && (
                  <div style={{ 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    background: '#ef444415',
                    color: '#ef4444' 
                  }}>
                    失败 {dimension.items.filter(item => item.status === 'fail').length} 项
                  </div>
                )}
              </div>

              {/* 迷你进度条 */}
              <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ 
                  height: '100%', 
                  background: '#22c55e', 
                  width: `${(dimension.items.filter(item => item.status === 'pass').length / dimension.items.length) * 100}%` 
                }} />
                <div style={{ 
                  height: '100%', 
                  background: '#eab308', 
                  width: `${(dimension.items.filter(item => item.status === 'warning').length / dimension.items.length) * 100}%` 
                }} />
                <div style={{ 
                  height: '100%', 
                  background: '#ef4444', 
                  width: `${(dimension.items.filter(item => item.status === 'fail').length / dimension.items.length) * 100}%` 
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI爬虫配置分析 */}
      {result.details?.robotsAnalysis && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginBottom: '20px' }}>
            AI爬虫配置分析
          </h3>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: 'var(--text)' }}>robots.txt:</strong>
              <span style={{ marginLeft: '8px', color: result.details.robotsAnalysis?.exists ? 'var(--success)' : 'var(--danger)' }}>
                {result.details.robotsAnalysis?.exists ? '存在' : '不存在'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {(result.details.robotsAnalysis?.aiCrawlers || []).map((crawler, idx) => (
                <div key={idx} style={{
                  padding: '12px',
                  background: 'var(--bg-inset)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{crawler.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{crawler.description}</div>
                  <div style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 500,
                    background: crawler.status === 'allowed' ? '#22c55e1f' : crawler.status === 'blocked' ? '#ef44441f' : '#6b72801f',
                    color: crawler.status === 'allowed' ? 'var(--success)' : crawler.status === 'blocked' ? 'var(--danger)' : 'var(--text-muted)'
                  }}>
                    {crawler.status === 'allowed' ? '允许' : crawler.status === 'blocked' ? '阻止' : '未知'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>{crawler.recommendation}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* llms.txt生成按钮 */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={async () => {
            try {
              const response = await fetch(`${API_BASE}/api/v1/llms-txt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ result })
              });
              const data = await response.json();
              if (data.success) {
                const blob = new Blob([data.content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'llms.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }
            } catch (e) {
              console.error('Failed to generate llms.txt:', e);
            }
          }}
          style={{
            padding: '14px 28px',
            background: 'var(--bg-card)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          下载 llms.txt 文件
        </button>
      </div>

      {/* 内容可引用性评分 */}
      {result.details?.citability && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginBottom: '20px' }}>
            内容可引用性评分
          </h3>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: 'var(--text)' }}>综合评分:</strong>
              <span style={{ marginLeft: '8px', color: (result.details.citability?.overallScore ?? 0) >= 80 ? 'var(--success)' : (result.details.citability?.overallScore ?? 0) >= 60 ? 'var(--warning)' : 'var(--danger)', fontWeight: 600 }}>
                {result.details.citability?.overallScore ?? 0}/100
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>平均段落长度</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>{result.details.citability?.avgParagraphLength ?? 0}字</div>
              </div>
              <div style={{ padding: '12px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>最佳长度比例</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>{result.details.citability?.optimalLengthRatio ?? 0}%</div>
              </div>
              <div style={{ padding: '12px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>事实密度</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>{result.details.citability?.factDensity ?? 0}</div>
              </div>
              <div style={{ padding: '12px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>自包含内容</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: result.details.citability?.hasSelfContainedContent ? 'var(--success)' : 'var(--danger)' }}>
                  {result.details.citability?.hasSelfContainedContent ? '是' : '否'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 内容新鲜度检测 */}
      {result.details?.freshness && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginBottom: '20px' }}>
            内容新鲜度检测
          </h3>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: 'var(--text)' }}>新鲜度评分:</strong>
              <span style={{ marginLeft: '8px', color: (result.details.freshness?.overallFreshness ?? 0) >= 80 ? 'var(--success)' : (result.details.freshness?.overallFreshness ?? 0) >= 60 ? 'var(--warning)' : 'var(--danger)', fontWeight: 600 }}>
                {result.details.freshness?.overallFreshness ?? 0}/100
              </span>
            </div>
            <div style={{ padding: '12px', background: (result.details.freshness?.overallFreshness ?? 0) >= 80 ? '#22c55e1f' : (result.details.freshness?.overallFreshness ?? 0) >= 60 ? '#eab3081f' : '#ef44441f', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text)' }}>{result.details.freshness?.recommendation ?? ''}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>时间标记</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{result.details.freshness?.dateCount ?? 0}处</div>
              </div>
              <div style={{ padding: '12px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>版本信息</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{result.details.freshness?.versionCount ?? 0}处</div>
              </div>
              <div style={{ padding: '12px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>时效关键词</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{result.details.freshness?.freshnessScore ?? 0}处</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 关键词分析 */}
      {result.details?.keywords && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginBottom: '20px' }}>
            关键词分析
          </h3>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: 'var(--text)' }}>主要搜索意图:</strong>
              <span style={{ marginLeft: '8px', color: 'var(--brand)', fontWeight: 600 }}>
                {result.details.keywords?.searchIntent === 'informational' ? '信息搜索' :
                 result.details.keywords?.searchIntent === 'navigational' ? '导航搜索' :
                 result.details.keywords?.searchIntent === 'transactional' ? '交易搜索' : '商业比较'}
              </span>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: 'var(--text)' }}>Top 10 关键词:</strong>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(result.details.keywords?.topKeywords || []).slice(0, 10).map((kw: any, idx: number) => (
                <div key={idx} style={{
                  padding: '6px 12px',
                  background: 'var(--bg-inset)',
                  borderRadius: '20px',
                  fontSize: '13px',
                  color: 'var(--text)'
                }}>
                  {kw.word} ({kw.count})
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 多语言GEO优化 */}
      {result.details?.multiLanguage && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginBottom: '20px' }}>
            多语言GEO优化
          </h3>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: 'var(--text)' }}>多语言评分:</strong>
              <span style={{ marginLeft: '8px', color: (result.details.multiLanguage?.overallScore ?? 0) >= 80 ? 'var(--success)' : (result.details.multiLanguage?.overallScore ?? 0) >= 60 ? 'var(--warning)' : 'var(--danger)', fontWeight: 600 }}>
                {result.details.multiLanguage?.overallScore ?? 0}/100
              </span>
            </div>
            {(result.details.multiLanguage?.recommendations || []).length > 0 && (
              <div>
                <strong style={{ color: 'var(--text)', marginBottom: '12px', display: 'block' }}>优化建议:</strong>
                {(result.details.multiLanguage?.recommendations || []).map((rec: string, idx: number) => (
                  <div key={idx} style={{ padding: '8px 12px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)', marginBottom: '8px', fontSize: '14px', color: 'var(--text)' }}>
                    {rec}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 平台特定优化建议 */}
      {result.platformRecommendations && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginBottom: '20px' }}>
            平台特定优化建议
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {Object.entries(result.platformRecommendations).map(([platform, recs]: [string, any]) => (
              <div key={platform} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
                  {platform === 'chatgpt' ? 'ChatGPT' : platform === 'perplexity' ? 'Perplexity' : platform === 'googleAIO' ? 'Google AIO' : 'Claude'}
                </h4>
                {recs.map((rec: any, idx: number) => (
                  <div key={idx} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: idx < recs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 500,
                      marginBottom: '6px',
                      background: rec.priority === 'high' ? '#ef44441f' : rec.priority === 'medium' ? '#eab3081f' : '#3b82f61f',
                      color: rec.priority === 'high' ? 'var(--danger)' : rec.priority === 'medium' ? 'var(--warning)' : 'var(--brand)'
                    }}>
                      {rec.priority === 'high' ? '严重' : rec.priority === 'medium' ? '警告' : '建议'}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{rec.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rec.description}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* A/B测试建议 */}
      {result.abTestSuggestions && result.abTestSuggestions.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginBottom: '20px' }}>
            A/B测试建议
          </h3>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            {result.abTestSuggestions.map((suggestion: any, idx: number) => (
              <div key={idx} style={{ padding: '16px', background: 'var(--bg-inset)', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>{suggestion.testName}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{suggestion.hypothesis}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>测试指标</div>
                    <div style={{ fontSize: '13px', color: 'var(--text)' }}>{suggestion.metric}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>预期效果</div>
                    <div style={{ fontSize: '13px', color: 'var(--text)' }}>{suggestion.expectedImpact}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>测试周期</div>
                    <div style={{ fontSize: '13px', color: 'var(--text)' }}>{suggestion.testDuration}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>样本量</div>
                    <div style={{ fontSize: '13px', color: 'var(--text)' }}>{suggestion.sampleSize}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schema生成按钮 */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={async () => {
            try {
              const response = await fetch(`${API_BASE}/api/v1/generate-schema`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ result })
              });
              const data = await response.json();
              if (data.success && data.schemas) {
                const schemaContent = data.schemas.map((s: any) => JSON.stringify(s, null, 2)).join('\n\n');
                const blob = new Blob([schemaContent], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'schema.jsonld';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }
            } catch (e) {
              console.error('Failed to generate schema:', e);
            }
          }}
          style={{
            padding: '14px 28px',
            background: 'var(--bg-card)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          下载 Schema 文件
        </button>
      </div>

      {/* 优化建议 - 显示全部 */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginBottom: '20px' }}>
          优化建议（智能排序）- 共 {result.recommendations.length} 条
        </h3>
        {result.recommendations.map((rec, idx) => (
          <div key={idx} style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-md)', 
            padding: '24px', 
            marginBottom: '16px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                background: rec.priority === 'high' ? '#ef444426' : rec.priority === 'medium' ? '#f9731626' : '#3b82f626',
                color: rec.priority === 'high' ? 'var(--danger)' : rec.priority === 'medium' ? 'var(--warning)' : 'var(--brand)'
              }}>
                {rec.priority === 'high' ? '严重' : rec.priority === 'medium' ? '警告' : '建议'}
              </span>
              <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text)' }}>{rec.title}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>{rec.category}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>{rec.description}</p>
            
            {/* 智能排序指标 */}
            {rec.businessImpact !== undefined && (
              <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', flexWrap: 'wrap', padding: '16px', background: 'var(--bg-inset)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>业务影响:</span>
                  <div style={{ width: '80px', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${rec.businessImpact}%`, height: '100%', background: rec.businessImpact >= 70 ? '#22c55e' : rec.businessImpact >= 40 ? '#eab308' : '#ef4444' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>{rec.businessImpact}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>实施难度:</span>
                  <div style={{ width: '80px', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${rec.difficulty ?? 50}%`, height: '100%', background: (rec.difficulty ?? 50) <= 30 ? '#22c55e' : (rec.difficulty ?? 50) <= 60 ? '#eab308' : '#ef4444' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>{rec.difficulty ?? 50}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>ROI:</span>
                  <div style={{ width: '80px', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${rec.roi ?? 50}%`, height: '100%', background: (rec.roi ?? 50) >= 70 ? '#22c55e' : (rec.roi ?? 50) >= 40 ? '#eab308' : '#ef4444' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>{rec.roi ?? 50}</span>
                </div>
              </div>
            )}
            
            <div style={{ background: 'var(--brand-light)', borderLeft: '4px solid var(--brand)', padding: '16px', borderRadius: '0 8px 8px 0', fontSize: '14px', color: 'var(--text)' }}>
              <strong>优化建议：</strong> {rec.action}
            </div>
          </div>
        ))}
      </div>

      {/* 导出按钮 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
        <button onClick={exportJson} style={{ padding: '14px 28px', background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
          导出 JSON
        </button>
        <button onClick={exportHtml} style={{ padding: '14px 28px', background: 'transparent', color: 'var(--brand)', border: '2px solid var(--brand)', borderRadius: 'var(--radius-md)', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
          导出 HTML 报告
        </button>
        <button onClick={exportPdf} style={{ padding: '14px 28px', background: 'var(--brand)', color: '#fff', border: '2px solid var(--brand)', borderRadius: 'var(--radius-md)', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
          导出 PDF 报告
        </button>
      </div>
  </main>
  );
}

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const handleAnalyze = async (url: string, mode: string = 'single_page', depth: number = 2) => {
    setLoading(true);
    setAnalyzeError(null);

    try {
      // 标准化URL
      let targetUrl = url.trim();
      if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://' + targetUrl;
      }
      
      if (mode === 'full_site') {
        // 使用SSE进行全站分析
        await analyzeWithProgress(targetUrl, depth);
      } else {
        // 单页分析使用普通请求
        const response = await fetch(`${API_BASE}/api/v1/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: targetUrl, mode: 'single_page' })
        });
        
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.error || `分析失败: ${response.status}`);
        }
        
        const result = await response.json();
        setResult(result);
        
        // 保存历史记录
        saveToHistory(result);
      }
    } catch (err: any) {
      const errMsg = err?.message || '分析失败，请检查网址是否正确或稍后重试';
      setAnalyzeError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleShowHistory = async () => {
    const historyData = await getHistory();
    setHistory(historyData);
    setShowHistory(true);
  };

  // 保存到历史记录
  const saveToHistory = async (result: AnalysisResult) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result })
      });

      if (!response.ok) {
        console.error('Failed to save history to server');
      }
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  };

  const getHistory = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/history`);
      if (response.ok) {
        const data = await response.json();
        return data.history || [];
      }
    } catch (e) {
      console.error('Failed to get history:', e);
    }
    return [];
  };

  // 使用SSE进行全站分析
  const analyzeWithProgress = async (url: string, depth: number) => {
    const response = await fetch(`${API_BASE}/api/v1/analyze-full-site-progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, depth })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `分析失败: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('无法读取响应流');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('event:')) {
          continue;
        }
        if (line.startsWith('data:')) {
          const data = line.replace('data:', '').trim();
          if (!data) continue;

          try {
            const parsed = JSON.parse(data);
            
            if (parsed.message) {
              console.log('Status:', parsed.message);
            }
            
            if (parsed.currentUrl) {
              // 更新进度状态
              setProgress(parsed);
            }
            
            if (parsed.overallScore !== undefined) {
              // 分析完成
              setResult(parsed);
              setProgress(null);
            }
            
            if (parsed.error) {
              const bizErr = new Error(parsed.error);
              (bizErr as any).__bizError = true;
              throw bizErr;
            }
          } catch (e: any) {
            // 只忽略JSON解析错误，重新抛出业务错误
            if (e?.__bizError) {
              throw e;
            }
          }
        }
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
      <Header onShowHistory={handleShowHistory} />
      {!result ? (
        <>
          <Hero onAnalyze={handleAnalyze} loading={loading} progress={progress} error={analyzeError} />
          <Features />
        </>
      ) : (
        <AnalysisResult result={result} onBack={() => setResult(null)} />
      )}
      {showHistory && (
        <HistoryPanel
          history={history}
          onClose={() => setShowHistory(false)}
          onAnalyze={(url) => {
            setShowHistory(false);
            handleAnalyze(url, 'single_page', 2);
          }}
        />
      )}
    </div>
  );
}

export default App;
