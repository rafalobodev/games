function novoElemento(tagName, className) {//cria função(parametros tag e class)
    const elem = document.createElement(tagName)//coloca tag
    elem.className = className//elemento recebe classname
    return elem
}

function Barreira(reversa = false) {//barreira reversa vai estar em cima
    this.elemento = novoElemento('div', 'barreira')//recebe div aplica barreira

    const borda = novoElemento('div', 'borda')//primeiro elemento tipo div classe borda
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)//appendChild:insere um elemento filho (children) ao elemento pai (parent)
    this.elemento.appendChild(reversa ? borda : corpo)//se for false reversa primeiro borda depois corpo,,true contrario

    this.setAltura = altura => corpo.style.height = `${altura}px`//alterar a altura do corpo da barreira
}

// const b = new Barreira(true) //conectando barreira com b
// b.setAltura(300)//recebe setaltura
// document.querySelector('[wm-flappy]').appendChild(b.elemento)//add barreira ao jogo wm-flappy html

function ParDeBarreiras(altura, abertura, x) {//(altura,abertura:entre uma e outra,x:posição x onde quer coloca par de barreiras)
    this.elemento = novoElemento('div', 'par-de-barreiras')//recebe novo elemento(param..)

    this.superior = new Barreira(true)//primeiro corpo depois borda
    this.inferior = new Barreira(false)//borda e corpo false abaixo

    this.elemento.appendChild(this.superior.elemento)//elemento representa elemento dom js html css
    this.elemento.appendChild(this.inferior.elemento)//add sup e inferior

    this.sortearAbertura = () => {//sortear par de barreiras tamanhos aleatorios
        const alturaSuperior = Math.random() * (altura - abertura)//aleatorio calculo(altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior//inferior  sera altura em si q sobrar - abertura - altura superior
        this.superior.setAltura(alturaSuperior)//setta infer e superior
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])//saber em que posição barreira esta,split no pixel separador especificado limite parametro string
    this.setX = x => this.elemento.style.left = `${x}px`//settar o x em pixel
    this.getLargura = () => this.elemento.clientWidth//saber a largura do elemento

    this.sortearAbertura()//sortear a primeira abertura tamanhos
    this.setX(x)//seta x
}

// const b = new ParDeBarreiras(700, 200, 800)//testar para ver se funciona no momento as barreiras randomicamente(altura,abertura,x)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)//selecionar html do jogo,,insere um elemento filho (children) ao elemento pai (parent) na última posição

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {//barreiras e parametros,,espaco:espaço entre as duas barreiras,,notificarPonto:pontuação
    this.pares = [//array
        new ParDeBarreiras(altura, abertura, largura),//largura começa meio q fora da div e vai criando
        new ParDeBarreiras(altura, abertura, largura + espaco),//segunda barreira..
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),//..vezes 2
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)//mais 3 vezes o tamanho do espaço
    ]

    const deslocamento = 3//3 em 3 pixels o deslocamento div 
    this.animar = () => {//cria a animação this
        this.pares.forEach(par => {//passar por cada um dos paresde barreira
            par.setX(par.getX() - deslocamento)//e deslocar

            // quando o elemento sair da área do jogo
            if (par.getX() < -par.getLargura()) {//se getx for menor q gatlargura ou colada com quina do jogo
                par.setX(par.getX() + espaco * this.pares.length)//x + espaço vezes quantidade de elementos do array
                par.sortearAbertura()//sortea a abertura
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio//se x par+deslocamento maior ou igual meio
                && par.getX() < meio//e menor ou igual
            if(cruzouOMeio) notificarPonto()//quer dizer q cruzou o meio,, pontua 1 ponto
        })
    }
}

function Passaro(alturaJogo) {//passaro do jogo recebe param.. altura do jogo
    let voando = false //clica em uma tecla o passaro voa solta tecla'false' começa a cair

    this.elemento = novoElemento('img', 'passaro')//recebe elemento(parame..)
    this.elemento.src = 'imgs/passaro.png'//seta coloca png do passaro

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])//possição em passaro voa y altura e x largura distancia
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true//clicando qualquer tecla precionada voa true
    window.onkeyup = e => voando = false//solta tecla para de voar

    this.animar = () => {//animar: mapipular altura voo
        const novoY = this.getY() + (voando ? 8 : -5)//y voar + sobe 8 velocidade voando e solta tecla cai -5 mais devagar
        const alturaMaxima = alturaJogo - this.elemento.clientHeight//altura maxima q passaro voara=altura jogo teto- proprio elemento

        if (novoY <= 0) {//se o novoy é menor q 0
            this.setY(0)//então vai até 0 apenas
        } else if (novoY >= alturaMaxima) {//senão y maior ou igual altura maxima
            this.setY(alturaMaxima)//mantem maximo
        } else {//senão violar minimo nem maximo cria novo y..
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo / 2)//seta posição inicial do passaro com altura do jodo dividi por dois.. ficar no meio da tela
}



