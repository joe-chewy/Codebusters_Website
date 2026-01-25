// ===== TIMER FUNCTIONALITY =====

const timerDisplay = document.getElementById('timer-display');
const timerMinutesInput = document.getElementById('timer-minutes');
const timerStartBtn = document.getElementById('timer-start');
const timerPauseBtn = document.getElementById('timer-pause');
const timerResetBtn = document.getElementById('timer-reset');

let timerInterval = null;
let timeRemaining = 300; // 5 minutes in seconds

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    // Pad with zeros: 5 becomes "05"
    timerDisplay.textContent =
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');

    // Add warning color when under 1 minute
    if (timeRemaining <= 60) {
        timerDisplay.classList.add('warning');
    } else {
        timerDisplay.classList.remove('warning');
    }
}

function startTimer() {
    if (timerInterval) return; // Already running

    timerInterval = setInterval(function() {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Time's up!");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    const minutes = parseInt(timerMinutesInput.value) || 5;
    timeRemaining = minutes * 60;
    updateTimerDisplay();
}

timerStartBtn.addEventListener('click', startTimer);
timerPauseBtn.addEventListener('click', pauseTimer);
timerResetBtn.addEventListener('click', resetTimer);
timerMinutesInput.addEventListener('change', resetTimer);


// ===== CIPHER FUNCTIONS =====

function caesarCipher(text, shift) {
    shift = ((shift % 26) + 26) % 26;
    let result = '';

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (char >= 'A' && char <= 'Z') {
            let code = char.charCodeAt(0);
            let shifted = ((code - 65 + shift) % 26) + 65;
            result += String.fromCharCode(shifted);
        } else if (char >= 'a' && char <= 'z') {
            let code = char.charCodeAt(0);
            let shifted = ((code - 97 + shift) % 26) + 97;
            result += String.fromCharCode(shifted);
        } else {
            result += char;
        }
    }

    return result;
}

function atbashCipher(text) {
    let result = '';

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (char >= 'A' && char <= 'Z') {
            let code = char.charCodeAt(0);
            let reversed = 90 - (code - 65);
            result += String.fromCharCode(reversed);
        } else if (char >= 'a' && char <= 'z') {
            let code = char.charCodeAt(0);
            let reversed = 122 - (code - 97);
            result += String.fromCharCode(reversed);
        } else {
            result += char;
        }
    }

    return result;
}

function affineEncrypt(text, a, b) {
    let result = '';

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (char >= 'A' && char <= 'Z') {
            let code = char.charCodeAt(0) - 65;
            let index = (a * code + b) % 26;
            result += String.fromCharCode(index + 65);
        } else if (char >= 'a' && char <= 'z') {
            let code = char.charCodeAt(0) - 97;
            let index = (a * code + b) % 26;
            result += String.fromCharCode(index + 97);
        } else {
            result += char;
        }
    }

    return result;
}

// ===== CHECKERBOARD (POLYBIUS) CIPHER =====

function createPolybiusAlphabet(keyword = '') {
    keyword = keyword.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let alphabet = '';
    let used = new Set();

    for (let char of keyword) {
        if (!used.has(char)) {
            alphabet += char;
            used.add(char);
        }
    }

    for (let i = 0; i < 26; i++) {
        let char = String.fromCharCode(65 + i);
        if (char !== 'J' && !used.has(char)) {
            alphabet += char;
            used.add(char);
        }
    }

    return alphabet;
}

function checkerboardEncrypt(text, keyword = '') {
    const alphabet = createPolybiusAlphabet(keyword);
    text = text.toUpperCase().replace(/J/g, 'I');
    let result = '';

    for (let char of text) {
        if (char >= 'A' && char <= 'Z') {
            let index = alphabet.indexOf(char);
            if (index !== -1) {
                let row = Math.floor(index / 5) + 1;
                let col = (index % 5) + 1;
                result += '' + row + col + ' ';
            }
        }
    }

    return result.trim();
}

// ===== NIHILIST SUBSTITUTION CIPHER =====

function letterToPolybius(char, alphabet) {
    char = char.toUpperCase();
    if (char === 'J') char = 'I';
    let index = alphabet.indexOf(char);
    if (index === -1) return null;
    let row = Math.floor(index / 5) + 1;
    let col = (index % 5) + 1;
    return row * 10 + col;
}

