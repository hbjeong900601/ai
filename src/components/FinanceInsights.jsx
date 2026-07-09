import React from 'react';
import { Presentation, AlertTriangle, CheckCircle, TrendingUp, HelpCircle } from 'lucide-react';

const CATEGORY_LABEL_MAP = {
  food: '식비 🍔',
  transport: '교통비 🚌',
  shopping: '쇼핑 🛍️',
  housing: '주거/통신 🏠',
  culture: '문화/여가 🎬',
  extra: '기타 지출 💸'
};

export default function FinanceInsights({ transactions }) {
  // 1. Separate income and expenses
  const incomes = transactions.filter((t) => t.type === 'income');
  const expenses = transactions.filter((t) => t.type === 'expense');

  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  // 2. Calculate consumption rate
  let consumptionRate = 0;
  if (totalIncome > 0) {
    consumptionRate = Math.round((totalExpense / totalIncome) * 100);
  }

  // 3. Get insights feedback text and theme color
  const getInsightStatus = () => {
    if (totalIncome === 0) {
      return {
        message: '소비 비율을 분석하려면 수입 내역을 먼저 등록해 주세요.',
        color: '#9ca3af',
        icon: <HelpCircle size={18} />
      };
    }
    if (consumptionRate === 0) {
      return {
        message: '지출 내역이 아직 없습니다. 예산 계획을 세우고 소비를 등록해 보세요.',
        color: '#3b82f6',
        icon: <HelpCircle size={18} />
      };
    }
    if (consumptionRate <= 30) {
      return {
        message: '수입 대비 지출 비중이 매우 낮습니다(30% 이하)! 자산 형성 속도가 아주 빠릅니다. 🌟',
        color: '#10b981',
        icon: <CheckCircle size={18} />
      };
    }
    if (consumptionRate <= 70) {
      return {
        message: '수입의 절반 정도를 안정적으로 예산 범위 안에서 사용하고 계십니다. 좋은 흐름입니다. 👍',
        color: '#8b5cf6',
        icon: <CheckCircle size={18} />
      };
    }
    if (consumptionRate <= 100) {
      return {
        message: '수입 대비 소비율이 높습니다(70% 초과). 꼭 필요하지 않은 지출 목록이 있는지 필터링해 보세요.',
        color: '#f59e0b',
        icon: <AlertTriangle size={18} />
      };
    }
    return {
      message: '경고: 지출이 수입을 초과하여 적자 상태입니다! 즉시 소비 패턴을 재점검하고 조절해야 합니다.',
      color: '#f43f5e',
      icon: <AlertTriangle size={18} />
    };
  };

  const insight = getInsightStatus();

  // 4. Group expenses by category
  const categoryGroup = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  // Sort categories by amount descending
  const sortedCategories = Object.keys(categoryGroup)
    .map((catKey) => ({
      key: catKey,
      label: CATEGORY_LABEL_MAP[catKey] || catKey,
      amount: categoryGroup[catKey],
      percentage: totalExpense > 0 ? Math.round((categoryGroup[catKey] / totalExpense) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(val);
  };

  return (
    <div className="insights-panel" style={{
      background: 'var(--bg-secondary)',
      backdropFilter: 'blur(var(--glass-blur))',
      border: '1px solid var(--border-color)',
      borderRadius: '1.5rem',
      padding: '1.75rem 2rem',
      marginBottom: '2.5rem',
      boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.4)'
    }}>
      <h3 className="panel-title" style={{ marginBottom: '1.25rem' }}>
        <Presentation size={20} className="logo-icon" /> 스마트 소비 분석 리포트
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* Left column: Consumption Ratio Gauge */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>수입 대비 지출 비중</span>
            {totalIncome > 0 && (
              <span style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: insight.color,
                marginLeft: 'auto'
              }}>{consumptionRate}%</span>
            )}
          </div>

          {/* Custom gauge progress bar */}
          <div style={{
            height: '0.65rem',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '1rem',
            overflow: 'hidden',
            marginBottom: '1rem',
            position: 'relative'
          }}>
            <div style={{
              width: `${Math.min(consumptionRate, 100)}%`,
              height: '100%',
              background: `linear-gradient(90deg, var(--color-primary) 0%, ${insight.color} 100%)`,
              borderRadius: '1rem',
              transition: 'var(--transition-smooth)'
            }} />
          </div>

          {/* Feedback Alert box */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            background: 'rgba(0, 0, 0, 0.15)',
            border: `1px solid ${insight.color}33`,
            borderRadius: '0.75rem',
            padding: '1rem',
            color: '#fff',
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}>
            <div style={{ color: insight.color, flexShrink: 0 }}>
              {insight.icon}
            </div>
            <div>
              {insight.message}
            </div>
          </div>
        </div>

        {/* Right column: Category Ranking chart */}
        <div>
          <span style={{
            display: 'block',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            fontWeight: '500',
            marginBottom: '0.75rem'
          }}>지출 카테고리 랭킹</span>

          {sortedCategories.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sortedCategories.slice(0, 3).map((item) => (
                <div key={item.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                    <span style={{ fontWeight: '500' }}>{item.label}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <strong>{formatCurrency(item.amount)}</strong> ({item.percentage}%)
                    </span>
                  </div>
                  
                  {/* Category Progress Bar */}
                  <div style={{
                    height: '0.35rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '1rem',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #f43f5e 0%, #ec4899 100%)',
                      borderRadius: '1rem'
                    }} />
                  </div>
                </div>
              ))}
              {sortedCategories.length > 3 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                  *기타 {sortedCategories.length - 3}개 카테고리가 더 존재합니다.
                </span>
              )}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '0.75rem',
              padding: '1.75rem',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              border: '1px dashed rgba(255, 255, 255, 0.05)'
            }}>
              등록된 지출이 없어 통계가 표시되지 않습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
