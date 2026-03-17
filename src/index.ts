#!/usr/bin/env node
import pkg from '../package.json'
import { MeritClient } from './MeritClient'
import { Server } from '@modelcontextprotocol/sdk/server'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'

const meritClient = new MeritClient()

/**
 * Gonghun MCP Server
 * 국가유공자 공적을 탐색하고 정제하는 MCP 서버
 */
class GonghunServer {
  private readonly server: Server

  constructor() {
    this.server = new Server(
      { name: 'gonghun', version: pkg.version },
      {
        capabilities: {
          tools: {},
        },
      }
    )

    this.setupToolHandlers()

    // 에러 핸들링
    this.server.onerror = (error) => console.error('[MCP Error]', error)
    process.on('SIGINT', async () => {
      await this.server.close()
      process.exit(0)
    })
  }

  private setupToolHandlers() {
    // 1. 도구 리스트 정의
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'search_independence_merit',
          description: '국가보훈부 독립유공자 공훈록 목록을 검색합니다.',
          inputSchema: {
            type: 'object',
            properties: {
              nPageIndex: {
                type: 'number',
                description: '페이지 번호',
                default: 1,
              },
              nCountPerPage: {
                type: 'number',
                description: '페이지당 결과 수',
                default: 10,
              },
              nameKo: { type: 'string', description: '이름 (한글)' },
              nameCh: { type: 'string', description: '이름 (한자)' },
              workoutAffil: { type: 'string', description: '운동계열 코드' },
              judgeYear: { type: 'string', description: '포상년도 (YYYY)' },
            },
            required: [],
          },
        },
        {
          name: 'get_merit_detail',
          description: '특정 독립유공자의 상세 공훈록 원문을 조회합니다.',
          inputSchema: {
            type: 'object',
            properties: {
              nameKo: { type: 'string', description: '유공자 이름' },
              judgeYear: {
                type: 'string',
                description: '포상년도 (선택 사항)',
              },
            },
            required: ['nameKo'],
          },
        },
        {
          name: 'list_by_movement',
          description: '특정 운동계열별 독립유공자 목록을 조회합니다.',
          inputSchema: {
            type: 'object',
            properties: {
              workoutAffil: {
                type: 'string',
                description: '운동계열 코드 (예: 3.1운동 UGC00003)',
              },
              nPageIndex: {
                type: 'number',
                description: '페이지 번호',
                default: 1,
              },
              nCountPerPage: {
                type: 'number',
                description: '페이지당 결과 수',
                default: 10,
              },
            },
            required: ['workoutAffil'],
          },
        },
        {
          name: 'get_merit_stats',
          description: '국가보훈 관련 기본적인 통계 데이터를 제공합니다.',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
      ],
    }))

    // 2. 도구 실행 핸들러
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      try {
        switch (name) {
          case 'search_independence_merit':
            const searchParams = args as any
            const searchResult = await meritClient.searchIndependenceMerit(searchParams)
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      items: searchResult.ITEMS || [],
                      totalCount: searchResult.TOTAL_COUNT || 0,
                    },
                    null,
                    2
                  ),
                },
              ],
            }
          case 'get_merit_detail':
            const detailParams = args as any
            const detailResult = await meritClient.getMeritDetail(detailParams)
            const target = (detailResult.ITEMS || []).find(
              (item: any) => item.NAME_KO === detailParams.nameKo
            )
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      achievement: target ? target.ACHIVEMENT : '내용을 찾을 수 없습니다.',
                    },
                    null,
                    2
                  ),
                },
              ],
            }
          case 'list_by_movement':
            const movementParams = args as any
            const movementResult = await meritClient.listByMovement(
              movementParams.workoutAffil,
              movementParams.nPageIndex,
              movementParams.nCountPerPage
            )
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      items: movementResult.ITEMS || [],
                      totalCount: movementResult.TOTAL_COUNT || 0,
                    },
                    null,
                    2
                  ),
                },
              ],
            }
          case 'get_merit_stats':
            const statsResult = await meritClient.getMeritStats()
            return {
              content: [{ type: 'text', text: JSON.stringify(statsResult, null, 2) }],
            }
          default:
            throw new Error(`Unknown tool: ${name}`)
        }
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Error: ${error.message}` }],
          isError: true,
        }
      }
    })
  }

  async run() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('Gonghun MCP server running on stdio')
  }
}

const server = new GonghunServer()

server.run().catch(console.error)
