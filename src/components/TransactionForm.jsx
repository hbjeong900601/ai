import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit3, AlertCircle, DollarSign, Calendar, Tag, FileText } from 'lucide-react';

const INCOME_CATEGORIES = [
  { value: 'salary', label: '월급 💰' },
  { value: 'allowance', label: '용돈 💵' },
  { value: 'investment', label: '투자/재테크 📈' },
  { value: 'extra', label: '기타 수입 🎸' }
];

const EXPENSE_CATEGORIES = [
  { value: 'food', label: '식비 🍔' },
  { value: 'transport', label: '교통비 🚌' },
  { value: 'shopping', label: '쇼핑 🛍️' },
  { value: 'housing', label: '주거/통신 🏠' },
  { value: 'culture', label: '문화/여가 🎬' },
  { value: 'extra', label: '기타 지출 💸' }
];

export default function TransactionForm({ onSave, editingTransaction, onCancel }) {
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  // Validation States
  const [errors, setErrors] = useState({});

  // Populate form if in edit mode
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount.toString());
      setDate(editingTransaction.date);
      setCategory(editingTransaction.category);
      setNotes(editingTransaction.notes || '');
      setErrors({});
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  // Set default category when type changes (if not in edit mode)
  useEffect(() => {
    if (!editingTransaction) {
      const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      setCategory(categories[0].value);
    }
  }, [type, editingTransaction]);

  const resetForm = () => {
    setType('expense');
    setTitle('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory(EXPENSE_CATEGORIES[0].value);
    setNotes('');
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = '내역을 입력해 주세요.';
    } else if (title.length > 25) {
      newErrors.title = '내역은 25자 이내로 입력해 주세요.';
    }

    const parsedAmount = parseFloat(amount);
    if (!amount) {
      newErrors.amount = '금액을 입력해 주세요.';
    } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = '0보다 큰 올바른 금액을 입력해 주세요.';
    } else if (parsedAmount > 100000000) {
      newErrors.amount = '1억 원 이하의 금액만 입력할 수 있습니다.';
    }

    if (!date) {
      newErrors.date = '날짜를 지정해 주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const transactionData = {
      id: editingTransaction ? editingTransaction.id : Date.now().toString(),
      type,
      title: title.trim(),
      amount: parseFloat(amount),
      date,
      category,
      notes: notes.trim(),
      createdAt: editingTransaction ? editingTransaction.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(transactionData);
    resetForm();
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="form-panel">
      <h3 className="panel-title">
        {editingTransaction ? (
          <>
            <Edit3 size={20} className="logo-icon" /> 내역 수정하기
          </>
        ) : (
          <>
            <PlusCircle size={20} className="logo-icon" /> 새 내역 추가
          </>
        )}
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Type Selection */}
        <div className="form-group">
          <label>구분</label>
          <div className="type-segmented-control">
            <button
              type="button"
              className={`segment-btn ${type === 'expense' ? 'active expense' : ''}`}
              onClick={() => setType('expense')}
            >
              지출
            </button>
            <button
              type="button"
              className={`segment-btn ${type === 'income' ? 'active income' : ''}`}
              onClick={() => setType('income')}
            >
              수입
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">내역명</label>
          <div style={{ position: 'relative' }}>
            <input
              id="title"
              type="text"
              className={`input-field ${errors.title ? 'error' : ''}`}
              placeholder="예: 맛있는 점심식사"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {errors.title && (
            <span className="error-message">
              <AlertCircle size={14} /> {errors.title}
            </span>
          )}
        </div>

        {/* Amount */}
        <div className="form-group">
          <label htmlFor="amount">금액 (₩)</label>
          <div style={{ position: 'relative' }}>
            <input
              id="amount"
              type="number"
              className={`input-field ${errors.amount ? 'error' : ''}`}
              placeholder="금액을 입력하세요"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {errors.amount && (
            <span className="error-message">
              <AlertCircle size={14} /> {errors.amount}
            </span>
          )}
        </div>

        {/* Date */}
        <div className="form-group">
          <label htmlFor="date">날짜</label>
          <input
            id="date"
            type="date"
            className={`input-field ${errors.date ? 'error' : ''}`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && (
            <span className="error-message">
              <AlertCircle size={14} /> {errors.date}
            </span>
          )}
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">카테고리</label>
          <select
            id="category"
            className="input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label htmlFor="notes">메모 (선택)</label>
          <textarea
            id="notes"
            className="input-field"
            placeholder="추가적인 정보를 적어주세요 (선택)"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Submit / Cancel Buttons */}
        <button type="submit" className="btn-submit">
          {editingTransaction ? '변경사항 저장' : '내역 추가하기'}
        </button>

        {editingTransaction && (
          <button type="button" className="btn-cancel" onClick={onCancel}>
            취소
          </button>
        )}
      </form>
    </div>
  );
}
