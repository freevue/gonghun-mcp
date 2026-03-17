import axios from 'axios';

export class MeritClient {
    private readonly BASE_URL: string = 'https://e-gonghun.mpva.go.kr/opnAPI/contribuMeritList.do';

    constructor() {
    }

    private async request(params: Record<string, any>): Promise<any> {
        try {
            // Filter out undefined values and set defaults
            const filteredParams: Record<string, any> = {
                nPageIndex: 1,
                nCountPerPage: 10,
                type: 'json'
            };

            for (const key in params) {
                if (params[key] !== undefined) {
                    filteredParams[key] = params[key];
                }
            }
            
            const response = await axios.get(this.BASE_URL, {
                params: filteredParams,
                headers: {
                    'User-Agent': 'curl/8.7.1',
                },
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

    async searchIndependenceMerit(params: {
        nPageIndex?: number;
        nCountPerPage?: number;
        nameKo?: string;
        nameCh?: string;
        workoutAffil?: string;
        judgeYear?: string;
    }): Promise<any> {
        return this.request(params);
    }

    async getMeritDetail(params: { nameKo: string; judgeYear?: string }): Promise<any> {
        return this.request(params);
    }

    async listByMovement(workoutAffil: string, nPageIndex?: number, nCountPerPage?: number): Promise<any> {
        return this.request({ workoutAffil, nPageIndex, nCountPerPage });
    }

    async getMeritStats(): Promise<any> {
        const result = await this.request({ nPageIndex: 1, nCountPerPage: 1 });
        return { totalIndependenceMerits: result?.TOTAL_COUNT || 0 };
    }
}
