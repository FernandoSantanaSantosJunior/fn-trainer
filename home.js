const titulo = document.getElementById("tituloTreino");
const descricao = document.getElementById("descricaoTreino");
const botaoTreino = document.getElementById("startWorkoutBtn");
const areaTreino = document.getElementById("workoutArea");
const timer = document.getElementById("timer");
const mensagem = document.getElementById("mensagemDia");
const welcome = document.getElementById("welcome");

import { SpeedInsights } from "@vercel/speed-insights/next"

function carregarMensagemDia(diaNumerico) {
    if (!mensagem) return;
    switch (diaNumerico) {
        case 1: mensagem.innerHTML = "Comece a semana forte."; break;
        case 2: mensagem.innerHTML = "Disciplina supera motivação."; break;
        case 3: mensagem.innerHTML = "Descansar também faz parte do progresso."; break;
        case 4: mensagem.innerHTML = "Costas fortes, mente forte."; break;
        case 5: mensagem.innerHTML = "Último esforço da semana."; break;
        default: mensagem.innerHTML = "Recupere energia para a próxima semana.";
    }
}

// Essa função agora salva instantaneamente TODA VEZ que você clica nos dias do calendário
function mostrarTreino(dia) {
    if (!titulo || !descricao) return;

    switch (dia) {
        case "seg":
            if (botaoTreino) botaoTreino.style.display = "block";
            titulo.innerHTML = "Peito, Tríceps e Ombros";
            descricao.innerHTML = `• Supino Reto<br>• Supino Inclinado<br>• Crucifixo<br>• Desenvolvimento<br>• Elevação Lateral<br>• Tríceps Corda`;
            break;

        case "ter":
            if (botaoTreino) botaoTreino.style.display = "block";
            titulo.innerHTML = "Inferiores e Abdômen";
            descricao.innerHTML = `• Agachamento Livre<br>• Leg Press<br>• Cadeira Extensora<br>• Mesa Flexora<br>• Panturrilha<br>• Abdômen`;
            break;

        case "qua":
            if (botaoTreino) botaoTreino.style.display = "none";
            titulo.innerHTML = "Descanso";
            descricao.innerHTML = "Hoje é dia de recuperação muscular.";
            break;

        case "qui":
            if (botaoTreino) botaoTreino.style.display = "block";
            titulo.innerHTML = "Costas, Bíceps e Ombros";
            descricao.innerHTML = `• Puxada Frontal<br>• Remada Baixa<br>• Remada Curvada<br>• Rosca Direta<br>• Rosca Martelo<br>• Elevação Lateral`;
            break;

        case "sex":
            if (botaoTreino) botaoTreino.style.display = "block";
            titulo.innerHTML = "Inferiores e Abdômen";
            descricao.innerHTML = `• Agachamento Livre<br>• Leg Press<br>• Stiff<br>• Panturrilha<br>• Abdômen`;
            break;

        case "sab":
        case "dom":
            if (botaoTreino) botaoTreino.style.display = "none";
            titulo.innerHTML = "Descanso";
            descricao.innerHTML = "Aproveite para recuperar as energias.";
            break;
    }

    // CRUCIAL: Atualiza o banco de dados imediatamente ao alternar os dias do calendário
    localStorage.setItem("treinoAtual", titulo.innerHTML);
}

// Configuração do botão de ir para a tela de treino de forma blindada
if (botaoTreino) {
    botaoTreino.onclick = function() {
        if (titulo && titulo.innerHTML !== "Carregando...") {
            localStorage.setItem("treinoAtual", titulo.innerHTML);
            window.location.href = "treino.html";
        }
    };
}

let segundos = 0;
let cronometro;

function iniciarTreino() {
    if (areaTreino && botaoTreino) {
        areaTreino.style.display = "block";
        botaoTreino.disabled = true;
        botaoTreino.innerHTML = "🔥 Treino em andamento";
    }

    cronometro = setInterval(() => {
        segundos++;
        atualizarTimer();
    }, 1000);
}

function atualizarTimer() {
    if (!timer) return;

    const horas = Math.floor(segundos / 3600);
    const minutes = Math.floor((segundos % 3600) / 60);
    const seg = segundos % 60;

    timer.innerHTML =
        String(horas).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seg).padStart(2, "0");
}

