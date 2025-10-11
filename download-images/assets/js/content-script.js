(function () {
    function collectImages() {
        const imgs = Array.from(document.images || []).map(i => i.src).filter(Boolean);
        const bgEls = Array.from(document.querySelectorAll('*')).map(el => {
            const s = window.getComputedStyle(el);
            return (s.backgroundImage || '').replace(/(^url\()|(\)$|["'])/g, '').trim();
        }).filter(Boolean);
        const metas = Array.from(document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]')).map(m => m.content).filter(Boolean);
        return Array.from(new Set(imgs.concat(bgEls).concat(metas))).filter(u => !u.startsWith('data:') && u.length > 10);
    }


    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg.type === 'FETCH_IMAGES') {
            sendResponse({ images: collectImages() });
        }
    });
})();