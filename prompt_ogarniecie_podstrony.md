# Prompt do wklejenia (ogarnięcie kolejnej podstrony NEXUS)

Skopiuj cały poniższy tekst, wklej razem z **uploadem 3 plików**: podstrony, którą chcesz ogarnąć + `index.html` + `game_log.html` (jako wzorzec stylu i wzorzec już wdrożonego rozwiązania), i wyślij.

---

Ogarnij załączoną podstronę NEXUS tak samo jak wcześniej zrobiliśmy z `index.html` i `game_log.html` (też załączone — potraktuj je jako wzorzec zarówno wizualny, jak i pod względem struktury kodu). Konkretnie:

1. **Ochrona logowaniem (Supabase auth guard)**
   - W `<head>` dodaj:
     ```html
     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
     <script src="/auth.js"></script>
     <style>body{visibility:hidden}</style>
     ```
   - Na końcu głównego `<script>` (po tym, jak dane lokalne zostaną wczytane i strona wyrenderowana) dodaj:
     ```javascript
     requireAuth().then(async session => {
       if (session) {
         document.body.style.visibility = 'visible';
         const emailEl = document.getElementById('user-email');
         if (emailEl) emailEl.textContent = session.user.email;

         const gotCloudData = await pullFromCloud();
         if (gotCloudData) renderAll(); // podmień renderAll() na właściwą funkcję renderującą tej strony, jeśli nazywa się inaczej
       }
     });
     ```

2. **Synchronizacja danych z chmurą (Supabase, tabela `nexus_data`)**
   - Znajdź funkcję/e zapisu danych do `localStorage` (np. `save()`) i po każdym zapisie lokalnym dodaj wywołanie debounce'owanego zapisu do chmury — wzorem z `game_log.html`: `scheduleCloudSave()` z `setTimeout(pushToCloud, 600)`.
   - `pushToCloud()` ma robić `upsert` do tabeli `nexus_data` z polami: `user_id` (z sesji), `module` (unikalna nazwa tej podstrony — nazwa pliku bez `.html`), `data` (cały lokalny stan strony jako obiekt), `updated_at`.
   - `pullFromCloud()` ma pobierać wiersz `nexus_data` dla `user_id` + `module`, nadpisywać nim lokalny stan i `localStorage`, i zwracać `true`/`false` w zależności czy dane były.
   - Jeśli podstrona ma więcej niż jeden lokalny stan (np. dwa oddzielne obiekty, jak `state` + `platState` w `game_log.html`), spakuj je razem w jeden obiekt `data` w chmurze, tak jak tam.

3. **Powrót do `index.html` przez logo/chmurkę**
   - Znajdź element z logo/nazwą marki w nawigacji (np. `.nav-brand`, `.brand`, link z `akatsuki_logo.png`) i upewnij się, że to `<a href="index.html">` (nie inny/nieistniejący plik, np. `hub.html`).

4. **Panel użytkownika w nawigacji**
   - Obok istniejących przycisków akcji w nawigacji dodaj (wzorem `game_log.html`):
     ```html
     <span id="user-email" style="align-self:center;font-size:0.75em;letter-spacing:1px;color:var(--muted);margin-left:6px;"></span>
     <button class="btn" id="logout-btn" onclick="logout()">Wyloguj</button>
     ```
   - Użyj klasy przycisku już istniejącej w tej podstronie (np. `.btn`), żeby wyglądał spójnie ze stylem tej konkretnej strony — nie twórz nowego stylu przycisku, jeśli podobny już tam jest.

5. **Ujednolicenie kolorystyki, fontów i paska nawigacji pod `index.html` / `game_log.html`**
   - Podmień paletę kolorów tej podstrony (zmienne CSS w `:root`, np. `--accent`, `--bg`, `--text`, `--gold`/`--purple` itp.) na paletę użytą w `index.html` i `game_log.html` — to ma być **ta sama kolorystyka w całym zestawie**, nie tylko podobna.
   - Zachowaj nazwy zmiennych CSS już istniejące w tej podstronie (żeby nie trzeba było zmieniać wszystkich odwołań w kodzie) — zmień tylko ich **wartości** na odpowiedniki z `index.html`/`game_log.html` (np. czerwono-czarny motyw z akcentem `#b30000`).
   - Podmień import fontów Google na ten z `game_log.html` (`Rajdhani` + `Orbitron` + `Inter`) i zamień wszystkie użycia dotychczasowych fontów tej podstrony na te trzy, analogicznie do ich roli w `game_log.html` (Orbitron — marka/nagłówki/duże liczby, Rajdhani — taby/przyciski/etykiety, Inter — tekst body).
   - Cały pasek nawigacji (`.nav`, `.nav-brand`, `.nav-logo`, `.nav-tab`, `.btn`, `.btn-gold`/odpowiednik) podmień 1:1 na styl z `game_log.html` (wysokość, padding, blur, `clip-path` na przyciskach, linia gradientowa na dole, podświetlenie aktywnej zakładki) — to ma wyglądać identycznie w całym zestawie, nie tylko podobnie.
   - **Logo w `.nav-brand` zawsze jako obrazek `akatsuki_logo.png`** (`<img class="nav-logo" src="akatsuki_logo.png" alt="Akatsuki Logo">`), tak jak w `game_log.html` — nigdy emoji, ikona ani inny placeholder (np. ⚡, 🎬 itp.) zamiast tego.
   - Układ strony (grid, rozmieszczenie elementów poza paskiem nawigacji) zostaw bez zmian — ujednolicamy warstwę wizualną (kolory/fonty/nawigację), nie strukturę treści.

6. **Na koniec**
   - Zapisz gotowy plik i pokaż mi do pobrania.
