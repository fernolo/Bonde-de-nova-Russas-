const PainelADM = {
    estaLogado: false,
    login: async () => {
        const senha = prompt("Credenciais:");
        if (!senha) return;
        try {
            const response = await fetch('/API/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: senha })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    PainelADM.estaLogado = true;
                    if(qs('#adminBtn')) qs('#adminBtn').textContent = "✅ ADM";
                    renderPosts();
                } else {
                    alert("Senha incorreta.");
                }
            } else {
                const retry = await fetch('/API/auth.js', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: senha })
                });
                if (retry.ok) {
                    const data = await retry.json();
                    if (data.success) {
                        PainelADM.estaLogado = true;
                        if(qs('#adminBtn')) qs('#adminBtn').textContent = "✅ ADM";
                        renderPosts();
                        return;
                    }
                }
                alert("Erro: O servidor não encontrou a rota /API/auth. Verifique se o Deploy terminou.");
            }
        } catch (e) {
            alert("Erro de conexão com o servidor.");
        }
    },
    apagarPost: (index) => {
        if(!PainelADM.estaLogado) return;
        if(confirm("Deseja apagar esta mensagem permanentemente?")) {
            appState.posts.splice(index, 1);
            save();
            renderPosts();
        }
    }
};
