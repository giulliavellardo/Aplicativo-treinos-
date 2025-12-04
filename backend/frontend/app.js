// app.js — versão corrigida compatível com index.html (btnTreino / btnHistorico)
// Seleciona conteúdo (script está no final do body no seu index.html)
const conteudo = document.getElementById("conteudo");

// Lista de aparelhos (objeto com nome e grupo)
const aparelhos = [
  { nome: "Cadeira extensora", grupo: "Pernas" },
  { nome: "Cadeira flexora", grupo: "Pernas" },
  { nome: "Cadeira abdutora", grupo: "Pernas" },
  { nome: "Cadeira adutora", grupo: "Pernas" },
  { nome: "Leg press", grupo: "Pernas" },
  { nome: "Agachamento guiado", grupo: "Pernas" },
  { nome: "Smith", grupo: "Pernas" },
  { nome: "Glúteo máquina", grupo: "Pernas" },
  { nome: "Supino reto", grupo: "Peito" },
  { nome: "Supino inclinado", grupo: "Peito" },
  { nome: "Supino declinado", grupo: "Peito" },
  { nome: "Crossover", grupo: "Peito" },
  { nome: "Peck deck", grupo: "Peito" },
  { nome: "Puxada frente", grupo: "Costas" },
  { nome: "Puxada atrás", grupo: "Costas" },
  { nome: "Remada baixa", grupo: "Costas" },
  { nome: "Remada alta", grupo: "Costas" },
  { nome: "Polia baixa", grupo: "Costas" },
  { nome: "Polia alta", grupo: "Costas" },
  { nome: "Tríceps pulley", grupo: "Braços" },
  { nome: "Tríceps testa", grupo: "Braços" },
  { nome: "Rosca direta", grupo: "Braços" },
  { nome: "Rosca martelo", grupo: "Braços" },
  { nome: "Elevação lateral", grupo: "Ombros" },
  { nome: "Abdominal máquina", grupo: "Abdômen" },
  { nome: "Barra fixa", grupo: "Costas" },
  { nome: "Halteres diversos", grupo: "Diversos" },
  { nome: "Stiff", grupo: "Pernas" },
  { nome: "Panturrilha sentado", grupo: "Pernas" },
  { nome: "Panturrilha em pé", grupo: "Pernas" },
  { nome: "Esteira", grupo: "Cardio" },
  { nome: "Bicicleta ergométrica", grupo: "Cardio" },
  { nome: "Elíptico", grupo: "Cardio" },
  { nome: "Escada stepper", grupo: "Cardio" }
];

// Carrega histórico usando a mesma chave que seu código antigo
let historico = JSON.parse(localStorage.getItem("fitlog_historico") || "[]");

// ----------------------
// Renderiza lista de aparelhos (registro)
// ----------------------
function renderLista(filtro = "") {
  let html = `
    <h2>Registrar Treino</h2>
    <input type="text" placeholder="Buscar aparelho..." 
           class="search-box" id="searchBox" value="${filtro}">
    <div class="lista-aparelhos">
  `;

  const grupos = {};

  aparelhos.forEach(ap => {
    if (
      !ap.nome.toLowerCase().includes(filtro.toLowerCase()) &&
      !ap.grupo.toLowerCase().includes(filtro.toLowerCase())
    ) return;

    if (!grupos[ap.grupo]) grupos[ap.grupo] = [];
    grupos[ap.grupo].push(ap.nome);
  });

  for (let grupo in grupos) {
    html += `<h3>${grupo}</h3>`;
    grupos[grupo].forEach((nome, idx) => {
      // id único por nome (pode repetir em grupos diferentes, mas ok)
      const id = `chk_${grupo.replace(/\s+/g,'_')}_${idx}`;
      html += `
        <div class="aparelho-item">
          <label><input type="checkbox" id="${id}" /> ${nome}</label>
          <span class="check-ok">✅</span>
        </div>
      `;
    });
  }

  html += `
    </div>
    <div class="diario">
      <h3>Como você se sentiu hoje?</h3>
      <textarea id="diarioInput" placeholder="Escreva suas observações..."></textarea>
      <button id="btnFinalizar">Finalizar e Salvar Treino ✅</button>
    </div>
  `;

  conteudo.innerHTML = html;

  // Filtro em tempo real
  const searchBox = document.getElementById("searchBox");
  if (searchBox) {
    searchBox.addEventListener("input", (e) => renderLista(e.target.value));
  }

  // Marcar check (apenas para classe visual)
  document.querySelectorAll(".aparelho-item input[type='checkbox']")
    .forEach(cb => {
      cb.addEventListener("change", () => {
        cb.closest(".aparelho-item")
          .classList.toggle("checked", cb.checked);
      });
    });

  // Salvar
  const btnFinalizar = document.getElementById("btnFinalizar");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
      const marcados = [];

      document.querySelectorAll(".aparelho-item input[type='checkbox']")
        .forEach(cb => {
          if (cb.checked) {
            // pega só o texto do label ao lado do checkbox
            const label = cb.closest(".aparelho-item").querySelector("label");
            const text = label ? label.innerText.replace("✅", "").trim() : "";
            if (text) marcados.push(text);
          }
        });

      const registro = {
        data: new Date().toLocaleDateString("pt-BR"),
        aparelhos: marcados,
        observacao: (document.getElementById("diarioInput") || {}).value || ""
      };

      historico.push(registro);
      localStorage.setItem("fitlog_historico", JSON.stringify(historico));

      alert("Treino salvo! ✅");
      renderHistorico();
    });
  }
}

// ----------------------
// Renderiza histórico (com proteção contra dados quebrados)
// ----------------------
function renderHistorico() {
  let html = "<h2>Histórico</h2>";

  if (!Array.isArray(historico) || historico.length === 0) {
    html += "<p>Nenhum treino salvo ainda.</p>";
  } else {
    historico.slice().reverse().forEach(reg => {

      const listaAparelhos = Array.isArray(reg.aparelhos)
        ? reg.aparelhos.join(", ")
        : "-";

      html += `
        <div class="registro">
          <strong>${reg.data || "-"}</strong><br>
          Aparelhos: ${listaAparelhos}<br>
          Observações: ${reg.observacao || "-"}
        </div>
        <hr>
      `;
    });
  }

  conteudo.innerHTML = html;
}

// ----------------------
// Botões do menu — conecta aos IDs do seu index.html
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  const btnTreino = document.getElementById("btnTreino");
  const btnHistorico = document.getElementById("btnHistorico");

  if (btnTreino) btnTreino.addEventListener("click", () => renderLista());
  if (btnHistorico) btnHistorico.addEventListener("click", () => renderHistorico());

  // mostra mensagem inicial
  conteudo.innerHTML = '<p>Selecione uma opção acima para começar.</p>';
});
