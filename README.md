# National Merit Scout 🇰🇷 대한민국 유공자 MCP

![National Merit Scout Banner](https://img.shields.io/badge/Model%20Context%20Protocol-SDK%20Integrated-blueviolet)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![tsdown](https://img.shields.io/badge/tsdown-Modern%20Build-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 소개 (Introduction)

`National Merit Scout`는 대한민국 국가보훈부의 독립유공자 데이터를 Model Context Protocol (MCP)을 통해 대규모 언어 모델(LLM)이 쉽게 이해하고 활용할 수 있도록 정제 및 제공하는 오픈소스 MCP 서버입니다. 

복잡한 공훈록 데이터를 LLM 친화적인 형태로 변환하여, 역사적 가치를 재조명하고 누구나 쉽게 유공자의 숭고한 정신에 접근할 수 있도록 돕습니다. 💎

---

## 🚀 빠른 시작 (Quick Start)

별도의 설치나 클론 없이, **`npx`**를 통해 즉시 실행할 수 있습니다.

```bash
npx national-merit-scout
```

---

## 💡 Claude Desktop 설정 (Claude Desktop Setup)

Claude Desktop에서 이 MCP를 사용하려면 `claude_desktop_config.json` 파일에 아래 설정을 추가하세요.

### 🛠️ npx 기반 실행 (권장)
```json
{
  "mcpServers": {
    "national-merit-scout": {
      "command": "npx",
      "args": ["-y", "national-merit-scout"]
    }
  }
}
```

---

## 🛠️ 주요 기능 및 도구 (Key Features & Tools)

본 MCP는 아래와 같은 강력한 데이터 탐색 도구를 제공합니다.

### 🔍 `search_independence_merit`
*   **역할**: 이름, 생년월일, 공적 내용 등으로 유공자를 검색합니다.
*   **파라미터**: `name`, `birth_date`, `achievement_summary` (모두 선택)

### 📜 `get_merit_detail`
*   **역할**: 고유 ID를 통해 특정 유공자의 상세 공훈록을 심층 조회합니다.
*   **파라미터**: `merit_id` (필수)

### ✊ `list_by_movement`
*   **역할**: 3.1운동, 의병 등 운동 계열별로 유공자 목록을 필터링합니다.
*   **파라미터**: `movement_type` (필수)

### 📊 `get_merit_stats`
*   **역할**: 기간, 지역, 운동 계열별 유공자 통계 데이터를 제공합니다.
*   **파라미터**: `start_date`, `end_date`, `region`, `movement_type`

---

## 💻 로컬 개발 환경 (Local Development)

기여를 원하시거나 로컬에서 수정하여 실행하시려면 아래 단계를 따르세요.

1.  **의존성 설치**: `pnpm install`
2.  **프로젝트 빌드**: `npm run build` (tsdown 기반)
3.  **서버 실행**: `npm start`

---

## 📄 라이선스 (License)

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다. 대한민국 영웅들의 기록을 널리 알리는 데 자유롭게 활용해 주세요.

---
**"역사의 대칭을 맞추는 가장 우아한 방법, National Merit Scout. 🇰🇷"**  
Made with ❤️ by [freevue](https://github.com/freevue)
