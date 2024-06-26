/*** Language Toggle ***/
const languageToggleBtn = document.querySelector("#language-toggle");
const currentLanguage = localStorage.getItem("language") || "FR";
setLanguage(currentLanguage);

languageToggleBtn.addEventListener("click", () => {
  let language = languageToggleBtn.dataset.language;
  let newLanguage = language === "EN" ? "FR" : "EN";

  setLanguage(newLanguage);
});

function setLanguage(language) {
  document.documentElement.setAttribute("data-language", language);
  languageToggleBtn.dataset.language = language;
  localStorage.setItem("language", language);
  languageToggleBtn.classList.toggle("rotated", language === "EN");

  document.querySelectorAll("[data-en], [data-fr]").forEach((element) => {
    element.innerText = element.dataset[language.toLowerCase()];

  });
}
/*** End Language Toggle ***/

/***Dark Mode***/
const themeToggleBtn = document.querySelector("#theme-toggle");
const themeToggleTxt1Light = document.querySelector("#theme-texte1-light");
const themeToggleTxt2Light = document.querySelector("#theme-texte2-light");
const themeToggleTxt1Dark = document.querySelector("#theme-texte1-dark");
const themeToggleTxt2Dark = document.querySelector("#theme-texte2-dark");
const currentTheme = localStorage.getItem("theme");
const themeCaptionDark = document.querySelector('#theme-caption-dark');
const themeCaptionLight = document.querySelector('#theme-caption-light');

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
}

themeToggleBtn.addEventListener("click", () => {
  let theme = document.documentElement.getAttribute("data-theme");

  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    document.documentElement.style.setProperty("--translate-after", "0%, 0%");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    document.documentElement.style.setProperty(
      "--translate-after",
      "-70%, 20%"
    );
    themeToggleBtn.classList.add("spin");
    // Retire la classe après l'animation pour ne pas répéter l'animation au prochain clic
    setTimeout(() => themeToggleBtn.classList.remove("spin"), 1000);
  }
});

/***End Dark Mode***/

/*** Navigation  ***/
let instanceDock = null;

function between(val, min, max) {
  return Math.max(min, Math.min(val, max));
}
function scaling(d) {
  return Math.max(Math.min(-0.2 * Math.pow(d, 2) + 1.05, 1), 0);
}
function dockInit() {
  if (instanceDock) {
    instanceDock.deactivate();
  }
  instanceDock = new Dock(document.querySelector(".dock"));
}
function handleResize() {
  const mediaQuery = window.matchMedia("(min-width: 800px)");

  if (mediaQuery.matches) {
    dockInit();
  } else {
    if (instanceDock) {
      instanceDock.deactivate();
    }
  }
}

const TransformOrigins = {
  "-1": "right",
  0: "center",
  1: "left",
};

class Dock {
  scale = 1;
  constructor(el) {
    this.root = el;
    this.icons = Array.from(el.children);
    if (this.icons.length === 0) {
      return;
    }
    this.iconSize = this.icons[0].offsetWidth;

    // Lier les méthodes et conserver les références pour pouvoir les ajouter/supprimer en tant qu'écouteurs d'événements
    this.boundHandleMouseMove = this.handleMouseMove.bind(this);
    this.boundHandleMouseLeave = this.handleMouseLeave.bind(this);
    this.boundHandleMouseEnter = this.handleMouseEnter.bind(this);

    el.addEventListener("mousemove", this.boundHandleMouseMove);
    el.addEventListener("mouseleave", this.boundHandleMouseLeave);
    el.addEventListener("mouseenter", this.boundHandleMouseEnter);
  }
  deactivate() {
    this.root.removeEventListener("mousemove", this.boundHandleMouseMove);
    this.root.removeEventListener("mouseleave", this.boundHandleMouseLeave);
    this.root.removeEventListener("mouseenter", this.boundHandleMouseEnter);
    this.icons.forEach((icon) => {
      icon.style.removeProperty("transform");
      icon.style.removeProperty("transform-origin");
    });
  }

  handleMouseMove(e) {
    this.mousePosition = between(
      (e.clientX - this.root.offsetLeft) / this.iconSize,
      0,
      this.icons.length
    );
    this.scaleIcons();
  }

  scaleIcons() {
    const selectedIndex = Math.floor(this.mousePosition);
    const centerOffset = this.mousePosition - selectedIndex - 0.5;

    let baseOffset = this.scaleFromDirection(
      selectedIndex,
      0,
      -centerOffset * this.iconSize
    );
    let offset = baseOffset * (0.5 - centerOffset);
    for (let i = selectedIndex + 1; i < this.icons.length; i++) {
      offset += this.scaleFromDirection(i, 1, offset);
    }
    offset = baseOffset * (0.5 + centerOffset);
    for (let i = selectedIndex - 1; i >= 0; i--) {
      offset += this.scaleFromDirection(i, -1, -offset);
    }
  }
  scaleFromDirection(index, direction, offset) {
    const center = index + 0.5;
    const distanceFromPointer = this.mousePosition - center;
    const scale = scaling(distanceFromPointer) * this.scale;
    const icon = this.icons[index];

    icon.style.setProperty(
      "transform",
      `translateX(${offset}px) scale(${scale + 1})`
    );
    icon.style.setProperty(
      "transform-origin",
      `${TransformOrigins[direction.toString()]} bottom`
    );
    return scale * this.iconSize;
  }

  handleMouseLeave() {
    // this.root.style.setProperty("padding","5px 5px");
    this.root.classList.add("animated");

    this.icons.forEach((icon) => {
      icon.style.removeProperty("transform");
      icon.style.removeProperty("transform-origin");
    });
  }
  handleMouseEnter() {
    // this.root.style.setProperty("padding","5px 110px");
    this.root.classList.add("animated");
    window.setTimeout(() => {
      this.root.classList.remove("animated");
    }, 100);
  }
}

window.addEventListener("load", handleResize);
window.addEventListener("resize", handleResize);

/*** End Navigation ***/

/*** cards selection ***/
const filterBtn = document.querySelectorAll(".filter-btn");

filterBtn.forEach((btn) => {
  btn.addEventListener("click", function () {
    window.scrollTo({
      top: 0, behavior: 'smooth'
    });
    let filter = this.dataset.filter;
    let cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      if (!card.classList.contains(filter)) {
        card.classList.add("disabled");
      } else {
        card.classList.remove("disabled");
        card.parentNode.prepend(card);
      }
    });
  });
});
/*** End cards selection ***/

/*** figcaption ***/
const moreButtons = document.querySelectorAll('.more');

moreButtons.forEach(moreButton => {
  // Ajouter un écouteur d'événement sur chaque bouton
  moreButton.addEventListener('click', function () {
    // Remonter au parent figure du bouton
    const figure = this.closest('figure');
    const caption = figure.querySelector('figcaption');

    if (caption) {
      caption.classList.toggle('active'); // Utilise toggle pour activer/désactiver

      // Si vous voulez retirer la classe 'active' après un délai
      setTimeout(() => {
        caption.classList.remove('active');
      }, 1000);
    }
  });
});
/*** End figcaption ***/

