const letterMatchRegex = /\w/g;

function processCurrentWord(currentWord, wordFrequency, result) {
    if (currentWord.length > 0 && currentWord.match(letterMatchRegex)) {
        if (!wordFrequency[currentWord]) {
            wordFrequency[currentWord] = 0;
        }
        wordFrequency[currentWord]++;
        result.numberOfWords++;
    }

    return '';
}

function processCurrentLines(lines, letterFrequency, wordFrequency, result) {
    // iterate through each line of current buffer
    for (const line of lines) {

        let currentWord = '';
        // iterate through each char of a line: 
        /**
         * each char is categorized into types
         * based on these constraints, we can change the logic accordingly
         * type 1: letters: an alphabet (a-zA-Z) or a number 
         * type 2: word:  a set of characters (may include numbers too) separated by whitespaces and symbols ('_', '-' are not word breakers)
         * type 3: symbol: which is not an alphabet, not a number
         */
        for (const char of line.toLowerCase()) {
            if (char.match(letterMatchRegex)) {
                result.numbersOfLetters++;
                if (!letterFrequency[char]) {
                    letterFrequency[char] = 0;
                }
                letterFrequency[char]++;

                currentWord += char;
            } else if (char.match(/\s/)) { // white space character
                currentWord = processCurrentWord(currentWord, wordFrequency, result);
            } else { // considered as symbols
                result.numberOfSymbols++;
                if (char != '_' && char != '-') { // underscore considered a symbol but not a wordbreak
                    currentWord = processCurrentWord(currentWord, wordFrequency, result);
                } else {
                    currentWord += char;
                }
            }
        }
        // end of every line, process existing current word
        currentWord = processCurrentWord(currentWord, wordFrequency, result);
    }
}
module.exports.processCurrentLines = processCurrentLines;

async function processTextFile(fileStream, callback) {
    return new Promise((resolve, reject) => {
        try {
            // initialize required variables 
            const result = {
                numberOfWords: 0,
                numbersOfLetters: 0,
                numberOfSymbols: 0,
                topCommonWords: [],
                topCommonLetter: []
            }
            const letterFrequency = {};
            const wordFrequency = {};
            let remainder = '';

            fileStream.on('data', (chunk) => {
                const lines = (remainder + chunk).split(/\r?\n/g);
                processCurrentLines(lines, letterFrequency, wordFrequency, result);
            });

            fileStream.on('close', () => {
                // sort descending frequencies to find top three
                const sortedWordFrequency = Object.entries(wordFrequency).sort((a, b) => b[1] - a[1]);
                sortedWordFrequency.slice(0, 3).forEach((item) => {
                    result.topCommonWords.push(item[0]);
                });

                const sortedLetterFrequency = Object.entries(letterFrequency).sort((a, b) => b[1] - a[1]);
                sortedLetterFrequency.slice(0, 3).forEach((item) => {
                    result.topCommonLetter.push(item[0]);
                });

                resolve(result);
            });

        } catch (err) {
            reject(err);
        }
    });
}
module.exports.processTextFile = processTextFile;

module.exports.fileUploadHandler = async (req, res, next) => {
    try {
        const result = await processTextFile(req.file);
        return res.send(result)
    } catch (err) {
        return next(err);
    }
};