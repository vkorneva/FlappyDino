var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');


var dino       = getImage('assets/images/dino.png');
var bg         = getImage('assets/images/bg.png');
var fg         = getImage('assets/images/fg.png');
var pipeUp     = getImage('assets/images/pipeUp.png');
var pipeBottom = getImage('assets/images/pipeBottom.png');

var fly         = getAudio('assets/audio/fly.mp3');
var score_audio = getAudio('assets/audio/score.mp3');

var gap = 90;

setCtxSettings();

function startGame () {
    draw();
}


// При нажатии на какую-либо кнопку
document.addEventListener('keydown', moveUp);

function setCtxSettings () {
    ctx.fillStyle = '#000';
    ctx.font      = '24px Verdana';
}

function moveUp () {
    birdPosition.y -= 35;
    fly.play();
}

// Создание блоков
var barriers = [];

barriers[0] = {
    x: cvs.width,
    y: 0,
};

var score = 0;

// Позиция птички
var birdPosition = {
    x   : 10,
    y   : 150,
    grav: 1.5,
};

function getImage (url) {
    const image = new Image();
    image.src   = url;
    return image;
}

function getAudio (url) {
    const audio = new Audio();
    audio.src   = url;
    return audio;
}

function draw () {
    // Отрисовка бэкграунда
    drawImage(bg, 0, 0);

    // Отрисовка препятствий
    for (var i = 0; i < barriers.length; i++) {
        drawImage(pipeUp, barriers[i].x, barriers[i].y);
        drawImage(pipeBottom, barriers[i].x, barriers[i].y + pipeUp.height + gap);

        barriers[i].x--;

        if (barriers[i].x === 125) {
            barriers.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height,
            });
        }

        // При прикосновении перезагружаем страницу
        if (isNotValidBirdPosition(i)) {
            drawGameOver();
            reloadPage();
        }


        if (barriers[i].x === 5) {
            score++;
            score_audio.play();
        }
    }

    // Отрисовка земли
    drawImage(fg, 0, cvs.height - fg.height);

    // Отрисовка персонажа
    drawImage(dino, birdPosition.x, birdPosition.y);

    birdPosition.y += birdPosition.grav;

    // Отрисовка результатов игры
    drawScore();

    // Запускаем анимацию игры
    requestAnimationFrame(draw);
}

function drawImage (img, x, y) {
    ctx.drawImage(img, x, y);
}

function drawScore () {
    ctx.fillText('Счет: ' + score, 10, cvs.height - 20);
}

function drawGameOver () {
    ctx.fillText('Конец игры', cvs.width / 4, cvs.height / 2);
}

function isNotValidBirdPosition (i) {
    return birdPosition.x + dino.width >= barriers[i].x
        && birdPosition.x <= barriers[i].x + pipeUp.width
        && (birdPosition.y <= barriers[i].y + pipeUp.height || birdPosition.y + dino.height >= barriers[i].y + pipeUp.height + gap)
        || birdPosition.y + dino.height >= cvs.height - fg.height;
}

function reloadPage () {
    location.reload();
}


window.onload = startGame;
