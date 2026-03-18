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
        if(confirm("Deseja apagar permanentemente?")) {
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
        const acao = prompt("[1] Criar Board [2] Configurar Board [3] Remover");
        if(acao === "1") {
            const n = prompt("Nome (ex: /vip):");
            if(n) appState.boards.push({ name: n, p_msg: true, p_img: true, p_audio: true, blur: false, senha: null });
        } else if(acao === "2") {
            const nomeB = prompt("Qual board deseja editar?");
            const b = appState.boards.find(x => x.name === nomeB);
            if(b) {
                b.blur = confirm("Ativar Blur?");
                b.p_img = confirm("Permitir Imagens?");
                b.p_audio = confirm("Permitir Áudio?");
                const s = prompt("Senha da Board (vazio para nenhuma):");
                b.senha = s || null;
            }
        }
        save();
        renderPosts();
    },

    blacklist: () => {
        if(!PainelADM.estaLogado) return;
        const p = prompt("Palavra para bloquear:");
        if(p) { appState.blacklist.push(p.toLowerCase()); save(); }
    },

    gerirModeradores: () => {
        if(!PainelADM.estaLogado) return;
        const n = prompt("Nick do Mod:");
        const s = prompt("Senha do Mod:");
        if(n && s) {
            if(!appState.mods) appState.mods = [];
            appState.mods.push({ nick: n, pass: s });
            save();
        }
    }
};
