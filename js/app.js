/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Define Global Variables
 * 
*/

let sections;
let activeSection;
let lastScrollY = 0;

const SECTIONS_OBSERVER = new MutationObserver(onSectionChange);

let scrollToTopBtn;

// Used for scrollHandler
let ticking = false;

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

function onSectionChange() {
  sections = document.querySelectorAll('section');
  buildNav();
}


function createNavLink(section) {

  // Container: list item
  const li = document.createElement("li");

  // Anchor to section
  const a = document.createElement('a');
  a.href = `#${section.id}`;
  a.textContent = section.dataset.nav;
  a.classList.add('menu__link');

  li.appendChild(a);

  return li;
}


function closerToTop(e1, e2) {
  const { y: e1Y, } = e1.getBoundingClientRect();
  const { y: e2Y, } = e2.getBoundingClientRect();

  if (Math.abs(e1Y) - lastScrollY < Math.abs(e2Y) - lastScrollY) {
    return e1;
  }
  else {
    return e2;
  }
}


/*
 * A helper function that handles the scroll event efficiently,
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
 * And: https://www.html5rocks.com/en/tutorials/speed/animations/
*/
function scrollHandler(callback) {
  return function (e) {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        callback(e);
        ticking = false;
      });
      ticking = true;
    }
  }
}

// Sets header visibility
function setHeaderVisibility(state) {
  const header = document.querySelector('.page__header');
  if (header) {
    state ?
      header.classList.remove('page__header__hide') :
      header.classList.add('page__header__hide');
  }
}


function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// build the nav

function buildNav() {

  // Getting nav contianer
  const navContainer = document.querySelector('#navbar__list');
  navContainer.style.visibility = "hidden";

  // Clearing old nav items
  navContainer.innerHTML = "";

  // Creating nav items
  for (section of sections) {
    navContainer.insertAdjacentElement("afterbegin", createNavLink(section));
  }

  navContainer.style.visibility = "visible";
}

// Add class 'active' to section when near top of viewport

function setActiveSection() {
  if (sections.length) {

    const currentActive = activeSection || sections[0];

    const newActive = [...sections].reduce(closerToTop, currentActive);

    if (currentActive.id !== newActive.id) {
      currentActive.classList.remove('your-active-class');
      newActive.classList.add('your-active-class');
      activeSection = newActive;
    }
  }
}

// Scroll to anchor ID using scrollTO event

function scrollToSection(hash) {
  const section = document.querySelector(hash);
  if (section) {
    const { y } = section.getBoundingClientRect();
    window.scrollTo({ top: y + window.scrollY, behavior: 'smooth' });
  }
}


// Change page header visibility
function headerVisibilityHandler(lastScrollY) {

  // Scrolling up, showing header
  if (lastScrollY > window.scrollY) {
    setHeaderVisibility(true);
  }
  // Scrolling down, hiding header
  else if (lastScrollY < window.scrollY) {
    setHeaderVisibility(false);
  }
}


function setScrollBtnVisibility(state) {
  const currentState = !scrollToTopBtn.classList.contains('btn__hidden');
  if (state !== currentState) {
    state ?
      scrollToTopBtn.classList.remove('btn__hidden') :
      scrollToTopBtn.classList.add('btn__hidden');
  }
}

/**
 * End Main Functions
 * Begin Events
 *
*/

// Build menu 

document.addEventListener('DOMContentLoaded', () => {

  // Nav initial build
  onSectionChange();

  // Observing subsequent sections changes, assuming that sections are childern of main
  const main = document.querySelector('main');
  const config = { attributes: false, childList: true, subtree: false };
  SECTIONS_OBSERVER.observe(main, config);

});

// Scroll to section on link click

document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.querySelector("#navbar__list");
  navContainer.addEventListener('click', (e) => {
    if (e.target.nodeName === "A") {
      e.preventDefault();
      scrollToSection(e.target.hash);
    }
  });
});

// Set sections as active

window.addEventListener('scroll', scrollHandler(setActiveSection));


// Toggle page header
window.addEventListener('scroll', () => {
  setTimeout(headerVisibilityHandler, 0, window.scrollY);
});


// ScrollToTop events
document.addEventListener('DOMContentLoaded', () => {
  scrollToTopBtn = document.querySelector('#scroll-to-top');
  scrollToTopBtn.onclick = scrollToTop;
});

window.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight / 2) {
    setScrollBtnVisibility(true);
  }
  else {
    setScrollBtnVisibility(false);
  }
});
