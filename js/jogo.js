
 // ===============================
 // CONFIGURAÇÕES DO JOGO
 // ===============================

let faseAtual = 1;
let erros = 0;
let tempoRestante = 90;
let timer = null;
let historico = [];
let numeroDisplay;
let botoes;
let feedback;
let entradaBloqueada = false;
let partidaEncerrada = false;
let temporizadorFeedback = null;

const TEMPO_FEEDBACK = 1000;


// ===============================
// SONS DO JOGO
// ===============================

const somAcerto = new Audio("assets/sons/acerto.mp3");
const somErro = new Audio("assets/sons/erro.mp3");
const somVitoria = new Audio("assets/sons/vitoria.mp3");
const somDerrota = new Audio("assets/sons/derrota.mp3");

function tocarSom(som) {
    som.currentTime = 0;
    som.play().catch(() => {});
}


// ===============================
// INICIAR JOGO
// ===============================

function iniciarJogo() {
    faseAtual = 1;
    erros = 0;
    tempoRestante = 90;
    historico = [];
    entradaBloqueada = false;
    partidaEncerrada = false;

    clearInterval(timer);
    clearTimeout(temporizadorFeedback);

    numeroDisplay = document.getElementById("numero-display");
    botoes = document.querySelectorAll(".number-button");
    feedback = document.getElementById("feedback-jogo");

    atualizarTela();
    sortearBotoes();
    mostrarFeedback("MEMORIZE O NÚMERO", "neutro");
    iniciarTimer();
}


// ===============================
// TIMER
// ===============================

function iniciarTimer() {
    clearInterval(timer);

    timer = setInterval(() => {
        if (partidaEncerrada) return;

        tempoRestante--;
        atualizarTimer();

        if (tempoRestante <= 0) {
            clearInterval(timer);
            partidaEncerrada = true;
            bloquearBotoes(true);
            derrota("Tempo esgotado!");
        }
    }, 1000);
}


// ===============================
// MOSTRAR TIMER
// ===============================

function atualizarTimer() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;

    const tempoFormatado =
        String(minutos).padStart(2, "0") + ":" +
        String(segundos).padStart(2, "0");

    document.getElementById("timer").textContent =
        "Tempo: " + tempoFormatado;
}


// ===============================
// SORTEAR BOTÕES
// ===============================

function sortearBotoes() {
    const numeros = [1, 2, 3, 4];

    numeros.sort(() => Math.random() - 0.5);

    botoes.forEach((botao, indice) => {
        botao.textContent = numeros[indice];
        botao.dataset.numero = numeros[indice];

        botao.onclick = () => {
            clicarBotao(indice + 1, numeros[indice]);
        };
    });

    const display = Math.floor(Math.random() * 4) + 1;
    numeroDisplay.textContent = display;
}


// ===============================
// FEEDBACK VISUAL
// ===============================

function mostrarFeedback(mensagem, tipo) {
    feedback.textContent = mensagem;
    feedback.className = "game-feedback " + tipo;

    // Reinicia a animação visual do painel
    numeroDisplay.classList.remove("display-success", "display-error");

    if (tipo === "acerto") {
        numeroDisplay.classList.add("display-success");
    } else if (tipo === "erro") {
        numeroDisplay.classList.add("display-error");
    }
}

function bloquearBotoes(bloquear) {
    botoes.forEach(botao => {
        botao.disabled = bloquear;
    });
}


// ===============================
// CLIQUE NO BOTÃO
// ===============================

function clicarBotao(posicao, numero) {
    if (entradaBloqueada || partidaEncerrada) return;

    const display = Number(numeroDisplay.textContent);

    const correto = verificarResposta(
        faseAtual,
        display,
        posicao,
        numero
    );

    entradaBloqueada = true;
    bloquearBotoes(true);

    if (correto) {
        tocarSom(somAcerto);

        historico.push({
            fase: faseAtual,
            posicao: posicao,
            numero: numero
        });

        mostrarFeedback("✓ FASE CONCLUÍDA!", "acerto");

        temporizadorFeedback = setTimeout(() => {
            if (partidaEncerrada) return;
            proximaFase();
        }, TEMPO_FEEDBACK);

    } else {
        erro();
    }
}


