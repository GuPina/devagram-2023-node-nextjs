import type {NextApiResponse} from 'next';
import type {respostaPadraoMsg} from "../../types/respostaPadraoMsg";
import nc from 'next-connect';
import { updload, uploadImagemCosmic } from '../../services/uploadImagemCosmic';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import {PublicacaoModel} from '../../models/publicacaoModel';
import {UsuarioModel} from '../../models/UsuarioModel';
import { politicaCors } from '../../middlewares/politicaCors';


const handler = nc()
    .use(updload.single('file'))
    .post(async(req: any, res : NextApiResponse<respostaPadraoMsg>) => {
        try{
            const {userId} = req.query;
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({erro : 'Usuario não encontrado'});
            }

            if(!req || !req.body){
                return res.status(400).json({erro : 'Parametros de entrada não informados'});
            }
            const {descricao, file} = req.body;
            
            if(!descricao || descricao.length < 2 ){
                return res.status(400).json({erro : 'Descrição não é valida'});
            }
    
            if(!req.file || !req.file.originalname){
                return res.status(400).json({erro : 'Imagem é obrigatoria'});
            }

            const image = await uploadImagemCosmic(req);
            const publicacao = {
                idUsuario : usuario._id,
                descricao,
                foto : image.media.url,
                data : new Date()
            }

            usuario.publicacoes++;
            await UsuarioModel.findByIdAndUpdate({_id : usuario._id}, usuario);

            await PublicacaoModel.create(publicacao);
            return res.status(400).json({msg : 'Publicação criada com sucesso'});
        }catch(e){
            return res.status(400).json({erro : 'Erro ao cadastrar publicação'});
        }
});

export const config = {
    api : {
        bodyParser : false
    }
}

export default politicaCors(validarTokenJWT (conectarMongoDB (handler)));