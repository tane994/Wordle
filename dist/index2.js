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
// this is how to read data from the files
const answers = (0, fs_1.readFileSync)('../resources/answers.txt', 'utf-8').split("\n");
const words = (0, fs_1.readFileSync)('../resources/allwords.txt', 'utf-8').split("\n");
const input = (0, prompt_sync_1.default)();
const randomNumberRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
// generates the game answer
const answerToday = () => {
    return `${answers[randomNumberRange(0, 2314)].toUpperCase()}`;
};
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
const start = () => {
    let chosenCmd = "";
    const results = [];
    console.log("\nWelcome to the wordle game.");
    console.log("Before proceeding read carefully the commands.\n");
    help();
    while (chosenCmd !== 'QUIT') {
        chosenCmd = input("Now select a command to either play, read again the commands, print some stats or quit: ");
        gameOptions(chosenCmd, results);
    }
};
const wordIsValid = (userGuess) => {
    let validGuess = false;
    if (words.includes(userGuess) && userGuess.length === 5)
        validGuess = true;
    return validGuess;
};
const easyMode = () => {
    console.log("\nYou're starting this game in easy mode.");
    const wordOfThisGame = answerToday();
    let gameKeys = [];
    let listAttempts = [];
    let statusGame = false;
    while (listAttempts.length < 6) {
        let userGuess = input("Enter your guess: ");
        if (wordIsValid(userGuess)) {
            console.log("user guess: " + userGuess + "\nword of this game: " + wordOfThisGame + "\n");
            let attempt = [];
            if (userGuess.toUpperCase() === wordOfThisGame) {
                attempt = checkLetters(userGuess.toUpperCase(), wordOfThisGame);
                gameKeys = getValidKeys(attempt, gameKeys);
                listAttempts = pushAttempt(attempt, listAttempts);
                console.log(`\n${BgGreen} CONGRATULATIONS. YOU GOT IT RIGHT! ${Reset}`);
                statusGame = true;
                return statusGame;
            }
            else {
                attempt = checkLetters(userGuess.toUpperCase(), wordOfThisGame);
                gameKeys = getValidKeys(attempt, gameKeys);
                listAttempts = pushAttempt(attempt, listAttempts);
            }
            printAttempts(listAttempts);
            printKeyboard(renderKeyboard(gameKeys));
        }
        else
            console.log("Your word is not valid! Try again.");
    }
    console.log(`\n${BgRed} I'M SORRY. YOU LOST. ${Reset}`);
    return statusGame;
};
const getValidKeys = (attempt, gameKeys) => {
    let validKeys = attempt.filter(key => !isPresent(gameKeys, key) || key.color === BgGreen + " " + key.character + " " + Reset);
    validKeys.forEach(key => gameKeys.push(key));
    return gameKeys;
};
const isPresent = (arr, k) => {
    return arr.some(key => key.character === k.character);
};
const printAttempts = (listAttempts) => {
    listAttempts.forEach(element => {
        console.log(renderAttempt(element));
    });
};
const printKeyboard = (keyboard) => {
    console.log(keyboard);
};
const renderKeyboard = (keys) => {
    let keyboard = `
    |---|---|---|---|---|---|---|---|---|---|
    | Q | W | E | R | T | Y | U | I | O | P |
    |---|---|---|---|---|---|---|---|---|---|
    | A | S | D | F | G | H | J | K | L |
    |---|---|---|---|---|---|---|---|---|
    | Z | X | C | V | B | N | M |
    |---|---|---|---|---|---|---|
    `;
    keys.forEach(key => keyboard = keyboard.replace(" " + key.character + " ", key.color));
    return keyboard;
};
const renderAttempt = (attempt) => {
    return ` ${attempt[0]} | ${attempt[1]} | ${attempt[2]} | ${attempt[3]} | ${attempt[4]} `;
};
const pushAttempt = (attempt, attempts) => {
    const attemptColor = attempt.map(key => key.color);
    return [...attempts, attemptColor];
};
const checkLetters = (userGuess, wordOfThisGame) => {
    const keys = [];
    for (let i = 0; i < 5; i++) {
        let letterPosition = wordOfThisGame.indexOf(userGuess[i]);
        if (letterPosition === -1) {
            keys.push({ character: userGuess[i], color: BgRed + " " + userGuess[i] + " " + Reset });
        }
        else {
            if (userGuess[i] === wordOfThisGame[i]) {
                keys.push({ character: userGuess[i], color: BgGreen + " " + userGuess[i] + " " + Reset });
            }
            else {
                keys.push({ character: userGuess[i], color: BgYellow + " " + userGuess[i] + " " + Reset });
            }
        }
    }
    return keys;
};
const gameOptions = (chosenOption, results) => {
    switch (chosenOption) {
        case 'QUIT' || 'quit':
            quit();
            break;
        case 'HELP' || 'help':
            help();
            break;
        case 'EASY' || 'help':
            results.push(easyMode());
            break;
        case 'STAT' || 'stat':
            printStats(results);
        default:
            const inputNr = parseInt(chosenOption);
            if (isNaN(inputNr)) {
                console.log("Invalid input, type HELP for more information!\n");
            }
    }
};
const printStats = (results) => {
    console.log(`
    You played ${results.length} times
    You won ${results.filter(elem => elem === true).length} times
    You lost ${results.filter(elem => elem === false).length} times
    Winning rate ${results.filter(elem => elem === true).length / results.length * 100}%\n`);
    start();
};
start();
