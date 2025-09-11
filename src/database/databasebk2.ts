import { Pool, PoolConfig, QueryResult } from 'pg';
import { config } from '../config/env';
import { Database as DatabaseResult } from '../interfaces/database.interface';
import tunnel from 'tunnel-agent'; // Importe a biblioteca tunnel-agent

class Database {
    private pool: Pool;
    constructor() {
        // Crie o agente de proxy
        const agent = tunnel.httpsOverHttp({
            proxy: {
                host: 'seu-host-do-proxy',
                port: 8080, // A porta do seu proxy
                proxyAuth: 'usuario:senha' // Opcional, se o proxy exigir autenticação
            }
        });

        // Configure o pool
        const poolConfig: PoolConfig = {
            host: config.db_host,
            port: Number(config.db_port),
            database: config.db_database,
            user: config.db_user,
            password: config.db_password,
            ssl: {
                rejectUnauthorized: false
            },
            max: 20,
            idleTimeoutMillis: 30000,
            // Adicione o agente de proxy à configuração do pool
            agent: agent
        };
        this.pool = new Pool(poolConfig);
    }

    async query(sql: string, values?: any[]): Promise<DatabaseResult> {
        try {
            const result: QueryResult = await this.pool.query(sql, values);
            return {
                status: true,
                data: result.rows,
            };
        } catch (error) {
            return {
                status: false,
                data: [],
                error: error as Error
            };
        }
    }

    async end(): Promise<void> {
        await this.pool.end();
        console.log('Conexão com o banco de dados encerrada.');
    }
}

const database = new Database();
export { database };