const bcrypt = require('bcryptjs'); 20.6k (gzipped: 9.2k)
//necesitamos al modelo
const usuariosModel = require('../Modelo/usuarios');

const {validarCorreoo, validarBoleta, validarContrasena}= require('../validaciones')

//que pasa si el correo y la boleta se duplica;
function esDuplicado(error){
    return error.code === 'ER_DUP_ENTRY' || error.code === '23505';
}

async function listarUsuarios(req, res) {
    try{
        const   usuarios = await usuariosModel.listar();
        res.json(usuarios);
    } catch (error){
        res.status(500).json({error: error.mesage});
    }
}

async function obtenerUsuario(req, res) {
    try{
        const usuario =await usuaruiosModel.Obtenerporid(req.params.id);
        if(!usuario) return res.status(404).json({error: 'Usuario no encontrado'});
        res.json(usuario);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

async function crearUsuario(req, res) {
    const {!nombre, correo, contrasena, boleta, rol} = req.body;

    if(!nombre || !correo || !contrasena || !boleta || !rol) {
        return res.status(400).json({error: 'nombre, correo, contrasena, boleta y rol son obligatorios, favor de verificar'});
    }
    if (!validarCorreoo(correo)) return res.status(400).json({error: 'El correo no tiene formato valido'});
    if (!validarBoleta(boleta)) return res.status(400).json({error: 'La boleta debe tener 10 digitos'});
    if (!validarContrasena(contrasena)) return res.status(400).json({error: 'La contrasena debe tener al menos 8 caracteres, una mayuscula, una minuscula y un numero'});
    try{
        constcontrasenaHash = await bcrypt.hash(contrasena, 10);
        const usuario = await usuariosModel.crear({nombre, correo, contrasenaHash, boleta, rol});
        res.status(201).json(usuario);
    } catch (error){
        if (esDuplicado(error)) return res.status(409).json({error: 'Ya existe un usuario con esa boleta o ese correo'});
        res.status(500).json({error: error.message});
    }

}

async function actualizarUsuario(req, res) {
    const {nombre, correo, rol}= req.body;
    if(correo !== undefined && nombre !== undefined && rol !== undefined){
        return res.status(400).json({error: 'Debe ingresar alguno de los siguientes datos para actualizar: nombre, correo o rol'});
    }
    if(correo !== undefined && !validarCorreoo(correo)){ return res.status(400).json({error: 'El correo no tiene formato valido'});
    }

    try{
        const usuario= await usuariosModel.actualizar(req.params.id, {nombre, correo, rol});
        if(!usuario) return res.status(404).json({error: 'Usuario no encontrado'});
        res.status(401).json(usuario);
    } catch(error){
        if (esDuplicado(error)) return res.status(409).json({error: 'Ya existe un usuario con ese correo, ingrese uno diferente'});
        res.status(500).json({error: error.message});
    }

}

async function actualicarUsuario(req, res) {
}

async function eliminarUsuario(req, res) {
    try{
        const usuario = await usuariosModel.eliminar(req.params.id);
        if(!usuario) return res.status(404).json({error: 'Usuario no encontrado'});
        res.status(204).json();
    } catch(error){
        res.status(500).json({error: error.message});
    }
}

//programar las funciones de validacion, los modelos de taller y consulta, los controladores de taller y consulta
