let treino = localStorage.getItem("treinoAtual");
if (!treino || treino === "Carregando...") {
    const hoje = new Date().getDay();
    const padrao = ["Descanso", "Peito, Tríceps e Ombros", "Inferiores e Abdômen", "Descanso", "Costas, Bíceps e Ombros", "Inferiores e Abdômen", "Descanso"];
    treino = padrao[hoje];
}

console.log("Executando:", treino);

const nomeTreino = document.getElementById("nomeTreino");
const lista = document.getElementById("listaExercicios");

if (nomeTreino) {
    nomeTreino.innerHTML = treino;
}

// 2. DEFINIÇÃO DOS EXERCÍCIOS (Padrão ou Customizado)
let exercicios = [];

// Procurar se o treino atual é um treino customizado criado pelo usuário
const treinosCustomizados = JSON.parse(localStorage.getItem("treinos_customizados")) || [];
const treinoCustomizadoEncontrado = treinosCustomizados.find(t => t.nome === treino);

if (treinoCustomizadoEncontrado) {
    // Se encontrou no localStorage, carrega a lista de exercícios que o usuário escolheu
    exercicios = treinoCustomizadoEncontrado.exercicios;
} else {
    // Caso contrário, roda a lógica padrão baseada nos dias da semana que você criou
    if (treino.includes("Peito")) {
        exercicios = ["Supino Reto", "Supino Inclinado", "Crucifixo", "Desenvolvimento", "Elevação Lateral", "Tríceps Corda"];
    } else if (treino.includes("Costas")) {
        exercicios = ["Puxada Frontal", "Remada Baixa", "Remada Curvada", "Rosca Direta", "Rosca Martelo", "Elevação Lateral"];
    } else if (treino.includes("Inferiores")) {
        exercicios = ["Agachamento Livre", "Leg Press", "Cadeira Extensora", "Mesa Flexora", "Stiff", "Panturrilha", "Abdômen"];
    } else {
        exercicios = ["Exercício Geral Autónomo"];
    }
}

// 3. RENDERIZAR OS EXERCÍCIOS NA TELA (Mantendo a sua estrutura intacta)
if (lista) {
    lista.innerHTML = "";
    exercicios.forEach((exercicio) => {
        const idLimpo = exercicio.replace(/[^a-zA-Z0-9]/g, "");

        const prSalvo = localStorage.getItem(`PR_${idLimpo}`) || "0";
        const carga1 = localStorage.getItem(`Carga1_${idLimpo}`) || "";
        const carga2 = localStorage.getItem(`Carga2_${idLimpo}`) || "";
        const carga3 = localStorage.getItem(`Carga3_${idLimpo}`) || "";
        const prog2 = localStorage.getItem(`Prog2_${idLimpo}`) || "permaneceu";
        const prog3 = localStorage.getItem(`Prog3_${idLimpo}`) || "permaneceu";

        lista.innerHTML += `
        <div class="exercise" data-exercicio="${idLimpo}">
            <div class="exercise-main-row">
                <input type="checkbox" class="check">
                <span class="exercise-name">${exercicio}</span>
                <span class="pr-badge">PR: <span id="textPR_${idLimpo}">${prSalvo}</span> kg</span>
            </div>

            <div class="progression-panel">
                <div class="pr-input-group">
                    <label>Novo PR Máximo:</label>
                    <input type="number" id="inputPR_${idLimpo}" value="${prSalvo}" onchange="atualizarPRNaTela('${idLimpo}')">
                    <span>kg</span>
                </div>

                <table class="sets-table">
                    <thead>
                        <tr>
                            <th>Série</th>
                            <th>Carga (kg)</th>
                            <th>Progressão</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="set-number">1ª</td>
                            <td><input type="number" id="carga1_${idLimpo}" value="${carga1}" placeholder="0"></td>
                            <td><span class="txt-inicio">Início</span></td>
                        </tr>
                        <tr>
                            <td class="set-number">2ª</td>
                            <td><input type="number" id="carga2_${idLimpo}" value="${carga2}" placeholder="0"></td>
                            <td>
                                <select id="prog2_${idLimpo}" class="select-progression">
                                    <option value="permaneceu" ${prog2 === 'permaneceu' ? 'selected' : ''}>＝ Manteve</option>
                                    <option value="subiu" ${prog2 === 'subiu' ? 'selected' : ''}>▲ Subiu</option>
                                    <option value="desceu" ${prog2 === 'desceu' ? 'selected' : ''}>▼ Desceu</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td class="set-number">3ª</td>
                            <td><input type="number" id="carga3_${idLimpo}" value="${carga3}" placeholder="0"></td>
                            <td>
                                <select id="prog3_${idLimpo}" class="select-progression">
                                    <option value="permaneceu" ${prog3 === 'permaneceu' ? 'selected' : ''}>＝ Manteve</option>
                                    <option value="subiu" ${prog3 === 'subiu' ? 'selected' : ''}>▲ Subiu</option>
                                    <option value="desceu" ${prog3 === 'desceu' ? 'selected' : ''}>▼ Desceu</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        `;
    });
}

