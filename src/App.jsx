import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import FinanceInsights from './components/FinanceInsights';
import { fetchTransactions, saveTransaction, removeTransaction } from './utils/supabaseService';
import { Wallet, ArrowUpRight, ArrowDownLeft, Receipt } from 'lucide-react';
import './styles/app.css';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch transactions on mount (async API)
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to load transaction data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // CRUD Actions
  const handleSaveTransaction = async (transactionData) => {
    try {
      // Save through hybrid DB service and get the updated list
      const updatedList = await saveTransaction(transactionData, transactions);
      setTransactions(updatedList);
      setEditingTransaction(null);
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
      // Remove through hybrid DB service and get the updated list
      const updatedList = await removeTransaction(id, transactions);
      setTransactions(updatedList);
      
      // If deleted transaction was being edited, cancel edit
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
            <p className="subtitle">스마트하고 아름다운 자산 관리 파트너 (Supabase Extended)</p>
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
            <span className="card-label">총 수입</span>
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
            <span className="card-label">총 지출</span>
            <span className="card-value">
              {isLoading ? '계산 중...' : formatCurrency(totalExpense)}
            </span>
          </div>
        </div>
      </section>

      {/* Consumption Insights Analysis Section */}
      {!isLoading && <FinanceInsights transactions={transactions} />}

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
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          )}
        </section>
      </main>
    </div>
  );
}
