const escolha = process.argv[2]
const numero = process.argv[3]

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
const numeroAleatorioEntreUmeDez = getRndInteger(1, 10)

// const numeroAleatorioEntreZeroeDez = getRndInteger(0, 10)
// console.log(numeroAleatorioEntreZeroeDez)

// console.log(numeroAleatorioEntreUmeDez)

// const numeroAleatorioEntreDezeQuinze = getRndInteger(10, 15)
// console.log(numeroAleatorioEntreDezeQuinze)
let computador 
if(escolha === "par"){
  computador = "impar"
}else{
  computador = "par"
}

let resultado = Number(numero) + numeroAleatorioEntreUmeDez
let frase 

if(escolha === "par" && resultado%2 === 0){
  frase = "Você ganhou!"
}else if(escolha === "impar" && resultado%2 !== 0){
  frase = "Você ganhou!"
}else {
  frase = "Você perdeu :("
}

console.log("Você escolheu ", escolha, " e o computador escolheu", computador, ". O resultado foi", resultado, ".", frase)