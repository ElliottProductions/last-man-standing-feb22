import { checkAuth, logout, getMyProfile, updatePlayer, getActivePlayers, client } from '../fetch-utils.js';


checkAuth();

const logoutButton = document.getElementById('logout');

const gameArea = document.querySelector('.game-div');

logoutButton.addEventListener('click', () => {
    logout();

});

let moveSpeed = 10;

let currentPlayer;

window.addEventListener('load', async () => {
    currentPlayer = await getMyProfile();
    fetchAndDisplayActivePlayers();
    await client
    // hey, listen to the chats room
        .from('profiles')
        // if a row is added, let me know and tell about that row
        .on('UPDATE', (payload) => {
            //fetchAndDisplayActivePlayers();
            console.log(payload);
        })
        .subscribe();
});

async function fetchAndDisplayActivePlayers() {
    const activePlayers = await getActivePlayers();

    gameArea.textContent = '';
    for (let player of activePlayers) {


        const playerEl = document.createElement('div');
        playerEl.textContent = `😋 ${player.email}`;
        playerEl.classList.add('player');
        console.log(`${player.email} is at x: ${player.x_position}, y: ${player.y_position}`);
        playerEl.style.transform = `translate(${player.x_position}px, ${player.y_position}px)`;

        gameArea.append(playerEl);
    }
}

const GAME_HEIGHT = 490;
const GAME_WIDTH = 700;

window.addEventListener('keydown', async (e) => {
    if (e.key === 'w') {
        currentPlayer.y_position -= moveSpeed;

        if (currentPlayer.y_position < 0) {
            currentPlayer.y_position = GAME_HEIGHT;
        }
    }
    if (e.key === 'd') {
        currentPlayer.x_position += moveSpeed;

        if (currentPlayer.x_position > GAME_WIDTH) {
            currentPlayer.x_position = 0;
        }
    }
    if (e.key === 's') { 
        currentPlayer.y_position += moveSpeed;

        if (currentPlayer.y_position > GAME_HEIGHT) {
            currentPlayer.y_position = 0;
        }
    }
    if (e.key === 'a') {
        currentPlayer.x_position -= moveSpeed;

        if (currentPlayer.x_position < 0) {
            currentPlayer.x_position = GAME_WIDTH;
        }
    }

    await updatePlayer(currentPlayer);
    await fetchAndDisplayActivePlayers();
});
