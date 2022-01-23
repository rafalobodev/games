new Vue({
    el: '#app',
    data: {
        running: false,//falso jogo nao esta executando
        playerLife: 100,//vida inicial de ambos playerLife e monsterLife
        monsterLife: 100,
        logs: [] //log inicia vazio
    },
    computed: {
        hasResult() {//resultado se a vida do monstro ou a do jogador chegar a 0
            return this.playerLife == 0 || this.monsterLife == 0
        }
    },
    methods: {
        startGame() { //metodo para começar o jogo
            this.running = true //rodando o jogo
            this.playerLife = 100 //vida começa com 100
            this.monsterLife = 100
            this.logs = []// ao começa o jogo inicia vazio tbm
        },
        attack(especial) {//especial é um booleano
            //console.log(especial, this.getRandom(5, 10))//teste para ver se ta gerando valores aleatorios no console
            this.hurt('monsterLife', 5, 10, especial, 'Jogador', 'Monstro', 'player')//monstro recebe especial dano q é booleano
            if(this.monsterLife > 0) {//se a vida do montro for maior que 0
                this.hurt('playerLife', 7, 12, false, 'Monstro', 'Jogador', 'monster')//7 dano minimo e 12 dano maximo, false pois atack do monstro ele nao tem especial
            }
        },//prop == playerLife e monsterLife
        hurt(prop, min, max, especial, source, target, cls) {//dano, source==='Monstro', target==Jogador, cls==monster
            const plus = especial ? 5 : 0 //caso for especial soma mais 5 se não 0 dano padrão sem extras
            const hurt = this.getRandom(min + plus, max + plus)//armazena na const  o random com plus a ver com o dano
            this[prop] = Math.max(this[prop] - hurt, 0)//Math.max:evitar q a vida do jogador seja negativa no maximo 0
            this.registerLog(`${source} atingiu ${target} com ${hurt}.`, cls)//registro da lista
        },
        healAndHurt() {//no momento que é curado é atacado tbm
            this.heal(10, 15)//quanto de vida player recebe
            this.hurt('playerLife', 7, 12, false, 'Monstro', 'Jogador', 'monster')//quanto vai perder enquanto cura
        },// 'Monstro', 'Jogador', 'monster' a ver com o log lista dos dados da partida
        heal(min, max) {//cura
            const heal = this.getRandom(min, max)
            this.playerLife = Math.min(this.playerLife + heal, 100)//Math.min para o valor nunca ultrapassar o 100%
            this.registerLog(`Jogador ganhou força de ${heal}.`, 'player')//registrando no metodo onde tera o log com dados
        },
        getRandom(min, max) {//valor randomico, Math.random():apenas isso pega valor entre 0 e 1
            const value = Math.random() * (max - min) + min
            return Math.round(value)//round arredonda o numero aleatorio pra cima ou para baixo o mais perto
        },
        registerLog(text, cls) {//cls é classe para aplicar a cor estilo no css
            this.logs.unshift({ text, cls })//unshift: ficar no começo da lista no topo da pagina o que é recente
        }
    },
    watch: {
        hasResult(value) { //se chegar a 0 a vida
            if (value) this.running = false //aparece botão de iniciar jogo
        }
    }
})