/**
 * tratamento de colisões com o cenário <- OK
 * tratamento de colisões com a própria cobra <- OK
 * sobreposição de elementos (alimento e cenário) <- OK
 * otimizar fluidez do movimento da cobra
 * melhorar qualidade de código
 * sistema de pontuação <- OK (pode melhorar)
 * níveis
 * exibir pontuação <- OK
 * efeitos especiais
 * ranking
 * tela inicial do jogo
 * versão mobile
 */

// configurações iniciais do canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const corpoHTML = document.querySelector('body');

let corBackground = "black";
let corCenario = ["red", "white"];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = corBackground;
ctx.strokeStyle = 'red';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineWidth = 10;

let cenarioPosicao = [];

let velocidadeFrame = 60;


class AlimentoAleatorio {
    constructor(raio, cor){
        this.posicaoX = Math.round(Math.random() * (Number(window.innerWidth) - raio) + raio);
        this.posicaoY = Math.round(Math.random() * (Number(window.innerHeight) - raio) + raio);
        this.raioOriginal = raio;
        this.raioAtual = raio;
        this.crescimento = -1;
        this.cor = cor;
    }

    atualizaRaio(){
        this.raioAtual += this.crescimento;

        if(this.raioAtual <= this.raioOriginal/2) this.crescimento = 1;
        else if(this.raioAtual === this.raioOriginal) this.crescimento = -1;
    }

    setCor(cor){
        this.cor = cor;
    }

    atualizaAlimentoAleatorio(){
        this.posicaoX = Math.round(Math.random() * (Number(window.innerWidth) - this.raioOriginal) + this.raioOriginal);
        this.posicaoY = Math.round(Math.random() * (Number(window.innerHeight) - this.raioOriginal) + this.raioOriginal);
    }
}

class CorpoCobrinha {
    constructor(posicaoX, posicaoY, anguloInicial, anguloFinal, trajetoriaAtual){
        this.posicaoX = posicaoX;
        this.posicaoY = posicaoY;
        this.anguloInicial = anguloInicial;
        this.anguloFinal = anguloFinal;
        this.trajetoriaAtual = trajetoriaAtual;
    }
}

class Caminho {
    constructor(eixo, inicio, fim, sentido){
        this.eixo = eixo;
        // atributo de início apenas é utilizado para atravessar cenário
        this.inicio = inicio;
        this.fim = fim;
        this.sentido = sentido;
    }
}

class Snake{
    constructor(tamanho, cor, posicaoX, posicaoY, raio){
        this.tamanho = tamanho;
        this.cor = cor;
        this.posicaoX = posicaoX;
        this.posicaoY = posicaoY;
        this.velocidadeX = 10;
        this.velocidadeY = 10;
        this.raio = raio;
        this.corpoCobrinha = [];
        this.trajetoria = [];
        this.score = 0;
        this.trajetoria.push(new Caminho('x', null, null, 1));
        this.criaCorpoCobrinha();
    }

    setPosicaoX(novaPosicaoX){
        this.posicaoX.push(novaPosicaoX);
    }

    setPosicaoY(novaPosicaoY){
        this.posicaoY.push(novaPosicaoY);
    }

    setCor(cor){
        this.cor = cor;
    }

    //atualizam posição
    atualizaPosicaoX(indice){
        this.corpoCobrinha[indice].posicaoX += this.velocidadeX * this.trajetoria[this.corpoCobrinha[indice].trajetoriaAtual].sentido;
    }

    atualizaPosicaoY(indice){
        this.corpoCobrinha[indice].posicaoY += this.velocidadeY * this.trajetoria[this.corpoCobrinha[indice].trajetoriaAtual].sentido;

    }

    atualizaAnguloEixoX(indice){
        if (this.corpoCobrinha[indice].anguloInicial === 0) {
            this.corpoCobrinha[indice].anguloInicial =  Math.PI;
            this.corpoCobrinha[indice].anguloFinal =  0;
        } else {
            this.corpoCobrinha[indice].anguloInicial =  0;
            this.corpoCobrinha[indice].anguloFinal =  Math.PI;
        }
    }

