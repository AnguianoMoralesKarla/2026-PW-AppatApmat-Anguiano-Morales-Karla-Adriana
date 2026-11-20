// Datos de talleres
const talleres = [
    { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, ins: 25 },
    { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, ins: 30 },
    { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, ins: 20 },
    { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, ins: 25 }
];

// Pintar tabla
const tbody = document.querySelector('#tabla-talleres tbody');

function pintarTabla() {
    const filasHTML = talleres.map((t) => `
        <tr>
            <td>${t.nombre}</td>
            <td>${t.instructor}</td>
            <td>${t.cupo}</td>
            <td>${t.ins}</td>
        </tr>
    `).join('');
    tbody.innerHTML = filasHTML;
}

pintarTabla();

// FORM ARREGLOS
const formArreglos = document.getElementById('form-arreglos');
const resultadoArreglos = document.getElementById('resultado-arreglos');
const selectOperacionArreglo = document.getElementById('operacion-arreglo');

formArreglos.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const operacion = selectOperacionArreglo.value;
    let resultado;

    switch (operacion) {
        case 'forEach':
            resultado = talleres
                .map((t) => `- ${t.nombre} (${t.ins}/${t.cupo})`)
                .join('\n');
            break;

        case 'map':
            resultado = talleres.map((t) => t.nombre).join(', ');
            break;

        case 'filter':
            resultado = talleres
                .filter((t) => t.ins < t.cupo)
                .map((t) => `${t.nombre} (${t.ins}/${t.cupo})`)
                .join('\n');
            break;

        case 'find':
            const encontrado = talleres.find((t) => t.instructor.includes('Ing.'));
            resultado = encontrado
                ? `${encontrado.nombre} - ${encontrado.instructor}`
                : 'No encontrado';
            break;

        default:
            resultado = 'Operación no válida';
    }

    resultadoArreglos.textContent = resultado;
});

// FORM OBJETO
const formObjeto = document.getElementById('form-objeto');
const resultadoObjeto = document.getElementById('resultado-objeto');

formObjeto.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const taller = {
        nombre: document.getElementById('obj-nombre').value,
        instructor: document.getElementById('obj-instructor').value,
        cupo: Number(document.getElementById('obj-cupo').value),
        inscritos: Number(document.getElementById('obj-inscritos').value)
    };

    const operacion = document.getElementById('operacion-objeto').value;
    let resultado;

    switch (operacion) {
        case 'keys':
            resultado = JSON.stringify(Object.keys(taller));
            break;

        case 'values':
            resultado = JSON.stringify(Object.values(taller));
            break;

        case 'entries':
            resultado = JSON.stringify(Object.entries(taller));
            break;

        case 'stringify':
            resultado = JSON.stringify(taller, null, 2);
            break;

        case 'roundtrip':
            const textoJson = JSON.stringify(taller);
            const objetoDevuelta = JSON.parse(textoJson);
            resultado = [
                textoJson,
                '',
                `tipo: ${typeof objetoDevuelta}`,
                `nombre: ${objetoDevuelta.nombre}`
            ].join('\n');
            break;

        default:
            resultado = 'Operación no válida';
    }

    resultadoObjeto.textContent = resultado;
});
