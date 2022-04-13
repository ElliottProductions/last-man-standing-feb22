const SUPABASE_URL = 'https://pvznkxhqnmqddocjzgwz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2em5reGhxbm1xZGRvY2p6Z3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk0NTY1MDQsImV4cCI6MTk2NTAzMjUwNH0.dtTLwgwcNuDmXwAInmVa5_lH7gzBV2OgLuG5kJMg6dM';

export const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


export async function infect(player){
    console.log(player);
    await client
        .from('profiles')
        .update({ infected: true })
        .match({ user_id: player.user_id })
        .single();
}

export async function getInfectedPlayers() {
    const response = await client
        .from('profiles')
        .select('*')
        .match({ infected: true });
    
    return checkError(response);
}

export async function getReadyPlayers() {
    const response = await client
        .from('profiles')
        .select('*')
        .match({ is_ready: true });
    
    return checkError(response);
}

export async function createUser(){
    const response = await client
        .from('profiles')
        .insert({})
        .single();
    
    return checkError(response);
}

export async function getMyProfile() {
    const user = getUser();

    const response = await client
        .from('profiles')
        .select('*')
        .match({ email: user.email })
        .single();
    return (response.data);
}

export function getUser() {
    return client.auth.session() && client.auth.session().user;
}

export function checkAuth() {
    const user = getUser();

    if (!user) location.replace('../');
}

export function redirectIfLoggedIn() {
    if (getUser()) {
        location.replace('./lobby-page');
    }
}

export async function signupUser(email, password) {
    const response = await client.auth.signUp({ email, password });
    
    return response.user;
}

export async function createUserName(username, email){
    // const currentUser = getUser();
    await client
        .from('profiles')
        .update({ user_name: username })
        .match({ email: email });
        
}

export async function signInUser(email, password) {
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return (window.location.href = '../');
}
export async function deactivateUser(user){
    // const user = await getUser();
    await client 
        .from('profiles')
        .update({ active: false })
        .match({ user_id: user.id });
}

export async function activateUser(user){
    // const user = await getUser();
    await client 
        .from('profiles')
        .update({ active: true })
        .match({ user_id: user.id });
}
export async function updatePlayer(player, playerY, playerX){
    const response = await client
        .from('profiles')
        .update({ 
            y_position: playerY, 
            x_position: playerX, 
        })
        .match({ user_id: player.user_id })
        .single();

    return checkError (response);
}

export async function getActivePlayers() {
    const response = await client
        .from('profiles')
        .select('*')
        .match({ active: true });

    return checkError(response);
}
function checkError({ data, error }) {
    return error ? console.error(error) : data;
}

export async function endGameState() {
    window.location.replace('../gameover');
    alert('gameover');
}

export async function readyUp(user) {
    await client
        .from('profiles')
        .update({ is_ready: true })
        .match({ user_id: user.id });
    // console.log(user);
} 

export async function unReady(user) {
    await client
        .from('profiles')
        .update({ is_ready: false })
        .match({ user_id: user.id });
} 

export async function startGame(){
    window.location.replace('../game-page');
    alert('start game function is now running');
    

    

    
    


    
}