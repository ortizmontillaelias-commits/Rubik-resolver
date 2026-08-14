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

  const start = -(size - 1) / 2;

  cubePieces = [];

  for (let x = 0; x < size; x++) {

    for (let y = 0; y < size; y++) {

      for (let z = 0; z < size; z++) {

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

        // Posición inicial exacta
        piece.position.set(
          start + x,
          start + y,
          start + z
        );

        // ==================================
        // POSICIÓN LÓGICA
        // ==================================

        piece.userData = {

          gridX: x,
          gridY: y,
          gridZ: z,

          originalX: x,
          originalY: y,
          originalZ: z

        };

        rubiksCube.add(piece);

        cubePieces.push(piece);

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
// MOVIMIENTOS REALES
// ==========================================

let turning = false;

function rotateFace(face, clockwise = true) {

  if (!rubiksCube || turning) {
    return;
  }

  const size = selectedCubeSize;
  const center = (size - 1) / 2;

  let axis;
  let layer;

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
      return;
  }


  // ========================================
  // BUSCAR PIEZAS
  // ========================================

  const pieces =
    cubePieces.filter(function (piece) {

      const gridValue =
        axis === "x"
          ? piece.userData.gridX
          : axis === "y"
            ? piece.userData.gridY
            : piece.userData.gridZ;

      return Math.abs(
        gridValue - (layer + center)
      ) < 0.01;

    });


  if (pieces.length === 0) {
    return;
  }


  turning = true;


  // ========================================
  // GRUPO DE ROTACIÓN
  // ========================================

  const group =
    new THREE.Group();

  rubiksCube.add(group);


  pieces.forEach(function (piece) {

    group.attach(piece);

  });


  const targetAngle =
    clockwise
      ? Math.PI / 2
      : -Math.PI / 2;


  const duration = 300;
  const start = performance.now();


  // ========================================
  // ANIMACIÓN
  // ========================================

  function animateTurn(time) {

    const progress =
      Math.min(
        (time - start) / duration,
        1
      );


    const smooth =
      progress * (2 - progress);


    group.rotation[axis] =
      targetAngle * smooth;


    if (progress < 1) {

      requestAnimationFrame(
        animateTurn
      );

      return;

    }


    // ======================================
    // FINALIZAR GIRO
    // ======================================

    group.rotation[axis] =
      targetAngle;


    group.updateMatrixWorld(true);


    // ======================================
    // ACTUALIZAR POSICIONES LÓGICAS
    // ======================================

    pieces.forEach(function (piece) {

      const x =
        piece.userData.gridX;

      const y =
        piece.userData.gridY;

      const z =
        piece.userData.gridZ;

      const max =
        size - 1;

      let newX = x;
      let newY = y;
      let newZ = z;


      // GIRO EN X

      if (axis === "x") {

        if (clockwise) {

          newY = max - z;
          newZ = y;

        } else {

          newY = z;
          newZ = max - y;

        }

      }


      // GIRO EN Y

      if (axis === "y") {

        if (clockwise) {

          newX = z;
          newZ = max - x;

        } else {

          newX = max - z;
          newZ = x;

        }

      }


      // GIRO EN Z

      if (axis === "z") {

        if (clockwise) {

          newX = max - y;
          newY = x;

        } else {

          newX = y;
          newY = max - x;

        }

      }


      piece.userData.gridX = newX;
      piece.userData.gridY = newY;
      piece.userData.gridZ = newZ;


      // ==================================
      // IMPORTANTE:
      // conservar la ROTACIÓN de la pieza
      // ==================================

      rubiksCube.attach(piece);


      // Posición exacta

      piece.position.set(

        newX - center,

        newY - center,

        newZ - center

      );

    });


    // ======================================
    // ELIMINAR GRUPO
    // ======================================

    rubiksCube.remove(group);


    // ======================================
    // GUARDAR MOVIMIENTO
    // ======================================

    moveHistory.push(
      clockwise
        ? face
        : face + "'"
    );


    turning = false;

  }


  requestAnimationFrame(
    animateTurn
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

let scrambleRunning = false;

function generateScramble(size) {

  const moves = [
    "R",
    "L",
    "U",
    "D",
    "F",
    "B"
  ];

  const modifiers = [
    "",
    "'"
  ];

  let length;

  if (size === 2) {
    length = 9;
  } else if (size === 3) {
    length = 20;
  } else if (size === 4) {
    length = 40;
  } else if (size === 5) {
    length = 50;
  } else if (size === 6) {
    length = 60;
  } else {
    length = 70;
  }

  const scramble = [];

  let previousMove = null;

  while (scramble.length < length) {

    const move =
      moves[
        Math.floor(
          Math.random() *
          moves.length
        )
      ];

    // Evitar dos movimientos
    // consecutivos de la misma cara

    if (move === previousMove) {
      continue;
    }

    const modifier =
      modifiers[
        Math.floor(
          Math.random() *
          modifiers.length
        )
      ];

    scramble.push(
      move + modifier
    );

    previousMove = move;
  }

  return scramble;
}


// ==========================================
// EJECUTAR SCRAMBLE
// ==========================================

async function executeScramble(scramble) {

  if (scrambleRunning) {
    return;
  }

  scrambleRunning = true;

  moveHistory = [];

  for (const move of scramble) {

    const face =
      move.charAt(0);

    const clockwise =
      !move.includes("'");

    rotateFace(
      face,
      clockwise
    );

    // Esperar a que termine
    // la animación del movimiento

    await waitForTurn();

    await new Promise(
      function (resolve) {

        setTimeout(
          resolve,
          80
        );

      }
    );
  }

  scrambleRunning = false;
}


// ==========================================
// ESPERAR MOVIMIENTO
// ==========================================

function waitForTurn() {

  return new Promise(
    function (resolve) {

      function check() {

        if (!turning) {

          resolve();

          return;

        }

        requestAnimationFrame(
          check
        );

      }

      check();

    }
  );
}


// ==========================================
// BOTÓN MEZCLAR
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

      if (scrambleRunning) {
        return;
      }

      const scramble =
        generateScramble(
          selectedCubeSize
        );

      console.log(
        "Scramble:",
        scramble.join(" ")
      );

      executeScramble(
        scramble
      );

    }
  );

}

// ==========================================
// SOLUCIONADOR REAL - PASO 1
// ==========================================

const solveButton =
  document.getElementById("solveButton");


// ==========================================
// CREAR PANEL DE COLORES
// ==========================================

function openColorScanner() {

  // Por ahora comenzamos con el 3x3
  if (selectedCubeSize !== 3) {

    alert(
      "El sistema de entrada de colores comenzará primero con el cubo 3×3."
    );

    return;
  }


  // Evitar crear el panel dos veces
  const existing =
    document.getElementById(
      "cubeColorScanner"
    );

  if (existing) {

    existing.remove();

  }


  const scanner =
    document.createElement("div");

  scanner.id =
    "cubeColorScanner";


  scanner.innerHTML = `

    <div class="scanner-box">

      <div class="scanner-header">

        <h2>
          Configurar cubo 3×3
        </h2>

        <p>
          Introduce los colores de tu cubo físico.
        </p>

      </div>


      <div class="scanner-info">

        Selecciona un color y luego toca las
        casillas que tengan ese color.

      </div>


      <div class="color-selector">

        <button
          class="color-option selected"
          data-color="white"
          style="background:#ffffff">
        </button>

        <button
          class="color-option"
          data-color="yellow"
          style="background:#ffff00">
        </button>

        <button
          class="color-option"
          data-color="red"
          style="background:#ff0000">
        </button>

        <button
          class="color-option"
          data-color="orange"
          style="background:#ff8800">
        </button>

        <button
          class="color-option"
          data-color="blue"
          style="background:#0066ff">
        </button>

        <button
          class="color-option"
          data-color="green"
          style="background:#00aa00">
        </button>

      </div>


      <div class="cube-color-faces">

        ${createColorFace("U", "ARRIBA")}

        ${createColorFace("R", "DERECHA")}

        ${createColorFace("F", "FRENTE")}

        ${createColorFace("D", "ABAJO")}

        ${createColorFace("L", "IZQUIERDA")}

        ${createColorFace("B", "ATRÁS")}

      </div>


      <div class="scanner-buttons">

        <button
          id="clearCubeColors"
          class="secondary-button">

          Limpiar

        </button>


        <button
          id="saveCubeColors"
          class="primary-button">

          Continuar

        </button>

      </div>

    </div>

  `;


  document.body.appendChild(
    scanner
  );


  setupColorScanner();

}


// ==========================================
// CREAR UNA CARA
// ==========================================

function createColorFace(
  face,
  name
) {

  let squares = "";


  for (
    let i = 0;
    i < 9;
    i++
  ) {

    squares += `

      <button
        class="color-square"
        data-face="${face}"
        data-index="${i}">
      </button>

    `;

  }


  return `

    <div class="color-face">

      <h3>
        ${name}
      </h3>

      <div class="color-grid">

        ${squares}

      </div>

    </div>

  `;

}


// ==========================================
// CONFIGURAR SELECTOR
// ==========================================

function setupColorScanner() {

  let selectedColor =
    "white";


  const colors = {

    white: "#ffffff",

    yellow: "#ffff00",

    red: "#ff0000",

    orange: "#ff8800",

    blue: "#0066ff",

    green: "#00aa00"

  };


  const colorButtons =
    document.querySelectorAll(
      ".color-option"
    );


  const squares =
    document.querySelectorAll(
      ".color-square"
    );


  // ========================================
  // SELECCIONAR COLOR
  // ========================================

  colorButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          colorButtons.forEach(
            function (item) {

              item.classList.remove(
                "selected"
              );

            }
          );


          button.classList.add(
            "selected"
          );


          selectedColor =
            button.dataset.color;

        }
      );

    }
  );


  // ========================================
  // PINTAR CASILLAS
  // ========================================

  squares.forEach(
    function (square) {

      square.addEventListener(
        "click",
        function () {

          square.style.background =
            colors[selectedColor];

          square.dataset.color =
            selectedColor;

        }
      );

    }
  );


  // ========================================
  // LIMPIAR
  // ========================================

  const clearButton =
    document.getElementById(
      "clearCubeColors"
    );


  if (clearButton) {

    clearButton.addEventListener(
      "click",
      function () {

        squares.forEach(
          function (square) {

            square.style.background =
              "#111827";

            delete square.dataset.color;

          }
        );

      }
    );

  }


  // ========================================
  // CONTINUAR
  // ========================================

  const saveButton =
    document.getElementById(
      "saveCubeColors"
    );


  if (saveButton) {

    saveButton.addEventListener(
      "click",
      function () {

        const data = {};

        let complete = true;


        squares.forEach(
          function (square) {

            const face =
              square.dataset.face;

            const index =
              square.dataset.index;


            if (!data[face]) {

              data[face] = [];

            }


            const color =
              square.dataset.color;


            if (!color) {

              complete = false;

            }


            data[face][index] =
              color || null;

          }
        );


        if (!complete) {

          alert(
            "Completa todos los colores del cubo antes de continuar."
          );

          return;

        }


        console.log(
          "Estado del cubo:",
          data
        );


        alert(
          "✅ Colores guardados.\n\nEl siguiente paso será analizar este estado y generar la solución."
        );


        scanner.remove();

      }
    );

  }

}


// ==========================================
// BOTÓN RESOLVER
// ==========================================

if (solveButton) {

  solveButton.addEventListener(
    "click",
    function () {

      openColorScanner();

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