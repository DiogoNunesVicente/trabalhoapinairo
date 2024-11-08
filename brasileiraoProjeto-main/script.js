import getinfo from "./util/apiHelper.js";

// Pegar informações da APi
let informacoes = await getinfo();
console.log(informacoes);

// Pegar as classificações e classificações
async function PegarClassificacao() {
  const info = await getinfo();
  return info.fases["3908"].classificacao.equipe;
}

//Ordenar Classificações e arrays por posição
function OrdenarClassificacoes(classificacao) {
  return Object.values(classificacao).sort((a, b) => Number(a.pos) - Number(b.pos));
}

// Pegar ID do time
async function PegarTimes() {
  const informacoes = await getinfo();
  return Object.values(informacoes.equipes);
}

// Função para retornar os últimos 5 jogos de um time
function pegarUltimas5Partidas(teamId, informacoes) {
  const matches = [];
  const jogos = informacoes.fases["3908"].jogos.id;
  // Ordena os jogos por data antes de processá-los
  const sortedGames = Object.values(jogos).sort(
    (a, b) => new Date(a.data) - new Date(b.data)
  );
  // Itera sobre os jogos ordenados por data
  sortedGames.forEach((jogo) => {
    if (jogo.time1 === teamId || jogo.time2 === teamId) {
      let resultado;
      if (jogo.placar1 !== null && jogo.placar2 !== null) {
        if (
          (jogo.time1 === teamId && jogo.placar1 > jogo.placar2) ||
          (jogo.time2 === teamId && jogo.placar2 > jogo.placar1)
        ) {
          resultado = "V"; // Vitória
        } else if (jogo.placar1 === jogo.placar2) {
          resultado = "E"; // Empate
        } else {
          resultado = "D"; // Derrota
        }
        matches.push(resultado);
      }
    }
  });
  // Retorna os últimos 5 jogos (ou menos)
  return matches.slice(-5);
}

//Mesclar informações dos times com as classificações dos arrays
async function AddInfoDoTimeParaClassficacao(classificacao) {
  const times = await PegarTimes();
  const info = await getinfo();
  return classificacao.map((classification) => {
    const team = times.find((t) => t.id === classification.id);
    const ultimas5 = pegarUltimas5Partidas(classification.id, info);
    return { ...classification, equipe: team, ultimas5: ultimas5 };
  });
}

// Função para gerar o HTML das últimas partidas
function gerarHTMLUltimas5(partidas) {
  return partidas.map(resultado => {
    let cor;
    switch(resultado) {
      case 'V':
        cor = 'background-color: #28a745';
        break;
      case 'D':
        cor = 'background-color: #dc3545';
        break;
      case 'E':
        cor = 'background-color: #ffc107';
        break;
    }
    return `<span style="display: inline-block; width: 20px; height: 20px; ${cor}; color: white; text-align: center; margin: 0 2px; border-radius: 50%;">${resultado}</span>`;
  }).join('');
}

// Adicionar o HTML para os times na tela
function AdicionarTimesnaTela(classificacao) {
  const tbody = document.querySelector("tbody");
  classificacao.forEach((team, index) => {
    tbody.insertAdjacentHTML(
      "beforeend",
      `
      <tr>
        <td>${index + 1}</td>
        <td class="team-name">
          <img src="${team.equipe.brasao}" alt="Brasão de ${team.equipe["nome-comum"]}" width="20" height="20" margim="00">
          <a href="${team.equipe.uri}">${team.equipe["nome-comum"]}</a>
        </td>
        <td>${team.pg.total}</td>
        <td>${team.j.total}</td>
        <td>${team.v.total}</td>
        <td>${team.e.total}</td>
        <td>${team.d.total}</td>
        <td>${team.gp.total}</td>
        <td>${team.gc.total}</td>
        <td>${team.sg.total}</td>
        <td class="ultimas-5">${gerarHTMLUltimas5(team.ultimas5)}</td>
      </tr>
    `
    );
  });
}

// Função principal para mostrar os times na tela
async function MostrarTimesnatela() {
  let classification = await PegarClassificacao();
  classification = OrdenarClassificacoes(classification);
  classification = await AddInfoDoTimeParaClassficacao(classification);
  AdicionarTimesnaTela(classification);
}

// Executar a função main
MostrarTimesnatela();

setTimeout(function adicionarBordasNosTimesClassificacao() {
    let todosTrs = document.querySelectorAll("tr");

for (let i = 2; i < todosTrs.length; i++) {
if (i < 6) {
    todosTrs[i].style.borderLeft = "2px solid green";
} else if (i > 5 && i < 8) {
    todosTrs[i].style.borderLeft = "2px solid #1077dd";

} else if (i > 7 && i < 14) {
    todosTrs[i].style.borderLeft = "2px solid #e0a31f";
} else if (i > 17 && i < 22) {
    todosTrs[i].style.borderLeft = "2px solid red";
}
}
}, 2000);
