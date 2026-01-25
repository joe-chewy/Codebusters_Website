// ===== CAESAR CIPHER =====

// Get references to HTML elements using their IDs
// document.getElementById() finds an element by its id attribute
const caesarInput = document.getElementById('caesar-input');
const caesarShift = document.getElementById('caesar-shift');
const caesarOutput = document.getElementById('caesar-output');
const caesarEncryptBtn = document.getElementById('caesar-encrypt');
const caesarDecryptBtn = document.getElementById('caesar-decrypt');

/**
 * Caesar cipher function
 * @param {string} text - The text to encrypt/decrypt
 * @param {number} shift - How many positions to shift (positive = encrypt, negative = decrypt)
 * @returns {string} - The transformed text
 */
function caesarCipher(text, shift) {
    // Normalize shift to be within 0-25
    shift = ((shift % 26) + 26) % 26;

    let result = '';

    // Loop through each character in the text
    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        // Check if it's an uppercase letter (A-Z)
        if (char >= 'A' && char <= 'Z') {
            // Get the character code (A=65, B=66, ..., Z=90)
            let code = char.charCodeAt(0);
            // Shift it: subtract 65 to get 0-25, add shift, mod 26 to wrap, add 65 back
            let shifted = ((code - 65 + shift) % 26) + 65;
            // Convert back to a character
            result += String.fromCharCode(shifted);
        }
        // Check if it's a lowercase letter (a-z)
        else if (char >= 'a' && char <= 'z') {
            let code = char.charCodeAt(0);
            // Same logic but with 97 (a=97)
            let shifted = ((code - 97 + shift) % 26) + 97;
            result += String.fromCharCode(shifted);
        }
        // Keep non-letters unchanged (spaces, numbers, punctuation)
        else {
            result += char;
        }
    }

    return result;
}

// Add click event listener to the Encrypt button
caesarEncryptBtn.addEventListener('click', function() {
    const text = caesarInput.value;
    const shift = parseInt(caesarShift.value);  // Convert string to number

    // Validate shift value
    if (isNaN(shift) || shift < 1 || shift > 25) {
        caesarOutput.textContent = 'Please enter a shift between 1 and 25';
        return;
    }

    const encrypted = caesarCipher(text, shift);
    caesarOutput.textContent = encrypted;
});

// Add click event listener to the Decrypt button
caesarDecryptBtn.addEventListener('click', function() {
    const text = caesarInput.value;
    const shift = parseInt(caesarShift.value);

    if (isNaN(shift) || shift < 1 || shift > 25) {
        caesarOutput.textContent = 'Please enter a shift between 1 and 25';
        return;
    }

    // Decrypting is just encrypting with the negative shift
    const decrypted = caesarCipher(text, -shift);
    caesarOutput.textContent = decrypted;
});


// ===== ATBASH CIPHER =====

const atbashInput = document.getElementById('atbash-input');
const atbashOutput = document.getElementById('atbash-output');
const atbashConvertBtn = document.getElementById('atbash-convert');

/**
 * Atbash cipher function
 * Reverses the alphabet: A<->Z, B<->Y, C<->X, etc.
 * @param {string} text - The text to convert
 * @returns {string} - The converted text
 */
function atbashCipher(text) {
    let result = '';

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (char >= 'A' && char <= 'Z') {
            // For uppercase: A(65) becomes Z(90), B(66) becomes Y(89), etc.
            // Formula: 90 - (code - 65) = 155 - code
            // Or equivalently: 'Z' - (char - 'A')
            let code = char.charCodeAt(0);
            let reversed = 90 - (code - 65);  // Same as 155 - code
            result += String.fromCharCode(reversed);
        }
        else if (char >= 'a' && char <= 'z') {
            // For lowercase: a(97) becomes z(122), etc.
            let code = char.charCodeAt(0);
            let reversed = 122 - (code - 97);  // Same as 219 - code
            result += String.fromCharCode(reversed);
        }
        else {
            result += char;
        }
    }

    return result;
}

