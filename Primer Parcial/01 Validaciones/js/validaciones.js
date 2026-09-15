 /* las pcalidaciones de formuolario son expresiones regulares, plas cuales en este momento las podemos dividir en tres partes:
1.- Para el texto (Nombre)
2.- Para el numero de boleta (boleta)
3.- Para la fecha (fecha))
Una expresion regular, es un patron donde se identifican que elementos serab validados vs cuales ni, son reglas mediante las cuales realizamos la validacion de los datos ingresados por el usuario, en este caso, en un foprmulario,
*/

const patrones = {
    nombre: /^[a-zA-ZÀÁáéíóúÉÍÓÚÜü-ÿ\s]{2,60}$/, 
    boleta: /^\d{10}$/,
    fecha: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4})$/ 
};

const mensajes = {
    nombre: "Solo letras y espacios, entre 2 y 60 caracteres.",
    boleta: "Debe contener exactamente 10 dígitos.",
    fecha: "Formato esperado: DD/MM/YYYY. (ej 01/01/2023)"
};

function validarCampo(campo, valor) {
    return patrones[campo].test(valor.trim());
}

//Necesitamos ver el resto del archivo DOM,

if (typeof document !== 'undefined') {
    const formulario = document.getElementById('form-registro');

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        let formularioValido = true;
        for (const campo of Object.keys(patrones)) {
            const input = document.getElementById(campo);
            const spanError = document.getElementById('error-${campo}');
            const esValido = validarCampo(campo, input.value);

            input.classList.toogle('invalido', !esValido);
            spanError.textContent = esValido ? '' : mensajes[campo];

            if (!esValido) formularioValido = false;
        }
        const mensajeExito = document.getElementById('mensaje-exito');
        mensajeExito.textContent = formularioValido ? 'Registro exitoso.' : '';
    });

}