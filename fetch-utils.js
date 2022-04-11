const SUPABASE_URL = 'https://pvznkxhqnmqddocjzgwz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2em5reGhxbm1xZGRvY2p6Z3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk0NTY1MDQsImV4cCI6MTk2NTAzMjUwNH0.dtTLwgwcNuDmXwAInmVa5_lH7gzBV2OgLuG5kJMg6dM';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

export async function signInUser(email, password) {
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return (window.location.href = '../');
}

// function checkError({ data, error }) {
//     return error ? console.error(error) : data;
// }
