import React from 'react';
import { Edit2, Trash2, TrendingUp, TrendingDown, Calendar, MessageSquare } from 'lucide-react';

const CATEGORY_MAP = {
  // Income
  salary: '월급 💰',
  allowance: '용돈 💵',
  investment: '투자 📈',
  // Expense
  food: '식비 🍔',
  transport: '교통비 🚌',
  shopping: '쇼핑 🛍️',
  housing: '주거/통신 🏠',
  culture: '문화/여가 🎬',
  // Common
  extra: '기타 💸'
};

export default function TransactionCard({ transaction, onEdit, onDelete }) {
  const { id, type, title, amount, date, category, notes } = transaction;

  // Format currency
  const formatAmount = (value) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(value);
  };

  const handleEditClick = () => {
    onEdit(transaction);
  };

  const handleDeleteClick = () => {
    onDelete(id);
  };

  return (
    <div className={`transaction-card ${type}`}>
      <div className="card-left">
        <div className="card-type-icon">
          {type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
        </div>
        
        <div className="card-details">
          <div className="card-title-row">
            <span className="card-title">{title}</span>
            <span className="card-category">
              {CATEGORY_MAP[category] || category}
            </span>
          </div>
          
          <div className="card-meta">
            <span>
              <Calendar size={12} /> {date}
            </span>
            {notes && (
              <span className="card-notes-indicator" title={notes}>
                <MessageSquare size={12} /> 메모 있음
              </span>
            )}
          </div>
          
          {notes && (
            <p className="card-notes">"{notes}"</p>
          )}
        </div>
      </div>

      <div className="card-right">
        <span className="card-amount">
          {type === 'income' ? '+' : '-'} {formatAmount(amount)}
        </span>
        
        <div className="card-actions">
          <button 
            type="button" 
            className="action-btn edit-btn" 
            onClick={handleEditClick}
            title="수정"
          >
            <Edit2 size={14} />
          </button>
          <button 
            type="button" 
            className="action-btn delete-btn" 
            onClick={handleDeleteClick}
            title="삭제"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
