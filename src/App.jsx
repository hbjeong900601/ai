import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import FinanceInsights from './components/FinanceInsights';
import { fetchTransactions, saveTransaction, removeTransaction } from './utils/supabaseService';
import { Wallet, ArrowUpRight, ArrowDownLeft, Receipt, Calendar } from 'lucide-react';
import './styles/app.css';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Month-by-month filter state
  const [currentMonth, setCurrentMonth] = useState('');

  // 1. Fetch transactions on mount (async API)
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTransactions();
        setTransactions(data);
        
        // Initialize with latest transaction month if data exists
        if (data && data.length > 0) {
          const months = Array.from(new Set(data.map((t) => t.date.slice(0, 7)))).sort((a, b) => b.localeCompare(a));
          setCurrentMonth(months[0]);
        } else {
          setCurrentMonth(new Date().toISOString().slice(0, 7));
        }
      } catch (error) {
        console.error('Failed to load transaction data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Sync currentMonth if transactions list updates (e.g., added new month)
  useEffect(() => {
    if (transactions.length > 0) {
      const months = Array.from(new Set(transactions.map((t) => t.date.slice(0, 7)))).sort((a, b) => b.localeCompare(a));
      if (!currentMonth || !months.includes(currentMonth)) {
        setCurrentMonth(months[0]);
      }
    }
  }, [transactions, currentMonth]);

  // Extract all unique months from database in desc order (e.g. ["2026-07", "2026-06"])
  const monthOptions = Array.from(
    new Set(transactions.map((t) => t.date.slice(0, 7)))
  ).sort((a, b) => b.localeCompare(a));

  // If no transactions exist, ensure current month is in dropdown options
  if (monthOptions.length === 0) {
    const fallbackMonth = new Date().toISOString().slice(0, 7);
    monthOptions.push(fallbackMonth);
  }

  // Slicing data for current month ONLY
  const monthlyTransactions = transactions.filter((t) => t.date.slice(0, 7) === currentMonth);

  // CRUD Actions (Must pass whole list database to service API for proper syncing)
  const handleSaveTransaction = async (transactionData) => {
    try {
      const updatedList = await saveTransaction(transactionData, transactions);
      setTransactions(updatedList);
      setEditingTransaction(null);
      
      // Auto switch month view to the added transaction's month
      const addedMonth = transactionData.date.slice(0, 7);
      setCurrentMonth(addedMonth);
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('저장 도중 오류가 발생했습니다.');
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const updatedList = await removeTransaction(id, transactions);
      setTransactions(updatedList);
      
      if (editingTransaction && editingTransaction.id === id) {
        setEditingTransaction(null);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('삭제 도중 오류가 발생했습니다.');
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  // Calculating Statistics for CURRENT MONTH ONLY
  const totalIncome = monthlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(val);
  };

  const formatMonthLabel = (mStr) => {
    if (!mStr) return '';
    const [year, month] = mStr.split('-');
    return `${year}년 ${month}월`;
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <Receipt size={36} className="logo-icon" />
          <div>
            <h1 className="app-title">FinanceFlow</h1>
            <p className="subtitle">스마트하고 아름다운 자산 관리 파트너 (Supabase Extended)</p>
          </div>
        </div>

        {/* Dynamic Month Selector Header */}
        {!isLoading && (
          <div className="month-selector-wrapper">
            <Calendar size={16} className="logo-icon" />
            <select
              className="month-select"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
            >
              {monthOptions.map((monthOpt) => (
                <option key={monthOpt} value={monthOpt}>
                  {formatMonthLabel(monthOpt)}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {/* Dashboard Section (Shows data for selected month) */}
      <section className="dashboard-grid">
        {/* Balance Card */}
        <div className={`dashboard-card balance ${netBalance >= 0 ? 'positive' : 'negative'}`}>
          <div className="card-icon-wrapper">
            <Wallet size={24} />
          </div>
          <div className="card-info">
            <span className="card-label">당월 잔액 ({formatMonthLabel(currentMonth)})</span>
            <span className="card-value">
              {isLoading ? '계산 중...' : formatCurrency(netBalance)}
            </span>
          </div>
        </div>

        {/* Income Card */}
        <div className="dashboard-card income">
          <div className="card-icon-wrapper">
            <ArrowUpRight size={24} />
          </div>
          <div className="card-info">
            <span className="card-label">당월 총 수입</span>
            <span className="card-value">
              {isLoading ? '계산 중...' : formatCurrency(totalIncome)}
            </span>
          </div>
        </div>

        {/* Expense Card */}
        <div className="dashboard-card expense">
          <div className="card-icon-wrapper">
            <ArrowDownLeft size={24} />
          </div>
          <div className="card-info">
            <span className="card-label">당월 총 지출</span>
            <span className="card-value">
              {isLoading ? '계산 중...' : formatCurrency(totalExpense)}
            </span>
          </div>
        </div>
      </section>

      {/* Consumption Insights Analysis Section (Filtered for selected month) */}
      {!isLoading && <FinanceInsights transactions={monthlyTransactions} />}

      {/* Main Workspace Layout */}
      <main className="main-layout">
        {/* Left: Input Form Panel */}
        <section>
          <TransactionForm
            onSave={handleSaveTransaction}
            editingTransaction={editingTransaction}
            onCancel={handleCancelEdit}
          />
        </section>

        {/* Right: Data List & Filters Panel (Shows monthly transactions) */}
        <section>
          {isLoading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '4rem',
              color: 'var(--text-secondary)'
            }}>
              데이터를 불러오는 중입니다...
            </div>
          ) : (
            <TransactionList
              transactions={monthlyTransactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          )}
        </section>
      </main>
    </div>
  );
}
