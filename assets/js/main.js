/**
 * tratamento de colisões com o cenário <-
 * tratamento de colisões com a própria cobra
 * sobreposição de elementos (alimento e cenário) <-
 * otimizar fluidez do movimento da cobra
 * sistema de pontuação
 * níveis
 * exibir pontuação
 * efeitos especiais
 * ranking
 * tela inicial do jogo
 * versão mobile
 */

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const corpoHTML = document.querySelector('body');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = 'black';
ctx.strokeStyle = 'red';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineWidth = 10;

let cenarioPosicao = [];

let velocidadeFrame = 80;

let ultimoAnguloInicial = 0;
let ultimoAnguloInicialY = Math.PI/2;

class AlimentoAleatorio {
    constructor(raio){
        this.posicaoX = Math.round(Math.random() * (Number(window.innerWidth) - raio) + raio);
        this.posicaoY = Math.round(Math.random() * (Number(window.innerHeight) - raio) + raio);
        this.raioOriginal = raio;
        this.raioAtual = raio;
        this.crescimento = -1;
    }

    atualizaRaio(){
        this.raioAtual += this.crescimento;

        if(this.raioAtual <= this.raioOriginal/2) this.crescimento = 1;
        else if(this.raioAtual === this.raioOriginal) this.crescimento = -1;
    }

    atualizaAlimentoAleatorio(){
        this.posicaoX = Math.round(Math.random() * (Number(window.innerWidth) - this.raioOriginal) + this.raioOriginal);
        this.posicaoY = Math.round(Math.random() * (Number(window.innerHeight) - this.raioOriginal) + this.raioOriginal);
    }
}

class CorpoCobrinha {
    constructor(posicaoX, posicaoY, trajetoriaAtual){
        this.posicaoX = posicaoX;
        this.posicaoY = posicaoY;
        this.trajetoriaAtual = trajetoriaAtual;
    }
}

class Caminho {
    constructor(eixo, inicio, fim, sentido){
        this.eixo = eixo;
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

        this.trajetoria.push(new Caminho('x', null, null, 1));

        this.criaCorpoCobrinha();
    }

    mover(){
        ctx.fillStyle = 'black';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        moveCobra(); 
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

    criaCorpoCobrinha(){
        for(let i = 0; i < this.tamanho; i++){
            this.corpoCobrinha.push(new CorpoCobrinha(this.posicaoX + 10 * i, this.posicaoY, 0));
        }
    }

    aumentaCobrinha(){
        if(this.trajetoria[this.corpoCobrinha[0].trajetoriaAtual].eixo === 'x'){
            for(let i = 0; i < 4; i++){
                this.corpoCobrinha.unshift(new CorpoCobrinha(this.corpoCobrinha[0].posicaoX - 10 * this.trajetoria[this.corpoCobrinha[0].trajetoriaAtual].sentido, this.corpoCobrinha[0].posicaoY, this.corpoCobrinha[0].trajetoriaAtual));
            }

            cobra.tamanho += 4;
        } else {
            for(let i = 0; i < 4; i++){
                this.corpoCobrinha.unshift(new CorpoCobrinha(this.corpoCobrinha[0].posicaoX, this.corpoCobrinha[0].posicaoY  - 10 * this.trajetoria[this.corpoCobrinha[0].trajetoriaAtual].sentido, this.corpoCobrinha[0].trajetoriaAtual));
            }
            
            cobra.tamanho += 4;
        }

    }
}

const cobra = new Snake(5, 'white', 75, 75, 5);


corpoHTML.addEventListener('keypress', (evento) => {
    if(evento.keyCode === 115 && cobra.trajetoria[cobra.trajetoria.length - 1].eixo != 'y'){
        cobra.trajetoria[cobra.trajetoria.length - 1].fim = cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX;
        cobra.trajetoria.push(new Caminho('y', null, null, 1));
        console.log("apertou botao!");
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

function desenhaCobraEixoY(i){
    if((i !== cobra.tamanho - 1 && cobra.trajetoria[cobra.corpoCobrinha[i + 1].trajetoriaAtual].eixo !== 'y') || cobra.corpoCobrinha[i].posicaoY < 15 || (cobra.corpoCobrinha[i].posicaoY + 10 >= window.innerHeight && cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].inicio !== null )){
        anguloFinal = 0;
        anguloInicial = Math.PI * 2;
    } else if(ultimoAnguloInicialY === Math.PI/2){
            anguloInicial = 3 * Math.PI/2;
            anguloFinal = Math.PI/2;
    } else {
        anguloInicial = Math.PI/2;
        anguloFinal = 3 * Math.PI/2;
    }
    
    ctx.beginPath();
    if(i === cobra.tamanho - 1){
        if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].sentido === -1){
            ctx.arc(cobra.corpoCobrinha[i].posicaoX, cobra.corpoCobrinha[i].posicaoY - (cobra.raio + 2), cobra.raio + 2, 0, Math.PI * 2, true);
        } else {
            ctx.arc(cobra.corpoCobrinha[i].posicaoX, cobra.corpoCobrinha[i].posicaoY + (cobra.raio + 2), 7, 0, Math.PI * 2, true);
        }

        ctx.stroke(); 
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(cobra.corpoCobrinha[i].posicaoX, cobra.corpoCobrinha[i].posicaoY, cobra.raio, anguloInicial, anguloFinal, true);
    ctx.stroke();

    if(i === 0){
        ctx.beginPath();
        if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].sentido === -1){
            ctx.arc(cobra.corpoCobrinha[i].posicaoX, cobra.corpoCobrinha[i].posicaoY + 4, 1, 0, Math.PI * 2, true);
        } else {
            ctx.arc(cobra.corpoCobrinha[i].posicaoX, cobra.corpoCobrinha[i].posicaoY - 4, 1, 0, Math.PI * 2, true);
        }
        ctx.stroke();   
    }
    
