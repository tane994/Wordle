"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// these are the two libraries we need
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const fs_1 = require("fs");
const process_1 = require("process");
// these are some codes to get the console to print in colors
// see examples below
const Reset = "\x1b[0m";
const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";
const input = (0, prompt_sync_1.default)();
// this is how to read data from the files
const answers = (0, fs_1.readFileSync)('../resources/answers.txt', 'utf-8').split("\n");
const words = (0, fs_1.readFileSync)('../resources/allwords.txt', 'utf-8').split("\n");
// The list of attempts
let listAttempts = [];
const randomNumberRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
// generates the game answer
const answerToday = () => {
    return `${answers[randomNumberRange(0, 2314)].toUpperCase()}`;
};
const generateKeys = () => [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M"
];
let keys = generateKeys();
const quit = () => {
    (0, process_1.exit)(0);
};
const help = () => {
    console.log('QUIT -> exit the game' +
        '\nHELP -> print the list of commands and their description' +
        '\nHARD -> restart a game,in hard mode' +
        '\nEASY -> restart a game,in normal mode' +
        '\nSTAT -> print some statistics. After each game,the program record show many guesses you took to solve the game.' +
        '\nThese statistics are printed out with this command. The statistics are reset if you quit the game\n');
};
const hardMode = () => {
    console.log("You're starting this game in hard mode.");
    start();
};
const easyMode = () => {
    console.log("You're starting this game in easy mode.");
    const wordOfThisGame = answerToday();
    while (listAttempts.length < 6) {
        printAttempts(listAttempts);
        printKeyboard(keys);
        let userGuess = input("Enter your guess: ");
        if (wordIsValid(userGuess)) {
            console.log("user guess: " + userGuess + "\nword of this game: " + wordOfThisGame + "\n");
            let attempt = "";
            if (userGuess.toUpperCase() === wordOfThisGame) {
                attempt = checkLetters(userGuess.toUpperCase(), wordOfThisGame);
                listAttempts.push(attempt);
                console.log("\nCongratulations, you got it right");
                break;
            }
            else {
                attempt = checkLetters(userGuess.toUpperCase(), wordOfThisGame);
                listAttempts.push(attempt);
            }
        }
        else
            console.log("Your word is not valid! Try again.");
    }
    reset();
    start();
};
const printAttempts = (listAttempts) => {
    listAttempts.forEach(element => {
        console.log(element);
    });
};
const wordIsValid = (userGuess) => {
    let validGuess = false;
    if (words.includes(userGuess) && userGuess.length === 5)
        validGuess = true;
    return validGuess;
};
const printKeyboard = (keys) => {
    console.log('\n|---|---|---|---|---|---|---|---|---|---|');
    console.log(`| ${keys[0]} | ${keys[1]} | ${keys[2]} | ${keys[3]} | ${keys[4]} | ${keys[5]} | ${keys[6]} | ${keys[7]} | ${keys[8]} | ${keys[9]} |`);
    console.log('|---|---|---|---|---|---|---|---|---|---|');
    console.log('|---|---|---|---|---|---|---|---|---|');
    console.log(`| ${keys[10]} | ${keys[11]} | ${keys[12]} | ${keys[13]} | ${keys[14]} | ${keys[15]} | ${keys[16]} | ${keys[17]} | ${keys[18]} |`);
    console.log('|---|---|---|---|---|---|---|---|---|');
    console.log('|---|---|---|---|---|---|---|');
    console.log(`| ${keys[19]} | ${keys[20]} | ${keys[21]} | ${keys[22]} | ${keys[23]} | ${keys[24]} | ${keys[0]} |`);
    console.log('|---|---|---|---|---|---|---|');
};
const reset = () => {
    listAttempts = [];
    keys = generateKeys();
};
const printStats = () => {
    console.log("Printing some stats");
    start();
};
const checkLetters = (userGuess, wordOfThisGame) => {
    let attempt = "";
    let letterColor = "";
    for (let i = 0; i < 5; i++) {
        let letterPosition = wordOfThisGame.indexOf(userGuess[i]);
        if (letterPosition === -1) {
            updateKeys(userGuess[i], BgRed);
            letterColor = " " + Reset + userGuess[i] + Reset + " |";
        }
        else {
            if (userGuess[i] === wordOfThisGame[i]) {
                updateKeys(userGuess[i], BgGreen);
                letterColor = " " + BgGreen + userGuess[i] + Reset + " |";
            }
            else {
                updateKeys(userGuess[i], BgYellow);
                letterColor = " " + BgYellow + userGuess[i] + Reset + " |";
            }
        }
        attempt += letterColor;
    }
    return attempt;
};
const updateKeys = (character, color) => {
    for (let i = 0; i < keys.length; i++) {
        if (character === keys[i])
            keys[i] = color + character + Reset;
    }
};
const gameOptions = (chosenOption) => {
    switch (chosenOption) {
        case 'QUIT':
            quit();
            break;
        case 'HELP':
            help();
            break;
        case 'HARD':
            hardMode();
            break;
        case 'EASY':
            easyMode();
            break;
        case 'STATS':
            printStats();
            break;
        default:
            const inputNr = parseInt(chosenOption);
            if (isNaN(inputNr)) {
                console.log("Invalid input, type HELP for more information!\n");
            }
    }
};
const start = () => {
    console.log("\nWelcome to the wordle game.");
    console.log("Before proceeding read carefully the commands.\n");
    help();
    const chosenCmd = input("Now select a command to either play, read again the commands, print some stats or quit: ");
    gameOptions(chosenCmd);
};
start();
