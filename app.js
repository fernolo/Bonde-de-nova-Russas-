const STORAGE_KEY = 'bnr_v28_final';
const _SECRET_KEY = "jqquuj"; 
const _0x5f21 = (s) => s.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 5)).join('');

let appState = {
    route: '/geral',
    posts: [],
    boards: [{name: '/geral'}, {name: '/tecnologia'}],
    rules: "1. Sem spam\n2. Respeite os membros",
    isAdmin: false,
    currentFile: null
};

const qs = (sel) => document.querySelector(sel);

function save() { 
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
        if (appState.posts.length > 0) {
            appState.posts.splice(0, 5); 
            save(); 
        }
    }
}

function load() { 
    const data = localStorage.getItem(STORAGE_KEY);
    if(data) appState = JSON.parse(data);
}

function renderTopics() {
    const list = qs('.topic-list');
    if(!list) return;
    list.innerHTML = '';
    appState.boards.forEach(b => {
        const btn = document.createElement('button');
        btn.className = 'topic-item';
        btn.innerHTML = `<div class="topic-avatar">${b.name.charAt(1).toUpperCase()}</div><span><strong>${b.name}</strong></span>`;
        btn.onclick = () => {
            appState.route = b.name; 
            qs('#boardTitle').textContent = b.name;
            renderPosts();
            if(window.innerWidth < 768) {
                qs('#sidebar').classList.remove('active');
                qs('#sidebarOverlay').classList.add('hidden');
            }
        };
        list.appendChild(btn);
    });
}

function renderPosts() {
    const cont = qs('#content');
    if(!cont) return;
    cont.innerHTML = '';
    appState.posts.filter(p => p.board === appState.route).forEach(p => {
        const div = document.createElement('div');
        div.className = 'post';
        let media = p.file ? `<img src="${p.file}" style="width:100%; border-radius:6px; margin-top:8px; display:block;">` : '';
        div.innerHTML = `<b style='color:var(--accent-color); font-size: 0.9rem;'>${p.name || 'Anônimo'}</b>${media}<div style="margin-top:5px;">${p.text}</div>`;
        cont.appendChild(div);
    });
    cont.scrollTop = cont.scrollHeight;
}

if(qs('#menuToggle')) {
    qs('#menuToggle').onclick = () => {
        qs('#sidebar').classList.add('active');
        qs('#sidebarOverlay').classList.remove('hidden');
    };
}

if(qs('#sidebarOverlay')) {
    qs('#sidebarOverlay').onclick = () => {
        qs('#sidebar').classList.remove('active');
        qs('#sidebarOverlay').classList.add('hidden');
    };
}

if(qs('#btnAttach')) qs('#btnAttach').onclick = () => qs('#fileInput').click();

if(qs('#fileInput')) {
    qs('#fileInput').onchange = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const max = 800;
                let w = img.width, h = img.height;
                if (w > h && w > max) { h *= max/w; w = max; }
                else if (h > max) { w *= max/h; h = max; }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                appState.currentFile = canvas.toDataURL('image/jpeg', 0.7);
                qs('#btnAttach').style.color = '#4CAF50';
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };
}

if(qs('#postForm')) {
    qs('#postForm').onsubmit = (e) => {
        e.preventDefault();
        const txtInput = qs('#postText');
        const nickInput = qs('#postName');
        if(!txtInput.value && !appState.currentFile) return;

        appState.posts.push({ 
            board: appState.route, 
            name: nickInput.value || 'Anônimo', 
            text: txtInput.value, 
            file: appState.currentFile 
        });

        if(appState.posts.length > 100) appState.posts.shift();

        appState.currentFile = null;
        txtInput.value = '';
        qs('#btnAttach').style.color = 'var(--accent-color)';
        save();
        renderPosts();
    };
}

if(qs('#btnEnter')) {
    qs('#btnEnter').onclick = () => {
        qs('#welcomeScreen').classList.add('hidden');
        qs('#appContainer').classList.remove('hidden');
        renderTopics();
        renderPosts();
    };
}

load();
