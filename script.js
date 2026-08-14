// ==========================================
// CUBE MASTER
// ==========================================

import * as THREE from "three";

import {
  OrbitControls
} from "three/addons/controls/OrbitControls.js";


// ==========================================
// LOGIN
// ==========================================

const loginButton =
  document.getElementById("loginButton");

const emailInput =
  document.getElementById("emailInput");


if (loginButton) {

  loginButton.addEventListener(
    "click",
    login
  );

}


if (emailInput) {

  emailInput.addEventListener(
    "keydown",
    function (event) {

      if (event.key === "Enter") {
        login();
      }

    }
  );

}


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


  const loginScreen =
    document.getElementById(
      "loginScreen"
    );

  const appScreen =
    document.getElementById(
      "appScreen"
    );


  if (loginScreen) {
    loginScreen.classList.add("hidden");
  }


  if (appScreen) {
    appScreen.classList.add("active");
  }


  const profileEmail =
    document.getElementById(
      "profileEmail"
    );

  const profileName =
    document.getElementById(
      "profileName"
    );

  const profileAvatar =
    document.getElementById(
      "profileAvatar"
    );


  if (profileEmail) {

    profileEmail.textContent =
      email;

  }


  if (profileName) {

    profileName.textContent =
      email.split("@")[0];

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


        const targetPage =
          document.getElementById(
            pageId
          );


        if (targetPage) {

          targetPage.classList.add(
            "active-page"
          );

        }


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


function formatTime(milliseconds) {

  const minutes =
    Math.floor(
      milliseconds / 60000
    );


  const seconds =
    Math.floor(
      (milliseconds % 60000) / 1000
    );


  const centiseconds =
    Math.floor(
      (milliseconds % 1000) / 10
    );


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
        setInterval(
          updateTimer,
          10
        );


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


      clearInterval(
        timerInterval
      );


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

      clearInterval(
        timerInterval
      );


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
// VARIABLES THREE.JS
// ==========================================

let cubeScene = null;
let cubeCamera = null;
let cubeRenderer = null;
let cubeControls = null;
let rubiksCube = null;

let cubePieces = [];

let selectedCubeSize = 3;

let moveHistory = [];

let turning = false;

let solvingCube = false;


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

        const size =
          Number(
            button.dataset.cube
          );


        if (!size) {
          return;
        }


        openCubePractice(size);

      }
    );

  }
);


// ==========================================
// ABRIR CUBO
// ==========================================

