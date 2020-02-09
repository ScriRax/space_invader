var hero = {
    top: 520,
    left: 398,
    leftPressed: false,
    rightPressed: false,
    gameOver: false
};

var scoreText;
var score = 0;

var vies = 3;

var player_width = 40;

var lasers = [];

var lasersmechs = [];

// Coordonnées et position des méchants
var mechants = [
    {left: 130, top: 100},
    {left: 230, top: 100},
    {left: 330, top: 100},
    {left: 430, top: 100},
    {left: 530, top: 100},
    {left: 630, top: 100},
    {left: 130, top: 175},
    {left: 230, top: 175},
    {left: 330, top: 175},
    {left: 430, top: 175},
    {left: 530, top: 175},
    {left: 630, top: 175}
];

// Coordonnées et position des boss
var bosss = [
    {left: 730, top: 175},
    {left: 730, top: 175},
    {left: 730, top: 100},
    {left: 730, top: 100},
    {left: 30, top: 100},
    {left: 30, top: 100},
    {left: 30, top: 175},
    {left: 30, top: 175}
];

// Faire apparaître les boss
function apparitionbosss() {
    document.getElementById("bosss").innerHTML = "";
    for (var boss = 0; boss < bosss.length; boss++) {
        document.getElementById(
            "mechants"
        ).innerHTML += `<div class='bosss' src="img/laser-red-3.png" style='left:${bosss[boss].left}px; top:${bosss[boss].top}px;'></div>`;
    }
}

// Faire bouger les boss
function bougebosss() {
    for (var boss = 0; boss < bosss.length; boss++) {
        bosss[boss].top = bosss[boss].top + 0.2;
    }
}

// Détection des lasers avec les boss
function collisionbosss() {
    for (var boss = 0; boss < bosss.length; boss++) {
        for (var laser = 0; laser < lasers.length; laser++) {
            if (
                lasers[laser].top <= bosss[boss].top + 15 &&
                lasers[laser].top >= bosss[boss].top &&
                lasers[laser].left >= bosss[boss].left &&
                lasers[laser].left <= bosss[boss].left + 50
            ) {
                bosss.splice(boss, 1);
                lasers.splice(laser, 1);
                score += 50;
                $(".score").html("Score :" + " " + score);
            }
        }
    }
}

// GameOver lorsqu'un boss touche le hero
function perduboss() {
    for (var boss = 0; boss < bosss.length; boss++) {
        if (bosss[boss].top >= hero.top) {
            destroyPlayer();
            bosss.splice(bosss);
        }
    }
}

//Création du timer
function startTimer(duration, display) {
    var timer = duration,
        minutes,
        seconds;
    var tt = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        ++timer;

        if (hero.gameOver === true) {
            clearInterval(tt);
        } else if (mechants.length === 0 && bosss.length === 0) {
            clearInterval(tt);
        }
    }, 1000);
}

window.onload = function () {
    var time = 01,
        display = document.querySelector(".timercount");
    startTimer(time, display);
};

function updatePlayer() {
    if (hero.leftPressed) {
        hero.left -= 10;
        moveHero();
    } else if (hero.rightPressed) {
        hero.left += 10;
        moveHero();
    }
    hero.left = clamp(hero.left, player_width, 760);
}

//Bloque le joueur de chaque côté de l'écran
function clamp(v, min, max) {
    if (v < min) {
        return min;
    } else if (v > max) {
        return max;
    } else {
        return v;
    }
}

// Supprime le joueur
function destroyPlayer() {
    mechants.splice(mechants);
    hero.gameOver = true;
    const audio = new Audio("sound/sfx-lose1.ogg");
    audio.play();
    loop = null;
    document.getElementById("player").outerHTML = "";
    document.getElementById("mechants").outerHTML = "";
    document.querySelector(".game-over").style.display = "block";
    document.getElementById("félicitation").outerHTML = "";
}

