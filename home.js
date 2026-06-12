const nome =

localStorage.getItem(
"nome"
)

|| "Usuário";

document
.getElementById(
"welcome"
)
.innerHTML =

"Olá, " + nome;