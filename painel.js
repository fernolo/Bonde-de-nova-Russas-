const PainelADM = {
    estaLogado: false,
    
    login: async () => {
        const senha = prompt("Credenciais de Administração:");
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
                alert("Modo Administrador Ativado.");
                if(qs('#adminBtn')) qs('#adminBtn').textContent = "✅ PAINEL ATIVO";
                renderPosts();
            } else {
                alert("Senha incorreta.");
            }
        } catch (e) {
            alert("Erro de conexão com o servidor API.");
        }
    },

    apagarPost: (index) => {
        if(!PainelADM.estaLogado) return;
        if(confirm("Deseja eliminar esta mensagem permanentemente?")) {
            appState.posts.splice(index, 1);
            save();
            renderPosts();
        }
    },

    editarRegras: () => {
        if(!PainelADM.estaLogado) return;
        const novasRegras = prompt("Edite as Regras do Grupo:", appState.rules || "");
        if(novasRegras !== null) {
            appState.rules = novasRegras;
            save();
            alert("Regras atualizadas.");
        }
    },

    gerirBoards: () => {
        if(!PainelADM.estaLogado) return;
        const acao = prompt("Escolha: [1] Criar Board [2] Editar Board [3] Eliminar Board");
        
        if(acao === "1") {
            const nome = prompt("Nome da nova Board (ex: /hacker):");
            if(nome) {
                appState.boards.push({
                    name: nome,
                    p_msg: true, p_img: true, p_audio: true,
                    blur: false, hidden: false, senha: null
                });
                alert("Board criada.");
            }
        } else if(acao === "2") {
            const nomeB = prompt("Nome da board para editar:");
            const b = appState.boards.find(x => x.name === nomeB);
            if(b) {
                b.blur = confirm("Ativar Blur (Conteúdo sensível)?");
                b.hidden = confirm("Ocultar board da lista pública?");
                b.p_img = confirm("Permitir Imagens?");
                b.p_audio = confirm("Permitir Áudios?");
                const s = prompt("Definir senha de acesso (vazio para público):");
                b.senha = s || null;
            }
        }
        save();
        renderPosts();
    },

    blacklist: () => {
        if(!PainelADM.estaLogado) return;
        const palavra = prompt("Adicionar palavra proibida ao filtro:");
        if(palavra) {
            if(!appState.blacklist) appState.blacklist = [];
            appState.blacklist.push(palavra.toLowerCase());
            save();
            alert("Palavra adicionada à Blacklist.");
        }
    },

    gerirModeradores: () => {
        if(!PainelADM.estaLogado) return;
        const acao = prompt("[1] Adicionar Mod [2] Remover Mod [3] Mudar Senha");
        if(acao === "1") {
            const nick = prompt("Nick do Moderador:");
            const pass = prompt("Senha do Moderador:");
            if(nick && pass) {
                if(!appState.mods) appState.mods = [];
                appState.mods.push({ nick, pass });
            }
        } else if(acao === "2") {
            const nickR = prompt("Nick para remover:");
            appState.mods = appState.mods.filter(m => m.nick !== nickR);
        }
        save();
    }
};
