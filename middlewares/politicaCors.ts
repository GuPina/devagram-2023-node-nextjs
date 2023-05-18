import type {NextApiResponse, NextApiHandler, NextApiRequest} from 'next';
import type {respostaPadraoMsg} from '../types/respostaPadraoMsg';
import NextCors from 'nextjs-cors';

export const politicaCors =  (handler : NextApiHandler) =>
        async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {
        try{

            await NextCors(req, res, {
                origin : '*',
                methods : ['GET', 'POST', 'PUT'],
               optionSuccessStatus : 200,
            });
            
            return handler (req, res);
        }catch(e){
            console.log('Erro ao tratar a policia de CORS:', e);
            res.status(500).json({erro : 'Erro ao tratar a politica de CORS'});
        }
    }