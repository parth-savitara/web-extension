const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const toggle24 = document.getElementById('toggle24');
const FORMAT_KEY = 'clock24';

function pad(n) { return n.toString().padStart(2, '0'); }

function formatTime(d, use24) {
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    if (use24) {
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    } else {
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${pad(h)}:${pad(m)}:${pad(s)} ${ampm}`;
    }
}

function formatDate(d) {
    return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function startClock(use24) {
    function tick() {
        const now = new Date();
        timeEl.textContent = formatTime(now, use24);
        dateEl.textContent = formatDate(now);
    }
    tick();
    setInterval(tick, 1000);
}

function loadMode() {
    chrome.storage.sync.get([FORMAT_KEY], res => {
        const use24 = res[FORMAT_KEY] === true;
        toggle24.checked = use24;
        startClock(use24);
    });
}

toggle24.addEventListener('change', () => {
    const use24 = toggle24.checked;
    chrome.storage.sync.set({ [FORMAT_KEY]: use24 });
    location.reload(); // restart clock with new format
});

document.addEventListener('DOMContentLoaded', loadMode);
