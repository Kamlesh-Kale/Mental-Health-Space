document.addEventListener('DOMContentLoaded', () => {
    const toolCards = document.querySelectorAll('.tool-card');
    const contentArea = document.getElementById('content');

    // Tool content templates
    const tools = {
        breathing: `
            <h2>Breathing Exercise</h2>
            <div id="breathing-circle" style="
                width: 200px;
                height: 200px;
                border-radius: 50%;
                background: #3498db;
                margin: 2rem auto;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2rem;
                transition: transform 4s ease-in-out;
            ">
                <span>Breathe</span>
            </div>
            <button id="start-breathing" style="
                padding: 1rem 2rem;
                background: #3498db;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
                display: block;
                margin: 0 auto;
            ">Start Exercise</button>
        `,
        focus: `
            <h2>Eye Focus Exercise</h2>
            <p style="margin: 1rem 0; color: #2c3e50;">Follow the moving dot with your eyes without moving your head</p>
            <div id="exercise-area" style="
                width: 100%;
                height: 400px;
                background: #f5f6fa;
                position: relative;
                margin: 2rem 0;
                border-radius: 10px;
            ">
                <div id="focus-dot" style="
                    width: 20px;
                    height: 20px;
                    background: #e74c3c;
                    border-radius: 50%;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transition: all 1s ease;
                "></div>
            </div>
            <button id="start-focus" style="
                padding: 1rem 2rem;
                background: #3498db;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
                display: block;
                margin: 0 auto;
            ">Start Exercise</button>
        `,
        gratitude: `
            <h2>Gratitude Journal</h2>
            <div style="max-width: 600px; margin: 2rem auto;">
                <textarea id="gratitude-entry" style="
                    width: 100%;
                    height: 200px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    resize: vertical;
                " placeholder="Write what you're grateful for today..."></textarea>
                <button id="save-gratitude" style="
                    padding: 1rem 2rem;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1rem;
                ">Save Entry</button>
                <div id="gratitude-list" style="margin-top: 2rem;"></div>
            </div>
        `,
        meditation: `
            <h2>Time:</h2>
            <div style="text-align: center; margin: 2rem 0;">
                <div id="meditation-timer" style="
                    font-size: 2rem;
                    margin-bottom: 1rem;
                ">5:00</div>
                <button id="start-meditation" style="
                    padding: 1rem 2rem;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1rem;
                ">Start Meditation</button>
            </div>
        `
    };

    // Initialize with breathing exercise
    contentArea.innerHTML = tools.breathing;
    initializeBreathing();

    // Tool switching logic
    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            // Update active state
            toolCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Load tool content
            const tool = card.dataset.tool;
            contentArea.innerHTML = tools[tool];

            // Initialize tool functionality
            switch (tool) {
                case 'breathing':
                    initializeBreathing();
                    break;
                case 'focus':
                    initializeFocus();
                    break;
                case 'gratitude':
                    initializeGratitude();
                    break;
                case 'meditation':
                    initializeMeditation();
                    break;
            }
        });
    });

    // Tool initialization functions
    function initializeBreathing() {
        const startBtn = document.getElementById('start-breathing');
        const circle = document.getElementById('breathing-circle');
        let isActive = false;
        let interval;

        startBtn.addEventListener('click', () => {
            if (!isActive) {
                isActive = true;
                startBtn.textContent = 'Stop Exercise';
                interval = setInterval(() => {
                    circle.style.transform = 'scale(1.5)';
                    circle.querySelector('span').textContent = 'Inhale';
                    setTimeout(() => {
                        circle.style.transform = 'scale(1)';
                        circle.querySelector('span').textContent = 'Exhale';
                    }, 4000);
                }, 8000);
            } else {
                isActive = false;
                startBtn.textContent = 'Start Exercise';
                clearInterval(interval);
                circle.style.transform = 'scale(1)';
                circle.querySelector('span').textContent = 'Breathe';
            }
        });
    }

    function initializeFocus() {
        const startBtn = document.getElementById('start-focus');
        const dot = document.getElementById('focus-dot');
        let isActive = false;
        let interval;

        startBtn.addEventListener('click', () => {
            if (!isActive) {
                isActive = true;
                startBtn.textContent = 'Stop Exercise';
                interval = setInterval(() => {
                    const x = Math.random() * 80 + 10;
                    const y = Math.random() * 80 + 10;
                    dot.style.left = `${x}%`;
                    dot.style.top = `${y}%`;
                }, 2000);
            } else {
                isActive = false;
                startBtn.textContent = 'Start Exercise';
                clearInterval(interval);
            }
        });
    }

    function initializeGratitude() {
        const saveBtn = document.getElementById('save-gratitude');
        const textarea = document.getElementById('gratitude-entry');
        const list = document.getElementById('gratitude-list');

        // Load existing entries
        const entries = JSON.parse(localStorage.getItem('gratitudeEntries') || '[]');
        renderGratitudeEntries(entries);

        saveBtn.addEventListener('click', () => {
            const entry = textarea.value.trim();
            if (entry) {
                const newEntry = {
                    text: entry,
                    date: new Date().toLocaleDateString()
                };
                entries.unshift(newEntry);
                localStorage.setItem('gratitudeEntries', JSON.stringify(entries));
                textarea.value = '';
                renderGratitudeEntries(entries);
            }
        });

        function renderGratitudeEntries(entries) {
            list.innerHTML = entries.map(entry => `
                <div style="
                    background: #f8f9fa;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    border-radius: 5px;
                ">
                    <div style="color: #666; font-size: 0.9rem;">${entry.date}</div>
                    <div style="margin-top: 0.5rem;">${entry.text}</div>
                </div>
            `).join('');
        }
    }

    function initializeMeditation() {
        const startBtn = document.getElementById('start-meditation');
        const timerDisplay = document.getElementById('meditation-timer');
        let timeLeft = 300; // 5 minutes in seconds
        let interval;

        startBtn.addEventListener('click', () => {
            if (startBtn.textContent === 'Start Meditation') {
                startBtn.textContent = 'Stop Meditation';
                interval = setInterval(() => {
                    timeLeft--;
                    const minutes = Math.floor(timeLeft / 60);
                    const seconds = timeLeft % 60;
                    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                    if (timeLeft === 0) {
                        clearInterval(interval);
                        startBtn.textContent = 'Start Meditation';
                        timeLeft = 300;
                        timerDisplay.textContent = '5:00';
                    }
                }, 1000);
            } else {
                clearInterval(interval);
                startBtn.textContent = 'Start Meditation';
                timeLeft = 300;
                timerDisplay.textContent = '5:00';
            }
        });
    }
});