import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';
import type {respostaPadraoMsg} from '../types/respostaPadraoMsg';

export const conectarMongoDB = (handler : NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {

        // verificar se o banco já está conectado, se estiver seguir para o endpoint proximo middleware
        if (mongoose.connections[0].readyState) {
            return handler(req, res);
        }

        // já que não está conectado vamos conectar
        // obter a veriavel de ambiente preenchida do env
        const { DB_CONEXAO_STRING } = process.env;

        // Se a env estiver vazia aborta o uso do sistema e avisa o programador
        if (!DB_CONEXAO_STRING) {
            return res.status(500).json({ erro: 'ENV de configuração não informado' });
        }


        mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
        mongoose.connection.on('error', erro => console.log(`Ocorreu erro ao conectar no banco: ${erro}`));
        await mongoose.connect(DB_CONEXAO_STRING);

        // agora posso seguir para o endpoint, pois estou conectado no banco
        return handler(req, res);
    }