function atualizarPRNaTela(idLimpo) {
    const novoPR = document.getElementById(`inputPR_${idLimpo}`).value;
    const badgeText = document.getElementById(`textPR_${idLimpo}`);
    if (badgeText) {
        badgeText.innerText = novoPR;
    }
}

// ATENÇÃO: Corrigido o seletor para funcionar com elementos criados dinamicamente via innerHTML
document.addEventListener("change", function(e) {
    if (e.target && e.target.classList.contains("check")) {
        const exercicioCard = e.target.closest(".exercise");
        if (e.target.checked) {
            exercicioCard.classList.add("completed");
        } else {
            exercicioCard.classList.remove("completed");
        }
    }
});

const finishBtn = document.getElementById("finishWorkoutBtn");
if (finishBtn) {
    finishBtn.addEventListener("click", encerrarTreino);
}

function encerrarTreino() {
    clearInterval(cronometroInterval);
    
    // 2. ZERA O TEMPO
    segundos = 0;
    
    const tempoFormatadoAtual = document.getElementById("timer") ? document.getElementById("timer").innerText : "00:00:00";
    const partes = tempoFormatadoAtual.split(':');
    const segundosTotaisDoTreino = (+partes[0]) * 3600 + (+partes[1]) * 60 + (+partes[2]);

    const cards = document.querySelectorAll(".exercise");
    cards.forEach(card => {
        const idLimpo = card.getAttribute("data-exercicio");
        if (idLimpo) {
            const prValue = document.getElementById(`inputPR_${idLimpo}`).value;
            const c1 = document.getElementById(`carga1_${idLimpo}`).value;
            const c2 = document.getElementById(`carga2_${idLimpo}`).value;
            const c3 = document.getElementById(`carga3_${idLimpo}`).value;
            const p2 = document.getElementById(`prog2_${idLimpo}`).value;
            const p3 = document.getElementById(`prog3_${idLimpo}`).value;

            localStorage.setItem(`PR_${idLimpo}`, prValue);
            localStorage.setItem(`Carga1_${idLimpo}`, c1);
            localStorage.setItem(`Carga2_${idLimpo}`, c2);
            localStorage.setItem(`Carga3_${idLimpo}`, c3);
            localStorage.setItem(`Prog2_${idLimpo}`, p2);
            localStorage.setItem(`Prog3_${idLimpo}`, p3);
            localStorage.removeItem("inicioTreino");

   localStorage.removeItem("inicioTreino");

    // REDIRECIONAMENTO SILENCIOSO (sem o alert):
    window.location.href = "../index.html";
        }
    });

    const checks = document.querySelectorAll(".check");
    let concluidos = 0;

    checks.forEach(c => {
        if (c.checked) {
            concluidos++;
        }
    });

    const totalExercicios = checks.length;
    const porcentagem = totalExercicios > 0 ? concluidos / totalExercicios : 0;
    let pontos = Math.round(100 * porcentagem);

    const nota = prompt("De 0 a 10, como foi seu treino?");
    
    let treinos = Number(localStorage.getItem("treinos")) || 0;
    treinos++;
    localStorage.setItem("treinos", treinos);

    let somaNotas = Number(localStorage.getItem("somaNotas")) || 0;
    somaNotas += Number(nota);
    localStorage.setItem("somaNotas", somaNotas);

    let tempoTotal = Number(localStorage.getItem("tempoTotal")) || 0;
    tempoTotal += segundosTotaisDoTreino;
    localStorage.setItem("tempoTotal", tempoTotal);

    pontos += Number(nota) * 5;

    let pontosAtuais = Number(localStorage.getItem("xp")) || 0;
    pontosAtuais += pontos;
    localStorage.setItem("xp", pontosAtuais);

    alert(
        "Treino encerrado!\n\n" +
        "Exercícios feitos: " + concluidos + "\n\n" +
        "Cargas e PRs salvos com sucesso!\n\n" +
        "XP ganho: " + pontos + "\n\n" +
        "XP total: " + pontosAtuais
    );

    window.location.href = "index.html";
}

// 4. CRONÔMETRO SIMPLES
const timerDisplay = document.getElementById("timer");
let segundos = 0;
let cronometroInterval;

function iniciarCronometro() {
    segundos = 0; // Garante que começa do zero
    cronometroInterval = setInterval(() => {
        segundos++;
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const seg = segundos % 60;

        if (timerDisplay) {
            timerDisplay.innerHTML = 
                String(horas).padStart(2, "0") + ":" +
                String(minutos).padStart(2, "0") + ":" +
                String(seg).padStart(2, "0");
        }
    }, 1000);
}

// Inicia automaticamente ao carregar a página
iniciarCronometro();
