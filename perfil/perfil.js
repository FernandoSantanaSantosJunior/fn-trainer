document.getElementById("nomeUsuario").innerHTML = localStorage.getItem("nome") || "Fernando";

carregarPerfil();

function carregarPerfil() {
    let pesoSalvo = localStorage.getItem("peso") || "Não definido";
    let alturaSalva = localStorage.getItem("altura") || "Não definida";
    
    if (pesoSalvo !== "Não definido") {
        document.getElementById("peso").innerHTML = pesoSalvo + " kg";
    } else {
        document.getElementById("peso").innerHTML = pesoSalvo;
    }

    if (alturaSalva !== "Não definida") {
        document.getElementById("altura").innerHTML = alturaSalva + " m";
    } else {
        document.getElementById("altura").innerHTML = alturaSalva;
    }

    document.getElementById("objetivo").innerHTML = localStorage.getItem("objetivo") || "Não definido";
}

const fotoSalva = localStorage.getItem("fotoPerfil");
if (fotoSalva) {
    document.getElementById("fotoPerfil").src = fotoSalva;
}

document.getElementById("editarNome").addEventListener("click", function() {
    const nomeAtual = document.getElementById("nomeUsuario").innerText;
    const novoNome = prompt("Seu nome:", nomeAtual);
    
    if (novoNome && novoNome.trim() !== "") {
        localStorage.setItem("nome", novoNome);
        document.getElementById("nomeUsuario").innerHTML = novoNome;
    }
});

document.getElementById("editarPeso").addEventListener("click", function() {
    let pesoAtual = document.getElementById("peso").innerText.replace(" kg", "");
    let novoPeso = prompt("Seu peso atual:", pesoAtual === "Não definido" ? "" : pesoAtual);
    
    if (novoPeso && novoPeso.trim() !== "") {
        novoPeso = novoPeso.replace(",", ".");
        localStorage.setItem("peso", novoPeso);
        document.getElementById("peso").innerHTML = novoPeso + " kg";
    }
});

document.getElementById("editarAltura").addEventListener("click", function() {
    let alturaAtual = document.getElementById("altura").innerText.replace(" m", "");
    let novaAltura = prompt("Sua altura (ex: 1.74):", alturaAtual === "Não definida" ? "" : alturaAtual);
    
    if (novaAltura && novaAltura.trim() !== "") {
        novaAltura = novaAltura.replace(",", ".");
        localStorage.setItem("altura", novaAltura);
        document.getElementById("altura").innerHTML = novaAltura + " m";
    }
});

document.getElementById("editarObjetivo").addEventListener("click", function() {
    const objetivoAtual = document.getElementById("objetivo").innerText;
    const novoObjetivo = prompt("Seu objetivo:", objetivoAtual === "Não definido" ? "" : objetivoAtual);
    
    if (novoObjetivo && novoObjetivo.trim() !== "") {
        localStorage.setItem("objetivo", novoObjetivo);
        document.getElementById("objetivo").innerHTML = novoObjetivo;
    }
});

const uploadFoto = document.getElementById("uploadFoto");
uploadFoto.addEventListener("change", function() {
    const arquivo = this.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    
    leitor.onload = function() {
        console.log("Foto carregada");
        localStorage.setItem("fotoPerfil", leitor.result);
        document.getElementById("fotoPerfil").src = leitor.result;
    };

    leitor.readAsDataURL(arquivo);
});

document.getElementById("removerFoto").addEventListener("click", function() {
    const confirmar = confirm("Deseja remover sua foto de perfil?");
    if (!confirmar) return;

    localStorage.removeItem("fotoPerfil");
    document.getElementById("fotoPerfil").src = "../images/user.png";
    alert("Foto removida!");
});

document.getElementById("resetarPerfil").addEventListener("click", function() {
    const confirmar = confirm("Tem certeza que deseja apagar toda sua evolução de treinos? Seu perfil (nome, foto, peso e altura) continuará salvo.");
    if (!confirmar) return;

    localStorage.removeItem("xp");
    localStorage.removeItem("treinos");
    localStorage.removeItem("somaNotas");
    localStorage.removeItem("tempoTotal");

    alert("Progresso de evolução resetado com sucesso!");
    location.reload();
});

// ==========================================
// LÓGICA DE OBJETIVO DINÂMICO
// ==========================================
function gerenciarObjetivoDoUsuario() {
    const botoes = document.querySelectorAll(".btn-opcao-objetivo");
    
    // 1. Carrega o estado atual (se não houver nada, massa é o padrão)
    const metaSalva = localStorage.getItem("objetivoUsuario") || "massa";
    
    botoes.forEach(btn => {
        // Marca o botão correto como ativo ao carregar
        if (btn.dataset.meta === metaSalva) {
            btn.classList.add("ativo-meta");
        }

        // 2. Escuta o clique para salvar
        btn.addEventListener("click", () => {
            botoes.forEach(b => b.classList.remove("ativo-meta"));
            btn.classList.add("ativo-meta");
            localStorage.setItem("objetivoUsuario", btn.dataset.meta);
        });
    });
}

// Chame esta função dentro do seu DOMContentLoaded no perfil.js
document.addEventListener("DOMContentLoaded", () => {
    // ... suas outras lógicas de editar nome, peso, etc ...
    
    gerenciarObjetivoDoUsuario();
});