function Progresso() {//pontuação do jogo
    this.elemento = novoElemento('span', 'progresso')//progresso do css
    this.atualizarPontos = pontos => {//recebe pontos
        this.elemento.innerHTML = pontos//innerHTML:coloca os pontos q foram passados no elemento
    }
    this.atualizarPontos(0)//começa no zero a pontuação
}

// const barreiras = new Barreiras(700, 1200, 200, 400)//teste,,(altura,largura,abertura,espaço)
// const passaro = new Passaro(700)//cria o passaro com new,,700 a altura do jogo
// const areaDoJogo = document.querySelector('[wm-flappy]')//selecionar a area do jogo
// areaDoJogo.appendChild(passaro.elemento)//elemento dom add na pagina
// areaDoJogo.appendChild(new Progresso().elemento)//colocar pontuação para rodar ver teste se funciona 
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))//para cada par superior e inferior add dentro area do jogo
// setInterval(() => {//chama a função para animação
//     barreiras.animar()//movimento barreiras
//     passaro.animar()//e passaro move
// }, 20)//de 20 milisegundos a animação,,ja funciona o movimento da barreira

function estaoSobrepostos(elementoA, elementoB) {//criar as coliçoes vertical e horizontal das barreiras
    const a = elementoA.getBoundingClientRect()//retangulo associado ao elemento A
    const b = elementoB.getBoundingClientRect()//associado ao B

    const horizontal = a.left + a.width >= b.left //referencia ao lado esquerdo+largura igual ao lado direito,, maior ou igual lado esquerdo b:para dar colisão
        && b.left + b.width >= a.left//e && besquerdo+blargura=lado direito b é maior ou igual ao lado esquerdo de A==colisão
    const vertical = a.top + a.height >= b.top//mesma coisa mas topo e altura elemento
        && b.top + b.height >= a.top
    return horizontal && vertical//se ouver colisão horizontal ou vertical é verdadeiro..return
}

function colidiu(passaro, barreiras) {//colisão entre o passaro e as barreiras
    let colidiu = false//começa colidiu falso
    barreiras.pares.forEach(parDeBarreiras => {
        if (!colidiu) {//(!se não tiver coledido ainda falso)pardebarreiras ver se colidiu ou não com a parte de cima e de baixo
            const superior = parDeBarreiras.superior.elemento//superior e inferior..
            const inferior = parDeBarreiras.inferior.elemento
            colidiu = estaoSobrepostos(passaro.elemento, superior)
                || estaoSobrepostos(passaro.elemento, inferior)//colidiu recebe estaoSobrepostos:função passaro superior ou inferior..
        }//se colidiu sera = true ai para o jogo no caso
    })
    return colidiu//retorno do loop
}

function FlappyBird() {//função q de fato vai representar o jogo em si
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]')//seleciona area do jogo wm-flappy
    const altura = areaDoJogo.clientHeight//altura jogo
    const largura = areaDoJogo.clientWidth//largura

    const progresso = new Progresso()//cri progresso pontuação jogo
    const barreiras = new Barreiras(altura, largura, 200, 400,//barreira 200abertura,400espaço entre dura 
        () => progresso.atualizarPontos(++pontos))//função arrpw q notifica o ponto
    const passaro = new Passaro(altura)//passaros criado

    areaDoJogo.appendChild(progresso.elemento)//add a tela todos elementos com appendChild abaixo tbm
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {//função start para iniciar o jogo
        // loop do jogo
        const temporizador = setInterval(() => {//settimeout para parar o jogo se perdeu
            barreiras.animar()//animação
            passaro.animar()

            if (colidiu(passaro, barreiras)) {//se colidiu passaro com barreiras do jogo
                clearInterval(temporizador)//o jogo simplismente vai parar
            }
        }, 20)//temporizador com 20 segundos
    }
}

new FlappyBird().start()//startar o jogo