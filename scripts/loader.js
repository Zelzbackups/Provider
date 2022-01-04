const deepPath = document.getElementsByClassName("navbar")[0].classList.contains("deeppath");
const very = document.getElementsByClassName("navbar")[0].classList.contains("very");

document.getElementsByClassName("navbar")[0].innerHTML = `
      <a href="/" class="button">Home</a>
      <a href="/p" class="button">Proxy</a>
      <a href="/more" class="button">Games</a>
      <a href="/help" class="button">Help</a>`;