    if(anguloInicial == Math.PI/2){
        anguloInicial = 3*Math.PI/2;
        anguloFinal = Math.PI/2;
    } else {
        anguloInicial = Math.PI/2;
        anguloFinal = 3*Math.PI/2;
    }

    ultimoAnguloInicialY = anguloFinal;
}

function desenhaCobraEixoX(i, anguloInicial = Math.PI, anguloFinal = 0){
    if((i != cobra.tamanho - 1 && cobra.trajetoria[cobra.corpoCobrinha[i + 1].trajetoriaAtual].eixo != 'x') || cobra.corpoCobrinha[i].posicaoX < 15 || (cobra.corpoCobrinha[i].posicaoX + 10 >= window.innerWidth && cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].inicio !== null )){
        anguloInicial = 0;
        anguloFinal = Math.PI * 2;
    } else if(ultimoAnguloInicial == Math.PI){
        anguloInicial = 0;
        anguloFinal = Math.PI;
    } else {
        anguloInicial = Math.PI;
        anguloFinal = 0;
    }
    
    if(i === cobra.tamanho - 1){
        ctx.beginPath();
        if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].sentido === -1){
            ctx.arc(cobra.corpoCobrinha[i].posicaoX - (cobra.raio + 2), cobra.corpoCobrinha[i].posicaoY, cobra.raio + 2, 0, Math.PI * 2, true);
        } else {
            ctx.arc(cobra.corpoCobrinha[i].posicaoX + (cobra.raio + 2), cobra.corpoCobrinha[i].posicaoY, cobra.raio + 2, 0, Math.PI * 2, true);
        }

        ctx.stroke();
        ctx.fillStyle = 'red';
        ctx.fill();  
    }

    ctx.beginPath();
    ctx.arc(cobra.corpoCobrinha[i].posicaoX, cobra.corpoCobrinha[i].posicaoY, cobra.raio, anguloInicial, anguloFinal, true);
    ctx.stroke();

    if(i === 0){
        ctx.beginPath();
        if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].sentido === -1){
            ctx.arc(cobra.corpoCobrinha[i].posicaoX + 4, cobra.corpoCobrinha[i].posicaoY, 1, 0, Math.PI * 2, true);
        } else {
            ctx.arc(cobra.corpoCobrinha[i].posicaoX - 4, cobra.corpoCobrinha[i].posicaoY, 1, 0, Math.PI * 2, true);
        }
        
        ctx.stroke();   
    }
    
    if(anguloInicial == Math.PI){
        anguloInicial = 0;
        anguloFinal = Math.PI;
    } else {
        anguloInicial = Math.PI;
        anguloFinal = 0;
    }

    ultimoAnguloInicial = anguloFinal;
}

