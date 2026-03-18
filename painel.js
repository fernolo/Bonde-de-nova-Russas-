const PainelADM = {
    estaLogado: false,
    senhaMestra: "123", // Você muda depois

    login: (senha) => {
        if(senha === PainelADM.senhaMestra) {
            PainelADM.estaLogado = true;
            alert("Modo ADM Ativado!");
            return true;
        }
        alert("Senha Incorreta!");
        return false;
    },

    apagarPost: (index) => {
        if(!PainelADM.estaLogado) return alert("Acesso negado!");
        appState.posts.splice(index, 1);
        save();
        renderPosts();
    },

    mudarRegras: (novasRegras) => {
        if(!PainelADM.estaLogado) return;
        appState.rules = novasRegras;
        save();
        alert("Regras atualizadas!");
    }
};
