var containerWidth = Number(getComputedStyle(document.querySelector('.container')).width.replace('px', ''));
var containerHeight = Number(getComputedStyle(document.querySelector('.container')).height.replace('px', ''));
var bricksPosition = {};
var ballsPositions = {};
var stickLeft;
var stickTop;
var ballNumber = 0;
var positivity = [(-1), +1];
var brickLeft;
var brickTop;
var initialbrickLeft;
var initialbrickTop;
var ballInterval;
var newBall;
var color = {};
var stater = '';
var trailPositions = [];

function storeLastPositions(xPos, yPos) {
    trailPositions.push({
        x: xPos,
        y: yPos,
    });
    if (trailPositions.length > 7) {
        trailPositions.shift();
    }
}

function createBrick(backgroundColor) {
    this.brickElement = document.createElement('div');
    this.brickElement.className = 'brick';
    document.querySelector('.container').appendChild(this.brickElement);

    this.brickElement.style.backgroundColor = backgroundColor;
    this.brickElement.style.left = initialbrickLeft + 'px';
    this.brickElement.style.top = initialbrickTop + 'px';
    this.brickElement.style.opacity = 1;
    return this.brickElement;
}

var game = {
    ball: document.querySelector('.ball'),
    stick: document.querySelector('#stick'),
    score: 0,
    
    setInitialPositions: function () {
        this.score = 0;
        document.querySelector('#score-table').innerHTML = 'SCORE: ' + 0 + '   ' + 'HIGH: ' + localStorage.getItem('highScore');
        stickLeft = 400;
        stickTop = 575;
        this.stick.style.left = stickLeft + 'px';
        this.stick.style.top = stickTop + 'px';
    },

    setInitialBallPositions: function () {
        ballsPositions[ballNumber] = {
            ballLeft: 400,
            ballTop: 545,
            direction: 'up',
            ballLeftChanger: Math.ceil(Math.random() * 2) * positivity[Math.floor(Math.random() * positivity.length)],
        }
        ballNumber++;
        this.defineBallPos();
    },
    createBricks: function () {
        initialbrickLeft = 0;
        initialbrickTop = 80;
        for (var i = 0; i < 20; i++) {
            new createBrick('red'); 
            initialbrickLeft += 50; 
        }
        initialbrickLeft = 0;
        initialbrickTop += 20;
        for (var i = 0; i < 20; i++) {
            new createBrick('purple');
            initialbrickLeft += 50;
        }
        initialbrickTop += 20;
        initialbrickLeft = 0;
        for (var i = 0; i < 20; i++) {
            new createBrick('lightgreen');
            initialbrickLeft += 50;
        }
    },
    setBrickPos: function () {
        document.querySelectorAll('.brick').forEach(function (value, index) {
            bricksPosition[index] = {
                left: value.style.left,
                top: value.style.top,
            }
        })
    },

    defineBallPos: function () {
        document.querySelectorAll('.ball').forEach(function (value, index) {
            if (ballsPositions[index]['direction'] === 'up') {
                ballsPositions[index]['ballTop'] -= 1;

            } else if (ballsPositions[index]['direction'] === 'down') {
                ballsPositions[index]['ballTop'] += 1;
            }

            if (ballsPositions[index]['ballLeftChanger'] < 0) {
                ballsPositions[index]['ballLeft'] += ballsPositions[index]['ballLeftChanger'];

            } else {
                ballsPositions[index]['ballLeft'] += ballsPositions[index]['ballLeftChanger'];
            }

            value.style.top = ballsPositions[index]['ballTop'] + 'px';
            value.style.left = ballsPositions[index]['ballLeft'] + 'px';
        })

    },

    increaseScore: function () {
        this.score++;
        if (this.score > localStorage.getItem('highScore')) {
           
            localStorage.setItem('highScore', this.score);
        }
        document.querySelector('#score-table').innerHTML = 'SCORE: ' + this.score + 'HIGH ' + localStorage.getItem('highScore');
    },
}

game.createBricks();
game.setBrickPos();
game.setInitialPositions();
game.setInitialBallPositions();

function controlMouse() {

    document.onmousemove = function () {
        if (stater === 'playing') {
            stickLeft = event.clientX * (containerWidth - stickWidth) / window.innerWidth;
            game.stick.style.left = stickLeft + 'px';
        }
    }
}

document.querySelector('.container').addEventListener('click', controlMouse);

