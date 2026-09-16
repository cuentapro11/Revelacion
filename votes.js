

  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
  const SUPABASE_URL = 'https://jdtlrtyhkhaqffrckdag.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_6KgKwAVY5HP_g3iaOD8cYw_nCjdygcR';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  let yaVoto = false;
  let votos = { nino: 0, nina: 0 };
  const statusEl = document.getElementById('status');

  async function cargarVotos() {
    try {
      const { data, error } = await supabase.from('team_votes').select('nino, nina').eq('id', 1).single();
      if (error) { votos = { nino: 46, nina: 53 }; return; }
      votos = data;
    } catch (err) {
      votos = { nino: 46, nina: 53 };
    }
  }

  const DECOR_PINK_HEART = "images/DECOR_PINK_HEART.png";
  const DECOR_BLUE_HEART = "images/DECOR_BLUE_HEART.png";

  function spawnConfetti(colorHex) {
    const colors = [colorHex, '#ffe08a', '#ffffff', colorHex];
    for (let i = 0; i < 26; i++) {
      const c = document.createElement('span');
      c.className = 'confetti-piece';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDuration = (1.6 + Math.random() * 1.2) + 's';
      c.style.animationDelay = (Math.random() * 0.3) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3200);
    }
  }

  function mostrarResultado() {
    const total = votos.nino + votos.nina;
    const pNino = total > 0 ? Math.round((votos.nino / total) * 100) : 50;
    const pNina = 100 - pNino;
    document.getElementById('fillNino').style.width = pNino + '%';
    document.getElementById('fillNina').style.width = pNina + '%';
    document.getElementById('pctNino').textContent = pNino + '%';
    document.getElementById('pctNina').textContent = pNina + '%';
    document.getElementById('resultPanel').classList.add('show');
  }

  async function vote(team) {
    if (yaVoto) return;
    yaVoto = true;
    const btn = team === 'nino' ? document.getElementById('btn-nino') : document.getElementById('btn-nina');
    const otherBtn = team === 'nino' ? document.getElementById('btn-nina') : document.getElementById('btn-nino');
    btn.classList.add('pop');
    spawnConfetti(team === 'nino' ? '#6fb3e0' : '#e06f9c');
    btn.disabled = true; otherBtn.disabled = true;

    const { data, error } = await (async () => {
      try {
        return await supabase.rpc('increment_vote', { equipo: team });
      } catch (err) {
        return { data: null, error: err };
      }
    })();
    if (!error && data && data.length) { votos = data[0]; } else { votos[team] += 1; }

    // 1) mostrar la tarjeta de "qué traer" para el team elegido
    const bringNote = document.getElementById('bringNote');
    if (team === 'nino') {
      document.getElementById('bringEmoji').textContent = '💙';
      document.getElementById('bringTitle').textContent = '¡Votaste por Team Niño!';
      document.getElementById('bringItem').innerHTML = 'Para apoyar a tu team,<br>te toca traer <b>toallitas húmedas</b>';
      document.getElementById('thanksMsg').textContent = 'Votaste por Team Niño 💙';
    } else {
      document.getElementById('bringEmoji').textContent = '💗';
      document.getElementById('bringTitle').textContent = '¡Votaste por Team Niña!';
      document.getElementById('bringItem').innerHTML = 'Para apoyar a tu team,<br>te toca traer <b>pañales (Pampers)</b>';
      document.getElementById('thanksMsg').textContent = 'Votaste por Team Niña 💗';
    }
    setTimeout(() => { bringNote.classList.add('show'); }, 400);

    // 2) al cerrarse esa tarjeta (unos segundos despues), aparece la barra de votacion
    setTimeout(() => {
      bringNote.classList.remove('show');
      setTimeout(mostrarResultado, 400);
    }, 3800);
  }

  document.getElementById('btn-nino').addEventListener('click', () => vote('nino'));
  document.getElementById('btn-nina').addEventListener('click', () => vote('nina'));
  cargarVotos();

