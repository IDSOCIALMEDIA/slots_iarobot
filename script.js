// --- CONFIGURAÇÃO ---
// 👇 COLOQUE SEU LINK DE AFILIADO AQUI
const LINK_AFILIADO = "https://117luck.com/?id=564695396"; 

const TEMPO_SINAL_SEGUNDOS = 180; // 3 minutos

// --- ELEMENTOS DA PÁGINA ---
const telaBanca = document.getElementById('tela-banca');
const telaSinais = document.getElementById('tela-sinais');
const botoesBanca = document.querySelectorAll('.btn-banca');
const iframe = document.getElementById('plataforma-frame');

const sinalNormal = document.getElementById('sinal-normal');
const sinalTurbo = document.getElementById('sinal-turbo');
const contadorElemento = document.getElementById('contador');

let tempoRestante = TEMPO_SINAL_SEGUNDOS;
let timerInterval = null;

// --- FUNÇÕES ---

// 1. Inicia o App quando um botão de banca é clicado
function iniciarApp() {
    // Esconde a tela de banca
    telaBanca.style.display = 'none';
    
    // Mostra a tela de sinais
    // Usamos 'flex' porque foi definido no CSS
    telaSinais.style.display = 'flex'; 
    
    // ** IMPORTANTE **
    // Carrega o link de afiliado no iframe SÓ AGORA
    // Isso economiza dados e evita carregar se o usuário não clicar
    iframe.src = LINK_AFILIADO;
    
    // Gera o primeiro sinal
    gerarSinal();
}

// 2. Gera um novo sinal (Normal ou Turbo)
function gerarSinal() {
    // Limpa o timer anterior, se existir
    clearInterval(timerInterval);
    
    // Reinicia o tempo
    tempoRestante = TEMPO_SINAL_SEGUNDOS;

    // Remove a classe 'sinal-on' de ambos
    sinalNormal.classList.remove('sinal-on');
    sinalTurbo.classList.remove('sinal-on');
    
    // Sorteia o novo sinal (50% de chance para cada)
    if (Math.random() < 0.5) {
        // Ativa Modo Normal
        sinalNormal.classList.add('sinal-on');
    } else {
        // Ativa Modo Turbo
        sinalTurbo.classList.add('sinal-on');
    }
    
    // Inicia o novo contador
    timerInterval = setInterval(atualizarContador, 1000);
    atualizarContador(); // Roda uma vez imediatamente
}

// 3. Atualiza o contador regressivo
function atualizarContador() {
    if (tempoRestante <= 0) {
        // Quando o tempo acabar, gera um novo sinal
        gerarSinal();
    } else {
        // Calcula minutos e segundos
        const minutos = Math.floor(tempoRestante / 60);
        const segundos = tempoRestante % 60;
        
        // Formata o texto (ex: 03:05)
        contadorElemento.textContent = 
            `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        
        // Diminui o tempo
        tempoRestante--;
    }
}

// --- INICIALIZAÇÃO ---
// Adiciona o "ouvidor de clique" em todos os botões de banca
botoesBanca.forEach(botao => {
    botao.addEventListener('click', iniciarApp);
});