    atualizaAnguloEixoY(indice){
        if (this.corpoCobrinha[indice].anguloInicial === 3 * Math.PI/2) {
            this.corpoCobrinha[indice].anguloInicial =  Math.PI/2;
            this.corpoCobrinha[indice].anguloFinal =  3 * Math.PI/2;
        } else {
            this.corpoCobrinha[indice].anguloInicial =  3 * Math.PI/2;
            this.corpoCobrinha[indice].anguloFinal =  Math.PI/2;
        }
    }

    criaCorpoCobrinha(){
        for(let i = 0; i < this.tamanho; i++){
            if(i % 2 === 0) this.corpoCobrinha.push(new CorpoCobrinha(this.posicaoX + 10 * i, this.posicaoY, 0, Math.PI, 0));
            else this.corpoCobrinha.push(new CorpoCobrinha(this.posicaoX + 10 * i, this.posicaoY, Math.PI, 0, 0));
        }
    }

    aumentaCobrinha(){
        if(this.trajetoria[this.corpoCobrinha[0].trajetoriaAtual].eixo === 'x'){
            for(let i = 0; i < 4; i++){
                if(this.corpoCobrinha[0].anguloInicial === 0) this.corpoCobrinha.unshift(new CorpoCobrinha(this.corpoCobrinha[0].posicaoX - 10 * this.trajetoria[this.corpoCobrinha[0].trajetoriaAtual].sentido, this.corpoCobrinha[0].posicaoY, Math.PI, 0, this.corpoCobrinha[0].trajetoriaAtual));
                else this.corpoCobrinha.unshift(new CorpoCobrinha(this.corpoCobrinha[0].posicaoX - 10 * this.trajetoria[this.corpoCobrinha[0].trajetoriaAtual].sentido, this.corpoCobrinha[0].posicaoY, 0, Math.PI, this.corpoCobrinha[0].trajetoriaAtual));
            }

            cobra.tamanho += 4;
        } else {
            for(let i = 0; i < 4; i++){
                if(this.corpoCobrinha[0].anguloInicial === 3 * Math.PI/2) this.corpoCobrinha.unshift(new CorpoCobrinha(this.corpoCobrinha[0].posicaoX, this.corpoCobrinha[0].posicaoY  - 10 * this.trajetoria[this.corpoCobrinha[0].trajetoriaAtual].sentido, Math.PI/2, 3 * Math.PI/2, this.corpoCobrinha[0].trajetoriaAtual));
                else this.corpoCobrinha.unshift(new CorpoCobrinha(this.corpoCobrinha[0].posicaoX, this.corpoCobrinha[0].posicaoY  - 10 * this.trajetoria[this.corpoCobrinha[0].trajetoriaAtual].sentido, 3 * Math.PI/2, Math.PI/2, this.corpoCobrinha[0].trajetoriaAtual));
            }
            
            cobra.tamanho += 4;
        }
    }
}

const cobra = new Snake(5, 'red', 75, 75, 5);

// identifica tecla selecionada pelo usuário
corpoHTML.addEventListener('keypress', (evento) => {
    if(evento.keyCode === 115 && cobra.trajetoria[cobra.trajetoria.length - 1].eixo != 'y'){
        cobra.trajetoria[cobra.trajetoria.length - 1].fim = cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX;
        cobra.trajetoria.push(new Caminho('y', null, null, 1));
    } else if(evento.keyCode === 100 && cobra.trajetoria[cobra.trajetoria.length - 1].eixo != 'x'){
        cobra.trajetoria[cobra.trajetoria.length - 1].fim = cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY;
        cobra.trajetoria.push(new Caminho('x', null, null, 1));
    } else if(evento.keyCode === 97 && cobra.trajetoria[cobra.trajetoria.length - 1].eixo != 'x'){
        cobra.trajetoria[cobra.trajetoria.length - 1].fim = cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY;
        cobra.trajetoria.push(new Caminho('x', null, null, -1));
    } else if(evento.keyCode === 119 && cobra.trajetoria[cobra.trajetoria.length - 1].eixo != 'y'){
        cobra.trajetoria[cobra.trajetoria.length - 1].fim = cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX;
        cobra.trajetoria.push(new Caminho('y', null, null, -1));
    }
});

