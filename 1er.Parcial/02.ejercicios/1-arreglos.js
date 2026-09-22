// 01-arreglos.js
const talleres = [
  { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
  { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
  { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
  { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];

// TODO: forEach
console.log("Aplicando un forEach para imprimir los talleres:");
talleres.forEach((t) => console.log(`- ${t.nombre} (${t.inscritos}/${t.cupo})`));

// TODO: map
console.log("Aplicando funcion Map con solo Nombres");
const nombres = talleres.map((t) => t.nombre);
console.log(nombres);

// TODO: filter
console.log("Aplicando la función Filter en los talleres");
const llenos = talleres.filter((t) => t.inscritos >= t.cupo);
console.log(llenos.map((t) => t.nombre));

// TODO: find — encuentra el PRIMER taller impartido por 'Ing. María López'
const primerTallerMaria = talleres.find((t) => t.instructor === 'Ing. María López');
console.log("Primer taller de Ing. María López:", primerTallerMaria);

// TODO: reduce — calcula `totalInscritos`, la suma de inscritos de todos los talleres
const totalInscritos = talleres.reduce((acum, t) => acum + t.inscritos, 0);
console.log("Total de inscritos en todos los talleres:", totalInscritos);

// TODO: filter + map encadenados — nombres de los talleres que SÍ tienen cupo disponible
const disponiblesNombres = talleres
  .filter((t) => t.inscritos < t.cupo)
  .map((t) => t.nombre);
console.log("Talleres con cupo disponible:", disponiblesNombres);