// Supprime les lasers du héro lorsqu'ils touchent le haut de l'écran
function destroyLasers() {
    for (var laser = 0; laser < lasers.length; laser++) {
        if (lasers[laser].top <= hero.top - 510) {
            lasers.splice(laser, 1);
        }
    }
}

function perdu() {
    for (var mechant = 0; mechant < mechants.length; mechant++) {
        if (mechants[mechant].top >= hero.top) {
            destroyPlayer();
        }
    }
}

function update() {
    updatePlayer();
}

let isAttacking = false;

const waitForNextAttack = () => {
    if (isAttacking === true) {
        setTimeout(() => {
            isAttacking = false;
        }, 500);
    } else {
        clearInterval();
    }
};

//Détection lorsqu'on appui sur une touche
document.onkeydown = function (e) {
    if (e.keyCode === 37) {
        hero.leftPressed = true;
    } else if (e.keyCode === 39) {
        hero.rightPressed = true;
    } else if (e.keyCode === 32) {
        if (isAttacking === false) {
            isAttacking = true;
            const audio = new Audio("sound/sfx-laser1.ogg");
            audio.play();
            lasers.push({
                left: hero.left + 2.5,
                top: hero.top
            });
            waitForNextAttack();
        }
    }
};

//Détection lorsqu'une touche est relâché
document.onkeyup = function (e) {
    if (e.keyCode === 37) {
        hero.leftPressed = false;
    } else if (e.keyCode === 39) {
        hero.rightPressed = false;
    }
};

// Permet de bouger le héro
function moveHero() {
    document.getElementById("player").style.left = hero.left + "px";
}

// Faire apparaître les lasers
function apparitionlaser() {
    document.getElementById("laser").innerHTML = "";
    for (var laser = 0; laser < lasers.length; laser++) {
        document.getElementById(
            "laser"
        ).innerHTML += `<div class='laser' src="img/laser-blue-3.png" style='left:${lasers[laser].left}px; top:${lasers[laser].top}px;'></div>`;
    }
}

//Faire bouger les lasers
function bougelaser() {
    for (var laser = 0; laser < lasers.length; laser++) {
        lasers[laser].top = lasers[laser].top - 6;
    }
}

// Faire apparaître les méchants (bleus)
function apparitionmechant() {
    document.getElementById("mechants").innerHTML = "";
    for (var mechant = 0; mechant < mechants.length; mechant++) {
        document.getElementById(
            "mechants"
        ).innerHTML += `<div class='mechants' src="img/laser-blue-3.png" style='left:${mechants[mechant].left}px; top:${mechants[mechant].top}px;'></div>`;
    }
}

// Faire bouger les méchants
function bougemechant() {
    for (var mechant = 0; mechant < mechants.length; mechant++) {
        mechants[mechant].top = mechants[mechant].top + 0.4;
    }
}

// Faire apparaître les lasers des méchants (bleus) de façon aléatoire
function lasermechant() {
    if (Math.random() < 0.03 && mechants.length > 0) {
        var imech = Math.round(Math.random() * (mechants.length - 1));
        let id = Math.random()
        lasersmechs.push({
            left: mechants[imech].left,
            top: mechants[imech].top,
            id
        });


        document.getElementById(
            "lasersmech"
        ).innerHTML += `<div id='laserme-${id}' class="lasersmech" src="img/laser-blue-3.png" style='left:${mechants[
            imech
            ].left + 21.5}px; top:${mechants[imech].top + 16}px;'></div>`;

        const audio = new Audio("sound/sfx-lasermech.ogg");
        audio.play();
    }
}

// Faire apparaître les lasers des boss (oranges) de façon aléatoire
function laserboss() {
    if (Math.random() < 0.03 && bosss.length > 0) {
        var imech = Math.round(Math.random() * (bosss.length - 1));
        let id = Math.random()
        lasersmechs.push({
            left: bosss[imech].left,
            top: bosss[imech].top,
            id
        });

        document.getElementById(
            "lasersmech"
        ).innerHTML += `<div id='laserme-${id}' class="lasersmech" src="img/laser-red-3.png" style='left:${bosss[
            imech
            ].left + 21.5}px; top:${bosss[imech].top + 16}px;'></div>`;

        const audio = new Audio("sound/sfx-lasermech.ogg");
        audio.play();
    }
}