function nihilistEncrypt(text, alphabetKey, cipherKey) {
    const alphabet = createPolybiusAlphabet(alphabetKey);
    text = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    cipherKey = cipherKey.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');

    let keyNumbers = [];
    for (let char of cipherKey) {
        keyNumbers.push(letterToPolybius(char, alphabet));
    }

    let result = [];
    for (let i = 0; i < text.length; i++) {
        let plainNum = letterToPolybius(text[i], alphabet);
        let keyNum = keyNumbers[i % keyNumbers.length];
        result.push(plainNum + keyNum);
    }

    return result.join(' ');
}

// ===== COMPLETE COLUMNAR TRANSPOSITION CIPHER =====

function getColumnOrder(keyword) {
    keyword = keyword.toUpperCase();
    let pairs = [];
    for (let i = 0; i < keyword.length; i++) {
        pairs.push([keyword[i], i]);
    }
    pairs.sort((a, b) => {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return a[1] - b[1];
    });
    return pairs.map(p => p[1]);
}

function columnarEncrypt(text, keyword) {
    keyword = keyword.toUpperCase().replace(/[^A-Z]/g, '');
    text = text.toUpperCase().replace(/[^A-Z]/g, '');

    let numCols = keyword.length;
    let numRows = Math.ceil(text.length / numCols);

    while (text.length < numRows * numCols) {
        text += 'X';
    }

    let grid = [];
    for (let r = 0; r < numRows; r++) {
        let row = [];
        for (let c = 0; c < numCols; c++) {
            row.push(text[r * numCols + c]);
        }
        grid.push(row);
    }

    let order = getColumnOrder(keyword);

    let result = '';
    for (let colIndex of order) {
        for (let r = 0; r < numRows; r++) {
            result += grid[r][colIndex];
        }
    }

    return result;
}


// ===== PRACTICE PROBLEMS =====

const cipherTypeSelect = document.getElementById('cipher-type');
const generateProblemBtn = document.getElementById('generate-problem');
const problemText = document.getElementById('problem-text');
const problemHint = document.getElementById('problem-hint');
const answerInput = document.getElementById('answer-input');
const checkAnswerBtn = document.getElementById('check-answer');
const showAnswerBtn = document.getElementById('show-answer');
const resultDisplay = document.getElementById('result-display');

// Sample phrases for practice
const samplePhrases = [
    "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
    "SCIENCE OLYMPIAD IS FUN",
    "CODEBUSTERS TEAM WINS GOLD",
    "PRACTICE MAKES PERFECT",
    "CRYPTOGRAPHY IS AWESOME",
    "NEVER GIVE UP ON YOUR DREAMS",
    "TEAMWORK MAKES THE DREAM WORK",
    "DIVISION B ROCKS",
    "DECODE THIS MESSAGE",
    "ALWAYS DOUBLE CHECK YOUR WORK",
    "THE ANSWER IS HIDDEN IN PLAIN SIGHT",
    "KEEP CALM AND SOLVE CIPHERS",
    "GOOD LUCK AT REGIONALS",
    "STATE COMPETITION HERE WE COME",
    "CIPHERS ARE LIKE PUZZLES"
];

// Store the current problem's answer
let currentAnswer = '';
let currentCipherInfo = '';