function openCubePractice(size) {

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


  // Ocultar Mezclar porque ya no lo utilizaremos

  const scrambleButton =
    document.getElementById(
      "scrambleButton"
    );


  if (scrambleButton) {

    scrambleButton.style.display =
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


  container.innerHTML = "";


  cubePieces = [];
  moveHistory = [];
  turning = false;
  solvingCube = false;


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


  const cameraDistance =
    size * 2.4 + 3;


  cubeCamera.position.set(
    cameraDistance,
    cameraDistance,
    cameraDistance
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


  rubiksCube =
    new THREE.Group();


  cubeScene.add(
    rubiksCube
  );


  createCubePieces(size);


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

}


// ==========================================
// CREAR PIEZAS
// ==========================================

function createCubePieces(size) {

  const start =
    -(size - 1) / 2;


  cubePieces = [];


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

          gridX: x,
          gridY: y,
          gridZ: z,

          originalX: x,
          originalY: y,
          originalZ: z

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
// COLORES DEL CUBO
// ==========================================

function createStickerMaterials(
  x,
  y,
  z,
  size
) {

  const black = 0x111111;

  const white = 0xffffff;

  const yellow = 0xffff00;

  const red = 0xff0000;

  const orange = 0xff8800;

  const blue = 0x0066ff;

  const green = 0x00aa00;


  return [

    // DERECHA

    new THREE.MeshStandardMaterial({

      color:
        x === size - 1
          ? red
          : black

    }),


    // IZQUIERDA

    new THREE.MeshStandardMaterial({

      color:
        x === 0
          ? orange
          : black

    }),


    // ARRIBA

    new THREE.MeshStandardMaterial({

      color:
        y === size - 1
          ? white
          : black

    }),


    // ABAJO

    new THREE.MeshStandardMaterial({

      color:
        y === 0
          ? yellow
          : black

    }),


    // FRENTE

    new THREE.MeshStandardMaterial({

      color:
        z === size - 1
          ? green
          : black

    }),


    // ATRÁS

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
// ROTAR UNA CARA
// ==========================================

function rotateFace(
  face,
  clockwise = true,
  recordMove = true
) {

  return new Promise(
    function (resolve) {

      if (
        !rubiksCube ||
        turning
      ) {

        resolve(false);

        return;

      }


      const size =
        selectedCubeSize;


      const center =
        (size - 1) / 2;


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

          resolve(false);

          return;

      }


      const pieces =
        cubePieces.filter(
          function (piece) {

            const gridValue =
              axis === "x"
                ? piece.userData.gridX
                : axis === "y"
                  ? piece.userData.gridY
                  : piece.userData.gridZ;


            return Math.abs(
              gridValue -
              (layer + center)
            ) < 0.01;

          }
        );


      if (
        pieces.length === 0
      ) {

        resolve(false);

        return;

      }


      turning = true;


      const group =
        new THREE.Group();


      rubiksCube.add(
        group
      );


      pieces.forEach(
        function (piece) {

          group.attach(
            piece
          );

        }
      );


      const targetAngle =
        clockwise
          ? Math.PI / 2
          : -Math.PI / 2;


      const duration =
        solvingCube
          ? 1000
          : 350;


      const start =
        performance.now();


      function animateTurn(time) {

        const progress =
          Math.min(
            (time - start) /
            duration,
            1
          );


        const smooth =
          progress *
          (2 - progress);


        group.rotation[axis] =
          targetAngle *
          smooth;


        if (
          progress < 1
        ) {

          requestAnimationFrame(
            animateTurn
          );

          return;

        }


        group.rotation[axis] =
          targetAngle;


        group.updateMatrixWorld(
          true
        );


        const max =
          size - 1;


        pieces.forEach(
          function (piece) {

            const x =
              piece.userData.gridX;

            const y =
              piece.userData.gridY;

            const z =
              piece.userData.gridZ;


            let newX = x;
            let newY = y;
            let newZ = z;


            // X

            if (
              axis === "x"
            ) {

              if (
                clockwise
              ) {

                newY =
                  max - z;

                newZ =
                  y;

              } else {

                newY =
                  z;

                newZ =
                  max - y;

              }

            }


            // Y

            if (
              axis === "y"
            ) {

              if (
                clockwise
              ) {

                newX =
                  z;

                newZ =
                  max - x;

              } else {

                newX =
                  max - z;

                newZ =
                  x;

              }

            }


            // Z

            if (
              axis === "z"
            ) {

              if (
                clockwise
              ) {

                newX =
                  max - y;

                newY =
                  x;

              } else {

                newX =
                  y;

                newY =
                  max - x;

              }

            }


            piece.userData.gridX =
              newX;

            piece.userData.gridY =
              newY;

            piece.userData.gridZ =
              newZ;


            rubiksCube.attach(
              piece
            );


            piece.position.set(

              newX - center,

              newY - center,

              newZ - center

            );

          }
        );


        rubiksCube.remove(
          group
        );


        if (
          recordMove
        ) {

          moveHistory.push(
            clockwise
              ? face
              : face + "'"
          );

        }


        turning = false;

        resolve(true);

      }


      requestAnimationFrame(
        animateTurn
      );

    }
  );

}


// ==========================================
// TECLADO
// ==========================================

document.addEventListener(
  "keydown",
  function (event) {

    if (solvingCube) {
      return;
    }


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
        !event.shiftKey,
        true
      );

    }

  }
);


// ==========================================
// ESPERAR
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
// SOLUCIONADOR
// ==========================================

const solveButton =
  document.getElementById(
    "solveButton"
  );


if (solveButton) {

  solveButton.addEventListener(
    "click",
    function () {

      if (
        solvingCube
      ) {

        return;

      }


      openColorScanner();

    }
  );

}


// ==========================================
// ESTADO DE COLORES
// ==========================================

let enteredCubeColors = {};


// ==========================================
// COLORES DISPONIBLES
// ==========================================

const scannerColors = {

  white: "#ffffff",

  yellow: "#ffff00",

  red: "#ff0000",

  orange: "#ff8800",

  blue: "#0066ff",

  green: "#00aa00"

};


// ==========================================
// NOMBRES DE LAS CARAS
// ==========================================

const cubeFaces = [

  {
    id: "U",
    name: "ARRIBA"
  },

  {
    id: "R",
    name: "DERECHA"
  },

  {
    id: "F",
    name: "FRENTE"
  },

  {
    id: "D",
    name: "ABAJO"
  },

  {
    id: "L",
    name: "IZQUIERDA"
  },

  {
    id: "B",
    name: "ATRÁS"
  }

];


// ==========================================
// ABRIR INTRODUCCIÓN
// ==========================================

function openColorScanner() {

  if (
    selectedCubeSize !== 3
  ) {

    alert(
      "Por ahora el solucionador de colores funciona con el cubo 3×3."
    );

    return;

  }


  const existing =
    document.getElementById(
      "cubeColorScanner"
    );


  if (existing) {

    existing.remove();

  }


  enteredCubeColors = {};


  cubeFaces.forEach(
    function (face) {

      enteredCubeColors[
        face.id
      ] = [];

    }
  );


  const scanner =
    document.createElement(
      "div"
    );


  scanner.id =
    "cubeColorScanner";


  scanner.innerHTML = `

    <div class="scanner-box">

      <div class="scanner-header">

        <h2>
          Introduce los colores
        </h2>

        <p id="scannerInstruction">
          Selecciona los colores de tu cubo.
        </p>

      </div>


      <div
        id="scannerProgress"
        class="scanner-info"
      >
        Cara 1 de 6
      </div>


      <div
        id="scannerColorSelector"
        class="color-selector"
      >

        <button
          class="color-option selected"
          data-color="white"
          style="background:#ffffff"
          aria-label="Blanco"
        ></button>

        <button
          class="color-option"
          data-color="yellow"
          style="background:#ffff00"
          aria-label="Amarillo"
        ></button>

        <button
          class="color-option"
          data-color="red"
          style="background:#ff0000"
          aria-label="Rojo"
        ></button>

        <button
          class="color-option"
          data-color="orange"
          style="background:#ff8800"
          aria-label="Naranja"
        ></button>

        <button
          class="color-option"
          data-color="blue"
          style="background:#0066ff"
          aria-label="Azul"
        ></button>

        <button
          class="color-option"
          data-color="green"
          style="background:#00aa00"
          aria-label="Verde"
        ></button>

      </div>


      <div
        id="currentColorFace"
        class="current-color-face"
      ></div>


      <div class="scanner-buttons">

        <button
          id="clearCurrentFace"
          class="secondary-button"
        >
          Limpiar cara
        </button>

      </div>

    </div>

  `;


  document.body.appendChild(
    scanner
  );


  setupColorScanner(
    scanner
  );

}


// ==========================================
// CREAR CUADRADO 3x3
// ==========================================

function createCurrentFaceGrid(
  faceId
) {

  const container =
    document.getElementById(
      "currentColorFace"
    );


  if (!container) {
    return;
  }


  container.innerHTML = "";


  const face =
    cubeFaces.find(
      function (item) {

        return item.id === faceId;

      }
    );


  if (!face) {
    return;
  }


  const title =
    document.createElement(
      "h3"
    );


  title.textContent =
    face.name;


  container.appendChild(
    title
  );


  const grid =
    document.createElement(
      "div"
    );


  grid.className =
    "color-grid";


  for (
    let i = 0;
    i < 9;
    i++
  ) {

    const square =
      document.createElement(
        "button"
      );


    square.className =
      "color-square";


    square.dataset.index =
      i;


    const savedColor =
      enteredCubeColors[
        faceId
      ][i];


    if (savedColor) {

      square.style.background =
        scannerColors[
          savedColor
        ];

      square.dataset.color =
        savedColor;

    } else {

      square.style.background =
        "#111827";

    }


    grid.appendChild(
      square
    );

  }


  container.appendChild(
    grid
  );

}


// ==========================================
// CONFIGURAR SCANNER
// ==========================================

function setupColorScanner(
  scanner
) {

  let currentFaceIndex = 0;

  let selectedColor =
    "white";


  const colorButtons =
    scanner.querySelectorAll(
      ".color-option"
    );


  function updateScanner() {

    const currentFace =
      cubeFaces[
        currentFaceIndex
      ];


    const progress =
      document.getElementById(
        "scannerProgress"
      );


    const instruction =
      document.getElementById(
        "scannerInstruction"
      );


    if (progress) {

      progress.textContent =
        "Cara " +
        (currentFaceIndex + 1) +
        " de 6";

    }


    if (instruction) {

      instruction.textContent =
        "Introduce los colores de la cara " +
        currentFace.name.toLowerCase() +
        ".";

    }


    createCurrentFaceGrid(
      currentFace.id
    );


    // Girar el cubo 3D para mostrar
    // la siguiente cara

    rotateCubeToFace(
      currentFace.id
    );

  }


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
  // PINTAR CUADRADOS
  // ========================================

  scanner.addEventListener(
    "click",
    function (event) {

      if (
        !event.target.classList.contains(
          "color-square"
        )
      ) {

        return;

      }


      const square =
        event.target;


      const index =
        Number(
          square.dataset.index
        );


      const currentFace =
        cubeFaces[
          currentFaceIndex
        ];


      square.style.background =
        scannerColors[
          selectedColor
        ];


      square.dataset.color =
        selectedColor;


      enteredCubeColors[
        currentFace.id
      ][index] =
        selectedColor;


      // Verificar si la cara está completa

      const complete =
        enteredCubeColors[
          currentFace.id
        ].length === 9 &&
        enteredCubeColors[
          currentFace.id
        ].every(
          function (color) {

            return !!color;

          }
        );


      if (complete) {

        setTimeout(
          function () {

            goToNextFace();

          },
          350
        );

      }

    }
  );


  // ========================================
  // LIMPIAR CARA
  // ========================================

  const clearButton =
    document.getElementById(
      "clearCurrentFace"
    );


  if (clearButton) {

    clearButton.addEventListener(
      "click",
      function () {

        const currentFace =
          cubeFaces[
            currentFaceIndex
          ];


        enteredCubeColors[
          currentFace.id
        ] = [];


        createCurrentFaceGrid(
          currentFace.id
        );

      }
    );

  }


  // ========================================
  // SIGUIENTE CARA
  // ========================================

  function goToNextFace() {

    if (
      currentFaceIndex <
      cubeFaces.length - 1
    ) {

      currentFaceIndex++;

      updateScanner();

      return;

    }


    finishColorInput();

  }


  updateScanner();

}


// ==========================================
// GIRAR CUBO HACIA UNA CARA
// ==========================================

function rotateCubeToFace(
  face
) {

  if (!rubiksCube) {
    return;
  }


  if (
    !cubeControls
  ) {
    return;
  }


  const positions = {

    U: {
      x: 0,
      y: 7,
      z: 8
    },

    R: {
      x: 8,
      y: 4,
      z: 7
    },

    F: {
      x: 7,
      y: 4,
      z: 8
    },

    D: {
      x: 0,
      y: -7,
      z: 8
    },

    L: {
      x: -8,
      y: 4,
      z: 7
    },

    B: {
      x: -7,
      y: 4,
      z: -8
    }

  };


  const position =
    positions[face];


  if (!position) {
    return;
  }


  const target =
    new THREE.Vector3(
      0,
      0,
      0
    );


  cubeCamera.position.set(
    position.x,
    position.y,
    position.z
  );


  cubeCamera.lookAt(
    target
  );


  if (
    cubeControls
  ) {

    cubeControls.target.copy(
      target
    );

    cubeControls.update();

  }

}


// ==========================================
// TERMINAR ENTRADA DE COLORES
// ==========================================

function finishColorInput() {

  const scanner =
    document.getElementById(
      "cubeColorScanner"
    );


  if (!scanner) {
    return;
  }


  const valid =
    validateCubeColors();


  if (!valid) {

    alert(
      "Los colores introducidos no forman un cubo válido. Revisa que cada color aparezca exactamente 9 veces."
    );

    return;

  }


  scanner.innerHTML = `

    <div class="scanner-box">

      <div class="scanner-header">

        <h2>
          ¡Cubo registrado!
        </h2>

        <p>
          Ya tenemos las 6 caras de tu cubo.
        </p>

      </div>


      <div class="scanner-buttons">

        <button
          id="finalSolveButton"
          class="primary-button"
        >
          🧠 Resolver cubo
        </button>


        <button
          id="cancelColorInput"
          class="secondary-button"
        >
          Cancelar
        </button>

      </div>

    </div>

  `;


  const finalSolveButton =
    document.getElementById(
      "finalSolveButton"
    );


  if (finalSolveButton) {

    finalSolveButton.addEventListener(
      "click",
      function () {

        scanner.remove();

        startCubeSolution();

      }
    );

  }


  const cancelButton =
    document.getElementById(
      "cancelColorInput"
    );


  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      function () {

        scanner.remove();

      }
    );

  }

}


