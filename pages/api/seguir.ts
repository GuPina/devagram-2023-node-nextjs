import type {NextApiRequest, NextApiResponse} from 'next';
import type {respostaPadraoMsg} from '../../types/respostaPadraoMsg';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { UsuarioModel } from '../../models/UsuarioModel';
import { seguidorModel } from '../../models/seguidorModel';

const endpointSeguir = async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) =>{
    try{
        if(req.method === 'PUT'){
            if(req?.query?.userId){

                const {userId, id} = req?.query;


                const usuarioLogado = await UsuarioModel.findById(userId);
                if(!userId){
                    return res.status(400).json({erro : 'Usuario logado nao encontrado'})
                }
                const usuarioASerSeguido = await UsuarioModel.findById(id);
                if(!usuarioASerSeguido){
                    return res.status(400).json({erro : 'Usuario a ser seguido não encontrado' })
                }

                const euJaSigoEsseUsuario = await seguidorModel
                .find({usuarioId: usuarioLogado._id, usuarioSeguidoId : usuarioASerSeguido._id});

                if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){

                }else{
                    const seguidor = {
                        usuarioId : usuarioLogado._id,
                        usuarioASerSeguido : usuarioASerSeguido._id
                    };
                    await seguidorModel.create(seguidor);
                    return res.status(200).json({msg : 'Usuario seguido com sucesso'});
                }
            }


        }
        return res.status(405).json({erro : 'Metodo informado não existe'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro : 'Não foi possivel seguir/deseguir o usuario'});
    }
}

export default validarTokenJWT (conectarMongoDB(endpointSeguir));