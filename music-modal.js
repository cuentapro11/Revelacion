// ===== Modal de bienvenida + música de fondo (YouTube) =====
// Mismo sistema usado en las otras invitaciones: el player de YouTube se
// precarga desde el inicio (no en el click) para que playVideo() pueda
// ejecutarse de forma síncrona dentro del gesto del usuario. Esto es lo
// que exige iOS Safari para permitir audio automático.

let ymPlayer = null;
let ymPlayerReady = false;
let ymIsPlaying = false;
let ymEnableMusic = false;

const YT_VIDEO_ID = 'Rir_fuLX7HM';

function enterWithMusicClick() {
    ymEnableMusic = true;
    const modal = document.getElementById('welcomeModal');
    if (modal) modal.style.display = 'none';

    if (ymPlayerReady && ymPlayer) {
        startYmPlayback();
    }
    // Si el player todavía no está listo (conexión lenta), onPlayerReady se
    // encarga de reproducir apenas termine de inicializar.
}

function enterWithoutMusicClick() {
    ymEnableMusic = false;
    const modal = document.getElementById('welcomeModal');
    if (modal) modal.style.display = 'none';
}

function startYmPlayback() {
    const musicPlayer = document.getElementById('musicPlayer');
    if (musicPlayer) musicPlayer.style.display = 'block';
    ymPlayer.unMute();
    ymPlayer.setVolume(100);
    ymPlayer.playVideo();
    ymIsPlaying = true;
    updateYmIcon();
    // En iOS/Safari a veces el primer playVideo() no arranca el audio;
    // reintentamos una vez, todavía dentro del mismo gesto del usuario.
    setTimeout(() => {
        if (ymPlayer && typeof ymPlayer.getPlayerState === 'function' && ymPlayer.getPlayerState() !== 1) {
            ymPlayer.unMute();
            ymPlayer.playVideo();
        }
    }, 300);
}

function setupModalButtons() {
    const enterWithMusic = document.getElementById('enterWithMusic');
    const enterWithoutMusic = document.getElementById('enterWithoutMusic');
    const modal = document.getElementById('welcomeModal');

    if (enterWithMusic) {
        enterWithMusic.onclick = function() {
            ymEnableMusic = true;
            if (modal) modal.style.display = 'none';
            if (ymPlayerReady && ymPlayer) startYmPlayback();
        };
    }

    if (enterWithoutMusic) {
        enterWithoutMusic.onclick = function() {
            ymEnableMusic = false;
            if (modal) modal.style.display = 'none';
        };
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupModalButtons();

    const modal = document.getElementById('welcomeModal');
    if (modal) modal.style.display = 'flex';

    loadYouTubeAPI();
});

window.addEventListener('load', function() {
    setupModalButtons();
});

function loadYouTubeAPI() {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(script);
    window.onYouTubeIframeAPIReady = initializeYouTubePlayer;
}

function initializeYouTubePlayer() {
    if (ymPlayer) return; // ya inicializado

    ymPlayer = new YT.Player('youtube-player', {
        height: '1',
        width: '1',
        videoId: YT_VIDEO_ID,
        playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            playlist: YT_VIDEO_ID
        },
        events: {
            'onReady': onYmPlayerReady,
            'onStateChange': onYmPlayerStateChange,
            'onError': onYmPlayerError
        }
    });
}

function onYmPlayerReady(event) {
    ymPlayerReady = true;
    const musicToggle = document.getElementById('musicToggle');
    if (musicToggle) musicToggle.addEventListener('click', toggleYmMusic);

    // Caso borde: el usuario ya hizo click en "con música" antes de que el
    // player terminara de inicializar.
    if (ymEnableMusic && !ymIsPlaying) {
        const musicPlayer = document.getElementById('musicPlayer');
        if (musicPlayer) musicPlayer.style.display = 'block';
        event.target.unMute();
        event.target.setVolume(100);
        event.target.playVideo();
        ymIsPlaying = true;
        updateYmIcon();
    }
}

function onYmPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        ymIsPlaying = true;
    } else if (event.data === YT.PlayerState.PAUSED) {
        ymIsPlaying = false;
    }
    updateYmIcon();
}

function onYmPlayerError(event) {
    console.log('Error al cargar el video de YouTube');
    ymIsPlaying = false;
    updateYmIcon();
}

function toggleYmMusic() {
    if (!ymPlayer) return;
    if (ymIsPlaying) {
        ymPlayer.pauseVideo();
        ymIsPlaying = false;
    } else {
        ymPlayer.playVideo();
        ymIsPlaying = true;
    }
    updateYmIcon();
}

function updateYmIcon() {
    const volumeIcon = document.getElementById('volumeIcon');
    if (!volumeIcon) return;

    if (ymIsPlaying) {
        volumeIcon.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#1f3864" stroke="#fff" stroke-width="1"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.08" stroke="#1f3864" stroke-width="2"></path>
            <circle cx="6.5" cy="12" r="1" fill="#ec6e9a"/>
        `;
    } else {
        volumeIcon.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#1f3864" stroke="#fff" stroke-width="1"></polygon>
            <line x1="19" y1="9" x2="17" y2="11" stroke="#ff6b6b" stroke-width="2"></line>
            <line x1="17" y1="9" x2="19" y2="11" stroke="#ff6b6b" stroke-width="2"></line>
            <circle cx="6.5" cy="12" r="1" fill="#ff6b6b"/>
        `;
    }
}