// ==========================================
// VALIDAR COLORES
// ==========================================

function validateCubeColors() {

  const counts = {

    white: 0,

    yellow: 0,

    red: 0,

    orange: 0,

    blue: 0,

    green: 0

  };


  cubeFaces.forEach(
    function (face) {

      const colors =
        enteredCubeColors[
          face.id
        ] || [];


      colors.forEach(
        function (color) {

          if (
            counts[color] !== undefined
          ) {

            counts[color]++;

          }

        }
      );

    }
  );


  return (
    counts.white === 9 &&
    counts.yellow === 9 &&
    counts.red === 9 &&
    counts.orange === 9 &&
    counts.blue === 9 &&
    counts.green === 9
  );

}


// ==========================================
// SOLUCIÓN
// ==========================================

async function startCubeSolution() {

  if (
    solvingCube
  ) {

    return;

  }


  if (
    !rubiksCube
  ) {

    alert(
      "Primero abre un cubo."
    );

    return;

  }


  solvingCube = true;


  // Mostrar mensaje

  showSolverMessage(
    "Analizando el cubo..."
  );


  await sleep(
    1200
  );


  /*
   * IMPORTANTE:
   *
   * Aquí dejamos preparada la reproducción
   * lenta de movimientos.
   *
   * El siguiente paso será conectar un
   * solucionador matemático real del 3×3
   * que convierta los colores introducidos
   * en movimientos.
   */


  showSolverMessage(
    "Cubo preparado. Generando solución..."
  );


  await sleep(
    1200
  );


  /*
   * Por seguridad NO inventamos movimientos
   * para un cubo físico desconocido.
   *
   * Cuando conectemos el algoritmo real,
   * aquí se ejecutará:
   *
   * R
   * U
   * R'
   * U'
   *
   * etc., lentamente.
   */


  solvingCube = false;


  showSolverMessage(
    "El estado del cubo fue registrado correctamente."
  );


  setTimeout(
    function () {

      hideSolverMessage();

    },
    2500
  );

}


