import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
//#region src/merit-client.ts
var MeritClient = class {
	BASE_URL = "https://e-gonghun.mpva.go.kr/opnAPI/contribuMeritList.do";
	constructor() {}
	async request(params) {
		try {
			const filteredParams = {
				nPageIndex: 1,
				nCountPerPage: 10,
				type: "json"
			};
			for (const key in params) if (params[key] !== void 0) filteredParams[key] = params[key];
			return (await axios.get(this.BASE_URL, {
				params: filteredParams,
				headers: { "User-Agent": "curl/8.7.1" }
			})).data;
		} catch (error) {
			if (axios.isAxiosError(error)) console.error(`Error requesting API: ${error.message}`);
			else console.error(`Unexpected error: ${error}`);
			throw error;
		}
	}
	async searchIndependenceMerit(params) {
		return this.request(params);
	}
	async getMeritDetail(params) {
		return this.request(params);
	}
	async listByMovement(workoutAffil, nPageIndex, nCountPerPage) {
		return this.request({
			workoutAffil,
			nPageIndex,
			nCountPerPage
		});
	}
	async getMeritStats() {
		return { totalIndependenceMerits: (await this.request({
			nPageIndex: 1,
			nCountPerPage: 1
		}))?.TOTAL_COUNT || 0 };
	}
};
//#endregion
//#region src/index.ts
const meritClient = new MeritClient();
/**
* National Merit Scout MCP Server
* 국가유공자 공적을 탐색하고 정제하는 MCP 서버
*/
var NationalMeritScoutServer = class {
	server;
	constructor() {
		this.server = new Server({
			name: "national-merit-scout",
			version: "1.0.0"
		}, { capabilities: { tools: {} } });
		this.setupToolHandlers();
		this.server.onerror = (error) => console.error("[MCP Error]", error);
		process.on("SIGINT", async () => {
			await this.server.close();
			process.exit(0);
		});
	}
	setupToolHandlers() {
		this.server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [
			{
				name: "search_independence_merit",
				description: "국가보훈부 독립유공자 공훈록 목록을 검색합니다.",
				inputSchema: {
					type: "object",
					properties: {
						nPageIndex: {
							type: "number",
							description: "페이지 번호",
							default: 1
						},
						nCountPerPage: {
							type: "number",
							description: "페이지당 결과 수",
							default: 10
						},
						nameKo: {
							type: "string",
							description: "이름 (한글)"
						},
						nameCh: {
							type: "string",
							description: "이름 (한자)"
						},
						workoutAffil: {
							type: "string",
							description: "운동계열 코드"
						},
						judgeYear: {
							type: "string",
							description: "포상년도 (YYYY)"
						}
					},
					required: []
				}
			},
			{
				name: "get_merit_detail",
				description: "특정 독립유공자의 상세 공훈록 원문을 조회합니다.",
				inputSchema: {
					type: "object",
					properties: {
						nameKo: {
							type: "string",
							description: "유공자 이름"
						},
						judgeYear: {
							type: "string",
							description: "포상년도 (선택 사항)"
						}
					},
					required: ["nameKo"]
				}
			},
			{
				name: "list_by_movement",
				description: "특정 운동계열별 독립유공자 목록을 조회합니다.",
				inputSchema: {
					type: "object",
					properties: {
						workoutAffil: {
							type: "string",
							description: "운동계열 코드 (예: 3.1운동 UGC00003)"
						},
						nPageIndex: {
							type: "number",
							description: "페이지 번호",
							default: 1
						},
						nCountPerPage: {
							type: "number",
							description: "페이지당 결과 수",
							default: 10
						}
					},
					required: ["workoutAffil"]
				}
			},
			{
				name: "get_merit_stats",
				description: "국가보훈 관련 기본적인 통계 데이터를 제공합니다.",
				inputSchema: {
					type: "object",
					properties: {},
					required: []
				}
			}
		] }));
		this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
			const { name, arguments: args } = request.params;
			try {
				switch (name) {
					case "search_independence_merit":
						const searchParams = args;
						const searchResult = await meritClient.searchIndependenceMerit(searchParams);
						return { content: [{
							type: "text",
							text: JSON.stringify({
								items: searchResult.ITEMS || [],
								totalCount: searchResult.TOTAL_COUNT || 0
							}, null, 2)
						}] };
					case "get_merit_detail":
						const detailParams = args;
						const target = ((await meritClient.getMeritDetail(detailParams)).ITEMS || []).find((item) => item.NAME_KO === detailParams.nameKo);
						return { content: [{
							type: "text",
							text: JSON.stringify({ achievement: target ? target.ACHIVEMENT : "내용을 찾을 수 없습니다." }, null, 2)
						}] };
					case "list_by_movement":
						const movementParams = args;
						const movementResult = await meritClient.listByMovement(movementParams.workoutAffil, movementParams.nPageIndex, movementParams.nCountPerPage);
						return { content: [{
							type: "text",
							text: JSON.stringify({
								items: movementResult.ITEMS || [],
								totalCount: movementResult.TOTAL_COUNT || 0
							}, null, 2)
						}] };
					case "get_merit_stats":
						const statsResult = await meritClient.getMeritStats();
						return { content: [{
							type: "text",
							text: JSON.stringify(statsResult, null, 2)
						}] };
					default: throw new Error(`Unknown tool: ${name}`);
				}
			} catch (error) {
				return {
					content: [{
						type: "text",
						text: `Error: ${error.message}`
					}],
					isError: true
				};
			}
		});
	}
	async run() {
		const transport = new StdioServerTransport();
		await this.server.connect(transport);
		console.error("National Merit Scout MCP server running on stdio");
	}
};
new NationalMeritScoutServer().run().catch(console.error);
//#endregion
export {};

//# sourceMappingURL=index.mjs.map