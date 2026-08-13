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
// THREE.JS - RUBIK 3D
// ==========================================

import * as THREE from "three";

import {
  OrbitControls
} from "three/addons/controls/OrbitControls.js";


// ==========================================
// VARIABLES
// ==========================================

let cubeScene = null;
let cubeCamera = null;
let cubeRenderer = null;
let cubeControls = null;

let rubiksCube = null;
let cubePieces = [];

let selectedCubeSize = 3;

let moveHistory = [];

let isTurning = false;


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

        openCubePractice(
          size
        );

      }
    );

  }
);


// ==========================================
// ABRIR CUBO
// ==========================================

function openCubePractice(size) {

  selectedCubeSize = size;


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


  const bottomNav =
    document.querySelector(
      ".bottom-nav"
    );


  if (bottomNav) {

    bottomNav.style.display =
      "none";

  }


  createRubiksCube(
    size
  );

}


// ==========================================
// CREAR CUBO
// ==========================================

function createRubiksCube(size) {

  const container =
    document.getElementById(
      "rubiks3D"
    );


  if (!container) {
    return;
  }


  container.innerHTML = "";

  cubePieces = [];

  moveHistory = [];


  cubeScene =
    new THREE.Scene();


  cubeScene.background =
    new THREE.Color(
      0x020617
    );


  cubeCamera =
    new THREE.PerspectiveCamera(
      45,
      1,
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
    Math.min(
      window.devicePixelRatio,
      2
    )
  );


  container.appendChild(
    cubeRenderer.domElement
  );


  // ========================================
  // LUCES
  // ========================================

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


  // ========================================
  // GRUPO DEL CUBO
  // ========================================

  rubiksCube =
    new THREE.Group();


  cubeScene.add(
    rubiksCube
  );


  createCubePieces(
    size
  );


  // ========================================
  // CONTROLES
  // ========================================

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


  resizeRubiksCube();


  animateCube();

}


// ==========================================
// RESPONSIVE
// ==========================================

function resizeRubiksCube() {

  const container =
    document.getElementById(
      "rubiks3D"
    );


  if (
    !container ||
    !cubeRenderer ||
    !cubeCamera
  ) {

    return;

  }


  const width =
    container.clientWidth;


  const height =
    container.clientHeight;


  if (
    width === 0 ||
    height === 0
  ) {

    return;

  }


  cubeCamera.aspect =
    width / height;


  cubeCamera.updateProjectionMatrix();


  cubeRenderer.setSize(
    width,
    height
  );

}


window.addEventListener(
  "resize",
  resizeRubiksCube
);


// ==========================================
// PIEZAS DEL CUBO
// ==========================================

function createCubePieces(size) {

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
          createStickerMaterials(
            x,
            y,
            z,
            size
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


        piece.userData = {

          x: x,
          y: y,
          z: z

        };


        rubiksCube.add(
          piece
        );


        cubePieces.push(
          piece
        );

      }

    }

  }

}


// ==========================================
// COLORES
// ==========================================

function createStickerMaterials(
  x,
  y,
  z,
  size
) {

  const black =
    0x111111;


  const white =
    0xffffff;


  const yellow =
    0xffff00;


  const red =
    0xff0000;


  const orange =
    0xff8800;


  const blue =
    0x0066ff;


  const green =
    0x00aa00;


  return [

    new THREE.MeshStandardMaterial({
      color:
        x === size - 1
          ? red
          : black
    }),

    new THREE.MeshStandardMaterial({
      color:
        x === 0
          ? orange
          : black
    }),

    new THREE.MeshStandardMaterial({
      color:
        y === size - 1
          ? white
          : black
    }),

    new THREE.MeshStandardMaterial({
      color:
        y === 0
          ? yellow
          : black
    }),

    new THREE.MeshStandardMaterial({
      color:
        z === size - 1
          ? green
          : black
    }),

    new THREE.MeshStandardMaterial({
      color:
        z === 0
          ? blue
          : black
    })

  ];

}


// ==========================================
// MOVIMIENTO DE CARAS
// ==========================================

