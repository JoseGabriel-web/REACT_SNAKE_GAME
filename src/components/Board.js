import React, { useState, useEffect } from "react"
import { useInterval } from "../useInterval"

const Board = () => {
  const BOARD_SIZE = 10
  const initialBoard = []

  for (let i = 0; i < BOARD_SIZE; i++) {
    initialBoard.push([])
    for (let k = 0; k < BOARD_SIZE; k++) {
      initialBoard[i][k] = "BLANK"
    }
  }
  const getRandomNumber = () => Math.floor(Math.random() * (BOARD_SIZE - 2) + 1)
  const getRandomPosition = () => {
    return { x: getRandomNumber(), y: getRandomNumber() }
  }
  const [board, setBoard] = useState(initialBoard)
  const [snake, setSnake] = useState([getRandomPosition()])
  const [food, setFood] = useState([getRandomPosition()])
  const [direction, setDirection] = useState("RIGHT")
  const [delay, setDelay] = useState(null)
  const [alert, setAlert] = useState("")
  const [score, setScore] = useState(0)
  const [blocked, setBlocked] = useState(0)

  const displaySnake = () => {
    let boardWithSnake = initialBoard
    boardWithSnake[food[0].x][food[0].y] = "FOOD"
    snake.forEach((tile) => {
      if (
        boardWithSnake[tile.x] &&
        tile.x >= 0 &&
        tile.x <= 10 &&
        tile.y >= 0 &&
        tile.y <= 10
      ) {
        if (
          boardWithSnake[tile.x] &&
          boardWithSnake[tile.x][tile.y] === "FOOD"
        ) {
          handleFoodEaten(boardWithSnake)
        }
        boardWithSnake[tile.x][tile.y] = "SNAKE"
      } else {
        setAlert("You Lose!, Reset and Start again.")
        return
      }
    })
    setBoard(boardWithSnake)
  }

  const handleFoodEaten = (boardWithSnake) => {
    console.log("Food eaten")
    setFood([getRandomPosition()])
    boardWithSnake[food[0].x][food[0].y] = "FOOD"
    setDelay(delay - 10)
    setScore(score + 1)
    return boardWithSnake
  }

  const moveSnake = () => {
    if(blocked) return
    let newSnake = []

    if (direction === "UP" && snake[0] && snake[0].x - 1 > -2) {
      newSnake.push({ x: snake[0].x - 1, y: snake[0].y })
    } else if (direction === "DOWN" && snake[0] && snake[0].x + 1 < BOARD_SIZE + 1) {
      newSnake.push({ x: snake[0].x + 1, y: snake[0].y })
    } else if (direction === "LEFT" && snake[0] && snake[0].y - 1 > -2) {
      newSnake.push({ x: snake[0].x, y: snake[0].y - 1 })
    } else if (direction === "RIGHT" && snake[0] && snake[0].y + 1 < BOARD_SIZE + 1) {
      newSnake.push({ x: snake[0].x, y: snake[0].y + 1 })
    } else {
      setAlert("You Lose!, Reset and Start again.")
      setBlocked(true)
      return
    }

    if (snake.length !== 1) {
      snake.forEach((tile) => {
        newSnake.push(tile)
      })
    }
    setSnake(newSnake)
    displaySnake()
  }

  function handleDirection(e) {
    const { keyCode } = e
    switch (keyCode) {
      case 37:
        setDirection("LEFT")
        break
      case 38:
        setDirection("UP")
        break
      case 39:
        setDirection("RIGHT")
        break
      case 40:
        setDirection("DOWN")
        break
      default:
        setDirection("RIGHT")
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleDirection)

    return () => {
      window.removeEventListener("keydown", handleDirection)
    }
  }, [])

  useInterval(moveSnake, delay)
  const startGame = () => {
    setAlert('')
    setDelay(300)
  }

  const resetGame = () => {
    setDelay(null)
    setAlert('')
    setScore(0)
    setBlocked(false)
    setDirection("RIGHT")
    setSnake([getRandomPosition()])
    displaySnake()
  }

  return (
    <div>
      <h1>{alert && alert}</h1>
      <h1>{score && score}</h1>
      <button onClick={startGame}>Start</button>
      <button onClick={resetGame}>Reset</button>
      <div className='board'>
        {board &&
          board.map((row) => (
            <div className='column'>
              {row.map((tile) => (
                <div
                  className={
                    tile === "SNAKE"
                      ? "tile snake"
                      : tile === "FOOD"
                      ? "tile food"
                      : "tile blank"
                  }
                />
              ))}
            </div>
          ))}
      </div>
    </div>
  )
}

export default Board
