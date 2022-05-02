// these are the two libraries we need
import prompt from 'prompt-sync'
import { readFileSync } from 'fs'
import { exit } from "process"


// these are some codes to get the console to print in colors
// see examples below
const Reset = "\x1b[0m"
const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"

// this is how to read data from the files
const answers: string[] = readFileSync('../resources/answers.txt', 'utf-8').split("\n")
const words: string[] = readFileSync('../resources/allwords.txt', 'utf-8').split("\n")

const input = prompt();


interface key {
    character: string
    color: string
}


const randomNumberRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// generates the game answer
const answerToday = (): string => {
    return `${answers[randomNumberRange(0, 2314)].toUpperCase()}`
}


const quit = (): void => {
    exit(0)
}

const help = (): void => {
    console.log(
        'QUIT -> exit the game' +
        '\nHELP -> print the list of commands and their description' +
        '\nHARD -> restart a game,in hard mode' +
        '\nEASY -> restart a game,in normal mode' +
        '\nSTAT -> print some statistics. After each game,the program record show many guesses you took to solve the game.' +
        '\nThese statistics are printed out with this command. The statistics are reset if you quit the game\n')
}


// Initializes the interaction with the user.
const start = (): void => {
    let chosenCmd = ""
    const results: boolean[] = []
    console.log("\nWelcome to the wordle game.")
    console.log("Before proceeding read carefully the commands.\n")
    help()
    while (chosenCmd !== 'QUIT') {
        chosenCmd = input("Now select a command to either play, read again the commands, print some stats or quit: ")
        gameOptions(chosenCmd, results)
    }
}

// validates user's guesses
const wordIsValid = (userGuess: string): boolean => {
    let validGuess: boolean = false

    if (words.includes(userGuess) && userGuess.length === 5)
        validGuess = true

    return validGuess
}



const easyMode = (): boolean => {
    console.log("\nYou're starting this game in easy mode.")
    const wordOfThisGame: string = answerToday()
    let gameKeys: key[] = []
    let listAttempts: string[][] = []
    let statusGame: boolean = false

    while (listAttempts.length < 6) {

        let userGuess: string = input("Enter your guess: ")
        if (wordIsValid(userGuess)) {
            console.log("user guess: " + userGuess + "\nword of this game: " + wordOfThisGame + "\n")

            let attempt: key[] = []

            if (userGuess.toUpperCase() === wordOfThisGame) {

                attempt = checkLetters(userGuess.toUpperCase(), wordOfThisGame)
                gameKeys = getValidKeys(attempt, gameKeys)
                listAttempts = pushAttempt(attempt, listAttempts)

                console.log(`\n${BgGreen} CONGRATULATIONS. YOU GOT IT RIGHT! ${Reset}`)
                statusGame = true
                return statusGame
            }
            else {
                attempt = checkLetters(userGuess.toUpperCase(), wordOfThisGame)
                gameKeys = getValidKeys(attempt, gameKeys)
                listAttempts = pushAttempt(attempt, listAttempts)
            }
            printAttempts(listAttempts)
            printKeyboard(renderKeyboard(gameKeys))
        }
        else
            console.log("Your word is not valid! Try again.")
    }
    console.log(`\n${BgRed} I'M SORRY. YOU LOST. ${Reset}`)
    return statusGame;
}

// works like the easy mode but it also checks if the user uses valid letters after the first attempt.
const hardMode = (): boolean => {
    console.log("\nYou're starting this game in easy mode.")
    const wordOfThisGame: string = answerToday()
    let gameKeys: key[] = []
    let listAttempts: string[][] = []
    let statusGame: boolean = false
    let keysToReuse: string[] = []

    while (listAttempts.length < 6) {

        let userGuess: string = input("Enter your guess: ")
        if (wordIsValid(userGuess)) {
            console.log("user guess: " + userGuess + "\nword of this game: " + wordOfThisGame + "\n")

            let attempt: key[] = []

            if (userGuess.toUpperCase() === wordOfThisGame) {

                attempt = doubleCheckLetters(userGuess.toUpperCase(), wordOfThisGame, keysToReuse)
                gameKeys = getValidKeys(attempt, gameKeys)
                listAttempts = pushAttempt(attempt, listAttempts)

                console.log(`\n${BgGreen} CONGRATULATIONS. YOU GOT IT RIGHT! ${Reset}`)
                statusGame = true
                return statusGame
            }
            else {
                attempt = doubleCheckLetters(userGuess.toUpperCase(), wordOfThisGame, keysToReuse)
                gameKeys = getValidKeys(attempt, gameKeys)
                listAttempts = pushAttempt(attempt, listAttempts)
            }
            printAttempts(listAttempts)
            printKeyboard(renderKeyboard(gameKeys))
        }
        else
            console.log("Your word is not valid! Try again.")
    }
    console.log(`\n${BgRed} I'M SORRY. YOU LOST. ${Reset}`)
    return statusGame;
}