// Faire bouger les lasers des méchants
function lasermechbouge() {


    if (lasersmechs.length > 0) {

        lasersmechs.forEach(async function (lasermech, index) {

            let objectDOM = await document.getElementById(`laserme-${lasersmechs[index].id}`)
            if (objectDOM === null) {
                return
            } else {
                let test = parseInt(document.getElementById(`laserme-${lasersmechs[index].id}`).style.top, 10);
                objectDOM.style.top = `${test + 7}px`;
                lasersmechs[index].top = test + 7
            }


        })

    }
}

// Détruire les lasers des méchants
function destroyLasersmech() {

    lasersmechs.forEach(function (lasermech, index) {
        let test = lasersmechs[index].top;
        if (test >= hero.top) {
            
            document.getElementById(`laserme-${lasersmechs[index].id}`).remove()
            lasersmechs.splice(index, 1)

        }
    })

}

let isInvulnerable = false;

const intervalInvulnerability = () => {
    if (isInvulnerable === true) {
        setTimeout(() => {
            isInvulnerable = false;
            let player = document.getElementById("player");
            player.style.opacity = 1;
        }, 2000);
    } else {
        clearInterval();
    }
};

// Détecter lorsqu'un laser est en collision avec le héro
function collisionmech() {
    for (var x = 0; x < lasersmechs.length; x++) {
        if (
            lasersmechs[x].top >= hero.top + 15 &&
            lasersmechs[x].top <= hero.top &&
            lasersmechs[x].left >= hero.left &&
            lasersmechs[x].left <= hero.left + 50
        ) {
            if (isInvulnerable === false) {
                isInvulnerable = true;
                vies--;
                let player = document.getElementById("player");
                player.style.opacity = 0.5;
                intervalInvulnerability();
            }

            if (vies === 0) {
                loop = null;
                document.querySelector(".game-over").style.display = "block";
                const audio = new Audio("sound/sfx-lose1.ogg");
                audio.play();
            }
            if (vies >= 0) {
                $(".vies").html("Vies :" + " " + vies);
            }
        }
    }
}

// Détecter lorsqu'un laser est en collision avec les méchants
function collision() {
    for (var mechant = 0; mechant < mechants.length; mechant++) {
        for (var laser = 0; laser < lasers.length; laser++) {
            if (
                lasers[laser].top <= mechants[mechant].top + 15 &&
                lasers[laser].top >= mechants[mechant].top &&
                lasers[laser].left >= mechants[mechant].left &&
                lasers[laser].left <= mechants[mechant].left + 50
            ) {
                mechants.splice(mechant, 1);
                lasers.splice(laser, 1);
                score += 50;
                $(".score").html("Score :" + " " + score);
            }
        }
    }
}

// Permet de savoir si on gagne
function gagne() {
    return mechants.length === 0 && bosss.length === 0;
}

// Permet de refresh les éléments toutes les 40ms
function loop() {
    setTimeout(loop, 40);
    destroyLasersmech();
    bougelaser();
    lasermechbouge();
    apparitionlaser();
    apparitionmechant();
    lasermechant();
    destroyLasers();
    bougemechant();
    collision();
    collisionmech();
    window.requestAnimationFrame(update);
    bougebosss();
    apparitionbosss();
    collisionbosss();
    perduboss();
    laserboss();
    perdu();
    if (gagne()) {
        document.querySelector(".félicitation").style.display = "block";
        loop = null;
        return;
    }
}

loop();

// Centrer le héro au début du jeu
$("#player").css({
    left: "50%",
    margin: "-" + "px 0 0 -" + $("#player").width() / 2 + "px"
});
