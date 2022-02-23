

document.getElementsByClassName("navbar")[0].innerHTML += `
      <a href="/" class="button">Home</a>
      <a href="/m" class="button">Ρroxy</a>
      <a href="/more" class="button">Games</a>
      <a href="/help" class="button">Help</a>
       <script src="/scripts/image.js"></script>
      <script src="/scripts/name.js"></script>
       
<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">


      `;
      //background-color: #0d47a1;

//do stuff with the script
$("#tsparticles")
  .particles()
  .init(
    {
      background: {
        color: {
          value: "#0d47a1",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
          resize: true,
        },
        modes: {
          bubble: {
            distance: 400,
            duration: 2,
            opacity: 0.8,
            size: 40,
          },
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        collisions: {
          enable: true,
        },
        move: {
          direction: "none",
          enable: true,
          outMode: "bounce",
          random: false,
          speed: 6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          random: true,
          value: 5,
        },
      },
      detectRetina: true,
    },
    function (container) {
      // container is the particles container where you can play/pause or stop/start.
      // the container is already started, you don't need to start it manually.
    }
  );
// or

$("#tsparticles")
  .particles()
  .ajax("particles.json", function (container) {
    // container is the particles container where you can play/pause or stop/start.
    // the container is already started, you don't need to start it manually.
  });