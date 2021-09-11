const canvas = document.getElementById('canvas')
const score = document.getElementById('score')
const context = canvas.getContext('2d')

const pixelSize = 10

let snakePixels = []
let snakeLength = 1

let xSpeed = 0
let ySpeed = 0

let snakePosX = randomGridPosition(0, canvas.width - 10)
let snakePosY = randomGridPosition(0, canvas.height - 10)

let target = [
  randomGridPosition(0, canvas.width - 10),
  randomGridPosition(0, canvas.height - 10)
]

function randomGridPosition(min, max){
    return Math.round((Math.random()*(max-min)+min)/10)*10;
}

function renderSnake(snake) {
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.shadowColor = '#ff007f'
  context.shadowBlur = 5

  for (const [index, pixel] of snake.entries()) {
    context.fillStyle = index === snake.length - 1 ? '#ff007f' : '#ff007faa'

    context.fillRect(pixel[0], pixel[1], pixelSize,pixelSize)
  }
}

function renderTarget(target) {
    context.fillStyle = '#90ee90'
    context.shadowColor = '#90ee90'
    context.shadowBlur = 5
    context.fillRect(target[0], target[1], pixelSize,pixelSize)
}

function detectTargetCollision(target, snake) {
  return JSON.stringify(target) === JSON.stringify(snake[snake.length - 1])
}

function detectPlayerCollision(snake) {
  let countPixels = snake.filter(pixel => JSON.stringify(pixel) == JSON.stringify(snake[snake.length - 1])).length

  return snakeLength === 1? false : countPixels !== 1
}

function detectBorderCollision(snake) {
  if (snake[snake.length - 1][0] > canvas.width)
    snakePosX = 10
  
  else if (snake[snake.length - 1][0] < 0)
    snakePosX = canvas.width
  
  else if (snake[snake.length - 1][1] > canvas.height)
    snakePosY = 10
  
  else if (snake[snake.length - 1][1] < 0)
    snakePosY = canvas.height
}

setInterval(() => {
  snakePixels.push([snakePosX, snakePosY])

  snakePosX += xSpeed
  snakePosY += ySpeed

  if (detectPlayerCollision(snakePixels)) {
    alert(`you loose!!!`)
        
    snakePixels = []
    snakeLength = 1

    xSpeed = 0
    ySpeed = 0

    snakePosX = randomGridPosition(0, canvas.width - 10)
    snakePosY = randomGridPosition(0, canvas.height - 10)

    target = [
      randomGridPosition(0, canvas.width - 10),
      randomGridPosition(0, canvas.height - 10)
    ]

    score.innerHTML = `score: ${snakeLength - 1}`
  }

  if (snakePixels.length > snakeLength)
    snakePixels.shift()
  
  if (detectTargetCollision(target, snakePixels)) {
    snakeLength++
    target = [
    randomGridPosition(0, canvas.width),
    randomGridPosition(0, canvas.height)
    ]

    score.innerHTML = `score: ${snakeLength - 1}`
  }

  detectBorderCollision(snakePixels)

  renderSnake(snakePixels)
  renderTarget(target)
}, 100)

document.addEventListener('keydown', event => {
  if (event.key == "ArrowUp" && ySpeed == 0) {
    xSpeed = 0
    ySpeed = -10
  } else if (event.key == "ArrowDown"  && ySpeed == 0) {
    xSpeed = 0
    ySpeed = 10
  } else if (event.key == "ArrowLeft"  && xSpeed == 0) {
    xSpeed = -10
    ySpeed = 0
  } else if (event.key == "ArrowRight" && xSpeed == 0) {
    xSpeed = 10
    ySpeed = 0
  }
})