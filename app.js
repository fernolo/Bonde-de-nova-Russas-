const STORAGE_KEY = 'bnr_prod_v2';
let appState = { 
    route: '/geral', 
    posts: [], 
    boards: [
        { name: '/geral', p_msg: true, p_img: true, p_audio: true, blur: false, senha: null },
        { name: '/dev', p_msg: true, p_img: true, p_audio: true, blur: false, senha: null }
    ],
    blacklist: [],
    rules: "Sem spam. Respeite os membros."
};

const qs = (sel) => document.querySelector(sel);

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(appState)); }

function load() { 
    const data = localStorage.getItem(STORAGE_KEY); 
    if(data) {
        const parsed = JSON.parse(data);
        appState = { ...appState, ...parsed };
    }
}

function renderPosts() {
    const cont = qs('#content');
    if(!cont) return;
    cont.innerHTML = '';
    
    const currentB = appState.boards.find(b => b.name === appState.route) || appState.boards[0];
    
    appState.posts.filter(p => p.board === appState.route).forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'post';
        if(currentB.blur) div.classList.add('blur-active');
        
        let media = '';
        if(p.file) {
            if(p.file.type.startsWith('image/')) media = `<img src="${p.file.data}" style="width:100%; border-radius:8px; margin-top:5px;">`;
            else if(p.file.type.startsWith('audio/')) media = `<audio src="${p.file.data}" controls style="width:200px; filter:invert(1);"></audio>`;
        }
        
        const btnA = (typeof PainelADM !== 'undefined' && PainelADM.estaLogado) ? 
            `<button onclick="PainelADM.apagarPost(${i})" style="color:#ff5252; border:none; background:none; font-size:10px; cursor:pointer; float:right;">[X]</button>` : '';
        
        div.innerHTML = `<b style="color:#50a7ea; font-size:12px;">Anônimo</b> ${btnA}${media}<div style="margin-top:4px;">${p.text}</div>`;
        cont.appendChild(div);
    });
    cont.scrollTop = cont.scrollHeight;
}

qs('#btnEnter').onclick = () => {
    qs('#welcomeScreen').classList.add('hidden');
    qs('#appContainer').classList.remove('hidden');
    renderPosts();
};

qs('#fileInput').onchange = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const currentB = appState.boards.find(b => b.name === appState.route);
    if(file.type.startsWith('image/') && !currentB.p_img) return alert("Imagens bloqueadas aqui.");
    if(file.type.startsWith('audio/') && !currentB.p_audio) return alert("Áudio bloqueado aqui.");

    const reader = new FileReader();
    reader.onload = async (ev) => {
        appState.currentFile = { 
            data: (file.type.startsWith('image/') && typeof Defesa !== 'undefined') ? await Defesa.limparFoto(file) : ev.target.result, 
            type: file.type 
        };
        qs('#fileName').textContent = file.name;
        qs('#fileInfo').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
};

qs('#btnRecord').onclick = () => {
    const currentB = appState.boards.find(b => b.name === appState.route);
    if(!currentB.p_audio) return alert("Áudio desativado.");
    if (typeof mediaRecorder !== 'undefined' && mediaRecorder.state === "recording") {
        AudioBNR.parar();
    } else if (typeof AudioBNR !== 'undefined') {
        AudioBNR.iniciar(qs('#btnRecord'));
    }
};

window.addEventListener('audioPronto', (e) => {
    appState.currentFile = { data: e.detail, type: 'audio/webm' };
    qs('#fileName').textContent = "Voz Gravada";
    qs('#fileInfo').classList.remove('hidden');
});

qs('#postForm').onsubmit = (e) => {
    e.preventDefault();
    const txt = qs('#postText');
    const msg = txt.value.toLowerCase();
    
    if(appState.blacklist && appState.blacklist.some(p => msg.includes(p))) {
        return alert("Termo proibido detectado.");
    }

    if(!txt.value && !appState.currentFile) return;

    appState.posts.push({
        board: appState.route,
        text: typeof Defesa !== 'undefined' ? Defesa.sanitizar(txt.value) : txt.value,
        file: appState.currentFile
    });

    txt.value = '';
    appState.currentFile = null;
    qs('#fileInfo').classList.add('hidden');
    save();
    renderPosts();
};

qs('#btnRemoveFile').onclick = () => { appState.currentFile = null; qs('#fileInfo').classList.add('hidden'); };

load();
