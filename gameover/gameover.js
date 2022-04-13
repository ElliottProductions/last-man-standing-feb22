import { getActivePlayers, getMyProfile, getUser } from '../fetch-utils.js';
const lobbiesButton = document.getElementById('to-lobbies');
const playerCard = document.querySelector('.player-cards');

lobbiesButton.addEventListener('click', () => {
    window.location.href = '../lobby-page';
});

window.addEventListener('load', async () => {
    // display card for each player in match 
    renderPlayerCards();
        // card : name, number of players infected, and time survived 'Winner' if they are so

});

async function renderPlayerCards() {

    const players = await getActivePlayers();

    for (let player of players) {
        const div = document.createElement('div');
        const name = document.createElement('h4');
        const infected = document.createElement('p');

        infected.textContent = player.infected;
        name.textContent = player.user_name;
        div.append(name, infected);
        playerCard.append(div);
    }
}