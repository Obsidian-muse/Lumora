// Persistent Audio System - Survives page navigation
class PersistentAudio {
  constructor() {
    this.storageKey = 'persistentAudio';
    this.audio = null;
    this.settings = { music: 50, effects: 70, muted: false };
    this.init();
  }

  init() {
    // Load settings from localStorage
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      const appSettings = JSON.parse(saved);
      if (appSettings.sound) {
        this.settings = appSettings.sound;
      }
    }

    // Check if audio is already playing in another tab/window
    const audioState = sessionStorage.getItem(this.storageKey);
    if (audioState) {
      const state = JSON.parse(audioState);
      if (state.isPlaying && Date.now() - state.lastUpdate < 5000) {
        // Audio is playing in another context, don't create new instance
        return;
      }
    }

    // Create audio instance
    this.createAudio();
    this.startHeartbeat();
  }

  createAudio() {
    if (this.audio) return;

    this.audio = new Audio('assets/music1.mp3');
    this.audio.loop = true;
    this.audio.volume = this.settings.music / 100;
    this.audio.muted = this.settings.muted;

    // Restore playback position if available
    const audioState = sessionStorage.getItem(this.storageKey);
    if (audioState) {
      const state = JSON.parse(audioState);
      if (state.currentTime) {
        this.audio.currentTime = state.currentTime;
      }
    }

    // Start playing
    this.audio.play().catch(() => {
      // Auto-play blocked, wait for user interaction
      document.addEventListener('click', () => {
        this.audio.play();
      }, { once: true });
    });

    // Save state periodically
    this.audio.addEventListener('timeupdate', () => {
      this.saveState();
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.saveState();
    });
  }

  saveState() {
    if (!this.audio) return;
    
    const state = {
      currentTime: this.audio.currentTime,
      isPlaying: !this.audio.paused,
      lastUpdate: Date.now()
    };
    sessionStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  startHeartbeat() {
    // Update heartbeat every 2 seconds
    setInterval(() => {
      if (this.audio && !this.audio.paused) {
        this.saveState();
      }
    }, 2000);
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    if (this.audio) {
      this.audio.volume = this.settings.music / 100;
      this.audio.muted = this.settings.muted;
    }
  }
}

// Global Theme System
class GlobalThemeSystem {
  constructor() {
    this.themes = {
      galaxy: {
        bg: 'linear-gradient(rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.5)), url("assets/dreamy.jpeg") no-repeat center center fixed',
        accent: '#7aa3ff',
        name: 'Galaxy'
      },
      sakura: {
        bg: 'linear-gradient(rgba(255, 182, 193, 0.4), rgba(255, 105, 180, 0.3)), url("assets/dreamy.jpeg") no-repeat center center fixed',
        accent: '#ffb6c1',
        name: 'Sakura'
      },
      pastel: {
        bg: 'linear-gradient(rgba(173, 216, 230, 0.4), rgba(221, 160, 221, 0.3)), url("assets/dreamy.jpeg") no-repeat center center fixed',
        accent: '#dda0dd',
        name: 'Pastel'
      },
      forest: {
        bg: 'linear-gradient(rgba(34, 139, 34, 0.4), rgba(46, 125, 50, 0.3)), url("assets/dreamy.jpeg") no-repeat center center fixed',
        accent: '#4caf50',
        name: 'Forest'
      },
      neon: {
        bg: 'linear-gradient(rgba(255, 20, 147, 0.4), rgba(138, 43, 226, 0.3)), url("assets/dreamy.jpeg") no-repeat center center fixed',
        accent: '#ff1493',
        name: 'Neon'
      }
    };
    this.currentTheme = 'galaxy';
    this.init();
  }

  init() {
    // Load saved theme
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.theme && this.themes[settings.theme]) {
          this.currentTheme = settings.theme;
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    }
    
