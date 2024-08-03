/*====================
  Sticky header js
======================*/
// window.onscroll = function () {
//     myFunction()
// };

// var header = document.getElementById("header");
// var sticky = header.offsetTop;

// function myFunction() {
//     if (window.pageYOffset > sticky) {
//         header.classList.add("sticky");
//     } else {
//         header.classList.remove("sticky");
//     }
// }


document.addEventListener("DOMContentLoaded", function() {
    var header = document.getElementById("header");
    if (header) {
        var sticky = header.offsetTop;

        window.onscroll = function() {
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky");
            } else {
                header.classList.remove("sticky");
            }
        };
    }
});