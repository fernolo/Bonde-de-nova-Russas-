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
                if(qs('#adminBtn')) qs('#adminBtn').textContent = "✅ ADM";
                renderPosts();
            } else {
                alert("Negado.");
            }
        } catch (e) {
            alert("Erro de conexão.");
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
