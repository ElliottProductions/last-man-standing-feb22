import { checkAuth, logout, getMyProfile, updatePlayer, getActivePlayers, client } from '../fetch-utils.js';


checkAuth();

const logoutButton = document.getElementById('logout');

const gameArea = document.querySelector('.game-div');

logoutButton.addEventListener('click', () => {
    logout();

});

let moveSpeed = 10;

let currentPlayer;

window.addEventListener('load', async() => {
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

        //     <div class="player" style="transform:translate(190px, 120px)">
        //      😋
        //      </div>
        const playerEl = document.createElement('div');
        playerEl.textContent = `😋 ${player.email}`;
        playerEl.classList.add('player');
        playerEl.style.transform = `translate(${player.x_position}px, ${player.y_position}px)`;

        gameArea.append(playerEl);
    }
}

window.addEventListener('keydown', e => {
    if (e.key === 'w') currentPlayer.y_position -= moveSpeed;
    if (e.key === 's') currentPlayer.y_position += moveSpeed;
    if (e.key === 'a') currentPlayer.x_position -= moveSpeed;
    if (e.key === 'd') currentPlayer.x_position += moveSpeed;
});