function desenhaEfeitoColisao(){
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function desenhaCorpoCobra(i, eixo){
    ctx.strokeStyle = cobra.cor;

    // desenha seguimentos da cobrinha
    ctx.beginPath();
    ctx.arc(cobra.corpoCobrinha[i].posicaoX, cobra.corpoCobrinha[i].posicaoY, cobra.raio, cobra.corpoCobrinha[i].anguloInicial, cobra.corpoCobrinha[i].anguloFinal, true);
    ctx.stroke();

    ctx.beginPath();

    // desenha círculo quando a cobrinha faz curvas (obs: precisa melhorar isso)
    if((i !== cobra.tamanho - 1 && cobra.trajetoria[cobra.corpoCobrinha[i + 1].trajetoriaAtual].eixo !== eixo) ||
        cobra.corpoCobrinha[i].posicaoY < 15 || (cobra.corpoCobrinha[i].posicaoY + 10 >= window.innerHeight && cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].inicio !== null ) ||
        cobra.corpoCobrinha[i].posicaoX < 15 || (cobra.corpoCobrinha[i].posicaoX + 10 >= window.innerWidth && cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].inicio !== null )){
            ctx.arc(cobra.corpoCobrinha[i].posicaoX, cobra.corpoCobrinha[i].posicaoY, cobra.raio, 0, Math.PI * 2, true);
            ctx.stroke(); 
    } else if(i === cobra.tamanho - 1){ // desenha cabeça da cobra
        if(eixo === 'y'){
            if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].sentido === -1){
                ctx.arc(cobra.corpoCobrinha[i].posicaoX, cobra.corpoCobrinha[i].posicaoY - (cobra.raio + 2), cobra.raio + 2, 0, Math.PI * 2, true);
            } else {
                ctx.arc(cobra.corpoCobrinha[i].posicaoX, cobra.corpoCobrinha[i].posicaoY + (cobra.raio + 2), 7, 0, Math.PI * 2, true);
            }
        } else {
            if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].sentido === -1){
                ctx.arc(cobra.corpoCobrinha[i].posicaoX - (cobra.raio + 2), cobra.corpoCobrinha[i].posicaoY, cobra.raio + 2, 0, Math.PI * 2, true);
            } else {
                ctx.arc(cobra.corpoCobrinha[i].posicaoX + (cobra.raio + 2), cobra.corpoCobrinha[i].posicaoY, cobra.raio + 2, 0, Math.PI * 2, true);
            }
        }

        ctx.stroke();

        ctx.fillStyle = cobra.cor;
        ctx.fill();
    } else if(i === 0){ // desenha rabinho
        ctx.beginPath();
        if(eixo === 'x'){
            if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].sentido === -1){
                ctx.arc(cobra.corpoCobrinha[i].posicaoX + 4, cobra.corpoCobrinha[i].posicaoY, 1, 0, Math.PI * 2, true);
            } else {
                ctx.arc(cobra.corpoCobrinha[i].posicaoX - 4, cobra.corpoCobrinha[i].posicaoY, 1, 0, Math.PI * 2, true);
            }
        } else {
            if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].sentido === -1){
                ctx.arc(cobra.corpoCobrinha[i].posicaoX, cobra.corpoCobrinha[i].posicaoY + 4, 1, 0, Math.PI * 2, true);
            } else {
                ctx.arc(cobra.corpoCobrinha[i].posicaoX, cobra.corpoCobrinha[i].posicaoY - 4, 1, 0, Math.PI * 2, true);
            }
        }
    
        ctx.stroke();   
    }
}