    // Apply theme on page load
    this.applyTheme(this.currentTheme);
  }

  applyTheme(themeName) {
    if (!this.themes[themeName]) return;
    
    const theme = this.themes[themeName];
    this.currentTheme = themeName;
    
    // Apply to body
    document.body.style.background = theme.bg;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    
    // Update CSS variables
    document.documentElement.style.setProperty('--accent-color', theme.accent);
    document.documentElement.style.setProperty('--theme-accent', theme.accent);
    
    // Update data attribute for CSS targeting
    document.body.setAttribute('data-theme', themeName);
    
    // Save to localStorage
    this.saveTheme();
  }

  saveTheme() {
    const saved = localStorage.getItem('appSettings') || '{}';
    try {
      const settings = JSON.parse(saved);
      settings.theme = this.currentTheme;
      localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      localStorage.setItem('appSettings', JSON.stringify({ theme: this.currentTheme }));
    }
  }

  getThemes() {
    return this.themes;
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

// Global Language System
class GlobalLanguageSystem {
  constructor() {
    this.translations = {
      en: {
        // Main page
        'mood-tracker': 'Mood Tracker',
        'how-are-you-feeling': 'How are you feeling today?',
        'write-thoughts': 'Write down your thoughts...',
        'log-mood': 'Log My Mood',
        'view-journal': 'View Journal',
        
        // Games page
        'mini-games': 'Mini Games',
        'whisper-garden': 'Whisper Garden',
        'star-stitcher': 'Star Stitcher',
        'aura-comb': 'Aura Comb',
        'back-to-main': 'Back to Main',
        
        // Journal page
        'journal-entries': 'Journal Entries',
        'no-entries': 'No journal entries yet. Start by logging your mood!',
        'back-to-games': 'Back to Games',
        
        // Settings page
        'settings': 'Settings',
        'account-settings': 'Account Settings',
        'theme-settings': 'Theme Settings',
        'language-settings': 'Language Settings',
        'notification-settings': 'Notification Settings',
        'privacy-settings': 'Privacy Settings',
        'sound-settings': 'Sound Settings',
        'reset-backup': 'Reset & Backup',
        'save-changes': 'Save Changes',
        
        // Common
        'back': 'Back',
        'name': 'Name',
        'email': 'Email',
        'password': 'Password',
        'language': 'Language',
        'notifications': 'Notifications',
        'privacy': 'Privacy',
        'sound': 'Sound',
        'backup': 'Backup',
        'reset': 'Reset'
      },
      es: {
        // Main page
        'mood-tracker': 'Rastreador de Estado de Ánimo',
        'how-are-you-feeling': '¿Cómo te sientes hoy?',
        'write-thoughts': 'Escribe tus pensamientos...',
        'log-mood': 'Registrar Mi Estado de Ánimo',
        'view-journal': 'Ver Diario',
        
        // Games page
        'mini-games': 'Mini Juegos',
        'whisper-garden': 'Jardín Susurrante',
        'star-stitcher': 'Cosedor de Estrellas',
        'aura-comb': 'Peine de Aura',
        'back-to-main': 'Volver al Inicio',
        
        // Journal page
        'journal-entries': 'Entradas del Diario',
        'no-entries': '¡Aún no hay entradas en el diario. Comienza registrando tu estado de ánimo!',
        'back-to-games': 'Volver a Juegos',
        
        // Settings page
        'settings': 'Configuración',
        'account-settings': 'Configuración de Cuenta',
        'theme-settings': 'Configuración de Tema',
        'language-settings': 'Configuración de Idioma',
        'notification-settings': 'Configuración de Notificaciones',
        'privacy-settings': 'Configuración de Privacidad',
        'sound-settings': 'Configuración de Sonido',
        'reset-backup': 'Restablecer y Respaldo',
        'save-changes': 'Guardar Cambios',
        
        // Common
        'back': 'Atrás',
        'name': 'Nombre',
        'email': 'Correo',
        'password': 'Contraseña',
        'language': 'Idioma',
        'notifications': 'Notificaciones',
        'privacy': 'Privacidad',
        'sound': 'Sonido',
        'backup': 'Respaldo',
        'reset': 'Restablecer'
      },
      fr: {
        // Main page
        'mood-tracker': 'Suivi d\'Humeur',
        'how-are-you-feeling': 'Comment vous sentez-vous aujourd\'hui?',
        'write-thoughts': 'Écrivez vos pensées...',
        'log-mood': 'Enregistrer Mon Humeur',
        'view-journal': 'Voir le Journal',
        
        // Games page
        'mini-games': 'Mini Jeux',
        'whisper-garden': 'Jardin Chuchoté',
        'star-stitcher': 'Couseur d\'Étoiles',
        'aura-comb': 'Peigne d\'Aura',
        'back-to-main': 'Retour à l\'Accueil',
        
        // Journal page
        'journal-entries': 'Entrées du Journal',
        'no-entries': 'Aucune entrée de journal pour le moment. Commencez par enregistrer votre humeur!',
        'back-to-games': 'Retour aux Jeux',
        
        // Settings page
        'settings': 'Paramètres',
        'account-settings': 'Paramètres du Compte',
        'theme-settings': 'Paramètres du Thème',
        'language-settings': 'Paramètres de Langue',
        'notification-settings': 'Paramètres de Notification',
        'privacy-settings': 'Paramètres de Confidentialité',
        'sound-settings': 'Paramètres Audio',
        'reset-backup': 'Réinitialiser et Sauvegarder',
        'save-changes': 'Sauvegarder les Modifications',
        
        // Common
        'back': 'Retour',
        'name': 'Nom',
        'email': 'Email',
        'password': 'Mot de passe',
        'language': 'Langue',
        'notifications': 'Notifications',
        'privacy': 'Confidentialité',
        'sound': 'Son',
        'backup': 'Sauvegarde',
        'reset': 'Réinitialiser'
      },
      de: {
        // Main page
        'mood-tracker': 'Stimmungs-Tracker',
        'how-are-you-feeling': 'Wie fühlst du dich heute?',
        'write-thoughts': 'Schreibe deine Gedanken auf...',
        'log-mood': 'Meine Stimmung Protokollieren',
        'view-journal': 'Tagebuch Anzeigen',
        
        // Games page
        'mini-games': 'Mini-Spiele',
        'whisper-garden': 'Flüster-Garten',
        'star-stitcher': 'Sternen-Näher',
        'aura-comb': 'Aura-Kamm',
        'back-to-main': 'Zurück zur Hauptseite',
        
        // Journal page
        'journal-entries': 'Tagebuch-Einträge',
        'no-entries': 'Noch keine Tagebuch-Einträge. Beginne damit, deine Stimmung zu protokollieren!',
        'back-to-games': 'Zurück zu Spielen',
        
        // Settings page
        'settings': 'Einstellungen',
        'account-settings': 'Konto-Einstellungen',
        'theme-settings': 'Thema-Einstellungen',
        'language-settings': 'Sprach-Einstellungen',
        'notification-settings': 'Benachrichtigungs-Einstellungen',
        'privacy-settings': 'Datenschutz-Einstellungen',
        'sound-settings': 'Ton-Einstellungen',
        'reset-backup': 'Zurücksetzen & Sicherung',
        'save-changes': 'Änderungen Speichern',
        
        // Common
        'back': 'Zurück',
        'name': 'Name',
        'email': 'E-Mail',
        'password': 'Passwort',
        'language': 'Sprache',
        'notifications': 'Benachrichtigungen',
        'privacy': 'Datenschutz',
        'sound': 'Ton',
        'backup': 'Sicherung',
        'reset': 'Zurücksetzen'
      },
      ja: {
        // Main page
        'mood-tracker': '気分トラッカー',
        'how-are-you-feeling': '今日の気分はいかがですか？',
        'write-thoughts': '思考を書き留めてください...',
        'log-mood': '気分を記録する',
        'view-journal': '日記を見る',
        
        // Games page
        'mini-games': 'ミニゲーム',
        'whisper-garden': 'ささやきの庭',
        'star-stitcher': 'スターステッチャー',
        'aura-comb': 'オーラコーム',
        'back-to-main': 'メインに戻る',
        
        // Journal page
        'journal-entries': '日記エントリー',
        'no-entries': 'まだ日記エントリーがありません。気分を記録することから始めましょう！',
        'back-to-games': 'ゲームに戻る',
        
        // Settings page
        'settings': '設定',
        'account-settings': 'アカウント設定',
        'theme-settings': 'テーマ設定',
        'language-settings': '言語設定',
        'notification-settings': '通知設定',
        'privacy-settings': 'プライバシー設定',
        'sound-settings': 'サウンド設定',
        'reset-backup': 'リセット＆バックアップ',
        'save-changes': '変更を保存',
        
        // Common
        'back': '戻る',
        'name': '名前',
        'email': 'メール',
        'password': 'パスワード',
        'language': '言語',
        'notifications': '通知',
        'privacy': 'プライバシー',
        'sound': 'サウンド',
        'backup': 'バックアップ',
        'reset': 'リセット'
      },
      zh: {
        // Main page
        'mood-tracker': '心情追踪器',
        'how-are-you-feeling': '你今天感觉如何？',
        'write-thoughts': '写下你的想法...',
        'log-mood': '记录我的心情',
        'view-journal': '查看日记',
        
        // Games page
        'mini-games': '迷你游戏',
        'whisper-garden': '低语花园',
        'star-stitcher': '星星缝合师',
        'aura-comb': '光环梳',
        'back-to-main': '返回主页',
        
        // Journal page
        'journal-entries': '日记条目',
        'no-entries': '还没有日记条目。从记录你的心情开始吧！',
        'back-to-games': '返回游戏',
        
        // Settings page
        'settings': '设置',
        'account-settings': '账户设置',
        'theme-settings': '主题设置',
        'language-settings': '语言设置',
        'notification-settings': '通知设置',
        'privacy-settings': '隐私设置',
        'sound-settings': '声音设置',
        'reset-backup': '重置和备份',
        'save-changes': '保存更改',
        
        // Common
        'back': '返回',
        'name': '姓名',
        'email': '邮箱',
        'password': '密码',
        'language': '语言',
        'notifications': '通知',
        'privacy': '隐私',
        'sound': '声音',
        'backup': '备份',
        'reset': '重置'
      }
    };
    
    this.currentLanguage = 'en';
    this.init();
  }

  init() {
    // Load saved language
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.language && this.translations[settings.language]) {
          this.currentLanguage = settings.language;
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    }
    
    // Apply language on page load
    this.applyLanguage(this.currentLanguage);
  }

  applyLanguage(languageCode) {
    if (!this.translations[languageCode]) return;
    
    this.currentLanguage = languageCode;
    
    // Update HTML lang attribute
    document.documentElement.lang = languageCode;
    
    // Translate all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      const translation = this.translations[languageCode][key];
      if (translation) {
        if (element.tagName === 'INPUT' && element.type === 'text') {
          element.placeholder = translation;
        } else if (element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
    
    // Save to localStorage
    this.saveLanguage();
  }

  saveLanguage() {
    const saved = localStorage.getItem('appSettings') || '{}';
    try {
      const settings = JSON.parse(saved);
      settings.language = this.currentLanguage;
      localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      localStorage.setItem('appSettings', JSON.stringify({ language: this.currentLanguage }));
    }
  }

  translate(key) {
    return this.translations[this.currentLanguage][key] || key;
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getAvailableLanguages() {
    return Object.keys(this.translations);
  }
}

// Initialize global systems
let globalTheme, globalLanguage;

function initGlobalSystems() {
  globalTheme = new GlobalThemeSystem();
  globalLanguage = new GlobalLanguageSystem();
}

// Global functions for theme and language switching
function switchTheme(themeName) {
  if (globalTheme) {
    globalTheme.applyTheme(themeName);
  }
}

function switchLanguage(languageCode) {
  if (globalLanguage) {
    globalLanguage.applyLanguage(languageCode);
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  initGlobalSystems();
});

// Initialize persistent audio
const persistentAudio = new PersistentAudio();

// Global audio functions for compatibility
function initGlobalAudio() {
  // Already handled by PersistentAudio constructor
}

function updateGlobalAudioSettings(newSettings) {
  persistentAudio.updateSettings(newSettings);
}

// Create sound effects using Web Audio API
function createSoundEffect(frequency, duration, type = 'sine') {
  if (persistentAudio.settings.muted) return;
  
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = type;
  
  const volume = (persistentAudio.settings.effects / 100) * 0.3;
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

// Play sound effects globally
function playGlobalSound(type) {
  if (persistentAudio.settings.muted) return;
  
  switch(type) {
    case 'click':
      createSoundEffect(800, 0.1);
      break;
    case 'success':
      createSoundEffect(600, 0.2);
      setTimeout(() => createSoundEffect(800, 0.2), 100);
      break;
    case 'error':
      createSoundEffect(300, 0.3);
      break;
    case 'toggle':
      createSoundEffect(1000, 0.1);
      break;
    case 'hover':
      createSoundEffect(1200, 0.05);
      break;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Add click sounds to all buttons and links
  document.querySelectorAll('button, a, .card, .game-card').forEach(element => {
    element.addEventListener('click', () => playGlobalSound('click'));
  });
  
  // Add hover sounds to interactive elements
  document.querySelectorAll('button, .card, .game-card').forEach(element => {
    element.addEventListener('mouseenter', () => playGlobalSound('hover'));
  });
  
  // Add toggle sounds to checkboxes and toggles
  document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(element => {
    element.addEventListener('change', () => playGlobalSound('toggle'));
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // 🎭 Mood Tracking Section
  // ==========================

  let selectedMood = null;
  const moodButtons = document.querySelectorAll('.mood-btn');
  const saveBtn = document.getElementById('saveBtn');
  const moodNote = document.getElementById('moodNote');
  const moodLog = document.getElementById('moodLog');
  const savedEntries = JSON.parse(localStorage.getItem('moodEntries')) || [];

  // Placeholder rotation
  const placeholderMessages = [
    "What’s on your mind? 🌈",
    "Type it out — let it go 🌙",
    "Feeling stormy or sunny? ☁️☀️",
    "Turn your thoughts into stars 🌠",
    "Write it like a story... 📖",
    "No pressure. Just be you 💖"
  ];
  let i = 0;
  setInterval(() => {
    if (moodNote) {
      moodNote.placeholder = placeholderMessages[i];
      i = (i + 1) % placeholderMessages.length;
    }
  }, 4000);

  // Load saved moods
  savedEntries.forEach(entry => addMoodToLog(entry.mood, entry.note));

  // Mood selection
  moodButtons.forEach(button => {
    button.addEventListener('click', () => {
      moodButtons.forEach(btn => {
        btn.classList.remove('selected', 'pop');
      });

      button.classList.add('selected', 'pop');
      selectedMood = button.dataset.mood;

      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      createBubble(x, y);

      setTimeout(() => button.classList.remove('pop'), 300);
    });
  });

  // Save mood
  saveBtn.addEventListener('click', () => {
    const note = moodNote.value.trim();
    if (!selectedMood) {
      alert("Please select a mood!");
      return;
    }

    const entry = { mood: selectedMood, note };
    savedEntries.push(entry);
    localStorage.setItem('moodEntries', JSON.stringify(savedEntries));
    addMoodToLog(entry.mood, entry.note);

    moodNote.value = '';
    selectedMood = null;
    moodButtons.forEach(btn => btn.classList.remove('selected'));
  });

  function addMoodToLog(mood, note) {
    const li = document.createElement('li');
    li.className = 'mood-entry';

    const moodColors = {
      happy: "#ffe066",
      sad: "#a0c4ff",
      angry: "#ffadad",
      anxious: "#bdb2ff",
      neutral: "#d0f4de"
    };

    li.style.borderLeft = `6px solid ${moodColors[mood] || "#f7c4ff"}`;
    li.innerHTML = `<strong>🌀 Mood:</strong> ${mood}<br><strong>📝 Note:</strong> ${note || '—'}`;
    moodLog.prepend(li);
  }

  // Typing bubble effect
  moodNote.addEventListener("input", () => {
    const rect = moodNote.getBoundingClientRect();
    const x = rect.left + Math.random() * rect.width;
    const y = rect.top + Math.random() * rect.height;
    createBubble(x, y);
  });

  // Bubble Canvas
  const canvas = document.getElementById("bubbleCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const bubbles = [];

  function createBubble(x, y) {
    const colors = [
      "rgba(255, 182, 193, 0.7)",
      "rgba(173, 216, 230, 0.7)",
      "rgba(221, 160, 221, 0.7)",
      "rgba(255, 255, 224, 0.7)",
      "rgba(144, 238, 144, 0.7)"
    ];

    for (let i = 0; i < 6; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      bubbles.push({
        x, y,
        radius: Math.random() * 6 + 5,
        color,
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: -Math.random() * 2 - 1,
        life: 60
      });
    }
  }

  function updateBubbles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const bubble = bubbles[i];
      bubble.x += bubble.velocityX;
      bubble.y += bubble.velocityY;
      bubble.life--;

      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fillStyle = bubble.color;
      ctx.fill();

      if (bubble.life <= 0) {
        bubbles.splice(i, 1);
      }
    }
    requestAnimationFrame(updateBubbles);
  }
  updateBubbles();

  function createSakuraPetals() {
  const sakuraContainer = document.getElementById('sakuraPetals');
  sakuraContainer.innerHTML = ''; // clear old ones

  for (let i = 0; i < 50; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.animationDelay = Math.random() * 5 + 's';
    petal.style.opacity = Math.random();
    petal.style.width = petal.style.height = (Math.random() * 10 + 10) + 'px';
    sakuraContainer.appendChild(petal);
  }
}

function createPastelClouds() {
  const cloudContainer = document.getElementById('pastelClouds');
  cloudContainer.innerHTML = ''; // clear existing

  for (let i = 0; i < 20; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    cloud.style.top = Math.random() * 60 + 'vh';
    cloud.style.left = -100 + 'vw';
    cloud.style.width = Math.random() * 100 + 100 + 'px';
    cloud.style.height = Math.random() * 40 + 40 + 'px';
    cloud.style.animationDelay = Math.random() * 20 + 's';
    cloudContainer.appendChild(cloud);
  }
}

function createForestWind() {
  const container = document.getElementById('forestWind');
  container.innerHTML = '';

  for (let i = 0; i < 40; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.style.left = Math.random() * 100 + 'vw';
    leaf.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(leaf);
  }
}

function createNeonLights() {
  const container = document.getElementById('neonLights');
  container.innerHTML = '';

  for (let i = 0; i < 50; i++) {
    const glow = document.createElement('div');
    glow.className = 'neon-glow';
    glow.style.left = Math.random() * 100 + 'vw';
    glow.style.top = Math.random() * 100 + 'vh';
    glow.style.animationDelay = Math.random() * 4 + 's';
    container.appendChild(glow);
  }
}



  // ==========================
  // 🌸 Theme Handling Section
  // ==========================

  const themes = {
    galaxy: 'assets/galaxy.jpg',
    sakura: 'assets/sakura.jpg',
    pastel: 'assets/pastel.jpg',
    forest: 'assets/forest.jpg',
    neon: 'assets/neon.jpg'
  };

  const themeButtons = document.querySelectorAll('.theme-btn');
  const allAnimations = document.querySelectorAll('.theme-animation');

  function applyTheme(themeName) {
    const imagePath = themes[themeName];
    if (imagePath) {
      document.body.style.background = `url('${imagePath}') no-repeat center center fixed`;
      document.body.style.backgroundSize = 'cover';
      localStorage.setItem('selectedTheme', themeName);
    }

    toggleThemeAnimations(themeName);
  }

  function toggleThemeAnimations(themeName) {
    allAnimations.forEach(el => {
      el.style.display = 'none';
    });

    const currentAnim = document.querySelector(`.${themeName}-animation`);
    if (currentAnim) {
      currentAnim.style.display = 'block';
    }
  }

  // ✅ Apply theme on load
  const savedTheme = localStorage.getItem('selectedTheme') || 'galaxy';
  applyTheme(savedTheme);

  // ✅ Trigger animation functions on reload
  if (savedTheme === 'sakura') createSakuraPetals();
  if (savedTheme === 'pastel') createPastelClouds();
  if (savedTheme === 'forest') createForestWind();
  if (savedTheme === 'neon') createNeonLights();

  // ✅ Button click listeners
  themeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const theme = button.dataset.theme;
      applyTheme(theme);

      // ✅ Trigger animation creation functions
      if (theme === 'sakura') createSakuraPetals();
      if (theme === 'pastel') createPastelClouds();
      if (theme === 'forest') createForestWind();
      if (theme === 'neon') createNeonLights();
    });
  });
});

function openMiniGames() {
  alert("Coming soon: Relaxing mini-games to lift your mood! 🌈");
  // Later you can redirect to a page or open a modal with embedded games
}
