// ------------------------------------------------------------
// ГОТИЧЕСКИЕ СКАЗКИ – SCRIPT.JS (ФИНАЛ)
// ------------------------------------------------------------

const tales = [
  { title: "Девочка со спичками", cover: "images/DS.png", textFile: "tales/tale1.txt" },
  { title: "Красные башмачки", cover: "images/KB.png", textFile: "tales/tale2.txt" },
  { title: "Стойкий оловянный солдатик", cover: "images/OS.png", textFile: "tales/tale3.txt" },
  { title: "Синяя борода", cover: "images/SB.png", textFile: "tales/tale4.txt" },
  { title: "Солнце, Луна и Талия", cover: "images/SL.png", textFile: "tales/tale5.txt" }
];

const galleryContainer = document.getElementById('galleryContainer');
const storyContainer = document.getElementById('storyContainer');
const storyContent = document.getElementById('storyContent');
const backBtn = document.getElementById('backBtn');
const coversGrid = document.getElementById('coversGrid');
const bgMusic = document.getElementById('bgMusic');
const musicToggleBtn = document.getElementById('musicToggleBtn');

const themeToggleBtn = document.getElementById('themeToggleBtn');
const fontToggleBtn = document.getElementById('fontToggleBtn');

let musicEnabled = false;
let isLightReading = false;
let isAltFont = false;

// Звук наведения
function playHoverSound() {
  try {
    const click = new Audio('audio/hover-click.mp3');
    click.volume = 0.25;
    click.play().catch(() => {});
  } catch (e) {}
}

// Управление музыкой
function toggleMusic() {
  if (!bgMusic) return;
  if (!musicEnabled) {
    bgMusic.volume = 0.4;
    bgMusic.play().then(() => {
      musicEnabled = true;
      musicToggleBtn.textContent = '🔊';
    }).catch(() => alert('Проверьте файл audio/bg-music.mp3'));
  } else {
    bgMusic.pause();
    musicEnabled = false;
    musicToggleBtn.textContent = '🎵';
  }
}

// Рендер обложек
function renderCovers() {
  coversGrid.innerHTML = '';
  tales.forEach((tale, index) => {
    const card = document.createElement('div');
    card.className = 'cover-card';
    card.dataset.index = index;

    const img = document.createElement('img');
    img.src = tale.cover;
    img.alt = tale.title;
    img.className = 'cover-image';
    img.onerror = function() {
      this.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'%3E%3Crect width='400' height='600' fill='%231e1518'/%3E%3Ctext x='30' y='300' font-family='serif' font-size='24' fill='%23b89b72'%3E${encodeURIComponent(tale.title)}%3C/text%3E%3C/svg%3E`;
    };

    card.appendChild(img);
    card.addEventListener('mouseenter', playHoverSound);
    card.addEventListener('click', () => openTale(index));
    coversGrid.appendChild(card);
  });
}

// Открытие сказки
async function openTale(index) {
  const tale = tales[index];
  if (!tale) return;

  if (bgMusic) bgMusic.pause();
  galleryContainer.classList.add('hidden');
  storyContainer.classList.remove('hidden');

  // Сброс настроек чтения
  storyContainer.classList.remove('light-reading', 'alt-font-reading');
  isLightReading = false;
  isAltFont = false;
  themeToggleBtn.textContent = '🌙';
  fontToggleBtn.style.background = '';
  fontToggleBtn.style.color = '';

  storyContent.innerHTML = `<h2>${tale.title}</h2><div class="spinner"></div>`;

  try {
    const response = await fetch(tale.textFile);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    const formattedText = paragraphs.map(p => `<p>${p}</p>`).join('');
    storyContent.innerHTML = `<h2>${tale.title}</h2><div class="story-text">${formattedText}</div>`;
  } catch (error) {
    storyContent.innerHTML = `<h2>${tale.title}</h2><div class="story-text"><p>⚠️ Текст не загружен. Проверьте файл: ${tale.textFile}</p></div>`;
  }

  window.scrollTo(0, 0);
}

// Возврат в галерею
function backToGallery() {
  storyContainer.classList.add('hidden');
  galleryContainer.classList.remove('hidden');
  if (musicEnabled && bgMusic) bgMusic.play().catch(() => {});
}

// Кнопки темы и шрифта (только в чтении)
themeToggleBtn.addEventListener('click', () => {
  isLightReading = !isLightReading;
  storyContainer.classList.toggle('light-reading', isLightReading);
  themeToggleBtn.textContent = isLightReading ? '☀️' : '🌙';
});

fontToggleBtn.addEventListener('click', () => {
  isAltFont = !isAltFont;
  storyContainer.classList.toggle('alt-font-reading', isAltFont);
  fontToggleBtn.style.background = isAltFont ? 'var(--accent-gold)' : '';
  fontToggleBtn.style.color = isAltFont ? '#1a1215' : '';
});

// Запуск
backBtn.addEventListener('click', backToGallery);
musicToggleBtn.addEventListener('click', toggleMusic);
if (bgMusic) bgMusic.load();
renderCovers();