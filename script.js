// ==================== FUNÇÃO PARA CARREGAR IMAGENS DA PASTA ====================
async function loadImagesFromFolder(folderPath, containerId, dotsContainerId) {
    const container = document.getElementById(containerId);
    const dotsContainer = document.getElementById(dotsContainerId);
    
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    
    try {
        let imageFiles = [];
        
        try {
            const response = await fetch(`${folderPath}/images.json`);
            if (response.ok) {
                const data = await response.json();
                imageFiles = data.images || [];
            }
        } catch (e) {
            console.log('Tentando carregar imagens via listagem...');
        }
        
        if (imageFiles.length === 0) {
            const possibleNames = [];
            
            for (let i = 1; i <= 20; i++) {
                possibleNames.push(`${i}`);
                possibleNames.push(`image${i}`);
                possibleNames.push(`img${i}`);
                possibleNames.push(`photo${i}`);
                possibleNames.push(`model${i}`);
            }
            
            possibleNames.push('1', '2', '3', '4', '5', '6', '7', '8', '9', '10');
            possibleNames.push('image', 'img', 'photo', 'picture', 'screenshot');
            
            for (const name of possibleNames) {
                for (const ext of imageExtensions) {
                    const testUrl = `${folderPath}/${name}.${ext}`;
                    try {
                        const imgTest = new Image();
                        await new Promise((resolve) => {
                            imgTest.onload = () => {
                                if (!imageFiles.includes(`${name}.${ext}`)) {
                                    imageFiles.push(`${name}.${ext}`);
                                }
                                resolve(true);
                            };
                            imgTest.onerror = () => resolve(false);
                            imgTest.src = testUrl;
                            setTimeout(() => resolve(false), 500);
                        });
                    } catch(e) {}
                }
            }
        }
        
        imageFiles = [...new Set(imageFiles)];
        
        if (imageFiles.length > 0) {
            container.innerHTML = '';
            imageFiles.forEach((imgFile, index) => {
                const img = document.createElement('img');
                img.src = `${folderPath}/${imgFile}`;
                img.alt = `Imagem ${index + 1}`;
                img.onerror = () => {
                    console.log(`Erro ao carregar: ${imgFile}`);
                };
                container.appendChild(img);
            });
            
            dotsContainer.innerHTML = '';
            for (let i = 0; i < imageFiles.length; i++) {
                const dot = document.createElement('span');
                dot.className = 'dot';
                dotsContainer.appendChild(dot);
            }
            
            const slideImages = container;
            const imageCount = imageFiles.length;
            if (imageCount > 1) {
                const duration = Math.max(12, imageCount * 4);
                slideImages.style.animation = `slideSlow ${duration}s infinite ease-in-out`;
            } else {
                slideImages.style.animation = 'none';
            }
        } else {
            container.innerHTML = `
                <img src="https://picsum.photos/id/104/500/280" alt="Placeholder 1">
                <img src="https://picsum.photos/id/26/500/280" alt="Placeholder 2">
                <img src="https://picsum.photos/id/175/500/280" alt="Placeholder 3">
            `;
            dotsContainer.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        }
        
    } catch (error) {
        console.error('Erro ao carregar imagens:', error);
        container.innerHTML = `
            <img src="https://picsum.photos/id/104/500/280" alt="Placeholder 1">
            <img src="https://picsum.photos/id/26/500/280" alt="Placeholder 2">
            <img src="https://picsum.photos/id/175/500/280" alt="Placeholder 3">
        `;
        dotsContainer.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    }
}

