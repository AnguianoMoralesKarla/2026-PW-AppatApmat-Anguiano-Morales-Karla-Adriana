//vamos a tener funciones que se encargan de validar correo, boleta y contraseña

//wiii mas tarea si

//aqui va la de correo
function validarCorreo(correo) {
}
//aqui va funcion de boleta
function validarBoleta(boleta) {
}

function validarContrasena(contrasena){
    if (typeof contrasena !== 'string') return false;
    return contrasena.length >=8

}

module.exports = {validarContrasena, validarCorreo, validarBoleta};