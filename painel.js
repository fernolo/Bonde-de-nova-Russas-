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
                alert("Erro no servidor: Verifique se a pasta /api/auth.js existe na Vercel.");
            }
        } catch (e) {
            alert("Erro local: A API só funciona quando publicada na Vercel.");
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
