"use strict";

/*========================
    Manifest js
 ==========================*/
window.onload = function () {
  "use strict";

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
  }
};

window.onload = function () {
  "use strict";

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
  }
};
/*====================
 Ratio js
=======================*/


window.addEventListener("load", function () {
  var bgImg = document.querySelectorAll(".bg-img");

  for (i = 0; i < bgImg.length; i++) {
    var bgImgEl = bgImg[i];

    if (bgImgEl.classList.contains("bg-top")) {
      bgImgEl.parentNode.classList.add("b-top");
    } else if (bgImgEl.classList.contains("bg-bottom")) {
      bgImgEl.parentNode.classList.add("b-bottom");
    } else if (bgImgEl.classList.contains("bg-center")) {
      bgImgEl.parentNode.classList.add("b-center");
    } else if (bgImgEl.classList.contains("bg-left")) {
      bgImgEl.parentNode.classList.add("b-left");
    } else if (bgImgEl.classList.contains("bg-right")) {
      bgImgEl.parentNode.classList.add("b-right");
    }

    if (bgImgEl.classList.contains("blur-up")) {
      bgImgEl.parentNode.classList.add("blur-up", "lazyload");
    }

    if (bgImgEl.classList.contains("bg_size_content")) {
      bgImgEl.parentNode.classList.add("b_size_content");
    }

    bgImgEl.parentNode.classList.add("bg-size");
    var bgSrc = bgImgEl.src;
    bgImgEl.style.display = "none";
    bgImgEl.parentNode.setAttribute("style", "\n      background-image: url(".concat(bgSrc, ");\n      background-size:cover;\n      background-position: center;\n      background-repeat: no-repeat;\n      display: block;\n      "));
  }
});