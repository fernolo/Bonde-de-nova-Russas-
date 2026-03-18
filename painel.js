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
                alert("Erro: Verifique se o arquivo auth.js está dentro da pasta API (maiúsculo).");
            }
        } catch (e) {
            alert("Erro de comunicação com o servidor.");
        }
    },
    apagarPost: (index) => {
        if(!PainelADM.estaLogado) return;
        if(confirm("Apagar mensagem?")) {
            appState.posts.splice(index, 1);
            save();
            renderPosts();
        }
    }
};