function desenhaCobra () {
    for(let i = 0; i < cobra.tamanho; i++){
        ctx.lineWidth = 10;
        if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].eixo == 'x'){
            cobra.atualizaPosicaoX(i);
            cobra.atualizaAnguloEixoX(i);
            desenhaCorpoCobra(i, 'x');

            if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].fim != null && cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].sentido !== -1 &&
                cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].fim < cobra.corpoCobrinha[i].posicaoX - 10){
                    cobra.corpoCobrinha[i].trajetoriaAtual += 1;
                    if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].inicio != null){
                        cobra.corpoCobrinha[i].posicaoX = cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].inicio;
                    }
            } else if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].fim != null && cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].sentido === -1 &&
                cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].fim > cobra.corpoCobrinha[i].posicaoX + 10){
                    cobra.corpoCobrinha[i].trajetoriaAtual += 1;
                    if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].inicio != null){
                        cobra.corpoCobrinha[i].posicaoX = cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].inicio;
                    }
            }
            
            if(i === cobra.tamanho - 1){
                if(cobra.corpoCobrinha[i].posicaoX > window.innerWidth && cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].fim === null){
                    cobra.trajetoria[cobra.trajetoria.length - 1].fim = cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX - 5;
                    cobra.trajetoria.push(new Caminho('x', 0, null, 1));  
                }else if(cobra.corpoCobrinha[i].posicaoX < 0 && cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].fim === null){
                    cobra.trajetoria[cobra.trajetoria.length - 1].fim = cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX + 5;
                    cobra.trajetoria.push(new Caminho('x', window.innerWidth, null, -1));  
                }
            }
        } else {
            cobra.atualizaPosicaoY(i);
            cobra.atualizaAnguloEixoY(i);
            desenhaCorpoCobra(i, 'y');

            if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].fim != null && cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].sentido !== -1 && 
                cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].fim < cobra.corpoCobrinha[i].posicaoY){
                    cobra.corpoCobrinha[i].trajetoriaAtual += 1;
                    if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].inicio != null){
                        cobra.corpoCobrinha[i].posicaoY = cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].inicio;
                    }
            } else if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].fim != null && cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].sentido === -1 &&
                cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].fim > cobra.corpoCobrinha[i].posicaoY){
                    cobra.corpoCobrinha[i].trajetoriaAtual += 1;
                    if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].inicio != null){
                        cobra.corpoCobrinha[i].posicaoY = cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].inicio;
                    }
            }

            if(i === cobra.tamanho - 1){
                if(cobra.corpoCobrinha[i].posicaoY > window.innerHeight && cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].fim === null){
                    cobra.trajetoria[cobra.trajetoria.length - 1].fim = cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY;
                    cobra.trajetoria.push(new Caminho('y', 0, null, 1));  
                }else if(cobra.corpoCobrinha[i].posicaoY < 0 && cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].fim === null){
                    cobra.trajetoria[cobra.trajetoria.length - 1].fim = cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY;
                    cobra.trajetoria.push(new Caminho('y', window.innerHeight, null, -1));  
                }
            }
        }
    }
}

function movimentaCobra(){
    ctx.fillStyle = corBackground;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // trata sobreposição do alimento com o cenário 
    verificaColisaoCenario(alimento.posicaoX, alimento.posicaoY, true);
    desenhaAlimentoAleatorio();

    desenhaCobra();   
    criaCenario();
    

    // trata colisçao da cobra com o cenário 
    verificaColisaoCenario(cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX, cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY, false);
    verificaCobraAlimento();
    verificaColisaoCobra();
}

function desenhaAlimentoAleatorio(){
    //const aleatorio = Math.round(Math.random() * (5 - 1) + 1);
    ctx.fillStyle = alimento.cor;
    ctx.beginPath();
    ctx.arc(alimento.posicaoX, alimento.posicaoY, alimento.raioAtual, 0, Math.PI * 2);
    ctx.fill();
    alimento.atualizaRaio();
}

