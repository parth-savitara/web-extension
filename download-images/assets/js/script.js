document.addEventListener('DOMContentLoaded', () => {
    const fetchBtn = document.getElementById('fetchBtn');
    const imagesGrid = document.getElementById('imagesGrid');
    const statusText = document.getElementById('status');


    fetchBtn.addEventListener('click', () => {
        statusText.textContent = 'Loading images...';
        imagesGrid.innerHTML = '';


        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0] || !tabs[0].id) return;
            chrome.tabs.sendMessage(tabs[0].id, { type: 'FETCH_IMAGES' }, (response) => {
                if (!response || !Array.isArray(response.images)) {
                    statusText.textContent = 'No images found.';
                    return;
                }
                statusText.textContent = `Found ${response.images.length} images.`;


                response.images.forEach((url, idx) => {
                    const item = document.createElement('div');
                    item.className = 'grid-item';


                    const img = document.createElement('img');
                    img.src = url;
                    img.onerror = () => img.style.display = 'none';


                    const btn = document.createElement('button');
                    btn.className = 'download-btn';
                    btn.innerHTML = '<i class="fas fa-arrow-down"></i>';
                    btn.addEventListener('click', () => downloadImage(url));


                    item.appendChild(img);
                    item.appendChild(btn);
                    imagesGrid.appendChild(item);
                });
            });
        });
    });


    async function downloadImage(url) {
        try {
            const res = await fetch(url, { mode: 'cors' });
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = url.split('/').pop() || 'image';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            window.open(url, '_blank');
        }
    }
});