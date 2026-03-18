

const Defesa = {
    
    sanitizar: (texto) => {
        const temp = document.createElement('div');
        temp.textContent = texto;
        return temp.innerHTML;
    },

    
    limparFoto: async (arquivo) => {
        if (!arquivo.type.startsWith('image/')) return arquivo;

        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                // Exporta como imagem nova, sem o rastro da antiga
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = URL.createObjectURL(arquivo);
        });
    }
};


Object.freeze(Defesa);
