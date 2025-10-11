class EnhancedDigitalClock {
    constructor() {
        this.is24Hour = true;
        this.showSeconds = true;
        this.currentTheme = 0;
        this.appsList = this.loadAppsFromStorage();

        this.initializeElements();
        this.createParticles();
        this.startClock();
        this.initDropdown();
        this.initGoogleApps();
        this.createAddNewApp();
    }

    initializeElements() {
        this.timeElement = document.getElementById('time');
        this.dateElement = document.getElementById('date');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.googleAppsList = document.getElementById('apps-list');
    }

    loadAppsFromStorage() {
        const storedApps = localStorage.getItem('appsList');
        if (storedApps) {
            try {
                return JSON.parse(atob(storedApps));
            } catch (error) {
                console.error("Failed to load apps from storage:", error);
            }
        }

        // Default apps list
        return [
            { name: 'Search', url: 'https://google.com', icon: 'search', type: 'default' },
            { name: 'Gmail', url: 'https://mail.google.com', icon: 'mail', type: 'default' },
            { name: 'Drive', url: 'https://drive.google.com', icon: 'cloud', type: 'default' },
            { name: 'Docs', url: 'https://docs.google.com', icon: 'file-text', type: 'default' },
            { name: 'Sheets', url: 'https://sheets.google.com', icon: 'table', type: 'default' },
            { name: 'Slides', url: 'https://slides.google.com', icon: 'presentation', type: 'default' },
            { name: 'Meet', url: 'https://meet.google.com', icon: 'video', type: 'default' },
            { name: 'Calendar', url: 'https://calendar.google.com', icon: 'calendar-days', type: 'default' },
            { name: 'Photos', url: 'https://photos.google.com', icon: 'image', type: 'default' },
            { name: 'Keep', url: 'https://keep.google.com', icon: 'clipboard', type: 'default' },
            { name: 'Translate', url: 'https://translate.google.com', icon: 'languages', type: 'default' },
            { name: 'Maps', url: 'https://maps.google.com', icon: 'map', type: 'default' },
            { name: 'YouTube', url: 'https://youtube.com', icon: 'play', type: 'default' },
            { name: 'Play Store', url: 'https://play.google.com', icon: 'smartphone', type: 'default' },
            { name: 'Tasks', url: 'https://tasks.google.com', icon: 'check-square', type: 'default' },
            { name: 'Forms', url: 'https://forms.google.com', icon: 'file-text', type: 'default' },
            { name: 'Blogger', url: 'https://www.blogger.com', icon: 'pencil', type: 'default' },
            { name: 'Firebase', url: 'https://firebase.google.com', icon: 'zap', type: 'default' }
        ];
    }

    saveAppsToStorage() {
        const encrypted = btoa(JSON.stringify(this.appsList));
        localStorage.setItem('appsList', encrypted);
    }

    initGoogleApps() {
        this.googleAppsList.innerHTML = '';
        this.appsList.forEach((app, index) => {
            const removeBtn = app.type === 'custom'
                ? `<button class="remove-app" data-index="${index}"><i data-lucide="trash" color="white"></i></button>`
                : '';

            this.googleAppsList.innerHTML += `
                        <a href="${app.url}" class="text-white google-app">
                            <i data-lucide="${app.icon}"></i>
                            <span>${app.name}</span>
                            ${removeBtn}
                        </a>
                    `;
        });
        lucide.createIcons();

        // Remove functionality
        this.googleAppsList.querySelectorAll('.remove-app').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const index = parseInt(btn.dataset.index, 10);
                this.appsList.splice(index, 1);
                this.saveAppsToStorage();
                this.initGoogleApps();
            });
        });
    }

    initDropdown() {
        const appsButton = document.getElementById('appsButton');
        const appsDropdown = document.getElementById('appsDropdown');
        const dropdownOverlay = document.getElementById('dropdownOverlay');

        appsButton.addEventListener('click', (e) => {
            e.stopPropagation();
            appsDropdown.scrollTo({ behavior: 'instant', top: 0 });
            const isActive = appsDropdown.classList.contains('active');
            if (isActive) closeDropdown();
            else openDropdown();
        });

        dropdownOverlay.addEventListener('click', closeDropdown);

        document.addEventListener('click', (e) => {
            if (!appsButton.contains(e.target) && !appsDropdown.contains(e.target)) {
                closeDropdown();
            }
        });

        function openDropdown() {
            appsDropdown.classList.add('active');
            dropdownOverlay.classList.add('active');
        }

        function closeDropdown() {
            appsDropdown.classList.remove('active');
            dropdownOverlay.classList.remove('active');
        }
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    createAddNewApp() {
        const createBtn = document.getElementById("add-more-apps");

        createBtn.addEventListener('click', (event) => {
            event.preventDefault();

            const name = prompt("Enter App name");
            const url = prompt("Enter App Url");
            const iconName = prompt("Enter Icon name");

            if (name?.length && url?.length && iconName?.length) {
                this.appsList.push({
                    icon: iconName,
                    name: name,
                    url: url,
                    type: 'custom'
                });
                this.saveAppsToStorage();
                this.initGoogleApps();
            }
        });
    }

    startClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        let displayHours = this.is24Hour ? hours : hours % 12 || 12;

        this.hoursElement.textContent = displayHours.toString().padStart(2, '0');
        this.minutesElement.textContent = minutes.toString().padStart(2, '0');
        this.secondsElement.textContent = seconds.toString().padStart(2, '0');

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        this.dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

window.addEventListener('DOMContentLoaded', () => new EnhancedDigitalClock());

// Fullscreen button handling (optional)
document.addEventListener('fullscreenchange', () => {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
    }
});