import { getInfectedPlayers, getReadyPlayers, infect, selectFighter, uninfect, updatePlayer, activateUser, deactivateUser, client, checkAuth, getActivePlayers, getUser, logout, readyUp, unReady, startGame, getMyProfile } from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');
const userListEl = document.querySelector('.user-list');
const readyBtn = document.querySelector('.ready-up');
const smiley = document.querySelector('.smiley');
const hap = document.querySelector('.hap');
const tengu = document.querySelector('.tengu');
const egg = document.querySelector('.EGG');
const startButton = document.getElementById('start-game');

//This event listener calls fetch util that reads num 
//of infected players and determines if one needs to be randomly assigned
//and checks to see if anybody has been assigned the host 
//and if not assigns the first logged in user a host property in supabase
//and also disables the button on click
startButton.addEventListener('click', async ()=>{
    const infectedArr = await getInfectedPlayers();
    if (infectedArr.length === 0){
        const userArr = await getReadyPlayers();
        const random = Math.floor((Math.random()) * (userArr.length - 1));
        const chosen = userArr[random];
        await infect(chosen);
    }
    const profile = await getMyProfile();
    if (profile.host === true) {
        await client
            .from('profiles')
            .update({ start_clicked: true })
            .match({ user_id: profile.user_id });
    }


    startButton.disabled = true;
});

//deactivates all users on logout to prevent absent users 
//from being assigned game properties
logoutButton.addEventListener('click', async () => {
    const user = getUser();
    await deactivateUser(user);
    logout();
});

//calls fetch utils to assign a """"""player model""""""" to them
hap.addEventListener('click', async () => {
    const user = await getMyProfile();
    await selectFighter(user, '2');
});

//calls fetch utils to assign a """"""player model""""""" to them
tengu.addEventListener('click', async () => {
    const user = await getMyProfile();
    await selectFighter(user, '3');
});

//calls fetch utils to assign a """"""player model""""""" to them
egg.addEventListener('click', async () => {
    const user = await getMyProfile();
    await selectFighter(user, '1');
});

//calls fetch utils to assign a """"""player model""""""" to them
smiley.addEventListener('click', async () => {
    const user = await getMyProfile();
    await selectFighter(user, '4');
});

//on load of game page assigns a random position to every player
//clears the DOM
//activates and displays all active players
//uninfects players when returning from the gameover page
window.addEventListener('load', async () => {
    let randomY = Math.ceil(Math.random() * 490);
    let randomX = Math.ceil(Math.random() * 700);
    const profile = await getMyProfile();
   
    await updatePlayer(profile, randomY, randomX);
    userListEl.innerHTML = '';
    const user = getUser();
    await activateUser(user);
    await displayActivePlayers();
    await uninfect(profile);
    
    await client
        .from('profiles')
        .on('UPDATE', async (payload) => {
            await displayActivePlayers();
            payload;
        })
        .subscribe();
});

//toggles ready state for the user clicking it
readyBtn.addEventListener('click', async () => {
    userListEl.innerHTML = '';
    const user = getUser();
    const profile = await getMyProfile();


    if (profile.is_ready === false) {
        await readyUp(user);

    } else {
        await unReady(user);
    }
});

//displays all players and shows their usernames and player icons  
//and determines if a game is ready to begin
async function displayActivePlayers() {
    userListEl.innerHTML = '';
    let allReady = true;
    const userArr = await getActivePlayers();
    for (let player of userArr) {
        if (player.is_ready === false) {
            allReady = false;
        }
    }

    for (let user of userArr) {
        if (user.host === true && user.start_clicked === true && allReady === true) {
            await startGame();
        } 
        if (user.active) {
            const userDiv = document.createElement('div');
            const userName = document.createElement('p');
            const userReady = document.createElement('p');
            if (user.fight_icon === 4){
                userName.textContent = user.user_name + '😃';
            }
            if (user.fight_icon === 2){
                userName.textContent = user.user_name + '🤠';
            }
            if (user.fight_icon === 3){
                userName.textContent = user.user_name + '👺';
            }
            if (user.fight_icon === 1){
                userName.textContent = user.user_name + '🥚';
            }
            if (user.host === true) {
                userName.textContent += '👑' + '(host)';
            }
            if (user.is_ready) {
                userReady.textContent = '☑️';
            } else {
                userReady.textContent = '❎';
            }
            userDiv.append(userName, userReady);
            userListEl.append(userDiv);}
    }

}