const alimento = new AlimentoAleatorio(20, "blue");

let contador = 0;
let corNiveis;

function verificaCobraAlimento(){
    if(alimento.posicaoX - alimento.raioAtual <= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX && 
         cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX <= alimento.posicaoX + alimento.raioAtual &&
        alimento.posicaoY - alimento.raioAtual <= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY &&
        cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY <= alimento.posicaoY + alimento.raioAtual){
            alimento.atualizaAlimentoAleatorio();
            cobra.aumentaCobrinha();
            velocidadeFrame -= 4;
            cobra.score += 20;
            clearInterval(intervalo);

            corNiveis = [["green", "white", "white", "white", "yellow"], 
                            ["black", "blue", "blue", "white", "yellow"],
                            ["black", "green", "green", "green", "green"],
                            ["black", "red", "red", "white", "blue"],]

            console.log(cobra.score % 60 === 0);
            if(cobra.score % 60 === 0) {
                corBackground = corNiveis[contador][0];
                cobra.setCor(corNiveis[contador][1]);
                corCenario[0] = corNiveis[contador][2];
                corCenario[1] = corNiveis[contador][3];
                alimento.setCor(corNiveis[contador][4]);
                contador++;

                if(contador === 4) contador = 0;
            }

            if(velocidadeFrame <= 20) velocidadeFrame = 20;
            intervalo = setInterval(() => {
                movimentaCobra();
                desenhaScore();
            }, velocidadeFrame);
        }
}

// precisa otimizar isso
function verificaColisaoCenario(posicaoX, posicaoY, sobreposicao){
        for(let i = 0; i < 2; i++){
            if(cenarioPosicao[i][0] - 12 <= posicaoX &&
                 posicaoX <= cenarioPosicao[i][0] + 410 &&
                 cenarioPosicao[i][1] - 12 <= posicaoY &&
                 posicaoY <= cenarioPosicao[i][1] + 63
            ){
                if(sobreposicao) alimento.atualizaAlimentoAleatorio();
                else {
                    desenhaEfeitoColisao();
                    clearInterval(intervalo);
                    break;
                }
            }
        }

        if((cenarioPosicao[2][0] <= posicaoX &&
            posicaoX <= cenarioPosicao[2][0] + 210 &&
            cenarioPosicao[2][1] <= posicaoY &&
            posicaoY <= cenarioPosicao[2][1] + 63) ||
            (cenarioPosicao[2][0] <= posicaoX &&
                posicaoX <= cenarioPosicao[2][0] + 63 &&
                cenarioPosicao[2][1] + 63 <= posicaoY &&
                posicaoY <= cenarioPosicao[2][1] + 213)
        ){
            if(sobreposicao) alimento.atualizaAlimentoAleatorio();
            else {
                desenhaEfeitoColisao();
                clearInterval(intervalo);
            }
        } else if((cenarioPosicao[4][0] <= posicaoX &&
            posicaoX <= cenarioPosicao[4][0] + 63 &&
            cenarioPosicao[4][1] - 213 <= posicaoY &&
            posicaoY <= cenarioPosicao[4][1] - 63) ||
            (cenarioPosicao[4][0] <= posicaoX &&
                posicaoX <= cenarioPosicao[4][0] + 213 &&
                cenarioPosicao[4][1] - 63 <= posicaoY &&
                posicaoY <= cenarioPosicao[4][1])
        ){
            if(sobreposicao) alimento.atualizaAlimentoAleatorio();
            else {
                desenhaEfeitoColisao();
                clearInterval(intervalo);
            }
        } else if((cenarioPosicao[3][0] >= posicaoX &&
            posicaoX >= cenarioPosicao[3][0] - 210 &&
            cenarioPosicao[3][1] <= posicaoY &&
            posicaoY <= cenarioPosicao[3][1] + 63) ||
            (cenarioPosicao[3][0] >= posicaoX &&
                posicaoX >= cenarioPosicao[3][0] - 63 &&
                cenarioPosicao[3][1] + 63 <= posicaoY &&
                posicaoY <= cenarioPosicao[3][1] + 213)
        ){
            if(sobreposicao) alimento.atualizaAlimentoAleatorio();
            else {
                desenhaEfeitoColisao();
                clearInterval(intervalo);
            }
        } else if((cenarioPosicao[5][0] - 63 <= posicaoX &&
            posicaoX <= cenarioPosicao[5][0] &&
            cenarioPosicao[5][1] - 213 <= posicaoY &&
            posicaoY <= cenarioPosicao[5][1] - 63) ||
            (cenarioPosicao[5][0] - 213 <= posicaoX &&
                posicaoX <= cenarioPosicao[5][0] &&
                cenarioPosicao[5][1] - 63 <= posicaoY &&
                posicaoY <= cenarioPosicao[5][1])
        ){
            if(sobreposicao) alimento.atualizaAlimentoAleatorio();
            else {
                desenhaEfeitoColisao();
                clearInterval(intervalo);
            }
        }

}

