import { getActivePlayers } from '../fetch-utils.js';
const lobbiesButton = document.getElementById('to-lobbies');
const playerCard = document.querySelector('.player-cards');

lobbiesButton.addEventListener('click', () => {
    window.location.href = '../lobby-page';
});

window.addEventListener('load', async () => {
    renderPlayerCards();
    //should probably still display who won
});

async function renderPlayerCards() {

    const players = await getActivePlayers();

    for (let player of players) {
        const div = document.createElement('div');
        const name = document.createElement('h4');
        const infected = document.createElement('p');

        infected.textContent = 'Players infected: ' + player.num_infected;
        name.textContent = player.user_name;
        div.append(name, infected);
        playerCard.append(div);
    }
}