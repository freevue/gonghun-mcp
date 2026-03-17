# Gonghun MCP 🇰🇷 대한민국 유공자 MCP

![Gonghun MCP Banner](https://img.shields.io/badge/Model%20Context%20Protocol-SDK%20Integrated-blueviolet)
![tsdown](https://img.shields.io/badge/tsdown-Modern%20Build-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 소개 (Introduction)

`Gonghun MCP`는 대한민국 국가보훈부의 독립유공자 데이터를 Model Context Protocol (MCP)을 통해 대규모 언어 모델(LLM)이 쉽게 이해하고 활용할 수 있도록 정제 및 제공하는 오픈소스 MCP 서버입니다.

복잡한 공훈록 데이터를 LLM 친화적인 형태로 변환하여, 역사적 가치를 재조명하고 누구나 쉽게 유공자의 숭고한 정신에 접근할 수 있도록 돕습니다. 💎

---

## 💡 MCP 클라이언트 설정 (Client Setup)

본 MCP 서버는 다양한 MCP 지원 클라이언트에서 활용할 수 있습니다.

### 1️⃣ Claude Desktop

Claude Desktop에서 이 MCP를 사용하려면 사용자 설정 파일(`claude_desktop_config.json`)에 아래 내용을 추가하세요.

- **설정 파일 경로**: `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)
- **설정 내용**:

```json
{
  "mcpServers": {
    "gonghun": {
      "command": "npx",
      "args": ["-y", "@freevuehub/gonghun-mcp"]
    }
  }
}
```

---

### 2️⃣ Cursor

Cursor 에디터에서 AI 어시스턴트가 이 MCP를 활용하도록 등록할 수 있습니다.

1. Cursor 설정 (`Settings`) ➔ `Features` ➔ `MCP` 섹션으로 이동
2. `+ Add New MCP Server` 클릭
3. 아래 정보 입력 후 생성:
   - **Name**: `gonghun` (자유롭게 지정)
   - **Type**: `command`
   - **Command**: `npx -y @freevuehub/gonghun-mcp`

---

### 3️⃣ Antigravity / Gemini Sandbox (기타 클라이언트)

Antigravity나 Cline 등 전용 확장 프로그램에서도 `mcp_config.json` 규격에 맞춰 동일하게 연동됩니다.

```json
{
  "mcpServers": {
    "gonghun": {
      "command": "npx",
      "args": ["-y", "@freevuehub/gonghun-mcp"]
    }
  }
}
```

---

## 🛠️ 주요 기능 및 도구 (Key Features & Tools)

본 MCP는 아래와 같은 강력한 데이터 탐색 도구를 제공합니다.

### 🔍 `search_independence_merit`

- **역할**: 독립유공자의 공훈록 목록을 검색합니다.
- **파라미터**:
  - `nameKo` _(선택)_: 이름 (한글)
  - `nameCh` _(선택)_: 이름 (한자)
  - `workoutAffil` _(선택)_: 운동계열 코드 (예: 3.1운동 `UGC00003`)
  - `judgeYear` _(선택)_: 포상년도 (YYYY)
  - `nPageIndex` _(선택)_: 페이지 번호 (기본값: 1)
  - `nCountPerPage` _(선택)_: 페이지당 결과 수 (기본값: 10)

### 📜 `get_merit_detail`

- **역할**: 특정 독립유공자의 상세 공훈록 원문을 조회합니다.
- **파라미터**:
  - `nameKo` **(필수)**: 유공자 이름
  - `judgeYear` _(선택)_: 포상년도 (YYYY)

### ✊ `list_by_movement`

- **역할**: 특정 운동 계열별로 유공자 목록을 조회합니다.
- **파라미터**:
  - `workoutAffil` **(필수)**: 운동계열 코드 (예: 3.1운동 `UGC00003`, 의열투쟁 `UGC00005` 등)
  - `nPageIndex` _(선택)_: 페이지 번호 (기본값: 1)
  - `nCountPerPage` _(선택)_: 페이지당 결과 수 (기본값: 10)

### 📊 `get_merit_stats`

- **역할**: 국가보훈 관련 기본적인 통계 데이터를 제공합니다.
- **파라미터**: 없음 (전체 통계 제공)

---

## 💡 활용 예시 (Example Queries)

LLM에게 다음과 같이 요청하여 데이터를 활용할 수 있습니다.

- _"안중근 의사의 순국일과 주요 공적을 정리해줘"_
- _"3.1운동 계열의 독립유공자 5명의 성함과 세부 정보를 알려줘"_
- _"독립유공자 중 포상년도가 1962년인 분들의 통계를 내줘"_

---

## 📄 라이선스 (License)

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다. 대한민국 영웅들의 기록을 널리 알리는 데 자유롭게 활용해 주세요.
