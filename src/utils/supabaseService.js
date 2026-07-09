import { supabase } from './supabase';

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

const isSupabaseAvailable = () => {
  return supabase !== null;
};

/**
 * 1. 거래 내역 조회 (Read)
 * Supabase DB 연결이 유효할 경우 Supabase에서 fetch하며,
 * 비활성화 상태이거나 에러 발생 시 LocalStorage로 Fallback 처리합니다.
 */
export const fetchTransactions = async () => {
  if (isSupabaseAvailable()) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      console.log('📊 Loaded transactions from Supabase DB.');
      
      // If DB is completely empty but connected, we can still load mock data or keep it empty.
      if (data && data.length > 0) {
        return data;
      }
    } catch (error) {
      console.error('⚠️ Supabase fetch failed. Falling back to LocalStorage:', error.message);
    }
  }

  // LocalStorage Fallback
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_DATA));
      return INITIAL_MOCK_DATA;
    }
  } catch (err) {
    console.error('LocalStorage load error:', err);
    return INITIAL_MOCK_DATA;
  }
};

/**
 * 2. 거래 내역 추가 및 수정 (Create & Update - Upsert)
 * ID 기준으로 데이터베이스에 upsert를 수행하며,
 * 비활성화 또는 예외 발생 시 로컬 스토리지를 갱신합니다.
 */
export const saveTransaction = async (transaction, currentList) => {
  // DB format mapping (date check and schema fields adaptation)
  const dbData = {
    id: transaction.id,
    type: transaction.type,
    title: transaction.title,
    amount: transaction.amount,
    date: transaction.date,
    category: transaction.category,
    notes: transaction.notes || null,
    created_at: transaction.createdAt,
    updated_at: transaction.updatedAt
  };

  if (isSupabaseAvailable()) {
    try {
      const { error } = await supabase
        .from('transactions')
        .upsert(dbData, { onConflict: 'id' });

      if (error) throw error;
      console.log('💾 Successfully saved to Supabase DB.');
    } catch (error) {
      console.error('⚠️ Supabase upsert failed. Saving locally to LocalStorage:', error.message);
    }
  }

  // LocalStorage Sync
  const isEditing = currentList.some((t) => t.id === transaction.id);
  let updatedList;
  if (isEditing) {
    updatedList = currentList.map((t) => (t.id === transaction.id ? transaction : t));
  } else {
    updatedList = [transaction, ...currentList];
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  } catch (err) {
    console.error('LocalStorage save error:', err);
  }
  return updatedList;
};

/**
 * 3. 거래 내역 삭제 (Delete)
 * ID에 부합하는 내역을 DB에서 삭제하며, LocalStorage 동기화를 진행합니다.
 */
export const removeTransaction = async (id, currentList) => {
  if (isSupabaseAvailable()) {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      console.log('🗑️ Successfully deleted from Supabase DB.');
    } catch (error) {
      console.error('⚠️ Supabase delete failed. Deleting locally from LocalStorage:', error.message);
    }
  }

  // LocalStorage Sync
  const updatedList = currentList.filter((t) => t.id !== id);
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  } catch (err) {
    console.error('LocalStorage delete sync error:', err);
  }
  return updatedList;
};
