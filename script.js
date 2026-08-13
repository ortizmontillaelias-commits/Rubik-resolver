// ==========================================
// CUBE MASTER
// ==========================================


// ==========================================
// LOGIN
// ==========================================

const loginButton =
  document.getElementById("loginButton");

const emailInput =
  document.getElementById("emailInput");


loginButton.addEventListener(
  "click",
  login
);


emailInput.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Enter") {
      login();
    }

  }
);


function login() {

  const email =
    emailInput.value.trim();


  if (email === "") {

    alert(
      "Escribe tu correo electrónico."
    );

    return;
  }


  if (!email.includes("@")) {

    alert(
      "Escribe un correo electrónico válido."
    );

    return;
  }


  // Ocultar login

  document
    .getElementById("loginScreen")
    .classList.add("hidden");


  // Mostrar aplicación

  document
    .getElementById("appScreen")
    .classList.add("active");


  // Datos del perfil

  document
    .getElementById("profileEmail")
    .textContent = email;


  document
    .getElementById("profileName")
    .textContent =
      email.split("@")[0];


  document
    .getElementById("profileAvatar")
    .textContent =
      email.charAt(0).toUpperCase();

}


// ==========================================
// NAVEGACIÓN
// ==========================================

const navigationButtons =
  document.querySelectorAll(
    ".nav-button"
  );


const pages =
  document.querySelectorAll(
    ".page"
  );


navigationButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        const pageId =
          button.dataset.page;


        // Ocultar todas las páginas

        pages.forEach(
          function (page) {

            page.classList.remove(
              "active-page"
            );

          }
        );


        // Quitar selección

        navigationButtons.forEach(
          function (nav) {

            nav.classList.remove(
              "active"
            );

          }
        );


        // Mostrar página

        document
          .getElementById(pageId)
          .classList.add(
            "active-page"
          );


        // Activar botón

        button.classList.add(
          "active"
        );


        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  }
);


// ==========================================
// TEMPORIZADOR
// ==========================================

let timerInterval = null;

let startTime = 0;

let elapsedTime = 0;

let timerRunning = false;


const timerDisplay =
  document.getElementById(
    "timerDisplay"
  );


const timerStatus =
  document.getElementById(
    "timerStatus"
  );


const startTimerButton =
  document.getElementById(
    "startTimer"
  );


const stopTimerButton =
  document.getElementById(
    "stopTimer"
  );


const resetTimerButton =
  document.getElementById(
    "resetTimer"
  );


// Formatear tiempo

function formatTime(
  milliseconds
) {

  const minutes =
    Math.floor(
      milliseconds / 60000
    );


  const seconds =
    Math.floor(
      (milliseconds % 60000) /
      1000
    );


  const centiseconds =
    Math.floor(
      (milliseconds % 1000) /
      10
    );


  return (
    String(minutes)
      .padStart(2, "0")
    +
    ":"
    +
    String(seconds)
      .padStart(2, "0")
    +
    "."
    +
    String(centiseconds)
      .padStart(2, "0")
  );

}


// Actualizar temporizador

function updateTimer() {

  elapsedTime =
    Date.now() -
    startTime;


  timerDisplay.textContent =
    formatTime(
      elapsedTime
    );

}


// Iniciar

startTimerButton.addEventListener(
  "click",
  function () {

    if (timerRunning) {
      return;
    }


    timerRunning = true;


    startTime =
      Date.now() -
      elapsedTime;


    timerInterval =
      setInterval(
        updateTimer,
        10
      );


    timerStatus.textContent =
      "Temporizador funcionando...";

  }
);


// Detener

stopTimerButton.addEventListener(
  "click",
  function () {

    if (!timerRunning) {
      return;
    }


    clearInterval(
      timerInterval
    );


    timerInterval = null;

    timerRunning = false;


    timerStatus.textContent =
      "Tiempo detenido.";

  }
);


// Reiniciar

resetTimerButton.addEventListener(
  "click",
  function () {

    clearInterval(
      timerInterval
    );


    timerInterval = null;

    timerRunning = false;

    elapsedTime = 0;


    timerDisplay.textContent =
      "00:00.00";


    timerStatus.textContent =
      "Presiona iniciar para comenzar.";

  }
);


// ==========================================
// BOTONES DE CUBOS
// ==========================================

const practiceButtons =
  document.querySelectorAll(
    ".practice-button"
  );


practiceButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        alert(
          "Modo de práctica seleccionado.\n\n" +
          "El cubo 3D interactivo lo añadiremos en el siguiente paso."
        );

      }
    );

  }
);