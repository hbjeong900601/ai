# FinanceFlow - Supabase 연동 가계부 App (과제 5 심화 결과물)

> 과제명: 리액트를 이용해서 CRUD 앱 만들기  
> 사용 방법: 이 파일은 과제 요구사항을 충족하고 심화 학습자(Advanced Track) 요건에 맞추어 클라우드 데이터베이스 및 행 단위 보안(RLS)을 적용한 프로젝트의 상세 안내서입니다.

---

## ⚡ 온라인에서 실행하기 (Run in Browser)

이 프로젝트는 로컬 PC 설치 과정 없이, 웹 브라우저 기반 온라인 IDE 환경에서 클릭 한 번으로 가상 서버를 가동해 즉시 작동을 확인해 볼 수 있습니다.

| 플랫폼 | 실행 방법 및 링크 |
|---|---|
| **StackBlitz** | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/hbjeong900601/ai)<br>1. 위의 **Open in StackBlitz** 배너 단추를 클릭합니다.<br>2. 깃허브 저장소 루트에 가계부 프로젝트가 바로 있으므로, 접속 시 가상 개발 서버가 자동으로 빌드를 시작합니다.<br>3. 패키지 설치(`npm install`) 및 개발 구동이 완료될 때까지 **약 30초~1분** 정도 기다리시면 화면이 정상 출력됩니다. |
| **CodeSandbox** | [CodeSandbox 실행 링크](https://codesandbox.io/s/github/hbjeong900601/ai)<br>1. 위의 링크를 클릭하여 CodeSandbox로 저장소를 가져옵니다.<br>2. 가상 에디터 우측 또는 가상 웹 브라우저 탭에서 실행 결과를 확인합니다. |
| **GitHub Codespaces** | 1. 본 GitHub 저장소 우측 상단의 초록색 **[Code]** 버튼을 클릭합니다.<br>2. **Codespaces** 탭을 선택한 뒤 **Create codespace on main**을 클릭합니다.<br>3. 개발 공간 로딩이 완료되면 VS Code 터미널 창에 바로 `npm install && npm run dev`를 입력합니다.<br>4. 팝업되는 **Open in Browser**를 누르면 가상 도메인으로 가계부 화면이 열립니다. |

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 과정명 | AI SW 장기교육 |
| 과제 번호 | 과제 5 |
| 과제명 | 리액트를 이용해서 CRUD 앱 만들기 |
| 프로젝트명 | FinanceFlow (파이낸스플로우) |
| 한 줄 소개 | 이 앱은 사용자가 지출/수입 내역을 클라우드 DB 및 LocalStorage에 동기화하여 안전하게 조회·추가·수정·삭제할 수 있도록 돕는 React CRUD 앱입니다. |
| 데이터 저장 방식 | ■ LocalStorage & ■ Supabase (하이브리드 자동 Fallback 구조) |
| 배포 또는 실행 링크 | https://financeflow-b8h.pages.dev/ |
| GitHub 링크 | https://github.com/hbjeong900601/ai |

## 1-1. 내가 선택한 수행 수준

| 구분 | 나의 선택 | 설명 |
|---|:---:|---|
| 초급자 | □ | mock data 또는 LocalStorage 기반으로 Read/Create/Update/Delete 4개 흐름 확인 |
| 표준 학습자 | □ | 컴포넌트 분리, 입력 검증, 빈 상태·오류 상태 처리, LocalStorage 저장, 검색 및 정렬/필터 |
| 심화 학습자 | ■ | Supabase 연결 및 하이브리드 설계, Auth/RLS 보안 정책 수립, 보안 주의사항과 스키마 SQL 동봉 |

---

## 2. 실행 화면

| 화면 | 설명 | 캡처 |
|---|---|---|
| 메인 목록 화면 | 등록된 수입/지출 내역과 실시간 대시보드 통계 및 소비 분석 요약을 확인하는 화면 | screenshots 폴더 참조 |
| 소비 분석 화면 | 수입 대비 지출 게이지 바 및 카테고리별 누적 소비 랭킹을 차트 형태로 종합 분석해 주는 화면 | screenshots 폴더 참조 |
| 항목 추가 화면 | 입력 폼으로 새 거래 항목(구분, 내역, 금액, 날짜, 카테고리, 메모)을 추가하는 화면 | screenshots 폴더 참조 |
| 항목 수정 화면 | 기존 내역을 수정 모드로 불러와 업데이트하고 반영하는 화면 | screenshots 폴더 참조 |
| 항목 삭제 화면 | 삭제 전 안전한 컨펌 모달을 거쳐 항목이 성공적으로 제거되는 화면 | screenshots 폴더 참조 |
| 빈 상태 또는 오류 상태 | 데이터가 아예 없을 때의 빈 상태 안내 화면 및 유효하지 않은 값 입력 시 에러 표시 화면 | screenshots 폴더 참조 |

---

## 3. 주요 기능

### 3-1. 필수 기능

| 번호 | 기능 | 구현 여부 | 설명 |
|---:|---|---|---|
| 1 | 목록 조회 Read | ■ 완료 | Supabase DB(또는 LocalStorage) 로드 후 실시간 화면에 렌더링합니다. |
| 2 | 항목 추가 Create | ■ 완료 | 검증 완료 시 UUID를 부여해 Supabase DB 및 로컬 스토리지에 동시 추가합니다. |
| 3 | 항목 수정 Update | ■ 완료 | 카드 수정 모드 진입 시 기존 데이터를 바인딩하여 갱신(Upsert)합니다. |
| 4 | 항목 삭제 Delete | ■ 완료 | 컨펌 모달 동의 시 DB 및 로컬 스토리지에서 동시 제거(Delete)합니다. |
| 5 | 데이터 구조 정의 | ■ 완료 | ID, UserID, 구분, 내역, 금액, 날짜, 메모, 생성/수정일 필드를 정의했습니다. |

### 3-2. 권장 기능

| 번호 | 기능 | 구현 여부 | 설명 |
|---:|---|---|---|
| 1 | 컴포넌트 분리 | ■ 완료 | App, TransactionForm, TransactionList, TransactionCard, FinanceInsights 로 분리 |
| 2 | 입력 검증 | ■ 완료 | 내역명 글자수(25자), 금액 0원 이하 검증, 날짜 필수 검증 적용 |
| 3 | 빈 상태 처리 | ■ 완료 | 내역이 없거나 검색/필터 결과가 없을 때 안내 템플릿 카드를 보여줍니다. |
| 4 | 오류 상태 처리 | ■ 완료 | 잘못된 값 입력 시 인라인 에러 붉은 텍스트 및 입력창 네온 경고 보더를 출력합니다. |
| 5 | LocalStorage 저장 | ■ 완료 | Supabase 비활성화 시 자동 Fallback하여 영구적으로 로컬 데이터를 유지합니다. |
| 6 | 검색 또는 필터 | ■ 완료 | 키워드 검색, 타입(수입/지출/전체) 필터, 카테고리 필터, 다중 기준 정렬 지원 |

### 3-3. 도전 및 고도화 기능

| 번호 | 기능 | 시도 여부 | 결과 |
|---:|---|---|---|
| 1 | Supabase 연결 | ■ 시도 | 연결 완료 (환경변수 미설정 시에도 LocalStorage 로 작동하는 하이브리드 레이어 구축) |
| 2 | Auth/RLS 개념 검토 | ■ 시도 | Auth 외래키 설계 적용 및 1:1 사용자 데이터 조회를 보장하는 RLS 정책 SQL 구현 |
| 3 | 보안 주의사항 기록 | ■ 시도 | anon key와 service role key 관리 지침 명시 및 .env 파일의 gitignore 제외 검증 |
| 4 | 배포 또는 외부 공유 | □ 미시도 | 로컬 테스트 구동 확인 |

---

## 4. 사용 기술

| 구분 | 사용 기술 | 사용 이유 |
|---|---|---|
| 프론트엔드 | React (v19) | 컴포넌트 기반 UI 구성 및 상태 관리 최적화 |
| 백엔드 / DB | Supabase (PostgreSQL) | 클라우드 데이터베이스 연동 및 Realtime CRUD 인프라 사용 |
| 개발 도구 | Vite | 빠르고 현대적인 프론트엔드 개발 빌드 서버 환경 제공 |
| 스타일 | Vanilla CSS | 다크 모드 및 글래스모피즘(Glassmorphism) 세부 커스터마이징 |
| 아이콘 | Lucide React | 모던하고 통일감 있는 픽토그램 아이콘 사용 |
| 데이터 | LocalStorage | 클라우드 DB 연결 부재 시 데이터를 무중단 임시 보관하는 용도 |
| AI 도구 | Antigravity (Gemini 3.5 Flash) | 요구사항 기획, DB 스키마 SQL 모델링, 서비스 계층 추상화 설계 보조 |

---

## 5. 실행 방법

### 5-1. 설치 및 실행

1. 의존성 라이브러리를 설치합니다.
   ```bash
   npm install
   ```
2. 환경변수 파일(`.env`)을 루트 디렉토리에 생성하고 키값을 기재합니다. (`.env.example` 템플릿 참조)
   ```text
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   *참고: `.env`에 키값을 기재하지 않으면 앱이 자동으로 로컬 스토리지 Fallback 모드로 실행됩니다.*
3. 개발 서버를 구동합니다.
   ```bash
   npm run dev
   ```
4. 브라우저에서 아래 로컬 웹사이트로 접속합니다.
   ```text
   http://localhost:5173
   ```

---

## 6. 데이터 구조

| 필드명 | 자료형 | 필수 여부 | 설명 | 예시 |
|---|---|:---:|---|---|
| id | string (UUID) | 필수 | 거래 내역 항목의 고유 식별값 | `"mock-1"` 또는 `"3ebf-45a8-bc1d"` |
| user_id | string (UUID) | 선택 | Supabase Auth users 테이블의 외래키 | `"auth.uid()"` 또는 `null` |
| type | string | 필수 | 거래 구분 (지출: `"expense"`, 수입: `"income"`) | `"expense"` |
| title | string | 필수 | 거래 내역 이름 (25자 제한) | `"스타벅스 아메리카노"` |
| amount | number | 필수 | 지출 또는 수입 액수 (1억 이하 양수) | `4500` |
| date | string | 필수 | 거래 발생 일자 (YYYY-MM-DD) | `"2026-07-09"` |
| category | string | 필수 | 수입/지출 세부 카테고리 | `"food"`, `"salary"`, `"shopping"` 등 |
| notes | string | 선택 | 사용자 메모 내용 | `"팀원들과 커피 타임"` |
| createdAt / created_at | string / timestamptz | 필수 | 최초 생성 일시 | `"2026-07-09T10:40:00.000Z"` |
| updatedAt / updated_at | string / timestamptz | 필수 | 최종 수정 일시 | `"2026-07-09T10:45:00.000Z"` |

---

## 7. 폴더 및 파일 구조

```text
프로젝트 폴더/
├─ README.md
├─ package.json
├─ vite.config.js
├─ index.html
├─ .env.example                    # 환경변수 설정 가이드 파일
├─ supabase/
│  └─ schema.sql                   # Supabase DB 초기화 및 RLS 보안 설정 SQL
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ components/
│  │  ├─ TransactionForm.jsx       # 추가 및 수정을 처리하는 폼 컴포넌트
│  │  ├─ TransactionList.jsx       # 리스트 렌더링, 검색, 필터링, 정렬 및 삭제 확인
│  │  ├─ TransactionCard.jsx       # 개별 거래 내역을 보여주는 아이템 카드
│  │  └─ FinanceInsights.jsx       # 소비 비중 및 지출 랭킹 차트 통계 리포트 (고도화)
│  ├─ utils/
│  │  ├─ supabase.js               # Supabase JS SDK 클라이언트 설정 (싱글톤)
│  │  └─ supabaseService.js        # Supabase API 호출 및 로컬스토리지 Fallback 데이터 레이어
│  └─ styles/
│     └─ app.css                   # 가계부 전용 다크 테마 및 유리 효과(Glassmorphism) CSS
├─ screenshots/                    # 기능별 실행 캡처본이 저장되는 경로
└─ eslint.config.js
```

---

## 8. AI 활용 기록

| 번호 | 사용 목적 | 사용한 AI 도구 | 입력한 프롬프트 요약 | AI 응답 활용 방식 | 내가 수정한 부분 |
|---:|---|---|---|---|---|
| 1 | 요구사항 정리 | Antigravity | 가계부 앱으로 기획을 변경하고 필수/권장/도전 기능 수준을 정의해주세요. | 가계부 앱의 흐름 및 요구사항 설계 활용 | 주제를 '학습기록'에서 '가계부'로 전환 |
| 2 | 파일 구조 제안 | Antigravity | 컴포넌트를 분리하기 위한 최적의 React 파일 구조를 제안해줘. | components 폴더와 styles 폴더로 관심사를 분리하는 구조 생성 | index.css 대신 app.css 독립 폴더 배정 |
| 3 | CSS 디자인 구현 | Antigravity | 칙칙하지 않은 다크 모드와 글래스모피즘 효과의 Vanilla CSS를 작성해줘. | app.css 작성 시 HSL 및 radial gradient 배경 구현에 사용 | 뷰포트 정렬 및 반응형 여백 디테일 보정 |
| 4 | 비동기 서비스 레이어 | Antigravity | Supabase가 연결되지 않았을 때 LocalStorage로 부드럽게 Fallback 작동되는 하이브리드 비동기 DB 서비스 헬퍼를 설계해줘. | supabaseService.js의 fetch/upsert/delete 예외 처리 및 스토리지 동기화 구현에 사용 | 데이터 리스트 갱신 콜백 인자 매핑 |
| 5 | DB 스키마/RLS 모델링 | Antigravity | transactions 테이블의 RLS 및 인덱스, 트리거, 사용자 격리 정책을 포함하는 SQL 스크립트를 작성해줘. | supabase/schema.sql 작성 및 테이블 컬럼 스펙 정의에 활용 | RLS anon 격리 및 users 외래키 설정 적용 |
| 6 | App.jsx 리팩토링 | Antigravity | 동기식 로컬스토리지 코드를 걷어내고 비동기 DB 헬퍼 API를 호출하는 형태로 App.jsx를 리팩토링해줘. | App.jsx의 훅 연동 및 로딩 상태 제어에 적용 | 로딩 시 대시보드 계산 스피너 분기 처리 |

---

## 9. AI 생성 결과 검토 기록

| 검토 항목 | 확인 결과 | 보완 내용 |
|---|---|---|
| 필수 CRUD 기능 | ■ 통과 | 생성, 상세목록 조회, 수정, 확인 후 삭제 모두 매끄럽게 연동 완료 |
| 데이터 구조 | ■ 통과 | 식별값 id, 생성일, 최종 변경일, 분류 등의 필드가 일관되게 구조화됨 |
| 컴포넌트 구조 | ■ 통과 | App은 State 홀더 역할을 수행하고 개별 컴포넌트는 Presentation 역할을 하도록 분리 |
| 입력 검증 | ■ 통과 | 제목 누락 시 경고창 대신 인라인 에러 텍스트 표시로 사용자 경험 개선 |
| 빈 상태·오류 상태 | ■ 통과 | 검색에 대한 빈 상태와 데이터 자체가 없는 빈 상태를 구별하여 메시지 렌더링 |
| 저장 방식 | ■ 통과 | LocalStorage 연동으로 데이터 휘발 방지. 최초 실행 시 샘플 로딩 완료 |
| 코드 이해도 | ■ 통과 | 상태 불변성을 지키기 위한 배열의 map, filter 사용 의미를 파악하고 검증함 |
| 보안 | ■ 통과 | API Key 또는 기타 하드코딩된 패스워드나 민감 키값이 파일에 포함되지 않음 |
| 과도한 구현 | ■ 통과 | 과제 기준 이상의 복잡한 전역 상태 도구(Redux) 등을 사용하지 않고 React 훅만 활용 |

---

## 10. 오류 해결 기록

```text
이번 과제에서는 실행 중 치명적인 오류가 발생하지 않았습니다. 다만, 최초 Vite 프로젝트 생성 시 기존 파일이 있는 빈 상태가 아닌 디렉토리에 설치를 시도하여 경고가 발생했던 점을 파악했고, 임시 디렉토리를 경유해 안전하게 코드를 복사하는 방식으로 우회하여 해결했습니다.
또한 Lucide 아이콘 중 ReceiptKoreanWon 아이콘이 로컬 패키지 버전에서 missing export 에러를 일으키는 것을 빌드 중 감지하여, 보편적으로 지원되는 Receipt 아이콘으로 교체하여 빌드 오류를 즉시 해결했습니다.
```

---

## 11. 테스트 기록

| 번호 | 테스트 항목 | 입력 또는 행동 | 기대 결과 | 실제 결과 | 통과 여부 |
|---:|---|---|---|---|:---:|
| 1 | 초기 화면 | 앱 실행 | 샘플 목록 4종 및 대시보드 통계 계산 표시 | 정상 렌더링 완료 | ■ |
| 2 | 항목 추가 | "용돈 50,000원 수입 추가" | 대시보드 잔액 5만원 증가 및 목록 반영 | 정상 반영 완료 | ■ |
| 3 | 빈 입력 | 제목 없이 추가 버튼 클릭 | "내역을 입력해 주세요." 붉은 텍스트 표시 | 에러 감지 완료 | ■ |
| 4 | 항목 수정 | "스타벅스 커피" -> "메가커피"로 수정 | 리스트 항목 변경 및 대시보드 영향 없음 | 정상 수정 완료 | ■ |
| 5 | 항목 삭제 | 삭제 버튼 클릭 후 삭제하기 선택 | 리스트에서 제거되고 잔액/지출 실시간 차감 | 정상 삭제 완료 | ■ |
| 6 | 새로고침 | 데이터 조작 후 F5 클릭 | 조작했던 내역이 브라우저에 그대로 유지됨 | LocalStorage 동기화 확인 | ■ |
| 7 | 소비 리포트 | 지출액 조작 | 수입 대비 소비율 게이지 바와 비율 랭킹이 실시간으로 변함 | 실시간 렌더링 확인 | ■ |
| 8 | 하이브리드 DB | URL/Key 제거 상태 실행 | 로컬 콘솔에 Warning 표시 및 LocalStorage Fallback 구동 | 정상 감지 및 구동 | ■ |

---

## 12. Supabase 확장 기록(선택)

Supabase는 도전 기능이며 필수가 아닙니다. Supabase를 사용하지 않은 경우 “이번 과제에서는 Supabase를 사용하지 않았고, LocalStorage 기반으로 구현했습니다”라고 적습니다.

| 항목 | 작성 내용 |
|---|---|
| 사용 여부 | ■ 사용 |
| 테이블 이름 | `transactions` |
| 주요 컬럼 | `id(UUID)`, `user_id(UUID)`, `type(VARCHAR)`, `title(VARCHAR)`, `amount(NUMERIC)`, `date(DATE)`, `category(VARCHAR)`, `notes(TEXT)`, `created_at`, `updated_at` |
| 사용한 작업 | ■ select / ■ insert / ■ update / ■ delete |
| Auth 사용 여부 | ■ 사용 |
| RLS 검토 여부 | ■ 검토 |
| 보안상 주의한 점 | `service_role_key` 및 프로젝트 비밀 키는 코드 내부에 일절 기재하지 않고, 브라우저용 `anon_key`만을 클라이언트 초기화에 사용하였습니다. 또한 RLS(행 단위 보안)를 활성화하여 `auth.uid() = user_id` 조건의 데이터만 CRUD가 가능하도록 강력한 데이터 소유 격리 정책을 설계했습니다. |

### Supabase 보안 메모

```text
- service role key 또는 secret key는 브라우저 코드, GitHub, README, 캡처에 노출하지 않았습니다.
- 공개 schema의 테이블은 RLS 필요성을 검토했습니다 (transactions 테이블 RLS 활성화 SQL 스크립트 제공).
- 실제 개인정보나 민감 데이터를 저장하지 않고 가상의 수입/지출 데모 정보만을 처리했습니다.
- 로컬 개발 환경용 '.env' 파일은 '.gitignore' 에 등재하여 깃허브 원격 공유 시 소스가 누출되지 않도록 차단했습니다.
```

---

## 13. 실시간 응시 기록과 10일 보완 기록

| 구분 | 작성 내용 |
|---|---|
| 실시간 1시간 안에 작성한 요구사항 | 가계부 앱(FinanceFlow)의 필요 기능 기획, 화면 흐름 정의 및 데이터 아키텍처 스키마 설정 |
| 실시간 1시간 안에 사용한 프롬프트 | 컴포넌트 관심사별 파일 분리 프롬프트 및 가계부 CRUD 템플릿 코드 구현 프롬프트 작성 |
| 실시간 1시간 안에 확인한 AI 생성 결과 | App, TransactionForm, TransactionList, TransactionCard 분할 컴포넌트 획득 |
| 실시간 1시간 안에 발생한 오류 또는 보완 계획 | 비어있지 않은 디렉토리에 Vite 프로젝트 충돌을 임시 폴더 우회 방식으로 극복 |
| 10일 보완 기간에 완성한 기능 | LocalStorage 동기화 구현, 입력 폼 세부 검증(Validation) 및 아름다운 다크 테마 CSS 완성 |
| 10일 보완 기간에 추가한 README/캡처/테스트 기록 | README 템플릿 완성도 보완, 소비 통계 패널(FinanceInsights) 추가, Supabase 하이브리드 연동, screenshots 생성 |

---

## 14. 보완 전후 비교

| 보완 항목 | 보완 전 | 보완 후 | 재실행 결과 |
|---|---|---|---|
| CRUD 기능 | 기본적인 목록 출력 위주 | 수정 모드 완성 및 예외 팝업 컨펌 모달 추가 | 정상 동작 통과 |
| 컴포넌트 구조 | 단순 한 개의 App.jsx 파일 | 4개의 독립 재사용 컴포넌트로 분리 관리 | 정상 빌드 완료 |
| 입력 검증·상태 처리 | 검증 없음 | 공란 입력 방지 및 수치형 한계 설정 적용 | 검증 메시지 확인 |
| 저장 방식 | 새로고침 시 데이터 초기화 | LocalStorage & Supabase 하이브리드 동기화 연동 | 유지 및 Fallback 확인 |
| 통계 분석 | 단순 합산 숫자 출력 | 소비 비중 게이지와 카테고리 랭킹 차트 추가 | 실시간 차트 확인 |
| README / 보안 | 템플릿 상태 | 심화 학습자 기준에 맞추어 RLS 스키마 및 보안 메모 완비 | 100% 작성 통과 |

---

## 15. 보안·개인정보·저작권 점검

| 항목 | 확인 내용 | 상태 |
|---|---|:---:|
| 개인정보 | 실제 이름, 전화번호, 주소, 주민번호, 개인 이메일 등을 사용하지 않았습니다. | ■ |
| 민감 데이터 | 실제 건강, 금융 계좌번호, 법률 비밀 정보를 포함하지 않았습니다. | ■ |
| API Key | API Key, 비공개 토큰, 비밀번호 등을 코드나 리파지토리에 적지 않았습니다. | ■ |
| `.env` | `.env` 등 불필요한 환경 변수 파일을 GitHub에 포함하지 않았습니다. | ■ |
| 외부 공유 링크 | 공개 링크에 편집 권한이나 관리자 도메인을 포함하지 않았습니다. | ■ |
| 저작권 | 아이콘 이미지 등 상용 라이선스를 침해하지 않는 Lucide React 리소스를 썼습니다. | ■ |
| AI 생성 코드 | 생성된 로직을 그대로 옮겨 적지 않고, 상태 흐름과 불변성 메서드를 직접 확인했습니다. | ■ |

---

## 16. 배운 점

1. **하이브리드 데이터 액세스 레이어 설계**: 클라우드 백엔드 환경(Supabase)과 로컬 브라우저 저장소(LocalStorage)를 추상화된 단일 데이터 서비스 레이어로 통합하여, 접속 장애나 설정 유실 시에도 애플리케이션의 가용성(High Availability)을 보장하는 탄탄한 예외 복구 패턴을 설계하고 습득했습니다.
2. **PostgreSQL RLS(행 단위 보안) 지식**: 단순 DB 연동을 넘어 행 단위 보안(Row Level Security) 정책을 수립해 `auth.uid() = user_id` 조건으로 유저 데이터를 독립 격리함으로써 프론트엔드와 백엔드 간의 데이터 보안 설계 기법을 배웠습니다.
3. **상태 관리의 불변성**: React에서 상태를 갱신할 때 `push()`나 `splice()` 같은 원본 파괴 메서드 대신, `map()`, `filter()`, 그리고 스프레드 연산자(`...`)를 활용하여 새 객체/배열을 복사해 주입하는 상태 업데이트 흐름을 정확히 체득했습니다.

---

## 17. 아쉬운 점과 다음 개선 방향

| 아쉬운 점 | 원인 | 다음 개선 방향 |
|---|---|---|
| 다국어 / 통화 설정 고정 | 원화(KRW) 화폐 단위로 제한되어 설계됨 | 다국어(i18n) 및 설정 패널을 추가하여 달러(USD) 등 이종 통화 지원 |

---

## 18. 제출 정보

| 항목 | 링크 또는 설명 |
|---|---|
| GitHub 링크 | https://github.com/hbjeong900601/ai |
| 실행 링크 | https://financeflow-b8h.pages.dev/ |
| 실행 화면 캡처 | screenshots 폴더 내 이미지 확인 |
| 과제 안내 Colab | `과제5_ReactCRUD_과제안내.ipynb` |
| 제출 폼 | `{{SUBMISSION_LINK}}` |
