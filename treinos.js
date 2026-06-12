function mostrar(id) {
    // Remove a classe 'ativo' de todas as seções
    document.querySelectorAll('.secao-exercicios').forEach(s => s.classList.remove('ativo'));
    
    // Adiciona a classe 'ativo' apenas na seção clicada
    const secao = document.getElementById(id);
    if (secao) {
        secao.classList.add('ativo');
    }
    
    // Rola para o topo
    window.scrollTo(0, 0);
}
