
import { supabase } from './supabase.js';

// ======================================
// PEGAR O TEMPO DA PARTIDA
// ======================================

const tempo = Number(
    localStorage.getItem('tempoUtilizado') || 0
);

// ======================================
// EXIBIR O TEMPO FINAL
// ======================================

const minutos = Math.floor(tempo / 60);
const segundos = tempo % 60;

const tempoFormatado =
    String(minutos).padStart(2, '0') +
    ':' +
    String(segundos).padStart(2, '0');

document.getElementById('tempo-final').textContent =
    tempoFormatado;

// ======================================
// BOTÃO SALVAR NO SUPABASE
// ======================================

const botaoSalvar = document.querySelector('#salvar');

botaoSalvar.addEventListener('click', async () => {
    const jogador1 = document
        .querySelector('#jogador1')
        .value.trim();

    const jogador2 = document
        .querySelector('#jogador2')
        .value.trim();

    if (!jogador1 || !jogador2) {
        alert('Digite o nome dos dois jogadores.');
        return;
    }

    if (
        !Number.isSafeInteger(tempo) ||
        tempo < 0
    ) {
        alert('Tempo inválido.');
        return;
    }

    botaoSalvar.disabled = true;

    try {
        const { error } = await supabase
            .from('resultados')
            .insert({
                jogador1: jogador1,
                jogador2: jogador2,
                tempo_segundos: tempo
            });

        if (error) {
            throw error;
        }

        alert('Resultado salvo no ranking online!');

        window.location.href = 'ranking.html';

    } catch (erro) {
        console.error(
            'Erro ao salvar resultado:',
            erro
        );

        alert(
            'Não foi possível salvar o resultado. ' +
            'Verifique a conexão e tente novamente.'
        );

    } finally {
        botaoSalvar.disabled = false;
    }
});