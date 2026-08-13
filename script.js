// ==========================================
// CUBE MASTER
// ==========================================

// ==========================================
// LOGIN
// ==========================================

const loginButton = document.getElementById("loginButton");
const emailInput = document.getElementById("emailInput");

if (loginButton) {
  loginButton.addEventListener("click", login);
}

if (emailInput) {
  emailInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      login();
    }
  });
}

function login() {
  const email = emailInput.value.trim();

  if (email === "") {
    alert("Escribe tu correo electrónico.");
    return;
  }

  if (!email.includes("@")) {
    alert("Escribe un correo electrónico válido.");
    return;
  }

  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("appScreen").classList.add("active");

  const profileEmail = document.getElementById("profileEmail");
  const profileName = document.getElementById("profileName");
  const profileAvatar = document.getElementById("profileAvatar");

  if (profileEmail) {
    profileEmail.textContent = email;
  }

  if (profileName) {
    profileName.textContent = email.split("@")[0];
  }

  if (profileAvatar) {
    profileAvatar.textContent =
      email.charAt(0).toUpperCase();
  }
}


// ==========================================
// NAVEGACIÓN
// ==========================================

const navigationButtons =
  document.querySelectorAll(".nav-button");

const pages =
  document.querySelectorAll(".page");

navigationButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    const pageId = button.dataset.page;

    pages.forEach(function (page) {
      page.classList.remove("active-page");
    });

    navigationButtons.forEach(function (nav) {
      nav.classList.remove("active");
    });

    const targetPage =
      document.getElementById(pageId);

    if (targetPage) {
      targetPage.classList.add("active-page");
    }

    button.classList.add("active");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });

});


// ==========================================
// TEMPORIZADOR
// ==========================================

let timerInterval = null;
let startTime = 0;
let elapsedTime = 0;
let timerRunning = false;

const timerDisplay =
  document.getElementById("timerDisplay");

const timerStatus =
  document.getElementById("timerStatus");

const startTimerButton =
  document.getElementById("startTimer");

const stopTimerButton =
  document.getElementById("stopTimer");

const resetTimerButton =
  document.getElementById("resetTimer");


function formatTime(milliseconds) {

  const minutes =
    Math.floor(milliseconds / 60000);

  const seconds =
    Math.floor((milliseconds % 60000) / 1000);

  const centiseconds =
    Math.floor((milliseconds % 1000) / 10);

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0") +
    "." +
    String(centiseconds).padStart(2, "0")
  );
}


function updateTimer() {

  elapsedTime =
    Date.now() - startTime;

  if (timerDisplay) {
    timerDisplay.textContent =
      formatTime(elapsedTime);
  }
}


if (startTimerButton) {

  startTimerButton.addEventListener(
    "click",
    function () {

      if (timerRunning) {
        return;
      }

      timerRunning = true;

      startTime =
        Date.now() - elapsedTime;

      timerInterval =
        setInterval(updateTimer, 10);

      if (timerStatus) {
        timerStatus.textContent =
          "Temporizador funcionando...";
      }

    }
  );

}


if (stopTimerButton) {

  stopTimerButton.addEventListener(
    "click",
    function () {

      if (!timerRunning) {
        return;
      }

      clearInterval(timerInterval);

      timerInterval = null;
      timerRunning = false;

      if (timerStatus) {
        timerStatus.textContent =
          "Tiempo detenido.";
      }

    }
  );

}


if (resetTimerButton) {

  resetTimerButton.addEventListener(
    "click",
    function () {

      clearInterval(timerInterval);

      timerInterval = null;
      timerRunning = false;
      elapsedTime = 0;

      if (timerDisplay) {
        timerDisplay.textContent =
          "00:00.00";
      }

      if (timerStatus) {
        timerStatus.textContent =
          "Presiona iniciar para comenzar.";
      }

    }
  );

}


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

let cubePieces = [];

let selectedCubeSize = 3;

let moveHistory = [];


// ==========================================
// BOTONES DE CUBOS
// ==========================================

const practiceButtons =
  document.querySelectorAll(
    ".practice-button"
  );

