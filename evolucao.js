let xp = Number(localStorage.getItem("xp")) || 0;
let treinos = Number(localStorage.getItem("treinos")) || 0;
let somaNotas = Number(localStorage.getItem("somaNotas")) || 0;
let tempoTotal = Number(localStorage.getItem("tempoTotal")) || 0;

if(document.getElementById("xpTotal")) {
    document.getElementById("xpTotal").innerHTML = xp;
}

if(document.getElementById("treinos")) {
    document.getElementById("treinos").innerHTML = treinos;
}

const media = treinos > 0 ? (somaNotas / treinos).toFixed(1) : 0;
if(document.getElementById("media")) {
    document.getElementById("media").innerHTML = media;
}

if(document.getElementById("tempo")) {
    document.getElementById("tempo").innerHTML = Math.floor(tempoTotal / 60) + " min";
}

const nivel = Math.floor(xp / 1000) + 1;
if(document.getElementById("nivel")) {
    document.getElementById("nivel").innerHTML = nivel;
}

const xpAtual = xp % 1000;

if(document.getElementById("xpTexto")) {
    document.getElementById("xpTexto").innerHTML = xpAtual + " / 1000 XP";
}

if(document.getElementById("progressFill")) {
    document.getElementById("progressFill").style.width = (xpAtual / 1000 * 100) + "%";
}
