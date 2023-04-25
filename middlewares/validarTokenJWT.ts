import type {NextApiRequest, NextApiHandler, NextApiResponse} from 'next';
import type {respostaPadraoMsg} from '../types/respostaPadraoMsg';

export const validarTokenJWT = (handler : NextApiHandler) =>
    (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) =>{

    const {MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT){
        return res.status(500).json({erro : 'ENV chave JWT não informada na execução do projeto'})
    }

    

    }
