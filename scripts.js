const CONFIG = {
  name: "Михаил Чернов",
  city: "выезд по городу и области",
  phone: "79771980070",
  telegram: "79771980070",
  offer: "Бронь в этом месяце: персональный сценарий в подарок, созвон по таймингу бесплатно и плейлист под ваш зал. Без доплат «за конкурсы».",
  prices: [
    { name: "Искра", sum: "от 35 000 ₽", points: ["до 4 часов", "сценарий вечера", "координация тостов", "1 созвон"], hot: false },
    { name: "Коралл", sum: "от 55 000 ₽", points: ["весь праздник", "сценарий в подарок при брони в этом месяце", "прогон тайминга", "связка с DJ и площадкой", "план Б, если торт опаздывает"], hot: true },
    { name: "Вау", sum: "от 80 000 ₽", points: ["праздник под ключ по программе", "две локации или выездная регистрация", "индивидуальные речевки", "приоритет по дате"], hot: false }
  ]
};

const defaultPhotos = [
  { src: "img/hero.jpg", caption: "Фирменный выход" },
  { src: "img/toast.jpg", caption: "Тост, который слушают" },
  { src: "img/dance.jpg", caption: "Зал уже внутри" },
  { src: "img/table.jpg", caption: "Стол смеётся" },
  { src: "img/stage.jpg", caption: "Вечерний свет" }
];
const defaultVideos = [
  { title: "Ролик со свадьбы", url: "https://rutube.ru/video/23e39a0c5049f28f26bdd9ae358ef485/" },
  { title: "День рождения", url: "https://rutube.ru/video/fa55da518fa9b40b47940dba41ec378d/" },
  { title: "Корпоратив", url: "https://rutube.ru/video/5cfa611b44881636fdcfb64278b360b3/" }
];

const state = {
  photos: load("photos", defaultPhotos),
  videos: load("videos", defaultVideos),
  profile: load("profile", CONFIG),
  videoIndex: 0
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem("korall-" + key);
    return raw ? JSON.parse(raw) : structuredClone(fallback);
  } catch (e) { return structuredClone(fallback); }
}
function save(key, value) { localStorage.setItem("korall-" + key, JSON.stringify(value)); }
function toast(text) {
  const el = document.getElementById("toast");
  el.textContent = text;
  el.style.display = "block";
  setTimeout(() => el.style.display = "none", 2200);
}

function applyProfile() {
  const p = CONFIG; // fixed profile, no self-edit
  document.getElementById("cityLabel").textContent = p.city || "уточним";
  document.getElementById("phoneLabel").textContent = "+79771980070";
  document.getElementById("footName").textContent = "Михаил Чернов";
  document.getElementById("stampName").textContent = "Михаил Чернов";
  document.getElementById("offerText").textContent = p.offer || CONFIG.offer;
  document.getElementById("navPhone").textContent = "Написать";
  const phone = String(p.phone || "").replace(/\D/g, "");
  document.getElementById("callLink").href = "https://t.me/+79771980070";
  document.getElementById("tgLink").href = "https://t.me/+79771980070";
  document.getElementById("prices").innerHTML = (p.prices || CONFIG.prices).map(item => `
    <article class="price ${item.hot ? "hit" : ""}">
      ${item.hot ? '<div class="tag">берут чаще</div>' : ""}
      <div class="num">${item.hot ? "ХИТ" : "ПАКЕТ"}</div>
      <h3>${item.name}</h3>
      <div class="sum">${item.sum}</div>
      <ul>${item.points.map(x => `<li>${x}</li>`).join("")}</ul>
      <a class="btn ${item.hot ? "btn-gold" : "btn-primary"}" href="#book">Узнать подробнее о формате</a>
    </article>`).join("");
}

function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = state.photos.map((photo, i) => `
    <button class="shot" type="button" data-i="${i}">
      <img src="${photo.src}" alt="${photo.caption || "Фото с праздника"}" />
      <figcaption>${photo.caption || "С праздника"}</figcaption>
    </button>`).join("");
  grid.querySelectorAll(".shot").forEach(btn => btn.onclick = () => openLight(state.photos[+btn.dataset.i].src));
}

function videoEmbed(url) {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:")) return `<video src="${url}" controls playsinline></video>`;
  let src = "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) src = "https://www.youtube.com/embed/" + u.pathname.slice(1);
    else if (u.hostname.includes("youtube.com")) src = "https://www.youtube.com/embed/" + (u.searchParams.get("v") || "");
    else if (u.hostname.includes("rutube.ru")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      src = "https://rutube.ru/play/embed/" + id + "?autoplay=0";
    } else if (u.hostname.includes("vk.com") || u.hostname.includes("vkvideo")) src = url;
  } catch (e) { return ""; }
  if (!src) return "";
  if (src === url && (url.includes("vk.com") || url.includes("vkvideo"))) {
    return `<a class="btn btn-gold" href="${url}" target="_blank" rel="noopener">Открыть видео VK</a>`;
  }
  return `<iframe 
    src="${src}" 
	autostartmute=false 
	autoplay=false 
    allow="encrypted-media; picture-in-picture; fullscreen; autoplay;" 
    allowfullscreen 
    loading="lazy"
  ></iframe>`;
}

function renderVideos() {
  document.getElementById("videoGrid").innerHTML = state.videos.map((v, i) => `
    <article class="video-card">
      <div class="video-frame">${v.url ? videoEmbed(v.url) : "<div></div>"}</div>
      <div class="body">
        <h3>${v.title || "Видео с праздника"}</h3>
        <a class="btn btn-primary" href="${v.url || '#'}" target="_blank" rel="noopener">Смотреть видео</a>
      </div>
    </article>`).join("");
}

function openLight(src) {
  document.getElementById("lightImg").src = src;
  document.getElementById("lightbox").classList.add("open");
}
function openVideo(index) {
  state.videoIndex = index;
  document.getElementById("videoTitle").value = state.videos[index].title || "";
  document.getElementById("videoUrl").value = state.videos[index].url?.startsWith("blob:") ? "" : (state.videos[index].url || "");
  document.getElementById("videoModal").classList.add("open");
}

document.getElementById("marquee").innerHTML = Array.from({length: 2}, () =>
  "<span>СВАДЬБА</span><b>★</b><span>ДЕНЬ РОЖДЕНИЯ</span><b>★</b><span>КОРПОРАТИВ</span><b>★</b><span>ЮБИЛЕЙ</span><b>★</b><span>ЛЮБОЙ ПОВОД</span><b>★</b>"
).join("");

document.getElementById("menuBtn").onclick = () => document.getElementById("navLinks").classList.toggle("open");





document.getElementById("closeLight").onclick = () => document.getElementById("lightbox").classList.remove("open");
document.getElementById("lightbox").onclick = (e) => { if (e.target.id === "lightbox") e.currentTarget.classList.remove("open"); };





document.getElementById("bookForm").onsubmit = (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const phone = "79771980070";
  const text = `Здравствуйте! Хочу забронировать ведущего.%0AИмя: ${data.name}%0AТелефон: ${data.phone}%0AПовод: ${data.type}%0AДата: ${data.date || "уточню"}%0A${data.about || ""}`;
  
  window.open("https://wa.me/" + phone + "?text=" + text, "_blank");
};

applyProfile();
renderGallery();
renderVideos();