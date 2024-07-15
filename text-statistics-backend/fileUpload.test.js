const fs = require('fs');
const request = require('supertest');
const app = require('./index');
const { processTextFile, processCurrentLines } = require('./fileUploadHandler');

// API validation test cases
test('Should return 500 on empty request post', async () => {
    await request(app).post('/upload').expect(500);
});

test('Should return 500 on unsupported file types', async () => {
    const filePath = `${__dirname}/testData/unsupported.pdf`;
    await request(app)
        .post('/upload')
        .attach('file', filePath)
        .expect(500);
});

test('Should return 500 on uncorrect form field attachment', async () => {
    const filePath = `${__dirname}/testData/supported.txt`;
    await request(app)
        .post('/upload')
        .attach('wrongfield', filePath)
        .expect(500);
});

test('Should return 200 on attaching a text file', async () => {
    const filePath = `${__dirname}/testData/supported.txt`;
    const result = await request(app)
        .post('/upload')
        .attach('file', filePath)
        .expect(200);

    expect(result).toBeDefined();
    expect(result).toBeDefined();
});


// file computation test cases
test('processTextFile function should return result with text statistics', async () => {
    const filePath = `${__dirname}/testData/supported.txt`;
    const fileStream = fs.createReadStream(filePath);
    const result = await processTextFile(fileStream);
    expect(result).toBeDefined();
    expect(result.numberOfSymbols).toBeDefined();
    expect(result.numberOfWords).toBeDefined();
    expect(result.numbersOfLetters).toBeDefined();
    expect(result.topCommonLetter).toBeDefined();
    expect(result.topCommonWords).toBeDefined();
});

test('processCurrentLine function should update statistics for every line', async () => {
    const result = {
        numberOfWords: 0,
        numbersOfLetters: 0,
        numberOfSymbols: 0,
        topCommonWords: [],
        topCommonLetter: []
    }
    const letterFrequency = {};
    const wordFrequency = {};
    const lines = ["1one 1one two three four.", "aaa"];
    processCurrentLines(lines, letterFrequency, wordFrequency, result);

    expect(result).toBeDefined();
    expect(result.numberOfWords).toBe(6);
    expect(result.numberOfSymbols).toBe(1);
    expect(result.numbersOfLetters).toBe(23); // both alphabet and numbers are considered
});