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

const SECTIONS_OBSERVER = new MutationObserver(onSectionChange);

// Used for scrollHandler
let ticking = false

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

function onSectionChange(){
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


/*
 * A helper function that handles the scroll event efficiently,
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
 * And: https://www.html5rocks.com/en/tutorials/speed/animations/
*/
function scrollHandler(callback) {
  return function (e) {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        callback(e);
        ticking = false;
      });
      ticking = true;
    }
  }
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
  for (section of sections) {
    const bounding = section.getBoundingClientRect();
    const offset = bounding.height / 3;
    if (bounding.y < offset && bounding.y > (-bounding.height + offset)) {
      section.classList.add('your-active-class');
    }
    else {
      section.classList.remove('your-active-class');
    }
  }
}

// Scroll to anchor ID using scrollTO event


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

// Set sections as active

window.addEventListener('scroll', scrollHandler(setActiveSection))

