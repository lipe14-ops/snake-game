const canvas = document.querySelector('#canvas')
const score = document.querySelector('#score')
const modal = document.querySelector('#modal')
const modalItems = document.querySelectorAll('#modal div')
const context = canvas.getContext('2d')

const pixelSize = 10

let snakePixels = []
let snakeLength = 1

let xSpeed = 0
let ySpeed = 0

let snakePosX = randomGridPosition(0, canvas.width - pixelSize)
let snakePosY = randomGridPosition(0, canvas.height - pixelSize)

let target = [
    randomGridPosition(0, canvas.width - pixelSize),
    randomGridPosition(0, canvas.height - pixelSize)
]

let record = 0

function randomGridPosition(min, max){
    return Math.round((Math.random()*(max-min)+min)/pixelSize)*pixelSize;
}

function renderSnake(snake) {
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.shadowColor = '#ff007f'
    context.shadowBlur = pixelSize / 2

    for (const [index, pixel] of snake.entries()) {
        context.fillStyle = index === snake.length - 1 ? '#ff007f' : '#ff007faa'

        context.fillRect(pixel[0], pixel[1], pixelSize,pixelSize)
  }
}

function renderTarget(target) {
    context.fillStyle = '#90ee90'
    context.shadowColor = '#90ee90'
    context.shadowBlur = 5
    context.fillRect(target[0], target[1], pixelSize, pixelSize)
}

function detectTargetCollision(target, snake) {
    return JSON.stringify(target) === JSON.stringify(snake[snake.length - 1])
}

function detectPlayerCollision(snake) {
    let countPixels = snake.filter(pixel => JSON.stringify(pixel) == JSON.stringify(snake[snake.length - 1])).length

    return snakeLength === 1? false : countPixels !== 1
}

function detectBorderCollision(snake) {
    if (snake[snake.length - 1][0] > canvas.width - pixelSize)
        snakePosX = 0
  
    else if (snake[snake.length - 1][0] < 0)
        snakePosX = canvas.width - pixelSize
  
    else if (snake[snake.length - 1][1] > canvas.height - pixelSize)
        snakePosY = 0
  
    else if (snake[snake.length - 1][1] < 0)
        snakePosY = canvas.height - pixelSize
}

setInterval(() => {
    snakePixels.push([snakePosX, snakePosY])

    snakePosX += xSpeed
    snakePosY += ySpeed

    if (detectPlayerCollision(snakePixels)) {
        if (snakeLength - 1 > record)
            record = snakeLength - 1
        
        modalItems[1].innerHTML = `record: ${record}`
        modalItems[2].innerHTML = `score: ${snakeLength - 1}`

        canvas.classList.add('noshow')
        score.classList.add('noshow')
        modal.style.display = 'flex'

    }

    if (snakePixels.length > snakeLength)
        snakePixels.shift()
  
    if (detectTargetCollision(target, snakePixels)) {
        snakeLength++
        target = [
            randomGridPosition(0, canvas.width - pixelSize),
            randomGridPosition(0, canvas.height - pixelSize)
        ]

        score.innerHTML = `score: ${snakeLength - 1}`
    }

    detectBorderCollision(snakePixels)

    renderSnake(snakePixels)
    renderTarget(target)
}, 150)

document.addEventListener('keydown', event => {
    if (event.key == "ArrowUp" && ySpeed === 0) {
        xSpeed = 0
        ySpeed = -pixelSize
    } else if (event.key == "ArrowDown"  && ySpeed === 0) {
        xSpeed = 0
        ySpeed = pixelSize
    } else if (event.key == "ArrowLeft"  && xSpeed === 0) {
        xSpeed = -pixelSize
        ySpeed = 0
    } else if (event.key == "ArrowRight" && xSpeed === 0) {
        xSpeed = pixelSize
        ySpeed = 0
    }
})

modalItems[3].addEventListener('click', () => {

    canvas.classList.remove('noshow')
    score.classList.remove('noshow')

    modal.style.display = 'none'
    
    snakePixels = []
    snakeLength = 1

    xSpeed = 0
    ySpeed = 0

    snakePosX = randomGridPosition(0, canvas.width - pixelSize)
    snakePosY = randomGridPosition(0, canvas.height - pixelSize)

    target = [
        randomGridPosition(0, canvas.width - pixelSize),
        randomGridPosition(0, canvas.height - pixelSize)
    ]
})