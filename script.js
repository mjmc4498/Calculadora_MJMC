document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons');
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

    // Theme toggle
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-bs-theme');
        if (currentTheme === 'dark') {
            document.body.setAttribute('data-bs-theme', 'light');
            themeToggleBtn.textContent = '🌙';
        } else {
            document.body.setAttribute('data-bs-theme', 'dark');
            themeToggleBtn.textContent = '☀️';
        }
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(display.value);
    });

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
        li.className = 'list-group-item';
        li.textContent = `${expression} = ${result}`;
        historyList.prepend(li); // Prepend to show newest first
    }

    const notes = document.getElementById('notes');

    // Load saved notes
    if (localStorage.getItem('savedNotes')) {
        notes.value = localStorage.getItem('savedNotes');
    }

    // Save notes on input
    notes.addEventListener('input', () => {
        localStorage.setItem('savedNotes', notes.value);
    });

    function factorial(n) {
        if (n < 0) return NaN;
        if (n === 0) return 1;
        let result = 1;
        for (let i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }
});
