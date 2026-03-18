const STORAGE_KEY = 'bnr_prod_v1';
let appState = { route: '/geral', posts: [], boards: [{name: '/geral'}, {name: '/dev'}], currentFile: null };

const qs = (sel) => document.querySelector(sel);

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(appState)); }
function load() { const data = localStorage.getItem(STORAGE_KEY); if(data) appState = JSON.parse(data); }

function renderPosts() {
    const cont = qs('#content');
    if(!cont) return;
    cont.innerHTML = '';
    appState.posts.filter(p => p.board === appState.route).forEach(p => {
        const div = document.createElement('div');
        div.className = 'post';
        let media = '';
        if(p.file) {
            if(p.file.type.startsWith('image/')) media = `<img src="${p.file.data}" style="width:100%; border-radius:8px; margin-top:5px;">`;
            else if(p.file.type.startsWith('audio/')) media = `<audio src="${p.file.data}" controls style="width:200px; height:40px; filter:invert(1);"></audio>`;
        }
        div.innerHTML = `<b style="color:#50a7ea; font-size:12px;">${p.name}</b>${media}<div style="margin-top:4px;">${p.text}</div>`;
        cont.appendChild(div);
    });
    cont.scrollTop = cont.scrollHeight;
}

qs('#btnAttach').onclick = () => qs('#fileInput').click();

qs('#fileInput').onchange = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    if(file.type.startsWith('image/')) {
        appState.currentFile = { data: await Defesa.limparFoto(file), type: file.type };
    } else {
        const reader = new FileReader();
        reader.onload = (ev) => appState.currentFile = { data: ev.target.result, type: file.type };
        reader.readAsDataURL(file);
    }
    qs('#fileName').textContent = file.name;
    qs('#fileInfo').classList.remove('hidden');
};

qs('#btnRecord').onclick = () => {
    if (typeof mediaRecorder !== 'undefined' && mediaRecorder.state === "recording") {
        AudioBNR.parar();
    } else {
        AudioBNR.iniciar(qs('#btnRecord'));
    }
};

window.addEventListener('audioPronto', (e) => {
    appState.currentFile = { data: e.detail, type: 'audio/webm' };
    qs('#fileName').textContent = "Áudio Gravado 🎙️";
    qs('#fileInfo').classList.remove('hidden');
});

qs('#postForm').onsubmit = (e) => {
    e.preventDefault();
    const txt = qs('#postText');
    if(!txt.value && !appState.currentFile) return;

    appState.posts.push({
        board: appState.route,
        name: "Anônimo",
        text: typeof Defesa !== 'undefined' ? Defesa.sanitizar(txt.value) : txt.value,
        file: appState.currentFile
    });

    txt.value = '';
    appState.currentFile = null;
    qs('#fileInfo').classList.add('hidden');
    save();
    renderPosts();
};

qs('#btnEnter').onclick = () => {
    qs('#welcomeScreen').classList.add('hidden');
    qs('#appContainer').classList.remove('hidden');
    const list = qs('.topic-list');
    list.innerHTML = '';
    appState.boards.forEach(b => {
        const btn = document.createElement('button');
        btn.className = 'topic-item';
        btn.style = "width:100%; padding:15px; background:none; border:none; color:white; text-align:left; cursor:pointer;";
        btn.innerHTML = `<span>${b.name}</span>`;
        btn.onclick = () => { appState.route = b.name; qs('#boardTitle').textContent = b.name; renderPosts(); };
        list.appendChild(btn);
    });
    renderPosts();
};

qs('#btnRemoveFile').onclick = () => {
    appState.currentFile = null;
    qs('#fileInfo').classList.add('hidden');
};

load();
