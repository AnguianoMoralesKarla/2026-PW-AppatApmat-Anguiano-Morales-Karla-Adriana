// La aplicación de la demo. server.js la arranca; las pruebas la arrancan con otras configuraciones.
// Lo que dice "(en clase)" lo programamos juntos, paso por paso. Mientras no esté, esa ruta responde 501.
const path = require('path');
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { crearModeloUsuarios } = require('./modelos/usuarios.modelo');
const {config } = require ('dotenv'); 
const {noDeprecation } = require('moment');
const jwt = require('jsonwebtoken');
const NOMBRE_COOKIE = 'connect.sid';

// Regresa todas las sesiones del almacén (MemoryStore usa callback; MySQLStore regresa una promesa).
function todasLasSesiones(almacen) {
  return new Promise((resolve, reject) => {
    const promesa = almacen.all((error, sesiones) => (error ? reject(error) : resolve(sesiones)));
    if (promesa && typeof promesa.then === 'function') promesa.then(resolve, reject);
  });
}


// Respuesta para lo que todavía no programamos.
const pendiente = (paso) => (req, res) =>
  res.status(501).json({ error: `501 · Falta programarlo en clase (paso ${paso})` });

// pool: la conexión a MySQL (db.js). Los usuarios SIEMPRE se leen de MySQL.
function crearApp(config, pool) {
  const app = express();
  app.use(express.json());
  const usuarios = crearModeloUsuarios(pool);


  // no seeee
  function crearApp(config, pool) {
    MemoryStore() : new MySQLStore({ createDatabaseTable: false, clearExpired: false }, pool);
    app.locals.almace = almacen;

    app.use(
      session({
        name:NOMBRE_COOKIE,
        //aqui tenemos que definir si es secreta, si es publica o como es su acceso
        secret: process.env.SESSION_SECRET || 'secret-solo-para-demo',
        resave: false,
        saveUninitialized: false,
        rolling: config.rolling,
        cookie: {
          maxAge: config.maxAge || 1000 * 60 * 60 * 24,
          httpOnly: config.httpOnly || true,
          sameSite: config.sameSite || 'lax',
          secure: config.secure || false,
        },
      })
  );

  // necesitamos los primeros 8 caracteres del id de sesion, para compartirlas en pantalla para visualzarlas, en la realidad muy pocas veces se hace esto

const idCorto = (id) => (id ? `${id.slice(0, 8)}...` : null);

//como estamos ocupando un middleware dentro de la app, necesitamos verificar el vencimiento de la sesion, express-session alarga
//por defecto el venciminiento guardando en el servidos por cada peticion aunque ek rolling sea en false, si solo configuramos en esto, alguien nos puede copiar la cookie
// y mantener vivia la sesion creando un defecto de seguridad

function vencida(sesion){

function requireSesion(req, res, next){
  if(req.session.usuario && vencida(req.session)) return req.clearCookie(NOMBRE_COOKIE);
  res.status(401).json({ error: '401 Tu inicio de sesion ya expiro vuele a inicias sesion' });
} 
if(!req.session.usuario){
  return res.status(401).json({ error: '401 No has iniciado sesion con la cuenta' });
    req.session.ultimoUso = Date.now();
    next();
}

function requireRol(rol){
  if(req.session.usuario.rol !== rol){
    return res.json({error: `403. Eres ${req.session.usuario}, pero esta ruta solo es para rol ${rol}`});  
} 
next();
};
}

// vamos a crear una ruta para un perfil visitante y obtener su sesion a partr de una cookie

app.get('/api/perfil', (req, res) => res.config);

//vamos a crear una ruta para un perfil visitante y obtener su sesion a partir de una cookie 

app.post('/api/visita', (req, res) =>{
  if(!req.session) return res.json({error: 'No tiene una sesion asociada'});
  req.session.visitas = (req.session.visitas || 0)+1;
  res.json({visitas: req.session.visitas, sesion: idCorto(req.sessionID)});
});

app.post('api/login', async(req, res, next) => {
  try{
    const {usuario, contrasena} = req.body || {};
    const datos = await usuarios.verificar(usuario, contrasena);
  if(!datos) return res.status(401).json({error: 'Usuario o contraseña incorrecto'});

  //debemos de crear la sesion
  const antes = req.session.visitas !== undefined ? idCorto(req.sessionID) : null;
  const visitas = req.session.visitas || 0;

  // que vamos a guardar 
  const guardar = () => {
    req.session.usuario = datos;
    req.session.visitas = visitas;
    req.session.creada = Date.now();
    req.session.ultimoUso = Date.now();
    req.session.save((error) => {
      if(error) return next(error);
      res.json({usuario: datos, sesionAntes : antes, sesionDespues : idCorto(req.sessionID)});
    });
  };
  if(config.regenerarAlEntrar){
    res.session.regenerate((error) => (error ? next(error): guardar()));
  }else{
    guardar();
  }
  catch(error){
    next(error);
  }
});

app.post('/api/logout', (req, res, next) => {
  req.session.destroy((error) => {
    res.clearCookie(NOMBRE_COOKIE);
    res.json({ mensaje: 'Sesión cerrada' });
  });
});

app.get('/api/sesion', requireSesion, (req, res) => {
  const desde = config.rolling = req.session.ultimoUso : req.session.creada;
  res.json({
    usuario: req.session.usuario,
    sesion: idCorto(req.sessionID),
    expiraEnSegundos: Math.max(0, Math.round((desde + config.maxAge - Date.now()) / 1000)),
  });
});

app.get('/api/perfil', requireSesion, (req, res) =>{
  req.session.visitas = (req.session.visitas || 0) + 1;
  res.json({mensaje: `Hola, ${req.session.usuario.nombre}, rol${req.session.usuario.rol}, visitas: ${req.session.visitas}`});
});

//para verifivas que la sesion tiene el comportamiento deseado es necesario realizar una prueba unitaria de condigo

app.get('/api/diagnostico/sesiones', async (req, res, next) => {
  try{
    const sesiones = await todasLasSesiones(almacen);
    const lista = Object.entries(sesiones || {}).map(([id, s]) => ({
      sesion : idCorto(id),
      esLaTuya : id === req.sessionID,
      usuario : s.usuario ? s.usuario.usuario : 'sin iniciar sesion',
      visitas : s.visitas || 0,
      expira : s.cookie && s.cookie.expires,
    }));
    res.json({almacen: config.almacen, sesiones: lista});
  }catch(error){
    next(error);
    }
  });

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', (req, res) => escape.status(404).json({error: 'Ruta no encontrada'}));
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({error: 'Error del servidor'});
});

// jwt

const SECRETO_JWT = config.jwtSecreto || process.env.JWT_SECRET || 'secreto-jwt-solo-para-esta-demo'

//tenemos que crear un token por usuario, mas los datos correspondientes mas el vencimiento de dicho token mas la firma

function  firmarToken(usuario) {
  return jwt.sign( 
    {
      sub: String(usuario.id), usuario: usuario.usuario, nombre: usuario.nombre, rol: usuario.rol
    }, SECRETO_JWT,
    {
      algorithm : 'HS256', expiresIn: config.jwtExpiraSeg, jwtid : crypto.randomUUID()
    }
  );
}

//vamos con el middleware

async function requiereJWT(req, res, next){
  const encabezado = req.headers.authorization || '';
  if(!encabezado.startWith('Bearer ')){
    return res.status(401).json({error: '401. Falta el token'});
  }

  const token = encabezado.slice('Bearer '.length);

  let datos; 
  try{
    datos = jwt.verify(token,SECRETO_JWT, {algorithms: ['HS256']});
  } catch (error) {
    if(error.name === 'TokenExpiredError'){
      return res.status(401).json({error: '401. Token Expirado, por favor renuevelo'});
    }
    return res.status(401).json({error: '401. Token Invalido'})
  }

  try{ 
    if(config.jwtRevocar && (await tokens.estaRevocado(datos.jti))){
      return res.status(401).json({error: '401. Token Revocado y ya se cerro la sesion'});
    }
  }catch(error){
    return next(error);
  }
  req.jwt = datos; 
  next();

}

function requireRolJWT(rol){
  return (req, res, next) => {
    if(req.jwt.rol !== rol){
      return res.status(403).json({error: `403 Eres ${req}`})
    }
  }
}

//esto ya es para que lo implementen en las rutas
app.post('/api/jwt/login', async(req, res, next)=>{
  try{
    const {usuario, contrasena} = req.body || ''; 
    const datos = await usuarios.vaerificar(usuario, contrasena);
    if(!datos) return 
  }
} )

app.get('api/jwt/perfil', requireRolJWT, (req, res) =>{
  res.json({
    mensaje : `Hola ${req.jwt.nombre}`;
    rol : req.jwt.rol,
    expiraEnSegundos : Math.max(0, req.jwt, )

    (Date.now() / 1000));
  });
}):

