import { uninfect, updatePlayer, activateUser, deactivateUser, client, checkAuth, getActivePlayers, getUser, logout, readyUp, unReady, startGame, getMyProfile } from '../fetch-utils.js';

checkAuth();

const logoutButton = document.getElementById('logout');
const userListEl = document.querySelector('.user-list');
const readyBtn = document.querySelector('.ready-up');

logoutButton.addEventListener('click', async () => {
    const user = getUser();
    await deactivateUser(user);
    logout();

});


window.addEventListener('load', async () => {
    let randomY = Math.ceil(Math.random() * 490);
    let randomX = Math.ceil(Math.random() * 700);
    const profile = await getMyProfile();
    await updatePlayer(profile, randomY, randomX);//change inputs
    userListEl.innerHTML = '';
    const user = getUser();
    await activateUser(user);
    
    await displayActivePlayers();

    await unReady(user);
    await uninfect(profile);
    
    await client
        .from('profiles')
        .on('UPDATE', async (payload) => {
            await displayActivePlayers();
            payload;
        })
        .subscribe();
});

readyBtn.addEventListener('click', async () => {
    userListEl.innerHTML = '';
    const user = getUser();
    const profile = await getMyProfile();


    if (profile.is_ready === false) {
        await readyUp(user);

    } else {
        await unReady(user);
    }
    // displayActivePlayers();
    //get random x and y positions
    
});

async function displayActivePlayers() {
    console.log(`Im displayin!!!`);
    userListEl.innerHTML = '';
    let allReady = true;
    const userArr = await getActivePlayers();
    for (let player of userArr) {
        if (player.is_ready === false) {
            allReady = false;
        }
    }
    if (allReady === true) {
        await startGame();
    }

    for (let user of userArr) {
        if (user.active) {
            const userDiv = document.createElement('div');
            const userName = document.createElement('p');
            const userReady = document.createElement('p');
            userName.textContent = user.user_name;
            if (user.is_ready) {
                userReady.textContent = '☑️';
            } else {
                userReady.textContent = '❎';
            }
            userDiv.append(userName, userReady);
            userListEl.append(userDiv);}
    }

}
{/* <main>
        <h1>Lobby 1</h1>
        <section class="lobby-left">
            <div class="fighter-selection">
                <h3>Belect a bighter</h3>
                <button class="smiley">😃</button>
                <button class="hap">🤠</button>
                <button class="tengu">👺</button>
                <button class="EGG">🥚</button>
            </div>
        </section>
        <section class="lobby-center">
            <div>
                <h2>Bones 😃  ☑️</h2>              
                <h2>Bill 🥚  ☑️</h2>                
                <h2>Bargaret Bhatcher 🤠  ❎</h2>
                <h3>Ready?</h3> <input type="checkbox">
            </div>
        </section>
        <section class="lobby-right">
            <br>
            <form id="player-chat" class="player-chatbox">
                <input type="text" name="chat-box"> <button>Bend Bessage</button>
            </form>
        </section> */}

