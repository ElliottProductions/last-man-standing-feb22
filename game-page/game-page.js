import { checkAuth, logout } from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    logout();
});

const speed = 10;

let up = false,
    right = false,
    down = false,
    left = false,
    x = window.innerWidth / 2 - 130 / 2,
    y = window.innerHeight / 2 - 130 / 2;

document.addEventListener('keydown', press);

function press(e){
    if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */){
        up = true;
    }
    if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */){
        right = true;
    }
    if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */){
        down = true;
    }
    if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */){
        left = true;
    }
}

document.addEventListener('keyup',release);

function release(e){
    if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */){
        up = false;
    }
    if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */){
        right = false;
    }
    if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */){
        down = false;
    }
    if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */){
        left = false;
    }
}
function gameLoop(){
    var div = document.querySelector('div');
    if (up){
        y = y - speed;
    }
    if (right){
        x = x + speed;
    }
    if (down){
        y = y + speed;
    }
    if (left){
        x = x - speed;
    }

    div.style.left = x + 'px';

    div.style.top = y + 'px';
    
    window.requestAnimationFrame(gameLoop);
}