// ==========================================
// FUNÇÕES: GESTÃO DE TREINOS CUSTOMIZADOS
// ==========================================
function renderizarTreinosCustomizados() {
    const listaContainer = document.getElementById("listaTreinosCustomizados");
    if (!listaContainer) return;

    // Busca os treinos salvos que o usuário montou
    const treinosSalvos = JSON.parse(localStorage.getItem("treinos_customizados")) || [];

    if (treinosSalvos.length === 0) {
        listaContainer.innerHTML = '<p class="sem-treino">Nenhum treino criado ainda.</p>';
        return;
    }

    // Injeta os cards dos treinos criados adicionando uma div de ações para segurar os dois botões juntos
    listaContainer.innerHTML = treinosSalvos.map((treinoCustom) => `
        <div class="card-treino-criado">
            <div>
                <h4>${treinoCustom.nome}</h4>
                <p style="color: #888; font-size: 12px; margin-top: 4px;">
                    ${treinoCustom.exercicios.length} exercício(s) selecionado(s)
                </p>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
                <button class="btn-play-custom" onclick="iniciarRotinaPersonalizada('${treinoCustom.nome}')">
                    <i class="fa-solid fa-play"></i> Treinar
                </button>
                <button class="btn-deletar-custom" onclick="deletarTreinoCustomizado('${treinoCustom.nome}')" title="Excluir Treino">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function iniciarRotinaPersonalizada(nomeDoTreino) {
    // Define o treino customizado como o treino ativo e manda para a tela de execução
    localStorage.setItem("treinoAtual", nomeDoTreino);
    window.location.href = "treino.html";
}

function deletarTreinoCustomizado(nomeDoTreino) {
    // Caixa de confirmação para evitar cliques acidentais
    const confirmar = confirm(`Deseja mesmo excluir a rotina "${nomeDoTreino}"?`);
    
    if (confirmar) {
        let treinosSalvos = JSON.parse(localStorage.getItem("treinos_customizados")) || [];
        
        // Remove da lista o treino correspondente ao nome clicado
        treinosSalvos = treinosSalvos.filter(t => t.nome !== nomeDoTreino);
        
        // Atualiza a memória local
        localStorage.setItem("treinos_customizados", JSON.stringify(treinosSalvos));
        
        // Atualiza a interface em tempo de execução
        renderizarTreinosCustomizados();
    }
}

// ==========================================
// SISTEMA DO CHATBOT LOCAL (SEM MISTURAR HTML)
// ==========================================

// Objeto de dados puro com todas as respostas mapeadas da central de ajuda
const baseConhecimentoBot = {
    // Mecânicas do App
    "xp": "Você ganha XP toda vez que encerra um treino! O cálculo leva em conta a quantidade de exercícios que você marcou como feitos (check) e a nota de 0 a 10 que você dá para a sua intensidade no final do treino. Quanto mais consistente, mais alto o seu nível!",
    "pr": "Dentro da tela de treino em andamento, cada exercício tem o campo 'Novo PR Máximo'. Quando você aumentar sua carga máxima, basta digitar o novo valor ali. O app atualiza na hora e salva para os próximos treinos!",
    "custom": "Na tela inicial, clique no botão verde 'Criar Treino' dentro do card dashed. Dê um nome para a sua rotina, selecione quais exercícios da biblioteca você quer fazer e clique em salvar. Ele aparecerá direto na sua Home!",
    "historico": "Para ver todos os seus dados salvos, basta clicar no ícone do Troféu (🏆 Evolução) no menu inferior do aplicativo. Lá você acompanha seu tempo total de treino acumulado, nota média e a quantidade de treinos feitos!",

    // Metodologia de Treino
    "falha": "Treinar até a falha significa realizar o movimento até que o seu músculo não consiga completar a fase concêntrica (subida do peso) com a técnica perfeita. É uma estratégia excelente para hipertrofia, mas deve ser usada com sabedoria para não sobrecarregar suas articulações.",
    "descanso": "Para hipertrofia e ganho de massa muscular, o tempo ideal fica entre 60 a 90 segundos de descanso. Se você estiver fazendo séries de força máxima com cargas muito elevadas, pode estender esse tempo para 2 a 3 minutos para recuperar o fôlego e o sistema nervoso.",
    "lesoes": "Para treinar pesado com segurança: 1) Nunca sacrifique a postura correta para colocar mais carga. 2) Faça um bom aquecimento antes de colocar o peso real de treino. 3) Controle a descida do peso (fase excêntrica) em vez de deixar a gravidade despencar o peso.",

    // Nutrição e Hidratação
    "agua": "A recomendação ideal para quem treina pesado é multiplicar seu peso corporal por 35ml a 40ml de água. Por exemplo, se você pesa 70kg, o ideal é consumir entre 2,4 e 2,8 litros de água bem distribuídos ao longo do dia para manter os músculos cheios e evitar cãibras.",
    "pretreino": "Foque em carboidratos de fácil digestão cerca de 45 a 60 minutos antes de treinar para garantir energia rápida. Boas opções: banana com aveia, fatias de pão com geleia ou doce de leite, ou uma porção de arroz com frango se for uma refeição sólida maior.",
    "postreino": "Após o treino, o seu corpo precisa de nutrientes para reconstruir as fibras musculares. Tente combinar uma boa fonte de proteína (como frango, ovos, carne ou whey) com carboidratos (arroz, batata, macarrão) para repor os estoques de glicogênio que você gastou."
};

// Guardamos o estado inicial do corpo do chat para o botão resetar depois
let estruturaInicialChat = "";

function inicializarChatbot() {
    const btnAbrir = document.getElementById("btnChatbotFlutuante");
    const btnFechar = document.getElementById("btnFecharChatbot");
    const janela = document.getElementById("janelaChatbot");
    const corpoChat = document.getElementById("corpoChatbot");

    if (!btnAbrir || !janela || !corpoChat) return;

    // Salva como o chat era originalmente ao carregar a página (incluindo as categorias e botões do HTML)
    estruturaInicialChat = corpoChat.innerHTML;

    // Evento para abrir/fechar a janela usando toggle de classe CSS
    btnAbrir.addEventListener("click", () => janela.classList.toggle("msn-escondida"));
    if (btnFechar) btnFechar.addEventListener("click", () => janela.classList.add("msn-escondida"));

    // Ouvinte de clique inteligente para as opções de perguntas
    corpoChat.addEventListener("click", (evento) => {
        const elementoClicado = evento.target;

        // Se clicou em uma opção de pergunta
        if (elementoClicado.classList.contains("btn-opcao-pergunta") && elementoClicado.dataset.pergunta) {
            const chavePergunta = elementoClicado.dataset.pergunta;
            const textoPergunta = elementoClicado.textContent;
            
            exibirRespostaChat(textoPergunta, chavePergunta);
        }

        // Se clicou no botão de reiniciar/voltar
        if (elementoClicado.id === "btnVoltarOpcoes" || elementoClicado.closest("#btnVoltarOpcoes")) {
            corpoChat.innerHTML = estruturaInicialChat;
        }
    });
}

function exibirRespostaChat(perguntaTexto, chaveResposta) {
    const corpoChat = document.getElementById("corpoChatbot");
    const respostaTexto = baseConhecimentoBot[chaveResposta];

    // Remove toda a estrutura de opções (e títulos de categorias) limpando o chat para a conversa
    corpoChat.innerHTML = "";

    // Cria o balão de mensagem do Usuário de forma limpa
    const balaoUsuario = document.createElement("div");
    balaoUsuario.classList.add("mensagem-usuario");
    balaoUsuario.textContent = perguntaTexto;

    // Cria o balão de resposta do Bot de forma limpa
    const balaoBot = document.createElement("div");
    balaoBot.classList.add("mensagem-bot");
    balaoBot.textContent = respostaTexto;

    // Cria o container isolado para o botão voltar voltar a ter a classe correta
    const containerVoltar = document.createElement("div");
    containerVoltar.id = "opcoesDuvidas";
    containerVoltar.classList.add("container-opcoes-chat");

    const btnVoltar = document.createElement("button");
    btnVoltar.id = "btnVoltarOpcoes";
    btnVoltar.classList.add("btn-opcao-pergunta", "voltar-opcoes");
    btnVoltar.textContent = "↩ Ver outras dúvidas";
    
    containerVoltar.appendChild(btnVoltar);

    // Adiciona os elementos criados um por um no final do chat
    corpoChat.appendChild(balaoUsuario);
    corpoChat.appendChild(balaoBot);
    corpoChat.appendChild(containerVoltar);

    // Faz o scroll rolar suavemente para acompanhar as mensagens novas
    corpoChat.scrollTop = corpoChat.scrollHeight;
}


// EXECUTA TUDO AO CARREGAR A PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    // 1. Lógica de Boas-vindas
    const nome = localStorage.getItem("nome") || "Usuário";
    if (welcome) {
        welcome.textContent = "Olá " + nome;
    }

    // 2. Lógica do Dia Atual Automático
    const hoje = new Date().getDay();
    const diasMapeados = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
    carregarMensagemDia(hoje);
    mostrarTreino(diasMapeados[hoje]);

    // 3. Carrega os treinos personalizados na interface da Home
    renderizarTreinosCustomizados();

    // 4. Inicializa o Chatbot Local
    inicializarChatbot();
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
