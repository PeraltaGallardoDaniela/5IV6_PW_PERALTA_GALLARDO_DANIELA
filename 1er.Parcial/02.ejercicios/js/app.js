// Arreglo de objetos base
const talleres = [
  { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
  { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
  { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
  { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];

// 1. Función para llenar la tabla HTML con los datos del arreglo "talleres"
function pintarTabla() {
    const tbody = document.querySelector('#tabla-talleres tbody');
    if (!tbody) return;

    tbody.innerHTML = talleres.map(taller => `
        <tr>
            <td>${taller.nombre}</td>
            <td>${taller.instructor}</td>
            <td>${taller.cupo}</td>
            <td>${taller.inscritos}</td>
        </tr>
    `).join('');
}

// Ejecutar pintado de la tabla al cargar el script
pintarTabla();

// ----------------------------------------------------
// 2. Operaciones con Arreglos
// ----------------------------------------------------
const formArreglos = document.getElementById('form-arreglos');
const resultadoArreglos = document.getElementById('resultado-arreglo');
const selectOperacionArreglo = document.getElementById('operacion-arreglo');

formArreglos.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const operacion = selectOperacionArreglo.value;

    let resultado;

    switch (operacion) {
        case 'forEach':
            resultado = talleres.map((t) => `- ${t.nombre} (${t.inscritos}/${t.cupo})`).join('\n');
            break;

        case 'map':
            const nombres = talleres.map(t => t.nombre);
            resultado = JSON.stringify(nombres, null, 2);
            break;

        case 'filter':
            const llenos = talleres.filter(t => t.inscritos >= t.cupo);
            resultado = JSON.stringify(llenos, null, 2);
            break;

        case 'find':
            const instructorEncontrado = talleres.find(t => t.instructor.includes('María López'));
            resultado = JSON.stringify(instructorEncontrado, null, 2);
            break;
    }

    resultadoArreglos.textContent = resultado;
});

// ----------------------------------------------------
// 3. Operaciones con Objetos y JSON
// ----------------------------------------------------
const formObjeto = document.getElementById('form-objeto');
const resultadoObjeto = document.getElementById('resultado-objeto');

formObjeto.addEventListener('submit', (evento) => {
    evento.preventDefault();

    // Construir el objeto a partir de los valores ingresados en el formulario
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
            // Devuelve las propiedades del objeto (nombres de los atributos)
            resultado = JSON.stringify(Object.keys(taller));
            break;

        case 'values':
            // Devuelve los valores de cada propiedad del objeto
            resultado = JSON.stringify(Object.values(taller));
            break;

        case 'entries':
            // Devuelve los pares [clave, valor] formateados línea por línea
            resultado = Object.entries(taller)
                .map(([clave, valor]) => `${clave}: ${valor}`)
                .join('\n');
            break;

        case 'stringify':
            // Convierte el objeto a una cadena JSON
            const textoJson = JSON.stringify(taller, null, 2);
            resultado = `${textoJson}\n\ntipo: ${typeof textoJson}`;
            break;

        case 'roundtrip':
            // Convierte a JSON y luego de vuelta a Objeto JavaScript
            const cadenaJson = JSON.stringify(taller, null, 2);
            const objetoDevuelto = JSON.parse(cadenaJson);

            resultado = [
                cadenaJson,
                '',
                `tipo: ${typeof objetoDevuelto}`,
                `Propiedad 'nombre': ${objetoDevuelto.nombre}`
            ].join('\n');
            break;
    }

    resultadoObjeto.textContent = resultado;
});