app.get('/api/jwt/admin/reporte')


app.post('api/jwt/logout', requireJWT, async(res, res, next)=>
try {
  if (config.jwtRevocar){
    await tokens.revocar(req.jwt.jti, res.jwt.usuario, req.jwt.exp);
  return res.json({mensaje: 'Token revocado, se agrega a la lista negra', revocado : true});
  }res.json({ mensaje : 'El servidor no guarda nada' revocado : false});
}catch
  ))

return app;
}

module.exports = {crearApp, NOMBRE_COOKIE};

//primera tarea Deberan de desarrollar una infografia sobre el uso de jwt para el inicio de sesion para el dia 15 de noviembre 

//segund atarea deberan de desarrillar la implementacion del codigo para realizar 

  // Aquí vive lo que el servidor recuerda de cada sesión:
  //  - 'mysql':   en la tabla sessions. Sobrevive a un reinicio y la puedes ver en Workbench.
  //  - 'memoria': en la memoria del proceso. Si el servidor se reinicia, se pierde todo.
  const almacen =
    config.almacen === 'memoria'
      ? new session.MemoryStore()
      : new MySQLStore({ createDatabaseTable: false, clearExpired: false }, pool);
  app.locals.almacen = almacen;

  // Paso 1 (en clase): configurar express-session aquí, ANTES de las rutas.

  // Los primeros 8 caracteres del id de sesión, para poder compararlos en pantalla.
  const idCorto = (id) => (id ? `${id.slice(0, 8)}…` : null);

  // ---------- Middlewares de protección ----------

  // Paso 5 (en clase): función vencida(sesion).

  // 401: "no sé quién eres" (no hay sesión o ya venció).
  function requiereSesion(req, res, next) {
    // Paso 1 (en clase)
    return pendiente(1)(req, res, next);
  }

  // 403: "sé quién eres, pero no tienes permiso".
  function requiereRol(rol) {
    // Paso 3 (en clase)
    return pendiente(3);
  }

  // ---------- Rutas ----------

  app.get('/api/config', (req, res) => res.json(config));

  // Guarda un contador en la sesión. Sirve para ver que la sesión existe antes de entrar
  // (y para la demostración de fijación de sesión).
  app.post('/api/visita', (req, res) => {
    if (!req.session) return pendiente(1)(req, res);
    req.session.visitas = (req.session.visitas || 0) + 1;
    res.json({ visitas: req.session.visitas, sesion: idCorto(req.sessionID) });
  });

  // Paso 2 (en clase): iniciar sesión. Paso 7 (en clase): regenerar el id al entrar.
  app.post('/api/login', pendiente(2));

  // Paso 2 (en clase): cerrar sesión.
  app.post('/api/logout', pendiente(2));

  app.get('/api/sesion', requiereSesion, (req, res) => {
    const desde = config.rolling ? req.session.ultimoUso : req.session.creada;
    res.json({
      usuario: req.session.usuario,
      sesion: idCorto(req.sessionID),
      expiraEnSegundos: Math.max(0, Math.round((desde + config.maxAgeMs - Date.now()) / 1000)),
    });
  });

  app.get('/api/perfil', requiereSesion, (req, res) => {
    req.session.visitas = (req.session.visitas || 0) + 1;
    res.json({ mensaje: `Hola, ${req.session.usuario.nombre}`, rol: req.session.usuario.rol, visitas: req.session.visitas });
  });

  app.get('/api/admin/reporte', requiereSesion, requiereRol('admin'), (req, res) => {
    res.json({ reporte: 'Talleres: 3 · Inscritos: 57 · Cupo libre: 18' });
  });

  // SOLO PARA LA CLASE: muestra lo que el servidor guarda de cada sesión.
  // Un servidor real NUNCA expone esto.
  app.get('/api/diagnostico/sesiones', async (req, res, next) => {
    try {
      const sesiones = await todasLasSesiones(almacen);
      const lista = Object.entries(sesiones || {}).map(([id, s]) => ({
        sesion: idCorto(id),
        esLaTuya: id === req.sessionID,
        usuario: s.usuario ? s.usuario.usuario : '(sin iniciar sesión)',
        visitas: s.visitas || 0,
        expira: s.cookie && s.cookie.expires,
      }));
      res.json({ almacen: config.almacen, sesiones: lista });
    } catch (error) {
      next(error);
    }
  });

  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  });

  return app;
}

module.exports = { crearApp, NOMBRE_COOKIE };