// Função alternativa mais simples: tentar carregar imagens sequencialmente
async function loadImagesSimple(folderPath, containerId, dotsContainerId, maxAttempts = 30) {
    const container = document.getElementById(containerId);
    const dotsContainer = document.getElementById(dotsContainerId);
    const loadedImages = [];
    
    container.innerHTML = '';
    
    for (let i = 1; i <= maxAttempts; i++) {
        let found = false;
        const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        
        for (const ext of extensions) {
            const imgUrl = `${folderPath}/${i}.${ext}`;
            try {
                const imgTest = new Image();
                const loaded = await new Promise((resolve) => {
                    imgTest.onload = () => resolve(true);
                    imgTest.onerror = () => resolve(false);
                    imgTest.src = imgUrl;
                    setTimeout(() => resolve(false), 800);
                });
                
                if (loaded) {
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.alt = `Imagem ${i}`;
                    container.appendChild(img);
                    loadedImages.push(imgUrl);
                    found = true;
                    break;
                }
            } catch(e) {}
        }
        
        if (!found && loadedImages.length > 0) {
            break;
        }
    }
    
    if (loadedImages.length === 0) {
        const commonNames = ['image', 'img', 'photo', 'picture', 'screenshot', 'model', 'asset', 'game'];
        for (const name of commonNames) {
            for (let num = 1; num <= 10; num++) {
                for (const ext of ['jpg', 'png', 'webp']) {
                    const imgUrl = `${folderPath}/${name}${num}.${ext}`;
                    try {
                        const imgTest = new Image();
                        const loaded = await new Promise((resolve) => {
                            imgTest.onload = () => resolve(true);
                            imgTest.onerror = () => resolve(false);
                            imgTest.src = imgUrl;
                            setTimeout(() => resolve(false), 500);
                        });
                        
                        if (loaded) {
                            const img = document.createElement('img');
                            img.src = imgUrl;
                            img.alt = `${name} ${num}`;
                            container.appendChild(img);
                            loadedImages.push(imgUrl);
                        }
                    } catch(e) {}
                }
            }
            if (loadedImages.length > 0) break;
        }
    }
    
    dotsContainer.innerHTML = '';
    for (let i = 0; i < loadedImages.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dotsContainer.appendChild(dot);
    }
    
    if (loadedImages.length === 0) {
        container.innerHTML = `
            <img src="https://picsum.photos/id/104/500/280" alt="Placeholder 1">
            <img src="https://picsum.photos/id/26/500/280" alt="Placeholder 2">
            <img src="https://picsum.photos/id/175/500/280" alt="Placeholder 3">
        `;
        dotsContainer.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    } else if (loadedImages.length === 1) {
        container.style.animation = 'none';
    } else {
        const duration = Math.max(12, loadedImages.length * 4);
        container.style.animation = `slideSlow ${duration}s infinite ease-in-out`;
    }
}

// ==================== MODAL DE CONTATO ====================
const modal = document.getElementById('contactModal');
const contactBtn = document.getElementById('contactBtn');
const closeModal = document.querySelector('.close-modal');
const toast = document.getElementById('toastMessage');

contactBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

function showToast(msg) {
    toast.textContent = msg || '📬 Mensagem enviada com sucesso!';
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const message = document.getElementById('userMessage').value;
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('_subject', `Contato de ${name} - Portfólio`);
    formData.append('_replyto', email);
    
    try {
        const response = await fetch('https://formsubmit.co/ajax/Henthaliss@gmail.com', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showToast('✅ Mensagem enviada! Em breve retornarei.');
            contactForm.reset();
            modal.style.display = 'none';
        } else {
            throw new Error('Erro no envio');
        }
    } catch (error) {
        window.location.href = `mailto:Henthaliss@gmail.com?subject=Contato de ${name}&body=Nome: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMensagem:%0D%0A${message}`;
        showToast('📧 Abrindo seu cliente de email');
        contactForm.reset();
        modal.style.display = 'none';
    }
});

// Carregar imagens das pastas
window.addEventListener('DOMContentLoaded', () => {
    loadImagesSimple('Friend chat imagens', 'friendChatImages', 'friendChatDots', 25);
    loadImagesSimple('3D model imagens', 'modelsImages', 'modelsDots', 25);
});
