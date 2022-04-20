
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




interface stats {
  gamesPlayed: number
  winPercentage: number
  currentStreak: number
  maxStreak: number
}

const input = prompt();

// this is how to read data from the files
const answers: string[] = readFileSync('../resources/answers.txt', 'utf-8').split("\n")
const words: string[] = readFileSync('../resources/allwords.txt', 'utf-8').split("\n")

// The list of attempts
let listAttempts: string[] = []


const randomNumberRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// generates the game answer
const answerToday = (): string => {
  return `${answers[randomNumberRange(0, 2314)].toUpperCase()}`
}

const generateKeys = (): string[] => [
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
]

let keys = generateKeys()

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


const hardMode = (): void => {
  console.log("You're starting this game in hard mode.")
  start()
}


const easyMode = (): void => {
  console.log("You're starting this game in easy mode.")
  const wordOfThisGame: string = answerToday()

  while (listAttempts.length < 6) {
    printAttempts(listAttempts)
    printKeyboard(keys)

    let userGuess = input("Enter your guess: ")

    if (wordIsValid(userGuess)) {
      console.log("user guess: " + userGuess + "\nword of this game: " + wordOfThisGame + "\n")
      let attempt: string = ""

      if (userGuess.toUpperCase() === wordOfThisGame) {
        attempt = checkLetters(userGuess.toUpperCase(), wordOfThisGame)
        listAttempts.push(attempt)
        console.log("\nCongratulations, you got it right")
        break
      }
      else {
        attempt = checkLetters(userGuess.toUpperCase(), wordOfThisGame)
        listAttempts.push(attempt)
      }
    }
    else
      console.log("Your word is not valid! Try again.")
  }
  reset()
  start()
}

const printAttempts = (listAttempts: string[]): void => {
  listAttempts.forEach(element => {
    console.log(element)
  });
}


const wordIsValid = (userGuess: string): boolean => {
  let validGuess: boolean = false

  if (words.includes(userGuess) && userGuess.length === 5)
    validGuess = true

  return validGuess
}


const printKeyboard = (keys: string[]): void => {
  console.log('\n|---|---|---|---|---|---|---|---|---|---|')
  console.log(`| ${keys[0]} | ${keys[1]} | ${keys[2]} | ${keys[3]} | ${keys[4]} | ${keys[5]} | ${keys[6]} | ${keys[7]} | ${keys[8]} | ${keys[9]} |`)
  console.log('|---|---|---|---|---|---|---|---|---|---|')
  console.log('|---|---|---|---|---|---|---|---|---|')
  console.log(`| ${keys[10]} | ${keys[11]} | ${keys[12]} | ${keys[13]} | ${keys[14]} | ${keys[15]} | ${keys[16]} | ${keys[17]} | ${keys[18]} |`)
  console.log('|---|---|---|---|---|---|---|---|---|')
  console.log('|---|---|---|---|---|---|---|')
  console.log(`| ${keys[19]} | ${keys[20]} | ${keys[21]} | ${keys[22]} | ${keys[23]} | ${keys[24]} | ${keys[0]} |`)
  console.log('|---|---|---|---|---|---|---|')
}


const reset = (): void => {
  listAttempts = []
  keys = generateKeys()
}


const printStats = (): void => {
  console.log("Printing some stats")
  start()
}

const checkLetters = (userGuess: string, wordOfThisGame: string): string => {
  let attempt: string = ""
  let letterColor: string = ""
  for (let i = 0; i < 5; i++) {
    let letterPosition = wordOfThisGame.indexOf(userGuess[i])
    if (letterPosition === -1) {
      updateKeys(userGuess[i], BgRed)
      letterColor = " " + Reset + userGuess[i] + Reset + " |"
    } else {
      if (userGuess[i] === wordOfThisGame[i]) {
        updateKeys(userGuess[i], BgGreen)
        letterColor = " " + BgGreen + userGuess[i] + Reset + " |"
      } else {
        updateKeys(userGuess[i], BgYellow)
        letterColor = " " + BgYellow + userGuess[i] + Reset + " |"
      }
    }
    attempt += letterColor
  }
  return attempt
}

const updateKeys = (character: string, color: string): void => {
  for (let i = 0; i < keys.length; i++) {
    if (character === keys[i])
      keys[i] = color + character + Reset
  }
}

const gameOptions = (chosenOption: string): void => {
  switch (chosenOption) {
    case 'QUIT':
      quit()
      break
    case 'HELP':
      help()
      break
    case 'HARD':
      hardMode()
      break
    case 'EASY':
      easyMode()
      break
    case 'STATS':
      printStats();
      break
    default:
      const inputNr: number = parseInt(chosenOption);
      if (isNaN(inputNr)) {
        console.log("Invalid input, type HELP for more information!\n");
      }
  }
}

const start = (): void => {
  console.log("\nWelcome to the wordle game.")
  console.log("Before proceeding read carefully the commands.\n")
  help()
  const chosenCmd = input("Now select a command to either play, read again the commands, print some stats or quit: ")
  gameOptions(chosenCmd)
}

start()
