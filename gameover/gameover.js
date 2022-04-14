import { checkAuth, client, getActivePlayers, getMyProfile, getUser, unReady } from '../fetch-utils.js';
const lobbiesButton = document.getElementById('to-lobbies');
const playerCard = document.querySelector('.player-cards');

checkAuth();

lobbiesButton.addEventListener('click', () => {
    window.location.href = '../lobby-page';
});

window.addEventListener('load', async () => {
    const user = getUser();
    const profile = getMyProfile();
    await unReady(user);
    renderPlayerCards();
    if (profile.host === true) {
        await client
            .from('profiles')
            .update({ start_clicked: false })
            .match({ user_id: profile.user_id });
    }
});

async function renderPlayerCards() {

    const players = await getActivePlayers();

    for (let player of players) {
        const div = document.createElement('div');
        const name = document.createElement('h4');
        const infected = document.createElement('p');
        div.classList.add('game-over-card');

        infected.textContent = 'Players infected: ' + player.num_infected;
        name.textContent = player.user_name;
        div.append(name, infected);
        playerCard.append(div);
    }
}