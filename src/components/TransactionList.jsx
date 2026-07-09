import React, { useState } from 'react';
import TransactionCard from './TransactionCard';
import { Search, Info, SlidersHorizontal, ArrowUpDown, HelpCircle } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { value: 'all', label: '모든 카테고리' },
  // Income
  { value: 'salary', label: '월급 💰' },
  { value: 'allowance', label: '용돈 💵' },
  { value: 'investment', label: '투자 📈' },
  // Expense
  { value: 'food', label: '식비 🍔' },
  { value: 'transport', label: '교통비 🚌' },
  { value: 'shopping', label: '쇼핑 🛍️' },
  { value: 'housing', label: '주거/통신 🏠' },
  { value: 'culture', label: '문화/여가 🎬' },
  { value: 'extra', label: '기타 💸' }
];

export default function TransactionList({ transactions, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest

  // Confirm delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((t) => {
      // 1. Search filter
      const matchesSearch =
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      // 2. Type filter
      const matchesType = filterType === 'all' || t.type === filterType;

      // 3. Category filter
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;

      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      // 4. Sort logic
      if (sortBy === 'newest') {
        return new Date(b.date + 'T00:00:00') - new Date(a.date + 'T00:00:00') || b.createdAt.localeCompare(a.createdAt);
      }
      if (sortBy === 'oldest') {
        return new Date(a.date + 'T00:00:00') - new Date(b.date + 'T00:00:00') || a.createdAt.localeCompare(b.createdAt);
      }
      if (sortBy === 'highest') {
        return b.amount - a.amount;
      }
      if (sortBy === 'lowest') {
        return a.amount - b.amount;
      }
      return 0;
    });

  // Modal handlers
  const requestDelete = (id) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      onDelete(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteTargetId(null);
  };

  return (
    <div className="list-panel">
      {/* Search & Filter Controls Bar */}
      <div className="filter-bar">
        <div className="filter-row-top">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="input-field search-input"
              placeholder="내역 또는 메모 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-row-bottom">
          <div className="filter-group-inline">
            <SlidersHorizontal size={14} className="logo-icon" />
            
            {/* Filter by Type */}
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setFilterCategory('all'); // Reset category when type changes
              }}
            >
              <option value="all">전체 내역</option>
              <option value="income">수입만</option>
              <option value="expense">지출만</option>
            </select>

            {/* Filter by Category */}
            <select
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {CATEGORY_OPTIONS.filter((opt) => {
                if (opt.value === 'all') return true;
                if (filterType === 'all') return true;
                
                // Specific filters
                const incomeVals = ['salary', 'allowance', 'investment'];
                const expenseVals = ['food', 'transport', 'shopping', 'housing', 'culture'];
                
                if (filterType === 'income') {
                  return incomeVals.includes(opt.value) || opt.value === 'extra';
                }
                if (filterType === 'expense') {
                  return expenseVals.includes(opt.value) || opt.value === 'extra';
                }
                return true;
              }).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group-inline">
            <ArrowUpDown size={14} className="logo-icon" />
            
            {/* Sort options */}
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">최신 날짜순</option>
              <option value="oldest">과거 날짜순</option>
              <option value="highest">금액 높은순</option>
              <option value="lowest">금액 낮은순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Cards List */}
      <div className="transaction-list">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((t) => (
            <TransactionCard
              key={t.id}
              transaction={t}
              onEdit={onEdit}
              onDelete={requestDelete}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <Info size={24} />
            </div>
            <h4 className="empty-title">내역이 없습니다</h4>
            <p className="empty-description">
              {transactions.length === 0
                ? '새로운 수입 또는 지출 내역을 입력하여 가계부를 시작해보세요.'
                : '검색 및 필터 조건에 일치하는 거래 내역이 없습니다.'}
            </p>
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="confirm-overlay" onClick={cancelDelete}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <h4 className="confirm-title">내역 삭제 확인</h4>
            <p className="confirm-text">
              선택한 거래 내역을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="btn-dialog btn-confirm-cancel"
                onClick={cancelDelete}
              >
                취소
              </button>
              <button
                type="button"
                className="btn-dialog btn-confirm-delete"
                onClick={confirmDelete}
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
