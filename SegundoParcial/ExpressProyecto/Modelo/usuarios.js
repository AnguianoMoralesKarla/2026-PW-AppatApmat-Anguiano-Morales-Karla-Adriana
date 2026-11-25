const pool = require('../db-local');

const COLUMNAS_PUBLICAS = 'id, nombre, correo, boleta, rol';

//consultar todos los usuarios
async function listar() {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios ORDER BY id`);
    return filas;
}

//consultar por id
async function Obtenerporid(id) {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios WHERE id = ?`, [id]);
    return filas[0];

}

//registrar un nuevo usuario
async function crear({nombre, correo, contrasenaHash, boleta, rol}) {
    const [info] = await pool.query(`INSERT INTO usuarios (nombre, correo, contrasena, boleta, rol) VALUES (?, ?, ?, ?, ?)`, [nombre, correo, contrasenaHash, boleta, rol || 'alumno']);
    return Obternerporid(info.insertId);

}

//actualizar un alumno
async function actualizar(id, {nombre, correo, rol}) {
    const cambios = Object.entries({nombre, correo, rol}).filter(([, valor])) => valor !== undefined;
    if(cambios.length === 0) return Obtenerporid(id);
    const columnas =cambios.map(([columna]) => `${columna} = ?`).join(', ');
    const [info] = await pool.query(`UPDATE usuarios SET ${columnas} WHERE id = ?`, [...cambios.map(([, valor]) => valor), id]);
    if(info.affectedRows === 0) return undefined;
    return Obtenerporid(id);
}

async function eliminar(id) {
    const [filas] = await pool.query(`DELEETE FROM usuarios WHERE id = ?`, [id]);
    return info.affectedRows > 0;
}   

//buscar por correo
async function buscarPorCorreoConHash(correo) {
    const [filas] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return filas[0];
}

//siempre es necesario exportar las funciones para poder crar a su api
module.exports = {listar, Obtenerporid, crear, actualizar, eliminar, buscarPorCorreoConHash};

//deberan de crear las otras 2 entidades talleres y asistencias 
//Para taller hay que crear las funciones de consultarportaller y registrarse en un taller
//para asistencia hay que crear las funciones de regirstrarasistencia en el taller, consultarlistadeasistencia 