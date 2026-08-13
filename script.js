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


  document
    .getElementById("loginScreen")
    .classList.add("hidden");


  document
    .getElementById("appScreen")
    .classList.add("active");


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


        pages.forEach(
          function (page) {

            page.classList.remove(
              "active-page"
            );

          }
        );


        navigationButtons.forEach(
          function (nav) {

            nav.classList.remove(
              "active"
            );

          }
        );


        document
          .getElementById(pageId)
          .classList.add(
            "active-page"
          );


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


function updateTimer() {

  elapsedTime =
    Date.now() -
    startTime;


  timerDisplay.textContent =
    formatTime(
      elapsedTime
    );

}


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
// THREE.JS
// ==========================================

import * as THREE from "three";

import {
  OrbitControls
} from "three/addons/controls/OrbitControls.js";


// ==========================================
// VARIABLES DEL CUBO
// ==========================================

let cubeScene = null;

let cubeCamera = null;

let cubeRenderer = null;

let cubeControls = null;

let rubiksCube = null;

let selectedCubeSize = 3;


// ==========================================
// BOTONES "PRACTICAR"
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


        openCubePractice(
          size
        );

      }
    );

  }
);


// ==========================================
// ABRIR PANTALLA DEL CUBO
// ==========================================

function openCubePractice(
  size
) {

  selectedCubeSize =
    size;


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


  document
    .querySelectorAll(
      ".page"
    )
    .forEach(
      function (page) {

        page.classList.remove(
          "active-page"
        );

      }
    );


  practicePage.classList.add(
    "active-page"
  );


  document
    .querySelector(
      ".bottom-nav"
    )
    .style.display =
    "none";


  createRubiksCube(
    size
  );

}


// ==========================================
// CREAR CUBO 3D
// ==========================================

function createRubiksCube(
  size
) {

  const container =
    document.getElementById(
      "rubiks3D"
    );


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


  // GRUPO DEL CUBO

  rubiksCube =
    new THREE.Group();


  cubeScene.add(
    rubiksCube
  );


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
// CREAR PIEZAS
// ==========================================

function createCubePieces(
  size
) {

  const colors = [

    0xffffff,
    0xffff00,
    0xff0000,
    0xff8800,
    0x0000ff,
    0x00aa00

  ];


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

          start + x,

          start + y,

          start + z

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
        "🧠 Modo resolver\n\n" +
        "Próximamente podrás recibir " +
        "los algoritmos para resolver tu " +
        "cubo " +
        selectedCubeSize +
        "×" +
        selectedCubeSize +
        " paso a paso."
      );

    }
  );


// ==========================================
// VOLVER A INICIO
// ==========================================

document
  .getElementById(
    "backToHome"
  )
  .addEventListener(
    "click",
    function () {

      document
        .querySelectorAll(
          ".page"
        )
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
        .style.display =
        "flex";


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