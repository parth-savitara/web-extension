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
        this.timezoneElement = document.getElementById('timezone');
        this.googleAppsList = document.getElementById('apps-list');
    }

    loadAppsFromStorage() {
        const storedApps = localStorage.getItem('appsList');
        if (storedApps) {
            return JSON.parse(storedApps);
        }
        // Default apps list
        return [
            {
                name: 'Search',
                url: 'https://google.com',
                icon: 'search'
            },
            {
                name: 'Gmail',
                url: 'https://mail.google.com',
                icon: 'mail'
            },
            {
                name: 'Drive',
                url: 'https://drive.google.com',
                icon: 'cloud'
            },
            {
                name: 'Docs',
                url: 'https://docs.google.com',
                icon: 'file-text'
            },
            {
                name: 'Sheets',
                url: 'https://sheets.google.com',
                icon: 'table'
            },
            {
                name: 'Slides',
                url: 'https://slides.google.com',
                icon: 'presentation'
            },
            {
                name: 'Meet',
                url: 'https://meet.google.com',
                icon: 'video'
            },
            {
                name: 'Calendar',
                url: 'https://calendar.google.com',
                icon: 'calendar-days'
            },
            {
                name: 'Photos',
                url: 'https://photos.google.com',
                icon: 'image'
            },
            {
                name: 'Keep',
                url: 'https://keep.google.com',
                icon: 'clipboard'
            },
            {
                name: 'Translate',
                url: 'https://translate.google.com',
                icon: 'languages'
            },
            {
                name: 'Maps',
                url: 'https://maps.google.com',
                icon: 'map'
            },
            {
                name: 'YouTube',
                url: 'https://youtube.com',
                icon: 'play'
            },
            {
                name: 'Play Store',
                url: 'https://play.google.com',
                icon: 'smartphone'
            },
            {
                name: 'Tasks',
                url: 'https://tasks.google.com',
                icon: 'check-square'
            },
            {
                name: 'Forms',
                url: 'https://forms.google.com',
                icon: 'file-text'
            },
            {
                name: 'Blogger',
                url: 'https://www.blogger.com',
                icon: 'pencil'
            },
            {
                name: 'Firebase',
                url: 'https://firebase.google.com',
                icon: 'zap'
            }
        ];
    }

    saveAppsToStorage() {
        localStorage.setItem('appsList', JSON.stringify(this.appsList));
    }

    initGoogleApps() {
        this.googleAppsList.innerHTML = ''; // Clear the list before rendering
        this.appsList.forEach(app => {
            this.googleAppsList.innerHTML += `
            <a href="${app.url}" class="text-white google-app">
                    <i data-lucide="${app.icon}"></i>
                    <span>${app.name}</span>
                </a>
            `;
        });
        lucide.createIcons();
    }

    initDropdown() {
        const appsButton = document.getElementById('appsButton');
        const appsDropdown = document.getElementById('appsDropdown');
        const dropdownOverlay = document.getElementById('dropdownOverlay');

        // Toggle dropdown
        appsButton.addEventListener('click', function (e) {
            e.stopPropagation();
            appsDropdown.scrollTo({ behavior: 'instant', top: 0 });
            const isActive = appsDropdown.classList.contains('active');

            if (isActive) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });

        // Close dropdown when clicking outside
        dropdownOverlay.addEventListener('click', closeDropdown);

        // Close dropdown when clicking outside anywhere
        document.addEventListener('click', function (e) {
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
                    url: url
                });
                this.saveAppsToStorage(); // Save the updated list to local storage
                this.initGoogleApps(); // Re-render the apps list
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

        // Format hours based on 12/24 hour preference
        let displayHours = hours;

        if (!this.is24Hour) {
            displayHours = hours % 12 || 12;
        }

        // Update time display with leading zeros
        this.hoursElement.textContent = displayHours.toString().padStart(2, '0');
        this.minutesElement.textContent = minutes.toString().padStart(2, '0');
        this.secondsElement.textContent = seconds.toString().padStart(2, '0');

        // Update date
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        this.dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

window.addEventListener('DOMContentLoaded', () => new EnhancedDigitalClock());

// Handle fullscreen change events
document.addEventListener('fullscreenchange', () => {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
    }
});
