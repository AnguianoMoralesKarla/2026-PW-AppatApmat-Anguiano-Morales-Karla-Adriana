//03-strings-fechas.js
//Metodos de string mas usados + el objeto Date --Conecta con la validacion de fecha (DD/MM/AAAA) de la semana 4.Completa todo

const entrada = 'Maria Lopez';

//TODO: trim -imprime 'entrada' sin espacios sobrantes, para quitar los espacios
console.log('Ejemplo de uso de .trim()');
console.log(`"${entrada.trim()}"`)




console.log('Ejemplo de split');
const partes = entrada.trim().split(' ');
console.log(partes);



console.log('Manejo de includes')
console.log('correo@cecyt9.com'.includes('@'));




console.log('Manejo de Replace / ReplaceAll')
console.log('05/09/2026'.replace('/', '-'));
console.log('05/09/2026'.replaceAll('/','-'));



console.log('\n Uso de template literals')
const nombre = 'Maria';
const cupo = 25;
console.log(`${nombre} se inscribio en un taller con cupo para &{cupo} personas`);




console.log('Manejo de Date')
function fechaDesdeTexto(textoFecha){

    const[dia, mes, anio] = textoFecha.split('/').map(Number);
    return new Date(anio, mes, - 1, dia);
}



const fechaAsistencia = fechaDesdeTexto('05/09/2026');
console.log('Fecha Construida', fechaAsistencia.toISOString());
console.log('Dia de la semana (0 = domingo)', fechaAsistencia.getDay());

const hoy = new Date();
const diaDeDiferencia = Math.round((fechaAsistencia - hoy) / ( 1000 * 60 * 60 * 24));
console.log(`Faltan ${diaDeDiferencia} dia(s) para la fecha de asistencia (puede ser negativo si ya paso)`);
