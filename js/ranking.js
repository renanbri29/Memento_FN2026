
import { supabase } from './supabase.js';

const lista = document.getElementById('ranking-lista');

// ======================================
// FORMATAR O TEMPO EM MM:SS
// ======================================

function formatarTempo(tempo) {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;

    return (
        String(minutos).padStart(2, '0') +
        ':' +
        String(segundos).padStart(2, '0')
    );
}

// ======================================
// CRIAR UMA LINHA DO RANKING
// ======================================

function criarLinha(partida, index) {
    const linha = document.createElement('div');
    linha.classList.add('ranking-item');

    if (index === 0) {
        linha.classList.add('primeiro');
    } else if (index === 1) {
        linha.classList.add('segundo');
    } else if (index === 2) {
        linha.classList.add('terceiro');
    }

    const posicao = document.createElement('span');
    posicao.textContent = `${index + 1}º`;

    const jogadores = document.createElement('span');
    jogadores.textContent =
        `${partida.jogador1} & ${partida.jogador2}`;

    const tempo = document.createElement('span');
    tempo.textContent = formatarTempo(partida.tempo_segundos);

    linha.append(posicao, jogadores, tempo);

    return linha;
}

// ======================================
// BUSCAR RANKING NO SUPABASE
// ======================================

async function carregarRanking() {
    lista.textContent = 'Carregando ranking...';

    try {
        const { data, error } = await supabase
            .from('resultados')
            .select('jogador1, jogador2, tempo_segundos')
            .order('tempo_segundos', { ascending: true })
            .order('criado_em', { ascending: true })
            .limit(10);

        if (error) {
            throw error;
        }

        lista.replaceChildren();

        if (!data || data.length === 0) {
            lista.textContent =
                'Ainda não existem partidas registradas.';
            return;
        }

        data.forEach((partida, index) => {
            lista.appendChild(criarLinha(partida, index));
        });

    } catch (erro) {
        console.error('Erro ao carregar ranking:', erro);

        lista.textContent =
            'Não foi possível carregar o ranking. Tente novamente.';
    }
}

carregarRanking();