// ===============================
// VERIFICAR RESPOSTA
// ===============================

function verificarResposta(fase, display, posicao, numero) {

    // FASE 1: display indica a posição correta
    if (fase === 1) {
        return display === posicao;
    }

    // FASE 2
    if (fase === 2) {
        const respostas = {
            1: 4,
            2: 1,
            3: 2,
            4: 3
        };

        return numero === respostas[display];
    }

    // FASE 3
    if (fase === 3) {
        if (display === 1) return posicao === 2;
        if (display === 2) return numero === 4;
        if (display === 3) return posicao === 4;
        if (display === 4) return numero === 1;
    }

    // FASE 4
    if (fase === 4) {
        const referencias = {
            1: 1,
            2: 2,
            3: 3,
            4: 1
        };

        const memoria = historico.find(
            item => item.fase === referencias[display]
        );

        return Boolean(memoria) && posicao === memoria.posicao;
    }

    // FASE 5
    if (fase === 5) {
        const referencias = {
            1: 1,
            2: 3,
            3: 2,
            4: 4
        };

        const memoria = historico.find(
            item => item.fase === referencias[display]
        );

        return Boolean(memoria) && numero === memoria.numero;
    }

    return false;
}


// ===============================
// ERRO
// ===============================

function erro() {
    tocarSom(somErro);

    erros++;
    atualizarErros();

    mostrarFeedback(
        erros >= 3
            ? "✕ ERRO FATAL — FIM DE JOGO"
            : "✕ RESPOSTA INCORRETA!",
        "erro"
    );

    if (erros >= 3) {
        partidaEncerrada = true;
        clearInterval(timer);

        temporizadorFeedback = setTimeout(() => {
            derrota();
        }, TEMPO_FEEDBACK);

        return;
    }

    temporizadorFeedback = setTimeout(() => {
        if (partidaEncerrada) return;

        faseAtual = 1;
        historico = [];

        atualizarTela();
        sortearBotoes();

        mostrarFeedback(
            "↺ SEQUÊNCIA REINICIADA — FASE 1",
            "reinicio"
        );

        entradaBloqueada = false;
        bloquearBotoes(false);
    }, TEMPO_FEEDBACK);
}


// ===============================
// PRÓXIMA FASE
// ===============================

function proximaFase() {
    if (faseAtual === 5) {
        partidaEncerrada = true;
        clearInterval(timer);
        vitoria();
        return;
    }

    faseAtual++;

    atualizarTela();
    sortearBotoes();

    mostrarFeedback(
        "FASE " + faseAtual + " — CONTINUE!",
        "neutro"
    );

    entradaBloqueada = false;
    bloquearBotoes(false);
}


// ===============================
// ATUALIZAR FASE E PROGRESSO
// ===============================

function atualizarTela() {
    document.getElementById("fase").textContent =
        "Fase: " + faseAtual + "/5";

    document.getElementById("fase-destaque").textContent =
        "FASE " + faseAtual + "/5";

    const segmentos = document.querySelectorAll(".phase-segment");

    segmentos.forEach((segmento, indice) => {
        segmento.classList.toggle("active", indice < faseAtual);
        segmento.classList.toggle("current", indice === faseAtual - 1);
    });

    atualizarErros();
    atualizarTimer();
}


// ===============================
// ATUALIZAR ERROS
// ===============================

function atualizarErros() {
    document.getElementById("erros").textContent =
        "Erros: " + erros + "/3";
}


// ===============================
// VITÓRIA
// ===============================

function vitoria() {
    tocarSom(somVitoria);

    const tempoUtilizado = 90 - tempoRestante;

    localStorage.setItem("tempoUtilizado", tempoUtilizado);
    window.location.href = "vitoria.html";
}


// ===============================
// DERROTA
// ===============================

function derrota(motivo) {
    clearInterval(timer);

    tocarSom(somDerrota);

    localStorage.setItem("motivoDerrota", motivo || "Três erros cometidos.");

    window.location.href = "derrota.html";
}


// ===============================
// INICIAR AUTOMATICAMENTE
// ===============================

window.addEventListener("DOMContentLoaded", iniciarJogo);
