const conteudo = document.getElementById("conteudo");

// Lista de aparelhos com grupos musculares
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

// Pega o histórico do localStorage
let historico = JSON.parse(localStorage.getItem("fitlog_historico") || "[]");

// Função para renderizar lista com checkboxes e OK verde
function renderLista(filtro = "") {
  let html = `<input type="text" placeholder="Buscar aparelho..." class="search-box" id="searchBox" value="${filtro}">`;
  html += `<div class="lista-aparelhos">`;

  // Agrupar por grupo muscular
  const grupos = {};
  aparelhos.forEach(ap => {
    if (!ap.nome.toLowerCase().includes(filtro.toLowerCase()) && !ap.grupo.toLowerCase().includes(filtro.toLowerCase())) return;
    if (!grupos[ap.grupo]) grupos[ap.grupo] = [];
    grupos[ap.grupo].push(ap.nome);
  });

  for (let grupo in grupos) {
    html += `<h3>${grupo}</h3>`;
    grupos[grupo].forEach(nome => {
      html += `
        <div class="aparelho-item">
          <label><input type="checkbox" /> ${nome}</label>
          <span class="check-ok">✅</span>
        </div>
      `;
    });
  }

  html += `</div>
    <div class="diario">
      <h3>Como você se sentiu hoje?</h3>
      <textarea id="diarioInput" placeholder="Escreva suas observações..."></textarea>
      <button id="btnFinalizar">Finalizar e Salvar Treino ✅</button>
    </div>`;

  conteudo.innerHTML = html;

  // Evento do input de busca
  const searchInput = document.getElementById("searchBox");
  searchInput.addEventListener("input", (e) => renderLista(e.target.value));

  // Evento de marcar/desmarcar
  document.querySelectorAll(".aparelho-item input[type='checkbox']").forEach(cb => {
    cb.addEventListener("change", () => {
      const item = cb.closest(".aparelho-item");
      if (cb.checked) {
        item.classList.add("checked");
      } else {
        item.classList.remove("checked");
      }
    });
  });

  // Evento de finalizar treino
  document.getElementById("btnFinalizar").addEventListener("click", () => {
    const marcados = [];
    document.querySelectorAll(".aparelho-item input[type='checkbox']").forEach(cb => {
      if (cb.checked) {
        marcados.push(cb.closest(".aparelho-item").innerText.replace("✅","").trim());
      }
    });

    const diario = document.getElementById("diarioInput").value;

    const registro = {
      data: new Date().toLocaleDateString(),
      aparelhos: marcados,
      observacao: diario
    };

    historico.push(registro);
    localStorage.setItem("fitlog_historico", JSON.stringify(historico));
    alert("Treino salvo! ✅");

    // Volta para o histórico automaticamente
    renderHistorico();
  });
}

// Função para mostrar histórico
function renderHistorico() {
  let html = "<h2>Histórico</h2>";
  if (historico.length === 0) {
    html += "<p>Nenhum treino salvo ainda.</p>";
  } else {
    historico.slice().reverse().forEach(reg => {
      html += `
        <div class="registro">
          <strong>${reg.data}</strong><br>
          Aparelhos: ${reg.aparelhos.join(", ")}<br>
          Observações: ${reg.observacao || "-"}
        </div>
        <hr>
      `;
    });
  }
  conteudo.innerHTML = html;
}

// Botões do menu
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnExercicios").addEventListener("click", () => renderLista());
  document.getElementById("btnTreino").addEventListener("click", () => renderLista());
  document.getElementById("btnHistorico").addEventListener("click", () => renderHistorico());
});