var ballWidth = Number(getComputedStyle(game.ball).width.replace('px', ''));
var ballHeight = Number(getComputedStyle(game.ball).width.replace('px', ''));
var stickWidth = Number(getComputedStyle(game.stick).width.replace('px', ''));
var brickWidth = Number(getComputedStyle(document.querySelector('.brick')).width.replace('px', ''));
var brickHeight = Number(getComputedStyle(document.querySelector('.brick')).height.replace('px', ''));
var brickWidth = Number(getComputedStyle(document.querySelector('.brick')).width.replace('px', ''));


function setBallInterval() {
    game.setBrickPos();
    game.defineBallPos();
    document.querySelectorAll('.ball').forEach(function (value, index) {

        if ((ballsPositions[index]['ballLeft'] + ballWidth > stickLeft && stickLeft + stickWidth > ballsPositions[index]['ballLeft'] && (ballsPositions[index]['ballTop'] + ballHeight >= stickTop))) {
            ballsPositions[index]['direction'] = 'up';

        } else if (ballsPositions[index]['ballTop'] === 0) {
            ballsPositions[index]['direction'] = 'down';

        } else if (ballsPositions[index]['ballLeft'] + ballWidth >= containerWidth || ballsPositions[index]['ballLeft'] <= 0) { 

            ballsPositions[index]['ballLeftChanger'] = -ballsPositions[index]['ballLeftChanger'];
            ballsPositions[index]['ballLeft'] += ballsPositions[index]['ballLeftChanger'];

        } 
        if (ballsPositions[index]['ballTop'] + ballHeight > containerHeight) {
            clearInterval(ballInterval);

            stater = 'stop';
            document.querySelector('.announcement.finish').style.display = 'block';
        }

        document.querySelectorAll('.brick').forEach(function (value, brindex) {

            function scoreActions() {
                game.increaseScore();
                var opacity = Number(value.style.opacity) - 0.25;
                value.style.opacity = opacity.toString();

                if (color[brindex] === undefined) {
                    color[brindex] = 0;
                }
                color[brindex]++
                if (getComputedStyle(value).backgroundColor === 'rgb(144, 238, 144)') {
                    if (color[brindex] !== 0 && Number.isInteger(color[brindex] / 2)) {
                        value.remove();
                    }

                }

            }
            brickLeft = Number(bricksPosition[brindex]['left'].replace('px', ''));
            brickTop = Number(bricksPosition[brindex]['top'].replace('px', ''));

            if (ballsPositions[index]['ballLeft'] + ballWidth > brickLeft &&
                brickLeft + brickWidth > ballsPositions[index]['ballLeft']) {
                if (ballsPositions[index]['direction'] === 'up' && ballsPositions[index]['ballTop'] === brickTop + brickHeight) {
                    scoreActions()

                    ballsPositions[index]['direction'] = 'down';
                } else if (ballsPositions[index]['direction'] === 'down' && ballsPositions[index]['ballTop'] + ballHeight === brickTop) {
                    game.increaseScore();
                    value.remove();
                    ballsPositions[index]['direction'] = 'up';
                }
            } else if (((ballsPositions[index]['ballLeftChanger'] < 0 && ballsPositions[index]['ballLeft'] === brickLeft + brickWidth) || (ballsPositions[index]['ballLeftChanger'] > 0 && ballsPositions[index]['ballLeft'] + ballWidth === brickLeft)) &&
                ballsPositions[index]['ballTop'] + ballHeight > brickTop && brickTop + brickHeight > ballsPositions[index]['ballTop']) {
                game.increaseScore();
                value.remove();
                ballsPositions[index]['ballLeftChanger'] = -ballsPositions[index]['ballLeftChanger'];
                ballsPositions[index]['ballLeft'] += ballsPositions[index]['ballLeftChanger'];
            }
        })
    })
}

document.querySelector('body').addEventListener('click', function (e) { 
    if (e.target.className === 'game-button') {
        document.querySelectorAll('.brick').forEach(function (value) {
            value.remove();
        })

        document.querySelectorAll('.clone').forEach(function (value) {
            value.remove();
        })

        e.target.parentNode.style.display = 'none';
        ballNumber = 0;
        color = {};
        stater = 'playing';
        ballInterval = setInterval(setBallInterval, 5);
        game.createBricks();
        game.setBrickPos();
        game.setInitialPositions();
        game.setInitialBallPositions();
    }
})

document.addEventListener('keyup', function (parametre) {
    if (parametre.keyCode === 32 && stater === 'playing') {
        newBall = document.createElement('div');
        newBall.className = 'ball clone';
        document.querySelector('.container').appendChild(newBall);
        game.setInitialBallPositions();

    }
})