// Add click event listener to the Convert button
atbashConvertBtn.addEventListener('click', function() {
    const text = atbashInput.value;
    const converted = atbashCipher(text);
    atbashOutput.textContent = converted;
});


// ===== AFFINE CIPHER =====

const affineInput = document.getElementById('affine-input');
const affineA = document.getElementById('affine-a');
const affineB = document.getElementById('affine-b');
const affineOutput = document.getElementById('affine-output');
const affineEncryptBtn = document.getElementById('affine-encrypt');
const affineDecryptBtn = document.getElementById('affine-decrypt');

function modInverse(a) {
    // Only these values of 'a' are valid (coprime with 26)
    const inverses = {
        1:1, 3: 9, 5: 21, 7: 15,
        9:3, 11: 19, 15: 7, 17: 23,
        19: 11, 21: 5, 23: 17, 25: 25
    };
    return inverses[a];
}

function affineEncrypt(text, a, b) {
    let result = '';

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (char >= 'A' && char <= 'Z') {
            let code = char.charCodeAt(0) - 65;
            let index = (a * code + b) % 26;
            result += String.fromCharCode(index + 65);
        }
        else if (char >= 'a' && char <= 'z') {
            let code = char.charCodeAt(0) - 97;
            let index = (a * code + b) % 26;  // Same as 219 - code
            result += String.fromCharCode(index + 97);
        }
        else {
            result += char;
        }
    }
    return result
}

function affineDecrypt(text, a, b) {
    let result = '';

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (char >= 'A' && char <= 'Z') {
            let code = char.charCodeAt(0) - 65;
            let index = modInverse(a) * (code - b + 26) % 26;
            result += String.fromCharCode(index + 65);
        }
        else if (char >= 'a' && char <= 'z') {
            let code = char.charCodeAt(0) - 97;
            let index = modInverse(a) * (code - b + 26) % 26;  
            result += String.fromCharCode(index + 97);
        }
        else {
            result += char;
        }
    }
    return result
}

// Add click event listener to the Encrypt button
affineEncryptBtn.addEventListener('click', function() {
    const text = affineInput.value;
    const a = parseInt(affineA.value);
    const b = parseInt(affineB.value);

    const encrypted = affineEncrypt(text, a, b);
    affineOutput.textContent = encrypted;
});

// Add click event listener to the Decrypt button
affineDecryptBtn.addEventListener('click', function() {
    const text = affineInput.value;
    const a = parseInt(affineA.value);
    const b = parseInt(affineB.value);

    const decrypted = affineDecrypt(text, a, b)
    affineOutput.textContent = decrypted;
});

// ===== CHECKERBOARD CIPHER (POLYBIUS SQUARE) =====

const checkerboardInput = document.getElementById('checkerboard-input');
const checkerboardKeyword = document.getElementById('checkerboard-keyword');
const checkerboardOutput = document.getElementById('checkerboard-output');
const checkerboardGrid = document.getElementById('checkerboard-grid');
const checkerboardEncryptBtn = document.getElementById('checkerboard-encrypt');
const checkerboardDecryptBtn = document.getElementById('checkerboard-decrypt');

/**
 * Creates a Polybius square alphabet from an optional keyword
 * @param {string} keyword - Optional keyword to scramble the alphabet
 * @returns {string} - 25 letter alphabet (I/J combined)
 */
function createPolybiusAlphabet(keyword = '') {
    // Remove non-letters and convert to uppercase
    keyword = keyword.toUpperCase().replace(/[^A-Z]/g, '');
    // Replace J with I
    keyword = keyword.replace(/J/g, 'I');

    // Build alphabet starting with keyword (no duplicates)
    let alphabet = '';
    let used = new Set();

    // Add keyword letters first
    for (let char of keyword) {
        if (!used.has(char)) {
            alphabet += char;
            used.add(char);
        }
    }

    // Add remaining letters (excluding J)
    for (let i = 0; i < 26; i++) {
        let char = String.fromCharCode(65 + i);
        if (char !== 'J' && !used.has(char)) {
            alphabet += char;
            used.add(char);
        }
    }

    return alphabet;
}

