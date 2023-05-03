import type { NextApiRequest, NextApiResponse } from "next";
import type {respostaPadraoMsg} from '../../types/respostaPadraoMsg';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import { UsuarioModel } from "../../models/UsuarioModel";

const usuarioEndpoint = async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg | any>) => {
    // como eu pego os dados do usuario logado?
    // id do usuario
    try{
        const {userId} = req?.query;
        const usuario = await UsuarioModel.findById(userId);
        usuario.senha = null;
        return res.status(200).json(usuario)
    }catch(e){
        console.log(e);
        return res.status(400).json({erro : 'Não foi possivel obter dados do usuario'})
    }

}

export default validarTokenJWT(conectarMongoDB(usuarioEndpoint));