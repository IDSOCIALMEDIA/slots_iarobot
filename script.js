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

// NOVO: ELEMENTO DA BARRA DE PROGRESSO
const sinalProgressFill = document.getElementById('sinal-progress-fill');

let tempoRestante = TEMPO_SINAL_SEGUNDOS;
let timerInterval = null;

// --- FUNÇÕES PRINCIPAIS DO APLICATIVO ---

// 1. Inicia o App quando um botão de banca é clicado
function iniciarApp() {
    telaBanca.style.display = 'none';
    telaSinais.style.display = 'flex'; 
    iframe.src = LINK_AFILIADO;
    gerarSinal();
}

// 2. Gera um novo sinal (Normal ou Turbo)
function gerarSinal() {
    clearInterval(timerInterval);
    tempoRestante = TEMPO_SINAL_SEGUNDOS;

    // Reseta a barra de progresso para 100%
    sinalProgressFill.style.transition = 'none'; // Remove transição para resetar
    sinalProgressFill.style.width = '100%';
    // Força o navegador a aplicar o reset antes de adicionar a transição de volta
    void sinalProgressFill.offsetWidth; 
    sinalProgressFill.style.transition = 'width 1s linear';

    sinalNormal.classList.remove('sinal-on');
    sinalTurbo.classList.remove('sinal-on');
    
    if (Math.random() < 0.5) {
        sinalNormal.classList.add('sinal-on');
    } else {
        sinalTurbo.classList.add('sinal-on');
    }
    
    timerInterval = setInterval(atualizarContador, 1000);
    atualizarContador(); 
}

// 3. Atualiza o contador regressivo na tela
function atualizarContador() {
    if (tempoRestante <= 0) {
        gerarSinal();
    } else {
        // Calcula minutos e segundos
        const minutos = Math.floor(tempoRestante / 60);
        const segundos = tempoRestante % 60;
        
        // Atualiza o texto do contador
        contadorElemento.textContent = 
            `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        
        // NOVO: ATUALIZA A BARRA DE PROGRESSO
        const porcentagem = (tempoRestante / TEMPO_SINAL_SEGUNDOS) * 100;
        sinalProgressFill.style.width = porcentagem + '%';

        // Decrementa o tempo
        tempoRestante--;
    }
}

// --- INICIALIZAÇÃO DO APLICATIVO ---
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
    radius: 100 
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(); 
}
window.addEventListener('resize', resizeCanvas); 

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});
window.addEventListener('mouseout', function() {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius + this.size) {
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
        
        this.draw();
    }
}

function initParticles() {
    particles = [];
    let numberOfParticles = (canvas.width * canvas.height) / 9000;
    if (numberOfParticles > 100) numberOfParticles = 100;
    if (numberOfParticles < 30) numberOfParticles = 30; 

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1; 
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2; 
        let directionY = (Math.random() * 0.4) - 0.2; 
        let color = '#AAA'; 
        particles.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate); 
    ctx.clearRect(0, 0, innerWidth, innerHeight); 

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    connectParticles(); 
}

function connectParticles() {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) +
                           ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance / 20000); 
                ctx.strokeStyle = 'rgba(170,170,170,' + opacityValue + ')'; 
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

// Inicia o efeito de fundo
resizeCanvas();
animate();
