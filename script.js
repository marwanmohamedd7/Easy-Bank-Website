'use strict';

///////////////////////////////////////
// Modal window

const nav = document.querySelector('.nav');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const tabsContainer = document.querySelector('.operations__tab-container');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////
// Button scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', e => {
  const s1coords = section1.getBoundingClientRect();

  // console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());

  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling

  // old way
  // window.scrollTo(s1coords.left + window.pageXOffset,s1coords.top + window.pageYOffset);

  // console.log(s1coords.top + window.pageYOffset);

  // modern way
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // more modern way : but it only supports modern browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////
// Page navigation

//// this technique is just fine if we gonna use little number of elements(nav-links)
// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener("click", function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior:'smooth'});
//   })
// });

// Event Delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

////////////////////////////////// Tabbed component (section 2)
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const seblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    seblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll',function(e){
//   console.log(window.scrollY);
//   if(window.scrollY>initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// })

////// Sticky navigation: Intersection Observer API
// const obsCallback = function(entries,observe){
//   entries.forEach((entry)=>{
//     console.log(entry);
//   })
// };

// const obsOption = {
//   root:null,
//   threshold:[0,0.2],
// };

// const Observer = new IntersectionObserver(obsCallback,obsOption);
// Observer.observe(section1);

//////////////////// Sticky navigation: Intersection Observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries, observe) {
  // console.log(observe);
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const navObsOption = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
  behavior: 'smooth',
};

const headerObserver = new IntersectionObserver(stickyNav, navObsOption);
headerObserver.observe(header);

///////////////////////////// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  // console.log(observer);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObsOption = {
  root: null,
  threshold: 0.1,
};
const sectionObserver = new IntersectionObserver(
  revealSection,
  sectionObsOption
);
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

/////////////////////// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `-10px`,
});
imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////////////////////// Slider
const slider = function(){
  const slides = document.querySelectorAll('.slide');
  const btnLeftSlider = document.querySelector('.slider__btn--left');
  const btnRightSlider = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length;
  
  /////////// replace line (244-246) by calling displaySlide with equal zero parameter( displaySlide(0) )
  // slides.forEach((el,i) => {
    //   el.style.transform = `translateX(${100*i}%)`
    // });
    
    // Functions (slider)
const displaySlide = function (slide) {
  slides.forEach((el, i) => {
    el.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `
      <button class="dots__dot" data-slide="${i}"></button>
      `
      );
    });
  };
  
  const activateDot = function (e) {
    let slideVal;
    if (typeof e === 'number') slideVal = e;
    else {
      slideVal = e.target.dataset.slide;
    }
    
    // const { slide } = e.target.dataset; // Structuring
    
    document
    .querySelectorAll('.dots__dot')
    .forEach(cl => cl.classList.remove('dots__dot--active'));
    document
    .querySelector(`.dots__dot[data-slide="${slideVal}"]`)
    .classList.add('dots__dot--active');
    
    displaySlide(slideVal);
  };
  
  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;
    displaySlide(curSlide);
    activateDot(curSlide);
  };
  
  // Previous slide
  const previousSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    displaySlide(curSlide);
    activateDot(curSlide);
  };
  
  const initialCall = function(){
    displaySlide(0);
    createDots();
    activateDot(0);  
  }
  initialCall();
  
  // Event handlers
  btnRightSlider.addEventListener('click', nextSlide);
  btnLeftSlider.addEventListener('click', previousSlide);
  dotContainer.addEventListener('click', activateDot.bind());
  document.addEventListener('keydown', function (e) {
    // using if or && gonna do the same thing
    e.key === 'ArrowRight' && nextSlide();
    if (e.key === 'ArrowLeft') previousSlide();
  });
}
slider();
  
  /*
  /////////////////////////////////////////////////////
  ////////////////////////////////////////////// Reference
  // experment some stuff
  // Creating and inserting elements
  // .insertAdjacentHTML
  
  console.log(document.documentElement); // selecting entire html
  console.log(document.head); // selecting html head
  console.log(document.body); // selecting html body

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = `We use cookied for improved functionality and analytics. 
// Please allow cookies to continue`;
message.innerHTML = `We use cookied for improved functionality and analytics. 
<button class = "btn btn--close-cookie">Got it!</button>`;

// we use prepend and append to insert and move elements
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);


// Delete elements
document.querySelector('.btn--close-cookie').addEventListener('click',function(){
  // modern way to remove element
  message.remove();
  // old way to remove element
  // message.parentElement.removeChild(message);
});


const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click',(e) => {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)',window.pageXOffset,window.pageYOffset);
  console.log('height/width viewport',
  document.documentElement.clientHeight,
  document.documentElement.clientWidth
  );

  
  // Scrolling

  // old way
  // window.scrollTo(s1coords.left + window.pageXOffset,s1coords.top + window.pageYOffset);

  // console.log(s1coords.top + window.pageYOffset);

  // modern way
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // more modern way : but it only supports modern browsers
  section1.scrollIntoView({behavior:'smooth'})
});

/////////////////////////////////////// training

// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '80%';
console.log(message.style.height); // give nothing 
console.log(message.style.backgroundColor); // give background as we set it before manully 
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);
message.style.height = Number.parseFloat(getComputedStyle(message).height,10)+40+'px';

document.documentElement.style.setProperty('--color-primary','orangered');


// Attributes
const logo = document.querySelector('.nav__logo');
// Read values
console.log(logo.src);
console.log(logo.alt);
console.log(logo.className);
console.log(logo.id);

// Set values
logo.alt = "pretty good";


// Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
console.log(logo.setAttribute('company','Bankist'));
console.log(logo.src);
console.log(logo.getAttribute('src'));

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c','j'); // can add multible classes
logo.classList.remove('c','j'); // can remove multible classes
logo.classList.toggle('c');
logo.classList.contains('c');

// Don't use
logo.className = 'marwan'

// Events 
const h1 = document.querySelector('h1');
const alertH1 = function(e){
  alert('Great!');
  h1.removeEventListener('mouseenter',alertH1);
};

// h1.onmouseenter = function(e){
//   alert('Good!');
// }

h1.addEventListener('mouseenter',alertH1);


// rgb(255,255,255)
const randomInt = (min,max) => Math.floor(Math.random()*(max-min+1) + min);
const randomColor = () => `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;
console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click',function(e){
  this.style.backgroundColor = randomColor();
  console.log('Link',e.target,e.currentTarget,this);
  console.log(e.currentTarget === this);

  // Stop propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click',function(e){
  this.style.backgroundColor = randomColor();
  console.log('Containear',e.target,e.currentTarget,this);
  console.log(e.currentTarget === this);
});

document.querySelector('.nav').addEventListener('click',function(e){
  this.style.backgroundColor = randomColor();
  console.log('Nav',e.target,e.currentTarget,this);
  console.log(e.currentTarget === this);
},true);


const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('.header').style.background = 'var(--gradient-primary)';

// Going sidways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function(el){
  if(el !== h1){
    el.style.transform = 'scale(1.075)';
  }
});

document.addEventListener('DOMContentLoaded',function(e){
  console.log('HTML parsed and Dom tree built!');
  console.log(e);
});

window.addEventListener('load',function(e){
  console.log('Page fully loaded',e);
});

window.addEventListener('beforeunload',function(e){
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
})
*/