// returns the keys to render
const getValidKeys = (attempt: key[], gameKeys: key[]): key[] => {
    let validKeys: key[] = attempt.filter(key => !isPresent(gameKeys, key) || key.color === BgGreen + " " + key.character + " " + Reset)
    validKeys.forEach(key => gameKeys.push(key))
    return gameKeys
}

const isPresent = (arr: key[], k: key): boolean => {
    return arr.some(key => key.character === k.character)
}

const printAttempts = (listAttempts: string[][]): void => {
    listAttempts.forEach(element => {
        console.log(renderAttempt(element))
    });
}

const printKeyboard = (keyboard: string): void => {
    console.log(keyboard)
}

// renders to keyboard
const renderKeyboard = (keys: key[]): string => {
    let keyboard: string = `
    |---|---|---|---|---|---|---|---|---|---|
    | Q | W | E | R | T | Y | U | I | O | P |
    |---|---|---|---|---|---|---|---|---|---|
    | A | S | D | F | G | H | J | K | L |
    |---|---|---|---|---|---|---|---|---|
    | Z | X | C | V | B | N | M |
    |---|---|---|---|---|---|---|
    `
    keys.forEach(key => keyboard = keyboard.replace(" " + key.character + " ", key.color))

    return keyboard
}

const renderAttempt = (attempt: string[]): string => {
    return ` ${attempt[0]} | ${attempt[1]} | ${attempt[2]} | ${attempt[3]} | ${attempt[4]} `
}

const pushAttempt = (attempt: key[], attempts: string[][]): string[][] => {
    const attemptColor: string[] = attempt.map(key => key.color)
    return [...attempts, attemptColor]
}

// checks if the letter like the the normal version of wordle.
const checkLetters = (userGuess: string, wordOfThisGame: string): key[] => {
    const keys: key[] = []
    for (let i = 0; i < 5; i++) {
        let letterPosition = wordOfThisGame.indexOf(userGuess[i])
        if (letterPosition === -1) {
            keys.push({ character: userGuess[i], color: BgRed + " " + userGuess[i] + " " + Reset })
        } else {
            if (userGuess[i] === wordOfThisGame[i]) {
                keys.push({ character: userGuess[i], color: BgGreen + " " + userGuess[i] + " " + Reset })

            } else {
                keys.push({ character: userGuess[i], color: BgYellow + " " + userGuess[i] + " " + Reset })
            }
        }
    }
    return keys
}

// This methods checks the letter like the checkLetters() method.
// Moreover, after the first attempt it checks if the letter used for this attempt
// are valid, which means that user reused the yellow/green letters of the previous attempt.
const doubleCheckLetters = (userGuess: string, wordOfThisGame: string, keysToReuse: string[]): key[] => {
    const keys: key[] = []
    const copyToReuse: string[] = [... keysToReuse]
    console.log(copyToReuse)

    for (let i = 0; i < 5; i++) {
        let letterPosition = wordOfThisGame.indexOf(userGuess[i])
        if (letterPosition === -1) {
            keys.push({ character: userGuess[i], color: BgRed + " " + userGuess[i] + " " + Reset })
        } else {
            if (userGuess[i] === wordOfThisGame[i]) {
                if(keysToReuse.includes(userGuess[i]))
                {
                    let index: number = copyToReuse.indexOf(userGuess[i])
                    copyToReuse.splice(index, 1)
                }
                else{
                    keysToReuse.push(userGuess[i])
                }
                keys.push({ character: userGuess[i], color: BgGreen + " " + userGuess[i] + " " + Reset })
                
            } else {
                if(keysToReuse.includes(userGuess[i]))
                {
                    let index: number = copyToReuse.indexOf(userGuess[i])
                    copyToReuse.splice(index, 1)
                }
                else{
                    keysToReuse.push(userGuess[i])
                }
                keys.push({ character: userGuess[i], color: BgYellow + " " + userGuess[i] + " " + Reset })
            }
        }
    }
    console.log(copyToReuse)

    if(copyToReuse.length != 0){
        console.log("You wasted an attempt. Reuse the yellow or green letters.")
    }

    return keys
}




const gameOptions = (chosenOption: string, results: boolean[]): void => {
    switch (chosenOption) {
        case 'QUIT' || 'quit':
            quit()
            break
        case 'HELP' || 'help':
            help()
            break
        case 'EASY' || 'help':
            results.push(easyMode())
            break
        case 'HARD':
            results.push(hardMode())
            break
        case 'STAT' || 'stat':
            printStats(results)
        default:
            const inputNr: number = parseInt(chosenOption);
            if (isNaN(inputNr)) {
                console.log("Invalid input, type HELP for more information!\n");
            }
    }
}

// game stats
const printStats = (results: boolean[]): void => {
    console.log(`
    You played ${results.length} times
    You won ${results.filter(elem => elem === true).length} times
    You lost ${results.filter(elem => elem === false).length} times
    Winning rate ${results.filter(elem => elem === true).length / results.length * 100}%\n`)
    start()
}

start()