/**
 * Displays the Polybius square grid
 */
function displayPolybiusGrid(alphabet, elementId) {
    const gridElement = document.getElementById(elementId);
    let html = '<table class="polybius-table"><tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>';

    for (let row = 0; row < 5; row++) {
        html += `<tr><th>${row + 1}</th>`;
        for (let col = 0; col < 5; col++) {
            let char = alphabet[row * 5 + col];
            // Show I/J together
            if (char === 'I') char = 'I/J';
            html += `<td>${char}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    gridElement.innerHTML = html;
}

/**
 * Encrypts text using Polybius square (letters to numbers)
 */
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
        } else if (char === ' ') {
            result += '  '; // Double space for word separation
        }
    }

    return result.trim();
}

/**
 * Decrypts Polybius numbers back to letters
 */
function checkerboardDecrypt(text, keyword = '') {
    const alphabet = createPolybiusAlphabet(keyword);
    // Extract all two-digit numbers
    let numbers = text.match(/\d{2}/g) || [];
    let result = '';

    for (let num of numbers) {
        let row = parseInt(num[0]) - 1;
        let col = parseInt(num[1]) - 1;

        if (row >= 0 && row < 5 && col >= 0 && col < 5) {
            result += alphabet[row * 5 + col];
        }
    }

    return result;
}

checkerboardEncryptBtn.addEventListener('click', function() {
    const text = checkerboardInput.value;
    const keyword = checkerboardKeyword.value;
    const alphabet = createPolybiusAlphabet(keyword);

    displayPolybiusGrid(alphabet, 'checkerboard-grid');
    const encrypted = checkerboardEncrypt(text, keyword);
    checkerboardOutput.textContent = encrypted;
});

checkerboardDecryptBtn.addEventListener('click', function() {
    const text = checkerboardInput.value;
    const keyword = checkerboardKeyword.value;
    const alphabet = createPolybiusAlphabet(keyword);

    displayPolybiusGrid(alphabet, 'checkerboard-grid');
    const decrypted = checkerboardDecrypt(text, keyword);
    checkerboardOutput.textContent = decrypted;
});


// ===== NIHILIST SUBSTITUTION CIPHER =====

const nihilistInput = document.getElementById('nihilist-input');
const nihilistAlphabetKey = document.getElementById('nihilist-alphabet-key');
const nihilistCipherKey = document.getElementById('nihilist-cipher-key');
const nihilistOutput = document.getElementById('nihilist-output');
const nihilistGrid = document.getElementById('nihilist-grid');
const nihilistEncryptBtn = document.getElementById('nihilist-encrypt');
const nihilistDecryptBtn = document.getElementById('nihilist-decrypt');

/**
 * Converts a letter to its Polybius number using given alphabet
 */
function letterToPolybius(char, alphabet) {
    char = char.toUpperCase();
    if (char === 'J') char = 'I';

    let index = alphabet.indexOf(char);
    if (index === -1) return null;

    let row = Math.floor(index / 5) + 1;
    let col = (index % 5) + 1;
    return row * 10 + col;
}

/**
 * Converts a Polybius number to its letter using given alphabet
 */
function polybiusToLetter(num, alphabet) {
    let row = Math.floor(num / 10) - 1;
    let col = (num % 10) - 1;

    if (row >= 0 && row < 5 && col >= 0 && col < 5) {
        return alphabet[row * 5 + col];
    }
    return '';
}

/**
 * Encrypts using Nihilist cipher
 */
function nihilistEncrypt(text, alphabetKey, cipherKey) {
    const alphabet = createPolybiusAlphabet(alphabetKey);

    // Clean inputs
    text = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    cipherKey = cipherKey.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');

    if (cipherKey.length === 0) {
        return 'Please enter a cipher keyword';
    }

    // Convert cipher key to Polybius numbers
    let keyNumbers = [];
    for (let char of cipherKey) {
        keyNumbers.push(letterToPolybius(char, alphabet));
    }

    // Encrypt each character
    let result = [];
    for (let i = 0; i < text.length; i++) {
        let plainNum = letterToPolybius(text[i], alphabet);
        let keyNum = keyNumbers[i % keyNumbers.length];
        result.push(plainNum + keyNum);
    }

    return result.join(' ');
}

/**
 * Decrypts Nihilist cipher
 */
function nihilistDecrypt(text, alphabetKey, cipherKey) {
    const alphabet = createPolybiusAlphabet(alphabetKey);

    // Clean cipher key
    cipherKey = cipherKey.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');

    if (cipherKey.length === 0) {
        return 'Please enter a cipher keyword';
    }

    // Convert cipher key to Polybius numbers
    let keyNumbers = [];
    for (let char of cipherKey) {
        keyNumbers.push(letterToPolybius(char, alphabet));
    }

    // Extract numbers from ciphertext
    let numbers = text.match(/\d+/g) || [];

    // Decrypt each number
    let result = '';
    for (let i = 0; i < numbers.length; i++) {
        let cipherNum = parseInt(numbers[i]);
        let keyNum = keyNumbers[i % keyNumbers.length];
        let plainNum = cipherNum - keyNum;
        result += polybiusToLetter(plainNum, alphabet);
    }

    return result;
}

nihilistEncryptBtn.addEventListener('click', function() {
    const text = nihilistInput.value;
    const alphabetKey = nihilistAlphabetKey.value;
    const cipherKey = nihilistCipherKey.value;
    const alphabet = createPolybiusAlphabet(alphabetKey);

    displayPolybiusGrid(alphabet, 'nihilist-grid');
    const encrypted = nihilistEncrypt(text, alphabetKey, cipherKey);
    nihilistOutput.textContent = encrypted;
});

nihilistDecryptBtn.addEventListener('click', function() {
    const text = nihilistInput.value;
    const alphabetKey = nihilistAlphabetKey.value;
    const cipherKey = nihilistCipherKey.value;
    const alphabet = createPolybiusAlphabet(alphabetKey);

    displayPolybiusGrid(alphabet, 'nihilist-grid');
    const decrypted = nihilistDecrypt(text, alphabetKey, cipherKey);
    nihilistOutput.textContent = decrypted;
});


// ===== COMPLETE COLUMNAR TRANSPOSITION CIPHER =====

const columnarInput = document.getElementById('columnar-input');
const columnarKeyword = document.getElementById('columnar-keyword');
const columnarOutput = document.getElementById('columnar-output');
const columnarGrid = document.getElementById('columnar-grid');
const columnarEncryptBtn = document.getElementById('columnar-encrypt');
const columnarDecryptBtn = document.getElementById('columnar-decrypt');

/**
 * Gets the column order based on keyword alphabetical sorting
 * @param {string} keyword - The keyword
 * @returns {number[]} - Array of column indices in read order
 */
function getColumnOrder(keyword) {
    keyword = keyword.toUpperCase();

    // Create array of [letter, original index] pairs
    let pairs = [];
    for (let i = 0; i < keyword.length; i++) {
        pairs.push([keyword[i], i]);
    }

    // Sort alphabetically (stable sort for duplicate letters)
    pairs.sort((a, b) => {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return a[1] - b[1]; // For same letters, maintain original order
    });

    // Return the original indices in sorted order
    return pairs.map(p => p[1]);
}

/**
 * Displays the columnar grid
 */
function displayColumnarGrid(keyword, grid, order) {
    const gridElement = document.getElementById('columnar-grid');
    keyword = keyword.toUpperCase();

    // Create numbered order for display
    let orderNumbers = new Array(keyword.length);
    for (let i = 0; i < order.length; i++) {
        orderNumbers[order[i]] = i + 1;
    }

    let html = '<table class="columnar-table">';

    // Header row with keyword letters
    html += '<tr>';
    for (let i = 0; i < keyword.length; i++) {
        html += `<th>${keyword[i]}<br><small>(${orderNumbers[i]})</small></th>`;
    }
    html += '</tr>';

    // Data rows
    for (let row of grid) {
        html += '<tr>';
        for (let cell of row) {
            html += `<td>${cell}</td>`;
        }
        html += '</tr>';
    }

    html += '</table>';
    gridElement.innerHTML = html;
}

/**
 * Encrypts using Complete Columnar Transposition
 */
function columnarEncrypt(text, keyword) {
    keyword = keyword.toUpperCase().replace(/[^A-Z]/g, '');
    if (keyword.length === 0) {
        return 'Please enter a keyword';
    }

    // Clean text - remove non-letters and convert to uppercase
    text = text.toUpperCase().replace(/[^A-Z]/g, '');

    if (text.length === 0) {
        return 'Please enter some text';
    }

    let numCols = keyword.length;
    let numRows = Math.ceil(text.length / numCols);

    // Pad with X to fill the grid
    while (text.length < numRows * numCols) {
        text += 'X';
    }

    // Fill grid row by row
    let grid = [];
    for (let r = 0; r < numRows; r++) {
        let row = [];
        for (let c = 0; c < numCols; c++) {
            row.push(text[r * numCols + c]);
        }
        grid.push(row);
    }

    // Get column read order
    let order = getColumnOrder(keyword);

    // Display the grid
    displayColumnarGrid(keyword, grid, order);

    // Read columns in order
    let result = '';
    for (let colIndex of order) {
        for (let r = 0; r < numRows; r++) {
            result += grid[r][colIndex];
        }
        result += ' '; // Space between column groups
    }

    return result.trim();
}

/**
 * Decrypts Complete Columnar Transposition
 */
function columnarDecrypt(text, keyword) {
    keyword = keyword.toUpperCase().replace(/[^A-Z]/g, '');
    if (keyword.length === 0) {
        return 'Please enter a keyword';
    }

    // Clean text
    text = text.toUpperCase().replace(/[^A-Z]/g, '');

    if (text.length === 0) {
        return 'Please enter some text';
    }

    let numCols = keyword.length;
    let numRows = Math.ceil(text.length / numCols);

    // Get column read order
    let order = getColumnOrder(keyword);

    // Create empty grid
    let grid = [];
    for (let r = 0; r < numRows; r++) {
        grid.push(new Array(numCols).fill(''));
    }

    // Fill columns in order
    let textIndex = 0;
    for (let colIndex of order) {
        for (let r = 0; r < numRows; r++) {
            if (textIndex < text.length) {
                grid[r][colIndex] = text[textIndex];
                textIndex++;
            }
        }
    }

    // Display the grid
    displayColumnarGrid(keyword, grid, order);

    // Read row by row
    let result = '';
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            result += grid[r][c];
        }
    }

    return result;
}

columnarEncryptBtn.addEventListener('click', function() {
    const text = columnarInput.value;
    const keyword = columnarKeyword.value;
    const encrypted = columnarEncrypt(text, keyword);
    columnarOutput.textContent = encrypted;
});

columnarDecryptBtn.addEventListener('click', function() {
    const text = columnarInput.value;
    const keyword = columnarKeyword.value;
    const decrypted = columnarDecrypt(text, keyword);
    columnarOutput.textContent = decrypted;
});


// ===== HELPFUL TIP =====
// To add more ciphers:
// 1. Add a new <section> in index.html with input/output elements
// 2. Create a new cipher function here in script.js
// 3. Get references to your new HTML elements with getElementById()
// 4. Add event listeners to your buttons