practiceButtons.forEach(function (button) {

  button.addEventListener(
    "click",
    function () {

      const size =
        Number(button.dataset.cube);

      if (!size) {
        return;
      }

      openCubePractice(size);

    }
  );

});


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

  if (!practicePage) {
    return;
  }

  if (title) {

    title.textContent =
      "Cubo " +
      size +
      "×" +
      size;

  }

  document
    .querySelectorAll(".page")
    .forEach(function (page) {

      page.classList.remove(
        "active-page"
      );

    });

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

  if (!container) {
    return;
  }

  // Limpiar cubo anterior

  container.innerHTML = "";

  cubePieces = [];
  moveHistory = [];


  // ========================================
  // ESCENA
  // ========================================

  cubeScene =
    new THREE.Scene();

  cubeScene.background =
    new THREE.Color(
      0x020617
    );


  // ========================================
  // CÁMARA
  // ========================================

  cubeCamera =
    new THREE.PerspectiveCamera(
      45,
      1,
      0.1,
      100
    );


  const cameraDistance =
    size * 2.4 + 3;

  cubeCamera.position.set(
    cameraDistance,
    cameraDistance,
    cameraDistance
  );


  // ========================================
  // RENDER
  // ========================================

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
  // GRUPO PRINCIPAL
  // ========================================

  rubiksCube =
    new THREE.Group();

  cubeScene.add(
    rubiksCube
  );


  // ========================================
  // CREAR PIEZAS
  // ========================================

  createCubePieces(size);


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
    size * 6;


  resizeRubiksCube();

  animateCube();

}


// ==========================================
// PIEZAS DEL CUBO
// ==========================================

function createCubePieces(size) {

  cubePieces = [];


  // Para cubos pares e impares
  // el centro siempre queda correcto.

  const center =
    (size - 1) / 2;


  // Tamaño de cada pieza.

  const pieceSize =
    0.92;


  // Separación uniforme.

  const spacing =
    1;


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
            pieceSize,
            pieceSize,
            pieceSize
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

          (x - center) * spacing,

          (y - center) * spacing,

          (z - center) * spacing

        );


        piece.userData = {

          gridX: x,
          gridY: y,
          gridZ: z

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

    // Derecha
    new THREE.MeshStandardMaterial({
      color:
        x === size - 1
          ? red
          : black
    }),

    // Izquierda
    new THREE.MeshStandardMaterial({
      color:
        x === 0
          ? orange
          : black
    }),

    // Arriba
    new THREE.MeshStandardMaterial({
      color:
        y === size - 1
          ? white
          : black
    }),

    // Abajo
    new THREE.MeshStandardMaterial({
      color:
        y === 0
          ? yellow
          : black
    }),

    // Frente
    new THREE.MeshStandardMaterial({
      color:
        z === size - 1
          ? green
          : black
    }),

    // Atrás
    new THREE.MeshStandardMaterial({
      color:
        z === 0
          ? blue
          : black
    })

  ];

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
    width <= 0 ||
    height <= 0
  ) {
    return;
  }


  cubeCamera.aspect =
    width / height;

  cubeCamera.updateProjectionMatrix();


  cubeRenderer.setSize(
    width,
    height,
    false
  );

}


window.addEventListener(
  "resize",
  resizeRubiksCube
);


// ==========================================
// MOVIMIENTOS
// ==========================================
//
// IMPORTANTE:
// Por ahora NO deformamos las piezas.
// Guardamos los movimientos para el
// solucionador que construiremos después.
//

function rotateFace(
  face,
  clockwise = true
) {

  if (!rubiksCube) {
    return;
  }


  moveHistory.push(
    clockwise
      ? face
      : face + "'"
  );


  console.log(
    "Movimiento:",
    clockwise
      ? face
      : face + "'",
    "Cubo:",
    selectedCubeSize + "×" +
    selectedCubeSize
  );

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
      validMoves.includes(key)
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

const scrambleButton =
  document.getElementById(
    "scrambleButton"
  );


if (scrambleButton) {

  scrambleButton.addEventListener(
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


      let amount;


      if (
        selectedCubeSize === 2
      ) {

        amount = 10;

      } else if (
        selectedCubeSize === 3
      ) {

        amount = 20;

      } else {

        amount = 30;

      }


      for (
        let i = 0;
        i < amount;
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


      alert(
        "Cubo " +
        selectedCubeSize +
        "×" +
        selectedCubeSize +
        " mezclado."
      );

    }
  );

}


// ==========================================
// RESOLVER
// ==========================================

const solveButton =
  document.getElementById(
    "solveButton"
  );


if (solveButton) {

  solveButton.addEventListener(
    "click",
    function () {

      alert(
        "🧠 Solucionador\n\n" +
        "Cubo: " +
        selectedCubeSize +
        "×" +
        selectedCubeSize +
        "\n\n" +
        "Movimientos registrados: " +
        moveHistory.length +
        "\n\n" +
        "El solucionador avanzado " +
        "lo añadiremos después."
      );

    }
  );

}


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

      document
        .querySelectorAll(".page")
        .forEach(function (page) {

          page.classList.remove(
            "active-page"
          );

        });


      const homePage =
        document.getElementById(
          "homePage"
        );


      if (homePage) {

        homePage.classList.add(
          "active-page"
        );

      }


      const bottomNav =
        document.querySelector(
          ".bottom-nav"
        );


      if (bottomNav) {

        bottomNav.style.display =
          "flex";

      }


      const container =
        document.getElementById(
          "rubiks3D"
        );


      if (container) {

        container.innerHTML = "";

      }


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