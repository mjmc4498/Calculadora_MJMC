document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons-grid');
    const clearAllBtn = document.getElementById('clear-all');
    const clearEntryBtn = document.getElementById('clear-entry');
    const equalsBtn = document.getElementById('equals');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const copyBtn = document.getElementById('copy-btn');

    let currentInput = '';

    // Function to handle button clicks
    buttons.addEventListener('click', (event) => {
        if (event.target.matches('button')) {
            const button = event.target;
            const value = button.dataset.value;

            if (value) {
                currentInput += value;
                updateDisplay();
            }
        }
    });

    // Function to handle keyboard input
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (/[0-9]|\.|\+|-|\*|\/|\(|\)|%/.test(key)) {
            currentInput += key;
            updateDisplay();
        } else if (key === 'Enter') {
            calculate();
        } else if (key === 'Backspace') {
            clearEntry();
        } else if (key === 'Escape') {
            clearAll();
        }
    });

    // Clear all
    clearAllBtn.addEventListener('click', clearAll);

    // Clear entry
    clearEntryBtn.addEventListener('click', clearEntry);

    // Equals
    equalsBtn.addEventListener('click', calculate);

    // Theme toggle is removed as Milligram doesn't have a dark mode by default

    // Copy to clipboard is removed

    function updateDisplay() {
        display.value = currentInput;
    }

    function clearAll() {
        currentInput = '';
        updateDisplay();
    }

    function clearEntry() {
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }

    const historyList = document.getElementById('history-list');

    function calculate() {
        try {
            let evalInput = currentInput.replace(/sin\(/g, 'Math.sin(');
            evalInput = evalInput.replace(/cos\(/g, 'Math.cos(');
            evalInput = evalInput.replace(/tan\(/g, 'Math.tan(');
            evalInput = evalInput.replace(/asin\(/g, 'Math.asin(');
            evalInput = evalInput.replace(/acos\(/g, 'Math.acos(');
            evalInput = evalInput.replace(/atan\(/g, 'Math.atan(');
            evalInput = evalInput.replace(/log\(/g, 'Math.log(');
            evalInput = evalInput.replace(/log10\(/g, 'Math.log10(');
            evalInput = evalInput.replace(/factorial\(/g, 'factorial(');

            const result = eval(evalInput);
            addToHistory(currentInput, result);
            currentInput = result.toString();
            updateDisplay();
        } catch (error) {
            currentInput = 'Error';
            updateDisplay();
        }
    }

    function addToHistory(expression, result) {
        const li = document.createElement('li');
        li.textContent = `${expression} = ${result}`;
        historyList.prepend(li);
    }

    const addNoteBtn = document.getElementById('add-note-btn');
    const notesList = document.getElementById('notes-list');
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    function renderNotes() {
        notesList.innerHTML = '';
        notes.forEach((noteText, index) => {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note';
            noteDiv.innerHTML = `
                <input type="text" value="${noteText}" data-index="${index}">
                <button class="button-clear delete-note-btn" data-index="${index}">X</button>
            `;
            notesList.appendChild(noteDiv);
        });
    }

    function saveNotes() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    addNoteBtn.addEventListener('click', () => {
        notes.push('Nueva nota');
        renderNotes();
        saveNotes();
    });

    notesList.addEventListener('input', (event) => {
        if (event.target.classList.contains('note-text')) {
            const index = event.target.dataset.index;
            notes[index] = event.target.value;
            saveNotes();
        }
    });

    notesList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-note-btn')) {
            const index = event.target.dataset.index;
            notes.splice(index, 1);
            renderNotes();
            saveNotes();
        }
    });

    renderNotes();

    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0) return 1;
        let result = 1;
        for (let i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    // Card tilt effect
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
});
