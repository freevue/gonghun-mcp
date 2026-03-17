// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

// src/merit-client.ts
import axios from "axios";
var MeritClient = class {
  BASE_URL = "https://e-gonghun.mpva.go.kr/opnAPI/contribuMeritList.do";
  constructor() {
  }
  async request(params) {
    try {
      const filteredParams = {
        nPageIndex: 1,
        nCountPerPage: 10,
        type: "json"
      };
      for (const key in params) {
        if (params[key] !== void 0) {
          filteredParams[key] = params[key];
        }
      }
      const response = await axios.get(this.BASE_URL, {
        params: filteredParams,
        headers: {
          "User-Agent": "curl/8.7.1"
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error requesting API: ${error.message}`);
      } else {
        console.error(`Unexpected error: ${error}`);
      }
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
    return this.request({ workoutAffil, nPageIndex, nCountPerPage });
  }
  async getMeritStats() {
    const result = await this.request({ nPageIndex: 1, nCountPerPage: 1 });
    return { totalIndependenceMerits: result?.TOTAL_COUNT || 0 };
  }
};

// src/index.ts
var meritClient = new MeritClient();
var NationalMeritScoutServer = class {
  server;
  constructor() {
    this.server = new Server(
      {
        name: "national-merit-scout",
        version: "1.0.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );
    this.setupToolHandlers();
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }
  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "search_independence_merit",
          description: "\uAD6D\uAC00\uBCF4\uD6C8\uBD80 \uB3C5\uB9BD\uC720\uACF5\uC790 \uACF5\uD6C8\uB85D \uBAA9\uB85D\uC744 \uAC80\uC0C9\uD569\uB2C8\uB2E4.",
          inputSchema: {
            type: "object",
            properties: {
              nPageIndex: { type: "number", description: "\uD398\uC774\uC9C0 \uBC88\uD638", default: 1 },
              nCountPerPage: { type: "number", description: "\uD398\uC774\uC9C0\uB2F9 \uACB0\uACFC \uC218", default: 10 },
              nameKo: { type: "string", description: "\uC774\uB984 (\uD55C\uAE00)" },
              nameCh: { type: "string", description: "\uC774\uB984 (\uD55C\uC790)" },
              workoutAffil: { type: "string", description: "\uC6B4\uB3D9\uACC4\uC5F4 \uCF54\uB4DC" },
              judgeYear: { type: "string", description: "\uD3EC\uC0C1\uB144\uB3C4 (YYYY)" }
            },
            required: []
          }
        },
        {
          name: "get_merit_detail",
          description: "\uD2B9\uC815 \uB3C5\uB9BD\uC720\uACF5\uC790\uC758 \uC0C1\uC138 \uACF5\uD6C8\uB85D \uC6D0\uBB38\uC744 \uC870\uD68C\uD569\uB2C8\uB2E4.",
          inputSchema: {
            type: "object",
            properties: {
              nameKo: { type: "string", description: "\uC720\uACF5\uC790 \uC774\uB984" },
              judgeYear: { type: "string", description: "\uD3EC\uC0C1\uB144\uB3C4 (\uC120\uD0DD \uC0AC\uD56D)" }
            },
            required: ["nameKo"]
          }
        },
        {
          name: "list_by_movement",
          description: "\uD2B9\uC815 \uC6B4\uB3D9\uACC4\uC5F4\uBCC4 \uB3C5\uB9BD\uC720\uACF5\uC790 \uBAA9\uB85D\uC744 \uC870\uD68C\uD569\uB2C8\uB2E4.",
          inputSchema: {
            type: "object",
            properties: {
              workoutAffil: { type: "string", description: "\uC6B4\uB3D9\uACC4\uC5F4 \uCF54\uB4DC (\uC608: 3.1\uC6B4\uB3D9 UGC00003)" },
              nPageIndex: { type: "number", description: "\uD398\uC774\uC9C0 \uBC88\uD638", default: 1 },
              nCountPerPage: { type: "number", description: "\uD398\uC774\uC9C0\uB2F9 \uACB0\uACFC \uC218", default: 10 }
            },
            required: ["workoutAffil"]
          }
        },
        {
          name: "get_merit_stats",
          description: "\uAD6D\uAC00\uBCF4\uD6C8 \uAD00\uB828 \uAE30\uBCF8\uC801\uC778 \uD1B5\uACC4 \uB370\uC774\uD130\uB97C \uC81C\uACF5\uD569\uB2C8\uB2E4.",
          inputSchema: {
            type: "object",
            properties: {},
            required: []
          }
        }
      ]
    }));
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      try {
        switch (name) {
          case "search_independence_merit":
            const searchParams = args;
            const searchResult = await meritClient.searchIndependenceMerit(searchParams);
            return {
              content: [{
                type: "text",
                text: JSON.stringify({ items: searchResult.ITEMS || [], totalCount: searchResult.TOTAL_COUNT || 0 }, null, 2)
              }]
            };
          case "get_merit_detail":
            const detailParams = args;
            const detailResult = await meritClient.getMeritDetail(detailParams);
            const target = (detailResult.ITEMS || []).find((item) => item.NAME_KO === detailParams.nameKo);
            return {
              content: [{
                type: "text",
                text: JSON.stringify({ achievement: target ? target.ACHIVEMENT : "\uB0B4\uC6A9\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." }, null, 2)
              }]
            };
          case "list_by_movement":
            const movementParams = args;
            const movementResult = await meritClient.listByMovement(
              movementParams.workoutAffil,
              movementParams.nPageIndex,
              movementParams.nCountPerPage
            );
            return {
              content: [{
                type: "text",
                text: JSON.stringify({ items: movementResult.ITEMS || [], totalCount: movementResult.TOTAL_COUNT || 0 }, null, 2)
              }]
            };
          case "get_merit_stats":
            const statsResult = await meritClient.getMeritStats();
            return {
              content: [{ type: "text", text: JSON.stringify(statsResult, null, 2) }]
            };
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error: ${error.message}` }],
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
var server = new NationalMeritScoutServer();
server.run().catch(console.error);