function desenhaCobra () {
    for(let i = 0; i < cobra.tamanho; i++){
        ctx.lineWidth = 10;
        if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].eixo == 'x'){
            cobra.atualizaPosicaoX(i);
            desenhaCobraEixoX(i);
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

            // if(cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].inicio != null && cobra.corpoCobrinha[i].posicaoX >= cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual - 1].fim){
            //     cobra.corpoCobrinha[i].posicaoX = cobra.trajetoria[cobra.corpoCobrinha[i].trajetoriaAtual].inicio;
            // }
        } else {
            cobra.atualizaPosicaoY(i);
            
            desenhaCobraEixoY(i);
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
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    desenhaAlimentoAleatorio();
    
    ctx.strokeStyle = 'red';
    desenhaCobra();   
    criaCenario();
    verificaColisao();
}


function desenhaAlimentoAleatorio(){
    //const aleatorio = Math.round(Math.random() * (5 - 1) + 1);
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(alimento.posicaoX, alimento.posicaoY, alimento.raioAtual, 0, Math.PI * 2);
    ctx.fill();
    alimento.atualizaRaio();
}

const alimento = new AlimentoAleatorio(20);

function verificaColisao(){
    //colisão com alimento
    if(alimento.posicaoX - alimento.raioAtual <= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX && 
         cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX <= alimento.posicaoX + alimento.raioAtual &&
        alimento.posicaoY -alimento.raioAtual <= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY &&
        cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY <= alimento.posicaoY + alimento.raioAtual){
            alimento.atualizaAlimentoAleatorio();
            cobra.aumentaCobrinha();
            velocidadeFrame -= 4;
            console.log(velocidadeFrame)
            clearInterval(intervalo);
            if(velocidadeFrame <= 20) velocidadeFrame = 20;
            intervalo = setInterval(() => movimentaCobra(), velocidadeFrame);
        }

        for(let i = 0; i < 2; i++){
            if(cenarioPosicao[i][0] - 12 <= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX &&
                 cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX <= cenarioPosicao[i][0] + 410 &&
                 cenarioPosicao[i][1] - 12 <= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY &&
                 cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY <= cenarioPosicao[i][1] + 63
            ){
                console.log("colidiu!");
                clearInterval(intervalo);
                break;
            }
        }

        //canto superior esquerdo
        if((cenarioPosicao[2][0] <= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX &&
            cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX <= cenarioPosicao[2][0] + 210 &&
            cenarioPosicao[2][1] <= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY &&
            cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY <= cenarioPosicao[2][1] + 63) ||
            (cenarioPosicao[2][0] <= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX &&
                cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX <= cenarioPosicao[2][0] + 63 &&
                cenarioPosicao[2][1] + 63 <= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY &&
                cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY <= cenarioPosicao[2][1] + 213)
        ){
            console.log("colidiu!");
            clearInterval(intervalo);
        }

        //canto superior direito
        if((cenarioPosicao[3][0] >= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX &&
            cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX >= cenarioPosicao[3][0] - 210 &&
            cenarioPosicao[3][1] <= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY &&
            cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY <= cenarioPosicao[3][1] + 63) ||
            (cenarioPosicao[3][0] >= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX &&
                cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX >= cenarioPosicao[3][0] - 63 &&
                cenarioPosicao[3][1] + 63 <= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY &&
                cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY <= cenarioPosicao[3][1] + 213)
        ){
            console.log("colidiu!");
            clearInterval(intervalo);
        }

        //canto inferior esquerdo
        // if((cenarioPosicao[3][0] <= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX &&
        //     cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX <= cenarioPosicao[3][0] + 210 &&
        //     cenarioPosicao[3][1] >= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY &&
        //     cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY >= cenarioPosicao[3][1] - 63) ||
        //     (cenarioPosicao[3][0] <= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX &&
        //         cobra.corpoCobrinha[cobra.tamanho - 1].posicaoX <= cenarioPosicao[3][0] + 63 &&
        //         cenarioPosicao[3][1] - 63 >= cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY &&
        //         cobra.corpoCobrinha[cobra.tamanho - 1].posicaoY >= cenarioPosicao[3][1] - 213)
        // ){
        //     console.log("colidiu!");
        //     clearInterval(intervalo);
        // }


}

