// === Konfiguracja Supabase ===
const SUPABASE_URL = 'https://riqfubddbyvsbqqcpzuc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpcWZ1YmRkYnl2c2JxcWNwenVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5ODc2MzksImV4cCI6MjEwMjU2MzYzOX0.r4tiEvvzH6o5aw_TvgTPhZ7AKSkKlXlDD6KPYQUbHG8';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// === Guard: blokuje dostęp niezalogowanym ===
async function requireAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    // zapamiętaj, dokąd użytkownik chciał iść
    const redirectTo = encodeURIComponent(location.pathname);
    location.href = `/login.html?redirect=${redirectTo}`;
    return null;
  }
  return session;
}

// === Wylogowanie (użyj w przycisku "Wyloguj") ===
async function logout() {
  await supabaseClient.auth.signOut();
  location.href = '/login.html';
}

// === Nasłuch na wygaśnięcie/zmianę sesji w tle ===
supabaseClient.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') {
    location.href = '/login.html';
  }
});