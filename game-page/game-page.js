import { getReadyPlayers, checkAuth, logout, getMyProfile, updatePlayer, getActivePlayers, client, infect, getInfectedPlayers, endGameState, getUser } from '../fetch-utils.js';


checkAuth();

const logoutButton = document.getElementById('logout');

const gameArea = document.querySelector('.game-div');

logoutButton.addEventListener('click', () => {
    logout();
});

let moveSpeed = 10;
let infected_count = 0;
let currentPlayer;

window.addEventListener('load', async () => {
    currentPlayer = await getMyProfile();
    await fetchAndDisplayActivePlayers();
    await client
        .from('profiles')
        .on('UPDATE', async (payload) => {
            await fetchAndDisplayActivePlayers();
            payload;
        })
        .subscribe();
    // const infectedArr = await getInfectedPlayers();
    // if (infectedArr.length < 1){
    //     const userArr = await getReadyPlayers();
    //     const random = Math.floor((Math.random()) * (userArr.length - 1));
    //     const chosen = userArr[random];
    //     await infect(chosen);

    // }
    if (currentPlayer.infected === true){
        alert('You are patient zero');
    }
    
});

async function fetchAndDisplayActivePlayers() {
    //TODO should only update players that change? reduce lag?
    const activePlayers = await getActivePlayers();

    gameArea.textContent = '';
    for (let player of activePlayers) {
        const playerEl = document.createElement('div');
        if (player.fight_icon === 4){
            playerEl.textContent = `😃  ${player.user_name}`;
        }
        if (player.fight_icon === 2){
            playerEl.textContent = `🤠  ${player.user_name}`;
        }
        if (player.fight_icon === 3){
            playerEl.textContent = `👺 ${player.user_name}`;
        }
        if (player.fight_icon === 1){
            playerEl.textContent = `🥚 ${player.user_name}`;
        }
        playerEl.classList.add('player');
        playerEl.style.transform = `translate(${player.x_position}px, ${player.y_position}px)`;

        gameArea.append(playerEl);
    }

    const infectedPlayer = await getInfectedPlayers();

    if (activePlayers.length - 1 === infectedPlayer.length) {
        //console.log(activePlayers);
        //console.log(infectedPlayer);
        const user = getUser();
        await endGameState(infected_count, user);
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
    await updatePlayer(currentPlayer, currentPlayer.y_position, currentPlayer.x_position);
    await fetchAndDisplayActivePlayers();
    await getCollision();
});

async function getCollision(){

    const activePlayerArr = await getActivePlayers();
        
    for (let player of activePlayerArr) {
                //check and see if any of the active players are colliding with "id"
        if ( 
            ((currentPlayer.y_position + 10) < (player.y_position)) ||
                    (currentPlayer.y_position > (player.y_position + 10)) ||
                    ((currentPlayer.x_position + 10) < player.x_position) ||
                    (currentPlayer.x_position > (player.x_position + 10))
                    
        ){
                    //
        } else if (currentPlayer.user_id !== player.user_id) {
            // console.log('player is colliding');
            if ((currentPlayer.infected === true) && (player.infected !== true)) {
                console.log('player is infecting');
                infected_count++;
                await infect(player);
                //await incrementInfections(currentPlayer);
            }
                    //nothing
        }

    }

}
