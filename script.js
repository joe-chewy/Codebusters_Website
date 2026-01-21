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


// ===== HELPFUL TIP =====
// To add more ciphers:
// 1. Add a new <section> in index.html with input/output elements
// 2. Create a new cipher function here in script.js
// 3. Get references to your new HTML elements with getElementById()
// 4. Add event listeners to your buttons
