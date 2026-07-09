-- ====================================================================
-- FinanceFlow 데이터베이스 스키마 및 RLS(행 단위 보안) 설계 스크립트
-- 이 SQL 스크립트는 Supabase SQL Editor에서 실행하는 용도입니다.
-- ====================================================================

-- 1. transactions 테이블 생성
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Supabase Auth 연동용 외래키
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')), -- 'income' 또는 'expense'만 허용
    title VARCHAR(50) NOT NULL, -- 내역명
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0), -- 금액 (양수 검증)
    date DATE NOT NULL, -- 거래 일자
    category VARCHAR(30) NOT NULL, -- 카테고리
    notes TEXT, -- 메모 (선택)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 인덱스 추가 (조회 및 검색 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);

-- 2. Row Level Security (RLS) 활성화 정책 설정
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 3. RLS 구체적인 보안 정책 (Policies) 수립

-- [보안 정책 A] 인증된 사용자(Auth Users)가 자신의 데이터만 CRUD 할 수 있도록 격리하는 정책
-- 이 정책은 회원 정보 격리의 핵심 정책입니다.

-- (조회 Read) 자신의 내역만 조회 허용
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- (추가 Create) 자신의 user_id로만 입력 허용
CREATE POLICY "Users can insert their own transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- (수정 Update) 자신의 내역만 수정 허용
CREATE POLICY "Users can update their own transactions" 
ON public.transactions 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- (삭제 Delete) 자신의 내역만 삭제 허용
CREATE POLICY "Users can delete their own transactions" 
ON public.transactions 
FOR DELETE 
USING (auth.uid() = user_id);


-- [보안 정책 B] 비인증(Auth 없는 공개 테이블) 상태로 설계하는 경우 (Fallback 대비용)
-- 만약 로그인 기능 없이 서비스 URL과 API Key(anon)만으로 누구나 읽고 쓸 수 있는 가계부를 구축한다면
-- 아래와 같이 모든 비인증 anon 역할에 전체 접근을 일시 허용할 수 있습니다.
-- (주의: 실제 서비스에서는 남용될 경우 데이터 오염의 우려가 있으므로, 개발 검증 단계에서만 추천합니다.)

/*
CREATE POLICY "Allow public read access to anonymous users"
ON public.transactions
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow public write access to anonymous users"
ON public.transactions
FOR INSERT
TO anon
WITH CHECK (true);
*/

-- 4. updated_at 자동 업데이트를 위한 트리거 함수 정의
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_modtime
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();
