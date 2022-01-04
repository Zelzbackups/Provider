const deepPath = document.getElementsByClassName("navbar")[0].classList.contains("deeppath");
const very = document.getElementsByClassName("navbar")[0].classList.contains("very");

document.getElementsByClassName("navbar")[0].innerHTML = `   <script src="/app.js"></script>
      <a href="/" class="button">Home</a>
      <a href="/proxy" class="button">Proxy</a>
      <a href="/games" class="button">Games</a>
      <a href="/help" class="button">Help</a>
      <a href="/unblock" class="button">Unblocked Websites</a>
      <a href="/chatbox" class="button">Chatbox</a>`;