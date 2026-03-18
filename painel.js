const PainelADM = {
    estaLogado: false,

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
                qs('#adminBtn').style.display = 'none';
                qs('#adminTools').style.display = 'flex';
                alert("Acesso Administrativo Liberado.");
                renderPosts();
            } else {
                alert("Senha incorreta.");
            }
        } catch (e) {
            alert("Erro de conexão com o servidor.");
        }
    },

    apagarPost: (index) => {
        if(!PainelADM.estaLogado) return;
        if(confirm("Apagar permanentemente?")) {
            appState.posts.splice(index, 1);
            save();
            renderPosts();
        }
    },

    editarRegras: () => {
        if(!PainelADM.estaLogado) return;
        const nova = prompt("Edite as regras:", appState.rules);
        if(nova !== null) { appState.rules = nova; save(); }
    },

    gerirBoards: () => {
        if(!PainelADM.estaLogado) return;
        const acao = prompt("[1] Criar [2] Configurar (Blur/Senha) [3] Remover Board");
        
        if(acao === "1") {
            const n = prompt("Nome (ex: /hack):");
            if(n) {
                appState.boards.push({ name: n, p_msg: true, p_img: true, p_audio: true, blur: false, senha: null });
            }
        } else if(acao === "2") {
            const nomeB = prompt("Nome da board para configurar:");
            const b = appState.boards.find(x => x.name === nomeB);
            if(b) {
                b.blur = confirm("Deseja ativar o BLUR (embaçar conteúdo) nesta board?");
                b.p_img = confirm("Permitir Imagens?");
                b.p_audio = confirm("Permitir Áudio?");
                const s = prompt("Senha da Board (vazio para nenhuma):");
                b.senha = s || null;
            }
        } else if(acao === "3") {
            const nRem = prompt("Nome da board para DELETAR:");
            appState.boards = appState.boards.filter(b => b.name !== nRem);
        }
        save();
        renderPosts();
    },

    blacklist: () => {
        if(!PainelADM.estaLogado) return;
        const acao = prompt("[1] Adicionar Palavra [2] Ver/Remover Palavra");
        
        if(acao === "1") {
            const p = prompt("Palavra para bloquear:");
            if(p) appState.blacklist.push(p.toLowerCase());
        } else if(acao === "2") {
            const lista = appState.blacklist.join(", ");
            const rem = prompt("Lista atual: " + lista + "\nDigite a palavra exata para REMOVER:");
            if(rem) appState.blacklist = appState.blacklist.filter(word => word !== rem.toLowerCase());
        }
        save();
    },

    gerirModeradores: () => {
        if(!PainelADM.estaLogado) return;
        const acao = prompt("[1] Adicionar Mod [2] Remover Mod");
        
        if(acao === "1") {
            const n = prompt("Nick:");
            const s = prompt("Senha:");
            if(n && s) {
                if(!appState.mods) appState.mods = [];
                appState.mods.push({ nick: n, pass: s });
            }
        } else if(acao === "2") {
            if(!appState.mods || appState.mods.length === 0) return alert("Nenhum mod cadastrado.");
            const listaMods = appState.mods.map(m => m.nick).join(", ");
            const nRem = prompt("Moderadores: " + listaMods + "\nDigite o Nick para REMOVER:");
            appState.mods = appState.mods.filter(m => m.nick !== nRem);
        }
        save();
    }
};
