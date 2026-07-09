import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import FinanceInsights from './components/FinanceInsights';
import { Wallet, ArrowUpRight, ArrowDownLeft, Receipt } from 'lucide-react';
import './styles/app.css';

const LOCAL_STORAGE_KEY = 'financeflow_transactions';

const INITIAL_MOCK_DATA = [
  {
    id: 'mock-1',
    type: 'income',
    title: '6월 급여',
    amount: 3200000,
    date: '2026-06-25',
    category: 'salary',
    notes: '본사 급여 입금',
    createdAt: new Date('2026-06-25T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-06-25T09:00:00Z').toISOString()
  },
  {
    id: 'mock-2',
    type: 'expense',
    title: '스타벅스 커피',
    amount: 4500,
    date: '2026-07-01',
    category: 'food',
    notes: '팀원들과 식후 디저트 타임',
    createdAt: new Date('2026-07-01T13:30:00Z').toISOString(),
    updatedAt: new Date('2026-07-01T13:30:00Z').toISOString()
  },
  {
    id: 'mock-3',
    type: 'expense',
    title: '지하철 교통카드 충전',
    amount: 30000,
    date: '2026-07-02',
    category: 'transport',
    notes: '출퇴근용 대중교통 충전',
    createdAt: new Date('2026-07-02T08:15:00Z').toISOString(),
    updatedAt: new Date('2026-07-02T08:15:00Z').toISOString()
  },
  {
    id: 'mock-4',
    type: 'expense',
    title: '린넨 셔츠',
    amount: 49000,
    date: '2026-07-05',
    category: 'shopping',
    notes: '여름용 시원한 셔츠 구매',
    createdAt: new Date('2026-07-05T16:45:00Z').toISOString(),
    updatedAt: new Date('2026-07-05T16:45:00Z').toISOString()
  }
];

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // 1. Load data from LocalStorage on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        setTransactions(JSON.parse(storedData));
      } else {
        // Load initial mock data if localStorage is empty
        setTransactions(INITIAL_MOCK_DATA);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DATA));
      }
    } catch (error) {
      console.error('LocalStorage 로드 중 오류가 발생했습니다:', error);
      setTransactions(INITIAL_MOCK_DATA);
    }
  }, []);

  // 2. Save data to LocalStorage when transactions update
  const saveToLocalStorage = (updatedList) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (error) {
      console.error('LocalStorage 저장 중 오류가 발생했습니다:', error);
      alert('데이터 저장 중 문제가 발생했습니다. 브라우저 저장공간을 확인해 주세요.');
    }
  };

  // CRUD Actions
  const handleSaveTransaction = (transactionData) => {
    let updatedTransactions;
    if (editingTransaction) {
      // Update existing
      updatedTransactions = transactions.map((t) =>
        t.id === transactionData.id ? transactionData : t
      );
      setEditingTransaction(null);
    } else {
      // Add new
      updatedTransactions = [transactionData, ...transactions];
    }
    setTransactions(updatedTransactions);
    saveToLocalStorage(updatedTransactions);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDeleteTransaction = (id) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    saveToLocalStorage(updatedTransactions);
    // If deleted transaction was being edited, cancel edit
    if (editingTransaction && editingTransaction.id === id) {
      setEditingTransaction(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  // Calculating Statistics for Dashboard
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(val);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <Receipt size={36} className="logo-icon" />
          <div>
            <h1 className="app-title">FinanceFlow</h1>
            <p className="subtitle">스마트하고 아름다운 자산 관리 파트너</p>
          </div>
        </div>
      </header>

      {/* Dashboard Section */}
      <section className="dashboard-grid">
        {/* Balance Card */}
        <div className={`dashboard-card balance ${netBalance >= 0 ? 'positive' : 'negative'}`}>
          <div className="card-icon-wrapper">
            <Wallet size={24} />
          </div>
          <div className="card-info">
            <span className="card-label">현재 잔액</span>
            <span className="card-value">{formatCurrency(netBalance)}</span>
          </div>
        </div>

        {/* Income Card */}
        <div className="dashboard-card income">
          <div className="card-icon-wrapper">
            <ArrowUpRight size={24} />
          </div>
          <div className="card-info">
            <span className="card-label">총 수입</span>
            <span className="card-value">{formatCurrency(totalIncome)}</span>
          </div>
        </div>

        {/* Expense Card */}
        <div className="dashboard-card expense">
          <div className="card-icon-wrapper">
            <ArrowDownLeft size={24} />
          </div>
          <div className="card-info">
            <span className="card-label">총 지출</span>
            <span className="card-value">{formatCurrency(totalExpense)}</span>
          </div>
        </div>
      </section>

      {/* Consumption Insights Analysis Section */}
      <FinanceInsights transactions={transactions} />

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

        {/* Right: Data List & Filters Panel */}
        <section>
          <TransactionList
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </section>
      </main>
    </div>
  );
}
