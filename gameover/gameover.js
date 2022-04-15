import { checkAuth, client, getActivePlayers, getMyProfile, getUser, unReady } from '../fetch-utils.js';
const lobbiesButton = document.getElementById('to-lobbies');
const playerCard = document.querySelector('.player-cards');

checkAuth();

//resets the start clicked bool on the host to prevent 
//players pulling instantly into a new game on returning to lobby
//redirects user to lobby page on click
lobbiesButton.addEventListener('click', async () => {
    const profile = await getMyProfile();
    if (profile.start_clicked === true) {
        await client
            .from('profiles')
            .update({ start_clicked: false })
            .match({ user_id: profile.user_id });
    }
    window.location.href = '../lobby-page';
});

//on load of gameover page renders player cards with game stats
//and unreadies all users 
window.addEventListener('load', async () => {
    const user = getUser();
    await unReady(user);
    renderPlayerCards();
});

//loops through and renders out a player card with the player's name and number of points earned
async function renderPlayerCards() {

    const players = await getActivePlayers();

    for (let player of players) {
        const div = document.createElement('div');
        const name = document.createElement('h4');
        const infected = document.createElement('p');
        div.classList.add('game-over-card');
        

        infected.textContent = 'Player score: ' + player.num_infected;
        
        name.textContent = player.user_name;

        if (player.infected === false) {
            div.classList.remove('game-over-card');
            div.classList.add('game-over-card-win');
            infected.textContent = '';
            if (player.fight_icon === 4){
                name.textContent = `😃  ${player.user_name} Survived`;
            }
            if (player.fight_icon === 2){
                name.textContent = `🤠  ${player.user_name} Survived`;
            }
            if (player.fight_icon === 3){
                name.textContent = `👺 ${player.user_name} Survived`;
            }
            if (player.fight_icon === 1){
                name.textContent = `🥚    ${player.user_name} Survived`;
            }
        }

        div.append(name, infected);
        playerCard.append(div);
    }
}