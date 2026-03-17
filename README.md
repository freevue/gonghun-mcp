# National Merit Scout 🇰🇷 대한민국 유공자 MCP

![National Merit Scout Banner](https://img.shields.io/badge/Model%20Context%20Protocol-SDK%20Integrated-blueviolet)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![tsup](https://img.shields.io/badge/tsup-Fast%20and%20Simple-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 소개 (Introduction)

`National Merit Scout`는 대한민국 국가보훈부의 독립유공자 데이터를 Model Context Protocol (MCP)을 통해 대규모 언어 모델(LLM)이 쉽게 이해하고 활용할 수 있도록 정제 및 제공하는 MCP 에이전트입니다. 복잡한 공훈록 데이터를 LLM 친화적인 형태로 변환하여, LLM이 유공자 정보에 접근하고 분석하는 새로운 가능성을 열어줍니다.

---

## 🚀 주요 기능 (Key Features)

*   **독립유공자 검색**: 이름, 생년월일, 공적 내용 등으로 독립유공자를 검색합니다.
*   **상세 공훈록 조회**: 특정 유공자의 상세 공훈록 정보를 조회합니다.
*   **운동계열별 필터링**: 독립운동의 계열(예: 3.1운동, 의병, 국내외 독립운동 등)별로 유공자를 필터링하여 조회합니다.
*   **보훈 통계 제공**: 특정 기간, 지역 또는 운동 계열별 유공자 수 등 다양한 통계 정보를 제공합니다.

---

## 🛠️ 설치 및 설정 (Installation & Setup)

프로젝트를 로컬 환경에 설치하고 설정하는 방법입니다.

1.  **저장소 클론 (Clone Repository)**:
    ```bash
    git clone https://github.com/your-repo/national-merit-scout.git
    cd national-merit-scout
    ```

2.  **의존성 설치 (Install Dependencies)**:
    ```bash
    npm install
    ```

3.  **프로젝트 빌드 (Build Project)**:
    ```bash
    npm run build
    ```
    이 과정은 MCP 에이전트가 실행될 수 있도록 코드를 컴파일합니다.

**💡 참고**: 본 프로젝트는 별도의 API 키를 필요로 하지 않습니다. 국가보훈부의 공개 데이터를 활용합니다.

---

## 💡 사용 방법 (Usage)

`National Merit Scout` MCP 에이전트를 Claude Desktop과 같은 LLM 환경에서 활용하는 예시입니다.

1.  **MCP 서버 실행 (Run MCP Server)**:
    `national-merit-scout`를 호스팅할 MCP 서버를 실행합니다.
    ```bash
    npm start
    ```
    또는
    ```bash
    node dist/index.js
    ```

2.  **Claude Desktop 설정 예시 (Claude Desktop Configuration Example)**:
    Claude Desktop에 MCP 에이전트를 등록하고 활용하는 방법은 다음과 같습니다.
    (실제 Claude Desktop의 "도구 추가" 메뉴 또는 유사 기능을 통해 설정)

    ```json
    {
      "name": "national-merit-scout",
      "description": "대한민국 국가보훈부의 독립유공자 데이터를 LLM이 쉽게 이해하도록 정제하여 제공합니다.",
      "url": "http://localhost:3000/mcp-schema", // MCP 서버가 실행되는 주소
      "actions": [
        {
          "name": "search_independence_merit",
          "description": "독립유공자를 이름, 생년월일, 공적 내용 등으로 검색합니다.",
          "parameters": {
            "name": { "type": "string", "description": "유공자 이름" },
            "birth_date": { "type": "string", "description": "생년월일 (YYYY-MM-DD)" },
            "achievement_summary": { "type": "string", "description": "공적 요약" }
          }
        },
        {
          "name": "get_merit_detail",
          "description": "특정 독립유공자의 상세 공훈록을 조회합니다.",
          "parameters": {
            "merit_id": { "type": "string", "description": "유공자 고유 ID" }
          }
        },
        {
          "name": "list_by_movement",
          "description": "독립운동 계열별로 유공자를 필터링하여 목록을 조회합니다.",
          "parameters": {
            "movement_type": { "type": "string", "description": "운동 계열 (예: '3.1운동', '의병', '국내외 독립운동')" }
          }
        },
        {
          "name": "get_merit_stats",
          "description": "특정 기간, 지역 또는 운동 계열별 유공자 수 등 통계 정보를 제공합니다.",
          "parameters": {
            "start_date": { "type": "string", "description": "시작일 (YYYY-MM-DD)" },
            "end_date": { "type": "string", "description": "종료일 (YYYY-MM-DD)" },
            "region": { "type": "string", "description": "지역" },
            "movement_type": { "type": "string", "description": "운동 계열" }
          }
        }
      ]
    }
    ```

---

## 🛠️ 도구 레퍼런스 (Tool Reference)

`National Merit Scout`가 제공하는 도구(Tool) 및 각 도구의 파라미터 상세 설명입니다.

### 🔍 `search_independence_merit`

*   **설명**: 이름, 생년월일, 공적 내용 등 다양한 기준으로 독립유공자를 검색합니다.
*   **파라미터**:
    *   `name` (string, optional): 검색할 유공자의 이름.
    *   `birth_date` (string, optional): 유공자의 생년월일 (예: "YYYY-MM-DD" 형식).
    *   `achievement_summary` (string, optional): 유공자의 공적 내용을 요약하여 검색.

### 📜 `get_merit_detail`

*   **설명**: 고유 ID를 통해 특정 독립유공자의 상세 공훈록을 조회합니다.
*   **파라미터**:
    *   `merit_id` (string, required): 조회할 유공자의 고유 식별자.

### ✊ `list_by_movement`

*   **설명**: 독립운동의 특정 계열에 해당하는 유공자 목록을 필터링하여 조회합니다.
*   **파라미터**:
    *   `movement_type` (string, required): 필터링할 독립운동 계열 (예: "3.1운동", "의병", "국내외 독립운동", "학생운동", "사회운동" 등).

### 📊 `get_merit_stats`

*   **설명**: 지정된 기간, 지역 또는 운동 계열별로 독립유공자에 대한 통계 정보를 제공합니다.
*   **파라미터**:
    *   `start_date` (string, optional): 통계를 시작할 날짜 (예: "YYYY-MM-DD" 형식).
    *   `end_date` (string, optional): 통계를 종료할 날짜 (예: "YYYY-MM-DD" 형식).
    *   `region` (string, optional): 특정 지역의 유공자 통계.
    *   `movement_type` (string, optional): 특정 운동 계열의 유공자 통계.

---

## 💻 기술 스택 (Tech Stack)

*   **TypeScript**: 강력한 타입 체킹을 통한 안정적인 코드 개발.
*   **tsup**: 빠르고 간편한 번들링 및 트랜스파일링 도구.
*   **Model Context Protocol SDK**: LLM과의 원활한 상호작용을 위한 프로토콜 구현.

---

## 📄 라이선스 (License)

이 프로젝트는 MIT 라이선스 (LICENSE 파일 참조) 하에 배포됩니다.

---
Made with ❤️ by Your Organization