function rotateFace(face, clockwise = true) {

  if (
    isTurning ||
    !rubiksCube
  ) {
    return;
  }

  isTurning = true;


  // Tamaño actual del cubo
  const size =
    selectedCubeSize;


  // Centro del cubo
  const center =
    (size - 1) / 2;


  let axis;
  let layer;


  // ========================================
  // DETERMINAR CARA
  // ========================================

  switch (face) {

    case "R":

      axis = "x";
      layer = center;

      break;


    case "L":

      axis = "x";
      layer = -center;

      break;


    case "U":

      axis = "y";
      layer = center;

      break;


    case "D":

      axis = "y";
      layer = -center;

      break;


    case "F":

      axis = "z";
      layer = center;

      break;


    case "B":

      axis = "z";
      layer = -center;

      break;


    default:

      isTurning = false;

      return;

  }


  // ========================================
  // BUSCAR LAS PIEZAS DE ESA CAPA
  // ========================================

  const pieces =
    cubePieces.filter(
      function (piece) {

        return (
          Math.abs(
            piece.position[axis] -
            layer
          ) < 0.1
        );

      }
    );


  if (
    pieces.length === 0
  ) {

    isTurning = false;

    return;

  }


  // ========================================
  // CREAR GRUPO TEMPORAL
  // ========================================

  const rotationGroup =
    new THREE.Group();


  rubiksCube.add(
    rotationGroup
  );


  // Meter las piezas en el grupo
  pieces.forEach(
    function (piece) {

      rotationGroup.attach(
        piece
      );

    }
  );


  // ========================================
  // ÁNGULO
  // ========================================

  const angle =
    clockwise
      ? Math.PI / 2
      : -Math.PI / 2;


  rotationGroup.rotation[
    axis
  ] = angle;


  rotationGroup.updateMatrixWorld(
    true
  );


  // ========================================
  // DEVOLVER PIEZAS AL CUBO
  // ========================================

  pieces.forEach(
    function (piece) {

      rubiksCube.attach(
        piece
      );

    }
  );


  rubiksCube.remove(
    rotationGroup
  );


  // ========================================
  // REDONDEAR POSICIONES
  // ========================================

  pieces.forEach(
    function (piece) {

      piece.position.x =
        Math.round(
          piece.position.x
        );


      piece.position.y =
        Math.round(
          piece.position.y
        );


      piece.position.z =
        Math.round(
          piece.position.z
        );

    }
  );


  // ========================================
  // GUARDAR MOVIMIENTO
  // ========================================

  moveHistory.push(
    clockwise
      ? face
      : face + "'"
  );


  isTurning = false;

}


// ==========================================
// TECLADO
// ==========================================

document.addEventListener(
  "keydown",
  function (event) {

    const key =
      event.key.toUpperCase();


    const validMoves = [
      "R",
      "L",
      "U",
      "D",
      "F",
      "B"
    ];


    if (
      validMoves.includes(
        key
      )
    ) {

      rotateFace(
        key,
        !event.shiftKey
      );

    }

  }
);


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


      const moves = [
        "R",
        "L",
        "U",
        "D",
        "F",
        "B"
      ];


      moveHistory = [];


      // Cantidad de movimientos
      // según el tamaño

      const scrambleLength =
        selectedCubeSize === 2
          ? 10
          : selectedCubeSize === 3
            ? 20
            : 30;


      for (
        let i = 0;
        i < scrambleLength;
        i++
      ) {

        const randomMove =
          moves[
            Math.floor(
              Math.random() *
              moves.length
            )
          ];


        const clockwise =
          Math.random() > 0.5;


        rotateFace(
          randomMove,
          clockwise
        );

      }

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
        "🧠 Solucionador\n\n" +
        "Cubo seleccionado: " +
        selectedCubeSize +
        "×" +
        selectedCubeSize +
        "\n\n" +
        "Movimientos registrados: " +
        moveHistory.length +
        "\n\n" +
        "El sistema de algoritmos " +
        "se añadirá en la siguiente etapa."
      );

    }
  );

  // ==========================================
// VOLVER A INICIO
// ==========================================

const backToHomeButton =
  document.getElementById(
    "backToHome"
  );

if (backToHomeButton) {

  backToHomeButton.addEventListener(
    "click",
    function () {

      // Ocultar todas las páginas

      document
        .querySelectorAll(".page")
        .forEach(
          function (page) {

            page.classList.remove(
              "active-page"
            );

          }
        );


      // Mostrar inicio

      const homePage =
        document.getElementById(
          "homePage"
        );


      if (homePage) {

        homePage.classList.add(
          "active-page"
        );

      }


      // Mostrar navegación inferior

      const bottomNav =
        document.querySelector(
          ".bottom-nav"
        );


      if (bottomNav) {

        bottomNav.style.display =
          "flex";

      }


      // Limpiar el cubo

      const container =
        document.getElementById(
          "rubiks3D"
        );


      if (container) {

        container.innerHTML = "";

      }


      // Liberar recursos

      if (cubeControls) {

        cubeControls.dispose();

        cubeControls = null;

      }


      if (cubeRenderer) {

        cubeRenderer.dispose();

        cubeRenderer = null;

      }


      cubeScene = null;

      cubeCamera = null;

      rubiksCube = null;

      cubePieces = [];

      moveHistory = [];

      isTurning = false;

    }
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