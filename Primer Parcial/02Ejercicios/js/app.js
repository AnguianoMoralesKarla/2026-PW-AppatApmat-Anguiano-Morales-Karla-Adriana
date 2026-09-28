

const talleres = [
  { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
  { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
  { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
  { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];
const tbody = document.querySelector("#tabla-talleres tbody");

function pintarTabla(){
    //Debe  de obtener la tabla y llenarla con los datos de los talleres
    const filasHTML = talleres.map((t) => `
    return    
        <tr>
            <td>${t.nombre}</td>
            <td>${t.instructor}</td>
            <td>${t.cupo}</td>
            <td>${t.inscritos}</td>
        </tr>
    `).join('');
    tbody.innerHTML = filasHTML;
}

const formArreglos = document.getElementById("form-arreglos");
const resultadoArreglos = document.getElementById("resultado-arreglos");
const selectOperacionArreglo = document.getElementById('operacion-arreglo');

formArreglos.addEventListener('submit', (evento) =>{
    evento.preventDefault();
    const operacion = selectOperacionArreglo.value;

    let resultado;

    switch(operacion){
        case 'forEach':
            resultado = talleres.map((t) => `- ${t.nombre} (${t.inscritos}/${t.cupo})`).join('\n');
            break;
    }
    resultadoArreglos.textContent = resultado;
} )

const formObjeto = document.getElementById('form-objeto');
const resultadoObjeto = document.getElementById('resultado-objeto');

formObjeto.addEventListener('submit', (evento)=> { 
    evento.preventDefault();

    //necesitamos construir el objeto del taller
    const taller = {
        nombre : document.getElementById('obj-nombre').value,
        instructor : document.getElementById('obj-instructor').value,
        cupo : Number(document.getElementById('obj-cupo').value),
        inscritos : Number(document.getElementById('obj-inscritos').value) 
    };

    const operacion = document.getElementById('operacion-objeto').value;

    let resultado;
    switch(operacion){
        case 'keys' :
            resultado = JSON.stringify(Object.keys(taller));
                break;
            case 'values':
                break;
            case 'entries' :
                break;
            case 'stringify':
                // yo
                const textoJson = JSON.stringify(taller, null, 2);
                resultado = `${textoJson}\n \n tipo: ${typeof textoJson}` ;
                break;
            case 'roundtrip' :
                // yo
                const textoJsons = JSON.stringify(taller, null, 2);
                const objetoDevuelta = JSON.parse(textoJsons);

                resultado = [
                    textoJsons,
                    '',
                `tipo:${typeof objetoDevuelta}`,
                objetoDevuelta.nombre
                ].join('\n');
                break;
    }       
    resultadoObjeto.textContent = resultado;
});