// ==========================================
// MENSAJE DEL SOLUCIONADOR
// ==========================================

function showSolverMessage(
  message
) {

  let messageBox =
    document.getElementById(
      "cubeSolverMessage"
    );


  if (!messageBox) {

    messageBox =
      document.createElement(
        "div"
      );


    messageBox.id =
      "cubeSolverMessage";


    messageBox.style.position =
      "fixed";


    messageBox.style.left =
      "50%";


    messageBox.style.bottom =
      "30px";


    messageBox.style.transform =
      "translateX(-50%)";


    messageBox.style.zIndex =
      "99999";


    messageBox.style.background =
      "#0f172a";


    messageBox.style.color =
      "white";


    messageBox.style.padding =
      "16px 24px";


    messageBox.style.borderRadius =
      "14px";


    messageBox.style.boxShadow =
      "0 10px 30px rgba(0,0,0,.4)";


    messageBox.style.fontSize =
      "15px";


    messageBox.style.textAlign =
      "center";


    document.body.appendChild(
      messageBox
    );

  }


  messageBox.textContent =
    message;

}


// ==========================================
// OCULTAR MENSAJE
// ==========================================

function hideSolverMessage() {

  const messageBox =
    document.getElementById(
      "cubeSolverMessage"
    );


  if (messageBox) {

    messageBox.remove();

  }

}


// ==========================================
// ESPERAR
// ==========================================

function sleep(
  milliseconds
) {

  return new Promise(
    function (resolve) {

      setTimeout(
        resolve,
        milliseconds
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
        .forEach(
          function (page) {

            page.classList.remove(
              "active-page"
            );

          }
        );


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

        container.innerHTML =
          "";

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

      turning = false;
      solvingCube = false;


      hideSolverMessage();

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


animateCube();