function verificaSobreposicao(){

}

function criaCenario(){
    for(let i = 0; i < 8; i++){
        ctx.beginPath();
        ctx.rect(window.innerWidth/2 - 250 + 50 * i , window.innerHeight/2 - 100, 50, 50);
        ctx.rect(window.innerWidth/2 - 250 + 50 * i , window.innerHeight/2 + 50, 50, 50);
        //cenarioPosicao.push([window.innerWidth/2 - 250 + 50 * i ,  window.innerHeight/2 + 50]);
        if(i % 2 === 0) ctx.fillStyle = "red";
        else ctx.fillStyle = "white";
        ctx.fill();
    }

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 50, 50);
    ctx.fillRect(0, 100, 50, 50);
    ctx.fillRect(100, 0, 50, 50);
    ctx.fillStyle = "white";
    ctx.fillRect(50, 0, 50, 50);
    ctx.fillRect(0, 50, 50, 50);
    ctx.fillRect(0, 150, 50, 50);
    ctx.fillRect(150, 0, 50, 50);

    ctx.beginPath();
    ctx.fillRect(0, window.innerHeight - 50, 50, 50);
    ctx.fillRect(0, window.innerHeight - 150, 50, 50);
    ctx.fillRect(100, window.innerHeight - 50, 50, 50);
    ctx.fillStyle = "red";
    ctx.fillRect(0, window.innerHeight - 100, 50, 50);
    ctx.fillRect(50, window.innerHeight - 50, 50, 50);
    ctx.fillRect(0, window.innerHeight - 200, 50, 50);
    ctx.fillRect(150, window.innerHeight - 50, 50, 50);

    ctx.beginPath();
    ctx.fillRect(window.innerWidth - 100, 0, 50, 50);
    ctx.fillRect(window.innerWidth - 200, 0, 50, 50);
    ctx.fillRect(window.innerWidth - 50, 50, 50, 50);
    ctx.fillRect(window.innerWidth - 50, 150, 50, 50);
    ctx.fillStyle = "white"
    ctx.fillRect(window.innerWidth - 50, 0, 50, 50);
    ctx.fillRect(window.innerWidth - 150, 0, 50, 50);
    ctx.fillRect(window.innerWidth - 50, 100, 50, 50);

    ctx.beginPath();
    ctx.fillRect(window.innerWidth - 100, window.innerHeight - 50, 50, 50);
    ctx.fillRect(window.innerWidth - 50, window.innerHeight - 100, 50, 50);
    ctx.fillRect(window.innerWidth - 200, window.innerHeight - 50, 50, 50);
    ctx.fillRect(window.innerWidth - 50, window.innerHeight - 200, 50, 50);
    ctx.fillStyle = "red";
    ctx.fillRect(window.innerWidth - 50, window.innerHeight - 50, 50, 50);
    ctx.fillRect(window.innerWidth - 150, window.innerHeight - 50, 50, 50);
    ctx.fillRect(window.innerWidth - 50, window.innerHeight - 150, 50, 50);
}

function calculaPontuacao(){

}

function exibePontuacao(){
    
}

cenarioPosicao.push([window.innerWidth/2 - 250,  window.innerHeight/2 - 100]);
cenarioPosicao.push([window.innerWidth/2 - 250,  window.innerHeight/2 + 50]);
cenarioPosicao.push([0, 0]); //canto superior esquerdo
cenarioPosicao.push([window.innerWidth, 0]); //canto superior direito
cenarioPosicao.push([0, window.innerHeight]); //canto inferior esquerdo
cenarioPosicao.push([window.innerWidth, window.innerHeight]); //canto inferior direito

let intervalo = setInterval(() => movimentaCobra(), velocidadeFrame);
