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
// CUBO 3D
// ==========================================

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


let cubeScene = null;
let cubeCamera = null;
let cubeRenderer = null;
let cubeControls = null;
let rubiksCube = null;

let selectedCubeSize = 3;


// ==========================================
// BOTONES PRACTICAR
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

        const size =
          Number(
            button.dataset.cube
          );

        openCubePractice(size);

      }
    );

  }
);


// ==========================================
// ABRIR CUBO
// ==========================================

function openCubePractice(size) {

  selectedCubeSize = size;


  const homePage =
    document.getElementById(
      "homePage"
    );


  const practicePage =
    document.getElementById(
      "cubePracticePage"
    );


  const title =
    document.getElementById(
      "selectedCubeTitle"
    );


  title.textContent =
    "Cubo " +
    size +
    "×" +
    size;


  // Ocultar páginas

  document
    .querySelectorAll(".page")
    .forEach(
      function (page) {

        page.classList.remove(
          "active-page"
        );

      }
    );


  // Mostrar cubo

  practicePage.classList.add(
    "active-page"
  );


  // Ocultar navegación inferior

  document
    .querySelector(
      ".bottom-nav"
    )
    .style.display = "none";


  // Crear cubo

  createRubiksCube(size);

}


// ==========================================
// CREAR CUBO
// ==========================================

function createRubiksCube(size) {

  const container =
    document.getElementById(
      "rubiks3D"
    );


  // Limpiar cubo anterior

  container.innerHTML = "";


  cubeScene =
    new THREE.Scene();


  cubeScene.background =
    new THREE.Color(
      0x020617
    );


  cubeCamera =
    new THREE.PerspectiveCamera(
      45,
      container.clientWidth /
      container.clientHeight,
      0.1,
      100
    );


  cubeCamera.position.set(
    size + 3,
    size + 3,
    size + 4
  );


  cubeRenderer =
    new THREE.WebGLRenderer({
      antialias: true
    });


  cubeRenderer.setPixelRatio(
    window.devicePixelRatio
  );


  cubeRenderer.setSize(
    container.clientWidth,
    container.clientHeight
  );


  container.appendChild(
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


  // GRUPO DEL RUBIK

  rubiksCube =
    new THREE.Group();

  cubeScene.add(
    rubiksCube
  );


  // CREAR PIEZAS

  createCubePieces(
    size
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


  cubeControls.minDistance =
    size + 2;

  cubeControls.maxDistance =
    size * 5;


  animateCube();

}


// ==========================================
// PIEZAS
// ==========================================

function createCubePieces(size) {

  const colors = [

    0xffffff,
    0xffff00,
    0xff0000,
    0xff8800,
    0x0000ff,
    0x00aa00

  ];


  const spacing = 1;


  const start =
    -(size - 1) / 2;


  for (
    let x = 0;
    x < size;
    x++
  ) {

    for (
      let y = 0;
      y < size;
      y++
    ) {

      for (
        let z = 0;
        z < size;
        z++
      ) {

        const geometry =
          new THREE.BoxGeometry(
            0.92,
            0.92,
            0.92
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

          start +
          x * spacing,

          start +
          y * spacing,

          start +
          z * spacing

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

document
  .getElementById(
    "scrambleButton"
  )
  .addEventListener(
    "click",
    function () {

      if (!rubiksCube) {
        return;
      }


      rubiksCube.rotation.x =
        Math.random() *
        Math.PI *
        2;


      rubiksCube.rotation.y =
        Math.random() *
        Math.PI *
        2;


      rubiksCube.rotation.z =
        Math.random() *
        Math.PI *
        2;

    }
  );


// ==========================================
// RESOLVER
// ==========================================

document
  .getElementById(
    "solveButton"
  )
  .addEventListener(
    "click",
    function () {

      alert(
        "🧠 Próximamente\n\n" +
        "Aquí colocaremos los algoritmos " +
        "para ayudarte a resolver el cubo " +
        selectedCubeSize +
        "×" +
        selectedCubeSize +
        " paso a paso."
      );

    }
  );


// ==========================================
// VOLVER
// ==========================================

document
  .getElementById(
    "backToHome"
  )
  .addEventListener(
    "click",
    function () {

      document
        .querySelectorAll(".page")
        .forEach(
          function (page) {

            page.classList.remove(
              "active-page"
            );

          }
        );


      document
        .getElementById(
          "homePage"
        )
        .classList.add(
          "active-page"
        );


      document
        .querySelector(
          ".bottom-nav"
        )
        .style.display = "flex";


      // Limpiar cubo

      const container =
        document.getElementById(
          "rubiks3D"
        );


      container.innerHTML = "";


      rubiksCube = null;

    }
  );


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