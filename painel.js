const PainelADM = {
    estaLogado: false,
    nickAtual: "Mod",

    login: async () => {
        const senha = prompt("Credenciais:");
        if (!senha) return;
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: senha })
            });
            const data = await response.json();
            if (data.success) {
                PainelADM.estaLogado = true;
                const nome = prompt("Seu Nick de Moderador:");
                if(nome) PainelADM.nickAtual = nome;
                
                qs('#adminBtn').style.display = 'none';
                qs('#adminTools').style.display = 'flex';
                renderPosts();
            } else {
                alert("Negado.");
            }
        } catch (e) {
            alert("Erro de conexão.");
        }
    },

    logout: () => {
        PainelADM.estaLogado = false;
        qs('#adminBtn').style.display = 'block';
        qs('#adminTools').style.display = 'none';
        alert("Modo ADM Desativado.");
        renderPosts();
    },

    apagarPost: (index) => {
        if(!PainelADM.estaLogado) return;
        if(confirm("Apagar?")) {
            appState.posts.splice(index, 1);
            save();
            renderPosts();
        }
    },

    editarRegras: () => {
        if(!PainelADM.estaLogado) return;
        const nova = prompt("Regras:", appState.rules);
        if(nova !== null) { appState.rules = nova; save(); }
    },

    gerirBoards: () => {
        if(!PainelADM.estaLogado) return;
        const acao = prompt("[1] Criar [2] Configurar [3] Remover");
        if(acao === "1") {
            const n = prompt("Nome:");
            if(n) appState.boards.push({ name: n, p_msg: true, p_img: true, p_audio: true, blur: false, senha: null });
        } else if(acao === "2") {
            const nomeB = prompt("Qual board?");
            const b = appState.boards.find(x => x.name === nomeB);
            if(b) {
                b.blur = confirm("Blur?");
                b.p_img = confirm("Imagens?");
                b.p_audio = confirm("Áudios?");
                const s = prompt("Senha:");
                b.senha = s || null;
            }
        } else if(acao === "3") {
            const nRem = prompt("Deletar:");
            appState.boards = appState.boards.filter(b => b.name !== nRem);
        }
        save(); renderPosts();
    },

    blacklist: () => {
        if(!PainelADM.estaLogado) return;
        const acao = prompt("[1] Add [2] Remover");
        if(acao === "1") {
            const p = prompt("Bloquear:");
            if(p) appState.blacklist.push(p.toLowerCase());
        } else if(acao === "2") {
            const rem = prompt("Palavra para remover:");
            if(rem) appState.blacklist = appState.blacklist.filter(w => w !== rem.toLowerCase());
        }
        save();
    }
};
