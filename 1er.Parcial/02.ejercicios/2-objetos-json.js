// 02-objetos-json.js
// Object.keys/values/entries y JSON.stringify/parse. Completa cada TODO.

const taller = {
  nombre: 'Introducción a Python',
  instructor: 'Ing. María López',
  cupo: 25,
  inscritos: 25,
};
 console.log("manejo de Objetc.keys");
 console.log(Object.keys(taller));



// TODO: Object.keys — imprime solo los nombres de las propiedades de `taller`
console.log("manejo de valores del objeto");
console.log(Object.values(taller));

// TODO: Object.values — imprime solo los valores
console.log("manejo de objeto por for-off para entries");
for(const(campo,valor)of Object.entries(taller)){
  console.log(`$(campo): $(valor)`);
}


// TODO: Object.entries — recorre con for..of e imprime "campo: valor" de cada propiedad
console.log("manejo de conversion");
const textoJson = JSON.stringify(taller, null,2);
console.log(textoJson)

// TODO: JSON.stringify — convierte `taller` a texto (guárdalo en `textoJson`) e imprímelo
console.log(`tipo:`,typeof textoJson);

// TODO: JSON.parse — convierte `textoJson` de vuelta a objeto (guárdalo en `objetoDeVuelta`)
console.log(`inverso de cadena a Json`)
const objetoDeVuelta = JSON.parse(textoJson),
console.log(`tipo : `,`)



//       e imprime `objetoDeVuelta.nombre`