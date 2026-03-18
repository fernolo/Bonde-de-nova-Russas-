const PainelADM = {
    estaLogado: false,
    _key: "jqquuj", 
    check: (input) => {
        const coded = input.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 5)).join('');
        return coded === PainelADM._key;
    },
    login: () => {
        const senha = prompt("Credenciais:");
        if (PainelADM.check(senha)) {
            PainelADM.estaLogado = true;
            qs('#adminBtn').textContent = "✅ ADM";
            renderPosts();
        }
    },
    apagarPost: (index) => {
        if(!PainelADM.estaLogado) return;
        if(confirm("Apagar?")) {
            appState.posts.splice(index, 1);
            save();
            renderPosts();
        }
    }
};
