const PainelADM = {
    estaLogado: false,
    
    // Gerenciamento de Mensagens e Regras
    apagarPost: (id) => {
        if(!PainelADM.estaLogado) return;
        appState.posts.splice(id, 1);
        save(); renderPosts();
    },
    editarRegras: () => {
        if(!PainelADM.estaLogado) return;
        const nova = prompt("Novas Regras:", appState.rules);
        if(nova) { appState.rules = nova; save(); alert("Regras Atualizadas!"); }
    },

    // Gerenciamento de Boards
    criarBoard: () => {
        const nome = prompt("Nome da Board (ex: /tech):");
        if(nome) {
            appState.boards.push({ name: nome, p_msg: true, p_img: true, p_audio: true, blur: false, hidden: false, pass: null });
            save(); alert("Board Criada!");
        }
    },
    configurarBoard: (nome) => {
        const b = appState.boards.find(x => x.name === nome);
        if(!b) return;
        b.blur = confirm(`Ativar Blur na ${nome}?`);
        b.hidden = confirm(`Ocultar ${nome} (Apenas ADM vê)?`);
        const p = prompt(`Senha para entrar na ${nome} (vazio para sem senha):`);
        b.pass = p || null;
        save();
    },

    // Gerenciamento de Moderadores
    addMod: () => {
        const nick = prompt("Nick do novo Mod:");
        const pass = prompt("Senha do novo Mod:");
        if(nick && pass) {
            appState.mods.push({ nick, pass });
            save(); alert("Moderador Adicionado!");
        }
    },
    removerMod: (nick) => {
        appState.mods = appState.mods.filter(m => m.nick !== nick);
        save(); alert("Moderador Removido!");
    },

    // Segurança
    addBlacklist: () => {
        const word = prompt("Palavra ou Termo para Blacklist:");
        if(word) { appState.blacklist.push(word.toLowerCase()); save(); }
    }
};