function generateProblem() {
    const cipherType = cipherTypeSelect.value;

    // Pick a random phrase
    const randomIndex = Math.floor(Math.random() * samplePhrases.length);
    const plaintext = samplePhrases[randomIndex];

    let ciphertext = '';
    let hint = '';

    if (cipherType === 'caesar') {
        // Random shift between 1 and 25
        const shift = Math.floor(Math.random() * 25) + 1;
        ciphertext = caesarCipher(plaintext, shift);
        hint = 'Hint: This is a Caesar cipher with an unknown shift.';
        currentCipherInfo = `Caesar cipher with shift of ${shift}`;
    } else if (cipherType === 'atbash') {
        ciphertext = atbashCipher(plaintext);
        hint = 'Hint: This is an Atbash cipher (A=Z, B=Y, C=X, etc.)';
        currentCipherInfo = 'Atbash cipher';
    } else if (cipherType === 'affine') {
        // Valid 'a' values that are coprime with 26
        const validA = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
        const a = validA[Math.floor(Math.random() * validA.length)];
        const b = Math.floor(Math.random() * 26);
        ciphertext = affineEncrypt(plaintext, a, b);
        hint = 'Hint: This is an Affine cipher. E(x) = (ax + b) mod 26';
        currentCipherInfo = `Affine cipher with a=${a}, b=${b}`;
    } else if (cipherType === 'checkerboard') {
        // Random keywords for Polybius grid
        const keywords = ['', 'ZEBRA', 'KEYWORD', 'SECRET', 'CIPHER', 'PUZZLE', 'QUANTUM'];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        ciphertext = checkerboardEncrypt(plaintext, keyword);
        if (keyword === '') {
            hint = 'Hint: This is a Polybius square cipher with standard alphabet (A=11, B=12, ...)';
            currentCipherInfo = 'Checkerboard cipher with standard alphabet';
        } else {
            hint = `Hint: This is a Polybius square cipher with keyword "${keyword}"`;
            currentCipherInfo = `Checkerboard cipher with keyword "${keyword}"`;
        }
    } else if (cipherType === 'nihilist') {
        // Random keywords
        const alphabetKeys = ['', 'ZEBRA', 'KEYWORD', 'SECRET'];
        const cipherKeys = ['KEY', 'CODE', 'MATH', 'SCIENCE', 'OLYMPIAD'];
        const alphabetKey = alphabetKeys[Math.floor(Math.random() * alphabetKeys.length)];
        const cipherKey = cipherKeys[Math.floor(Math.random() * cipherKeys.length)];
        ciphertext = nihilistEncrypt(plaintext, alphabetKey, cipherKey);
        hint = `Hint: This is a Nihilist cipher. Alphabet key: "${alphabetKey || 'standard'}", Cipher key: "${cipherKey}"`;
        currentCipherInfo = `Nihilist cipher with alphabet key="${alphabetKey || 'standard'}", cipher key="${cipherKey}"`;
    } else if (cipherType === 'columnar') {
        // Random keywords for columnar transposition
        const keywords = ['KEY', 'CODE', 'MATH', 'ZEBRA', 'SECRET', 'CIPHER'];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        ciphertext = columnarEncrypt(plaintext, keyword);
        hint = `Hint: This is a Complete Columnar Transposition cipher with keyword "${keyword}"`;
        currentCipherInfo = `Complete Columnar cipher with keyword "${keyword}"`;
    }

    // Store the answer and display the problem
    currentAnswer = plaintext;
    problemText.textContent = ciphertext;
    problemHint.textContent = hint;
    answerInput.value = '';
    resultDisplay.innerHTML = '';
}

function normalizeText(text) {
    // Remove spaces, convert to uppercase, keep only letters
    return text.toUpperCase().replace(/[^A-Z]/g, '');
}

function checkAnswer() {
    const userAnswer = normalizeText(answerInput.value);
    const correctAnswer = normalizeText(currentAnswer);

    if (!currentAnswer) {
        resultDisplay.innerHTML = '<div class="result-incorrect">Generate a problem first!</div>';
        return;
    }

    if (userAnswer === correctAnswer) {
        resultDisplay.innerHTML = '<div class="result-correct">Correct! Great job!</div>';
    } else {
        resultDisplay.innerHTML = '<div class="result-incorrect">Not quite. Try again or click "Show Answer".</div>';
    }
}

function showAnswer() {
    if (!currentAnswer) {
        resultDisplay.innerHTML = '<div class="result-incorrect">Generate a problem first!</div>';
        return;
    }

    resultDisplay.innerHTML =
        '<div class="result-correct">' +
        '<strong>Answer:</strong> ' + currentAnswer + '<br>' +
        '<strong>Cipher used:</strong> ' + currentCipherInfo +
        '</div>';
}

generateProblemBtn.addEventListener('click', generateProblem);
checkAnswerBtn.addEventListener('click', checkAnswer);
showAnswerBtn.addEventListener('click', showAnswer);
