import { checkAuth, logout, getMyProfile, updatePlayer, getActivePlayers, client, infect, getInfectedPlayers, endGameState, getUser } from '../fetch-utils.js';


checkAuth();

const logoutButton = document.getElementById('logout');

const gameArea = document.querySelector('.game-div');

logoutButton.addEventListener('click', () => {
    logout();
});

let moveSpeed = 10;
let infected_count = 0;
let currentPlayer;

//displays all active players and their random positions assigned by the function in lobby load
//alerts the player assigned to be the first infected that they are infected
window.addEventListener('load', async () => {
    currentPlayer = await getMyProfile();
    await fetchAndDisplayActivePlayers();
    await client
        .from('profiles')
        .on('UPDATE', async (payload) => {
            await fetchAndDisplayActivePlayers();
            payload; //this is the guy who actually gets updated
        })
        .subscribe();
    if (currentPlayer.infected === true){
        alert('You are patient zero');
    }
    
});

//displays active players with their selected icons and usernames and moves 
//their position on the screen according to their X Y coordinates
//determines if the amount of players infected has reached the threshold to end the game
async function fetchAndDisplayActivePlayers() {
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
        if (player.infected === true){
            playerEl.classList.add('infected');
        }
        gameArea.append(playerEl);
    }

    const infectedPlayer = await getInfectedPlayers();

    if (activePlayers.length - 1 === infectedPlayer.length) {
        const user = getUser();
        await endGameState(infected_count, user);
    }
}

const GAME_HEIGHT = 490;
const GAME_WIDTH = 700;

//enables inputs to move characters around and calls function to 
//determine if a collision has occurred
window.addEventListener('keydown', async (e) => {
    currentPlayer = await getMyProfile();
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

//references current player's position against other players to determine
//if their X Y position has collided
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
            if ((currentPlayer.infected === true) && (player.infected !== true)) {
                infected_count++;
                await infect(player);
            }
                    //nothing
        }

    }

}