function verificaColisaoCobra(){
    for(let i = 0; i < cobra.tamanho - 1; i++){
        if(cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX === cobra.corpoCobrinha[i].posicaoX && 
            cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY === cobra.corpoCobrinha[i].posicaoY){
                desenhaEfeitoColisao();
                clearInterval(intervalo); 
            }
    }
}

function desenhaScore(color = "#FFF"){
    ctx.fillStyle = color;
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + cobra.score, canvas.width - 330, 30);
}

cenarioPosicao.push([window.innerWidth/2 - 200,  window.innerHeight/2 - 100]); // cenário do meio superior
cenarioPosicao.push([window.innerWidth/2 - 200,  window.innerHeight/2 + 50]); // cenário do meio inferior
cenarioPosicao.push([0, 0]); //canto superior esquerdo
cenarioPosicao.push([window.innerWidth, 0]); //canto superior direito
cenarioPosicao.push([0, window.innerHeight]); //canto inferior esquerdo
cenarioPosicao.push([window.innerWidth, window.innerHeight]); //canto inferior direito

function criaCenario(){
    for(let i = 0; i < 8; i++){
        ctx.beginPath();
        ctx.rect(window.innerWidth/2 - 200 + 50 * i , window.innerHeight/2 - 100, 50, 50);
        ctx.rect(window.innerWidth/2 - 200 + 50 * i , window.innerHeight/2 + 50, 50, 50);
        if(i % 2 === 0) ctx.fillStyle = corCenario[0];
        else ctx.fillStyle = corCenario[1];
        ctx.fill();
    }

    for(let i = 0; i < 4; i++){
        ctx.beginPath();
        ctx.fillRect(0, 0 + 50 * i, 50, 50);
        ctx.fillRect(0, window.innerHeight - (50 + 50 * i), 50, 50);
        ctx.fillRect(window.innerWidth - 50, 0 + 50 * i, 50, 50);
        ctx.fillRect(window.innerWidth - 50, window.innerHeight - (50 + 50 * i), 50, 50);

        if(i !== 3) {
            ctx.rect(50 + 50 * i, 0, 50, 50);
            ctx.rect(50 + 50 * i, window.innerHeight - 50, 50, 50);
            ctx.rect(window.innerWidth - (100 + 50 * i), 0, 50, 50);
            ctx.rect(window.innerWidth - (100 + 50 * i), window.innerHeight - 50, 50, 50);
        }

        if(i % 2 === 0) ctx.fillStyle = corCenario[0];
        else ctx.fillStyle = corCenario[1];
        ctx.fill();
    }
}

let intervalo = setInterval(() => {
    movimentaCobra();
    desenhaScore();
}, velocidadeFrame);
