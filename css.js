const searchDiv = document.querySelector('.search');

// When search is clicked
searchDiv.addEventListener('click', function (e) {
  e.stopPropagation(); // Prevent bubbling up to window
  searchDiv.classList.add('active');
});

// When clicking anywhere else
window.addEventListener('click', function () {
  searchDiv.classList.remove('active');
});

//______________________________________________________________________________________________________________________
const boxes = document.getElementById("boxes");
const heading = document.querySelector(".heading");

boxes.addEventListener("scroll", () => {
  if (boxes.scrollTop > 0) {
    heading.classList.add("shadow");
  } else {
    heading.classList.remove("shadow");
  }
});
//________________________________________________________________________________________________________________________
  const scrollNext = document.getElementById("scrollNext");
  const scrollCards = document.querySelector(".cardContainer");

  scrollNext.addEventListener("click", () => {
    scrollCards.scrollBy({
      left: 300,
      behavior: "smooth"
    });
  });

  const scrollPrev = document.getElementById("scrollTop");
  scrollPrev.addEventListener("click", () => {
    scrollCards.scrollBy({
      left: -300,
      behavior: "smooth"
    });
  });

document.addEventListener("DOMContentLoaded", function () {
    const artistContainer = document.querySelector(".AN");

    const scrollNextBtns = document.querySelectorAll("#scrollNext");
    const scrollTopBtns = document.querySelectorAll("#scrollTop");

    scrollNextBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            artistContainer.scrollBy({ left: 200, behavior: 'smooth' });
        });
    });

    scrollTopBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            artistContainer.scrollBy({ left: -200, behavior: 'smooth' });
        });
    });
});

let hamburger = document.querySelector(".doo");
let left = document.querySelector(".left");
let isOpen = false;

hamburger.addEventListener("click", () => {
  if (!isOpen) {
    left.style.left = "0px";
    left.style.width = "260px"
    left.style.height="100vh";
    isOpen = true;
  } else {
    left.style.left = "-259px";
    left.style.width = "0";
    isOpen = false;
  }
});

let volumeimg = document.getElementById("volumeimg");
let volume = document.getElementById("volumeit");
let isvolume = false;

// Toggle volume display
volumeimg.addEventListener("click", () => {
  if (!isvolume) {
    volume.style.display = "block";
    volume.style.position = "relative";
    volume.style.bottom = "5px";
    isvolume = true;
  } else {
    volume.style.display = "none";
    isvolume = false;
  }
});

