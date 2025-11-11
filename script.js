// --- CONFIGURAÇÃO DO APLICATIVO ---
// 👇 COLOQUE SEU LINK DE AFILIADO AQUI
const LINK_AFILIADO = "https://117luck.com/?id=564695396"; 

const TEMPO_SINAL_SEGUNDOS = 180; // 3 minutos para cada sinal

// --- ELEMENTOS DO DOM ---
const telaBanca = document.getElementById('tela-banca');
const telaSinais = document.getElementById('tela-sinais');
const botoesBanca = document.querySelectorAll('.btn-banca');
const iframe = document.getElementById('plataforma-frame');

const sinalNormal = document.getElementById('sinal-normal');
const sinalTurbo = document.getElementById('sinal-turbo');
const contadorElemento = document.getElementById('contador');

let tempoRestante = TEMPO_SINAL_SEGUNDOS;
let timerInterval = null;

// --- FUNÇÕES PRINCIPAIS DO APLICATIVO ---

// 1. Inicia o App quando um botão de banca é clicado
function iniciarApp() {
    // Esconde a tela de banca
    telaBanca.style.display = 'none';
    
    // Mostra a tela de sinais (usando 'flex' para o layout column)
    telaSinais.style.display = 'flex'; 
    
    // Carrega o link de afiliado no iframe SOMENTE AGORA
    // Isso evita carregar a plataforma antes do usuário interagir
    iframe.src = LINK_AFILIADO;
    
    // Gera o primeiro sinal e inicia o contador
    gerarSinal();
}

// 2. Gera um novo sinal (Normal ou Turbo)
function gerarSinal() {
    // Limpa o timer anterior para evitar múltiplos timers
    clearInterval(timerInterval);
    
    // Reinicia o tempo para o novo sinal
    tempoRestante = TEMPO_SINAL_SEGUNDOS;

    // Remove as classes 'sinal-on' de ambos os botões para "apagar" o sinal anterior
    sinalNormal.classList.remove('sinal-on');
    sinalTurbo.classList.remove('sinal-on');
    
    // Sorteia o novo sinal (50% de chance para cada modo)
    if (Math.random() < 0.5) {
        // Ativa Modo Normal
        sinalNormal.classList.add('sinal-on');
    } else {
        // Ativa Modo Turbo
        sinalTurbo.classList.add('sinal-on');
    }
    
    // Inicia o novo contador regressivo
    timerInterval = setInterval(atualizarContador, 1000);
    atualizarContador(); // Roda uma vez imediatamente para mostrar o tempo correto
}

// 3. Atualiza o contador regressivo na tela
function atualizarContador() {
    if (tempoRestante <= 0) {
        // Se o tempo acabar, gera um novo sinal
        gerarSinal();
    } else {
        // Calcula minutos e segundos
        const minutos = Math.floor(tempoRestante / 60);
        const segundos = tempoRestante % 60;
        
        // Formata o texto para MM:SS (ex: 03:05)
        contadorElemento.textContent = 
            `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        
        // Decrementa o tempo restante
        tempoRestante--;
    }
}

// --- INICIALIZAÇÃO DO APLICATIVO ---
// Adiciona os "escutadores de clique" para os botões de seleção de banca
botoesBanca.forEach(botao => {
    botao.addEventListener('click', iniciarApp);
});


// --- CÓDIGO DO EFEITO DE FUNDO TECNOLÓGICO (PARTÍCULAS INTERATIVAS) ---

const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = {
    x: null,
    y: null,
    radius: 100 // Raio de interação do mouse com as partículas
};

// Redimensiona o canvas para preencher a tela inteira
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(); // Reinicia as partículas ao redimensionar a janela
}
window.addEventListener('resize', resizeCanvas); // Escuta eventos de redimensionamento da janela

// Atualiza a posição do mouse
window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});
// Remove a posição do mouse quando ele sai da janela
window.addEventListener('mouseout', function() {
    mouse.x = null;
    mouse.y = null;
});

// Define a classe Particle (cada ponto que se move no fundo)
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Desenha a partícula no canvas
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Atualiza a posição da partícula e interage com o mouse
    update() {
        // Inverte a direção se a partícula atingir as bordas do canvas
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }

        // Move a partícula
        this.x += this.directionX;
        this.y += this.directionY;

        // Interação com o mouse (partículas se afastam do cursor)
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius + this.size) {
                // Afasta a partícula do mouse
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 10;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 10;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 10;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 10;
                }
            }
        }
        
        // Redesenha a partícula após a atualização da posição
        this.draw();
    }
}

// Inicializa (cria) um novo conjunto de partículas
function initParticles() {
    particles = []; // Limpa partículas existentes
    let numberOfParticles = (canvas.width * canvas.height) / 9000; // Define a densidade com base no tamanho da tela
    if (numberOfParticles > 100) numberOfParticles = 100; // Limite máximo para performance
    if (numberOfParticles < 30) numberOfParticles = 30; // Limite mínimo para não ficar vazio

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1; // Tamanho aleatório entre 1 e 6
        // Posição inicial aleatória dentro do canvas
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        // Direção e velocidade aleatórias
        let directionX = (Math.random() * 0.4) - 0.2; // entre -0.2 e 0.2
        let directionY = (Math.random() * 0.4) - 0.2; // entre -0.2 e 0.2
        let color = '#AAA'; // Cor cinza clara para as partículas
        particles.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Função principal de animação
function animate() {
    requestAnimationFrame(animate); // Loop de animação otimizado pelo navegador
    ctx.clearRect(0, 0, innerWidth, innerHeight); // Limpa o canvas a cada frame

    // Atualiza e desenha cada partícula
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    connectParticles(); // Desenha as linhas que conectam as partículas próximas
}

// Conecta as partículas com linhas (efeito de "rede")
function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            // Calcula a distância quadrada entre duas partículas
            let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                           ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
            // Se a distância for menor que um certo limite, desenha uma linha
            if (distance < (canvas.width/7) * (canvas.height/7)) { // Limite ajustável
                opacityValue = 1 - (distance / 20000); // Opacidade da linha baseada na distância (mais perto = mais opaca)
                ctx.strokeStyle = 'rgba(170,170,170,' + opacityValue + ')'; // Cor da linha (cinza com opacidade)
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

// Inicia o efeito de fundo quando a página carrega
resizeCanvas(); // Garante que o canvas tenha o tamanho correto inicialmente
animate(); // Inicia o loop de animação
