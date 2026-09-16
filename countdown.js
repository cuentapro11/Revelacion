

  const eventDate = new Date('2026-05-17T16:00:00');
  function tick(){
    let diff = eventDate - new Date();
    if (diff < 0) diff = 0;
    document.getElementById('cd-d').textContent = String(Math.floor(diff/86400000)).padStart(2,'0');
    document.getElementById('cd-h').textContent = String(Math.floor(diff/3600000)%24).padStart(2,'0');
    document.getElementById('cd-m').textContent = String(Math.floor(diff/60000)%60).padStart(2,'0');
    document.getElementById('cd-s').textContent = String(Math.floor(diff/1000)%60).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);

