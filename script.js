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

// ==========================================
// CUBO 3D - BASE DEL SIMULADOR
// ==========================================

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let cubeScene;
let cubeCamera;
let cubeRenderer;
let cubeControls;
let rubiksCube;


// Crear el cubo 3D
function createRubiksCube() {

  const container =
    document.getElementById("homePage");

  if (!container) {
    return;
  }


  // Contenedor
  const cubeArea =
    document.createElement("div");

  cubeArea.id = "rubiks3DArea";

  cubeArea.innerHTML = `
    <div class="cube3d-title">
      <h2>Practica tu cubo</h2>
      <p>Arrastra para girar la vista</p>
    </div>

    <div id="rubiks3D"></div>

    <div class="cube3d-controls">

      <button id="scrambleButton">
        🔀 Mezclar
      </button>

      <button id="solveButton">
        🧠 Resolver
      </button>

    </div>
  `;


  container.prepend(cubeArea);


  // ESCENA
  cubeScene =
    new THREE.Scene();

  cubeScene.background =
    new THREE.Color(0x020617);


  // CÁMARA
  cubeCamera =
    new THREE.PerspectiveCamera(
      45,
      1,
      0.1,
      100
    );

  cubeCamera.position.set(
    5,
    5,
    7
  );


  // RENDER
  cubeRenderer =
    new THREE.WebGLRenderer({
      antialias: true
    });


  cubeRenderer.setPixelRatio(
    window.devicePixelRatio
  );

  cubeRenderer.setSize(
    350,
    350
  );


  document
    .getElementById("rubiks3D")
    .appendChild(
      cubeRenderer.domElement
    );


  // LUZ
  const ambientLight =
    new THREE.AmbientLight(
      0xffffff,
      2
    );

  cubeScene.add(
    ambientLight
  );


  const directionalLight =
    new THREE.DirectionalLight(
      0xffffff,
      3
    );

  directionalLight.position.set(
    5,
    8,
    6
  );

  cubeScene.add(
    directionalLight
  );


  // CONTROLES
  cubeControls =
    new OrbitControls(
      cubeCamera,
      cubeRenderer.domElement
    );

  cubeControls.enableDamping =
    true;

  cubeControls.enablePan =
    false;


  // CREAR CUBO
  rubiksCube =
    new THREE.Group();

  cubeScene.add(
    rubiksCube
  );


  createCubePieces();


  // BOTÓN MEZCLAR
  document
    .getElementById("scrambleButton")
    .addEventListener(
      "click",
      scrambleCube
    );


  // BOTÓN RESOLVER
  document
    .getElementById("solveButton")
    .addEventListener(
      "click",
      showSolveMessage
    );


  animateCube();

}


// ==========================================
// CREAR LAS 27 PIEZAS
// ==========================================

function createCubePieces() {

  const colors = [
    0xffffff,
    0xffff00,
    0xff0000,
    0xff8800,
    0x0000ff,
    0x00aa00
  ];


  for (
    let x = -1;
    x <= 1;
    x++
  ) {

    for (
      let y = -1;
      y <= 1;
      y++
    ) {

      for (
        let z = -1;
        z <= 1;
        z++
      ) {

        const geometry =
          new THREE.BoxGeometry(
            0.95,
            0.95,
            0.95
          );


        const materials =
          colors.map(
            function (color) {

              return new THREE.MeshStandardMaterial({
                color: color
              });

            }
          );


        const piece =
          new THREE.Mesh(
            geometry,
            materials
          );


        piece.position.set(
          x,
          y,
          z
        );


        rubiksCube.add(
          piece
        );

      }

    }

  }

}


// ==========================================
// MEZCLAR
// ==========================================

function scrambleCube() {

  if (!rubiksCube) {
    return;
  }


  rubiksCube.rotation.x =
    Math.random() * Math.PI * 2;

  rubiksCube.rotation.y =
    Math.random() * Math.PI * 2;

  rubiksCube.rotation.z =
    Math.random() * Math.PI * 2;

}


// ==========================================
// RESOLVER
// ==========================================

function showSolveMessage() {

  alert(
    "🧠 Modo resolver\n\n" +
    "Aquí añadiremos los algoritmos " +
    "para guiar al usuario paso a paso."
  );

}


// ==========================================
// ANIMACIÓN
// ==========================================

function animateCube() {

  requestAnimationFrame(
    animateCube
  );


  if (cubeControls) {
    cubeControls.update();
  }


  if (
    cubeRenderer &&
    cubeScene &&
    cubeCamera
  ) {

    cubeRenderer.render(
      cubeScene,
      cubeCamera
    );

  }

}


// ==========================================
// INICIAR CUBO
// ==========================================

window.addEventListener(
  "load",
  function () {

    createRubiksCube();

  }
);