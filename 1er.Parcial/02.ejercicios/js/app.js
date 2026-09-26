// app.js

const talleresData = [
  {
    nombre: "Introducción a Python",
    instructor: "Ing. María López",
    cupo: 25,
    inscritos: 25,
  },
  {
    nombre: "Fundamentos de Redes",
    instructor: "Ing. Carlos Ramírez",
    cupo: 30,
    inscritos: 18,
  },
  {
    nombre: "Diseño de Bases de Datos",
    instructor: "Ing. Ana Torres",
    cupo: 20,
    inscritos: 20,
  },
  {
    nombre: "Desarrollo Web con JS",
    instructor: "Ing. María López",
    cupo: 25,
    inscritos: 10,
  },
];

// 1. Renderizar la tabla dinámica usando .map()
function renderizarTabla(lista) {
  const tbody = document.querySelector("#tabla-talleres tbody");

  // Generar las filas con map y unirlas en un string HTML
  const filasHtml = lista
    .map(
      (t) => `
    <tr>
      <td>${t.nombre}</td>
      <td>${t.instructor}</td>
      <td>${t.cupo}</td>
      <td>${t.inscritos}</td>
    </tr>
  `
    )
    .join("");

  tbody.innerHTML = filasHtml;
}

// Cargar la tabla al iniciar
document.addEventListener("DOMContentLoaded", () => {
  renderizarTabla(talleresData);
});

// 2. Manejar la ejecución del formulario/select
const form = document.querySelector("#form-arreglos");
const outputResultado = document.querySelector("#resultado-arreglo");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const operacion = document.querySelector("#operacion-arreglo").value;
  let resultado = "";

  switch (operacion) {
    case "forEach":
      let lista = [];
      talleresData.forEach((t) =>
        lista.push(`- ${t.nombre} (${t.inscritos}/${t.cupo})`)
      );
      resultado = lista.join("\n");
      break;

    case "map":
      const nombresArr = talleresData.map((t) => t.nombre);
      resultado = `Nombres de los talleres:\n${JSON.stringify(
        nombresArr,
        null,
        2
      )}`;
      break;

    case "filter":
      const llenosArr = talleresData
        .filter((t) => t.inscritos >= t.cupo)
        .map((t) => t.nombre);
      resultado = `Talleres llenos:\n${llenosArr.join(", ")}`;
      break;

    case "find":
      const tallerMaria = talleresData.find(
        (t) => t.instructor === "Ing. María López"
      );
      resultado = `Primer taller de Ing. María López:\n${tallerMaria.nombre} (Cupo: ${tallerMaria.cupo}, Inscritos: ${tallerMaria.inscritos})`;
      break;

    default:
      resultado = "Operación no válida";
  }

  outputResultado.textContent = resultado;
  // Cargar la tabla con datos al abrir la página
  document.addEventListener("DOMContentLoaded", () => {
    renderizarTabla(talleresData);
  });

  // Manejo del formulario
  const form = document.querySelector("#form-arreglos");
  const outputResultado = document.querySelector("#resultado-arreglo");

  form.addEventListener("submit", (event) => {
    // PREVIENE QUE LA PÁGINA SE RECARGUE AL DAR CLIC EN EJECUTAR
    event.preventDefault();

    const operacion = document.querySelector("#operacion-arreglo").value;
    let resultado = "";

    switch (operacion) {
      case "forEach":
        let lista = [];
        talleresData.forEach((t) =>
          lista.push(`- ${t.nombre} (${t.inscritos}/${t.cupo})`)
        );
        resultado = lista.join("\n");
        break;

      case "map":
        const nombresArr = talleresData.map((t) => t.nombre);
        resultado = JSON.stringify(nombresArr, null, 2);
        break;

      case "filter":
        const llenosArr = talleresData
          .filter((t) => t.inscritos >= t.cupo)
          .map((t) => t.nombre);
        resultado = `Talleres llenos:\n${llenosArr.join(", ")}`;
        break;

      case "find":
        const tallerMaria = talleresData.find(
          (t) => t.instructor === "Ing. María López"
        );
        resultado = `Primer taller de Ing. María López:\n${tallerMaria.nombre}`;
        break;
    }

    outputResultado.textContent = resultado;
  });
});

