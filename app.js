const STORAGE_KEY = 'bnr_data_v1';
let appState = { 
    route: '/geral', 
    posts: [], 
    boards: [{name: '/geral'}, {name: '/dev'}], 
    currentFile: null,
    rules: "1. Sem Spam\n2. Respeite os membros" 
};

const qs = (sel) => document.querySelector(sel);

// Funções de Sistema
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(appState)); }
function load() { 
    const data = localStorage.getItem(STORAGE_KEY); 
    if(data) appState = JSON.parse(data); 
}

// Renderizar Mensagens
function renderPosts() {
    const cont = qs('#content');
    if(!cont) return;
    cont.innerHTML = '';
    
    appState.posts.filter(p => p.board === appState.route).forEach((p, index) => {
        const div = document.createElement('div');
        div.className = 'post';
        
        let media = '';
        if(p.file) {
            if(p.file.type.startsWith('image/')) media = `<img src="${p.file.data}" style="width:100%; border-radius:8px;">`;
            else if(p.file.type.startsWith('audio/')) media = `<audio src="${p.file.data}" controls style="width:200px; filter:invert(1);"></audio>`;
        }

        // Botão de apagar aparece se o ADM estiver logado
        const btnApagar = (typeof PainelADM !== 'undefined' && PainelADM.estaLogado) 
            ? `<button onclick="PainelADM.apagarPost(${index})" style="color:red; background:none; border:none; cursor:pointer;">[Apagar]</button>` 
            : '';

        div.innerHTML = `<b>Anônimo</b> ${btnApagar}${media}<div>${p.text}</div>`;
        cont.appendChild(div);
    });
    cont.scrollTop = cont.scrollHeight;
}

// --- BOTÕES FUNCIONAIS ---

// 1. Botão de Entrar
qs('#btnEnter').onclick = () => {
    qs('#welcomeScreen').classList.add('hidden');
    qs('#appContainer').classList.remove('hidden');
    renderPosts();
};

// 2. Anexar Arquivo
qs('#btnAttach').onclick = () => qs('#fileInput').click();
qs('#fileInput').onchange = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
        appState.currentFile = { data: ev.target.result, type: file.type };
        qs('#fileName').textContent = file.name;
        qs('#fileInfo').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
};

// 3. Microfone (Chama o audio.js)
qs('#btnRecord').onclick = () => {
    if (typeof mediaRecorder !== 'undefined' && mediaRecorder.state === "recording") {
        AudioBNR.parar();
    } else {
        AudioBNR.iniciar(qs('#btnRecord'));
    }
};

// 4. Enviar Mensagem
qs('#postForm').onsubmit = (e) => {
    e.preventDefault();
    const txt = qs('#postText');
    if(!txt.value && !appState.currentFile) return;

    appState.posts.push({
        board: appState.route,
        text: (typeof Defesa !== 'undefined') ? Defesa.sanitizar(txt.value) : txt.value,
        file: appState.currentFile
    });

    txt.value = '';
    appState.currentFile = null;
    qs('#fileInfo').classList.add('hidden');
    save();
    renderPosts();
};

// 5. Botão ADM (Abre o prompt de senha)
qs('#adminBtn').onclick = () => {
    const senha = prompt("Digite a senha de ADM:");
    if(PainelADM.login(senha)) renderPosts();
};

load();
