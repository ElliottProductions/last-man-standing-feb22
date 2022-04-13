import { unReady, getMyProfile, uninfect, getUser } from '../fetch-utils.js';
const lobbiesButton = document.getElementById('to-lobbies');

lobbiesButton.addEventListener('click', () => {
    window.location.href = '../lobby-page';
});

window.addEventListener('load', async () => {

    const user = getUser();
    const profile = await getMyProfile();
    await unReady(user);
    await uninfect(profile);
    //reset users to unready in supabase
    //remove infection in supabase
    // display card for each player in match 
        // card : name, number of players infected, and time survived 'Winner' if they are so
        
    

});