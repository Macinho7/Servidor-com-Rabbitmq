/* eslint-disable prettier/prettier */
import { UnauthorizedException } from "@nestjs/common"

const array = []
//escreva aqui, quais palavras deveriam ser verificas como proibidas!
array.push()

async function verificarFraseProibida(frase: string){
    array.forEach(function(nome1: string){
        const verificado = frase.includes(nome1)
        if(verificado){
            throw new UnauthorizedException("Palavra proibida encontrada!")
        }
        return frase
    })
}
export { verificarFraseProibida}