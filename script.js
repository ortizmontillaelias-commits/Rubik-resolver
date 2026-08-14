// ==========================================
// CUBEMASTER
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
    profileEmail.textContent = email;
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

let turning = false;


// ==========================================
// COLORES
// ==========================================

const CUBE_COLORS = {

  white: "#ffffff",
  yellow: "#ffff00",
  red: "#ff0000",
  orange: "#ff8800",
  blue: "#0066ff",
  green: "#00aa00"

};


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


  createRubiksCube(size);

}


// ==========================================
// CREAR CUBO 3D
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
  turning = false;


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


  cubeCamera.lookAt(
    0,
    0,
    0
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


  cubeControls.enableDamping = true;
  cubeControls.enablePan = false;


  cubeControls.minDistance =
    size + 2;


  cubeControls.maxDistance =
    size * 6;


  resizeRubiksCube();

  animateCube();

}


// ==========================================
// CREAR PIEZAS
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
// MATERIALES
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
// REDIMENSIONAR
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

      openColorScanner();

    }
  );

}


// ==========================================
// DATOS DEL ESCÁNER
// ==========================================

let scannerState = {

  currentFace: 0,

  selectedColor: "white",

  faces: {}

};


const faceNames = [

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
// ABRIR ESCÁNER
// ==========================================

function openColorScanner() {

  const oldScanner =
    document.getElementById(
      "cubeColorScanner"
    );


  if (oldScanner) {
    oldScanner.remove();
  }


  scannerState = {

    currentFace: 0,

    selectedColor: "white",

    faces: {}

  };


  faceNames.forEach(
    function (face) {

      scannerState.faces[
        face.id
      ] =
        new Array(
          selectedCubeSize *
          selectedCubeSize
        ).fill(null);

    }
  );


  const scanner =
    document.createElement(
      "div"
    );


  scanner.id =
    "cubeColorScanner";


  scanner.innerHTML = `

    <div class="cm-scanner-overlay">

      <div class="cm-scanner-card">

        <div class="cm-scanner-top">

          <span class="cm-scanner-icon">
            🧠
          </span>

          <div>

            <h2>
              Introduce tu cubo
            </h2>

            <p>
              Selecciona un color y toca
              las casillas correspondientes.
            </p>

          </div>

        </div>


        <div class="cm-face-progress">

          <strong id="cmFaceName">
            ARRIBA
          </strong>

          <span id="cmFaceNumber">
            Cara 1 de 6
          </span>

        </div>


        <div class="cm-color-selector">

          <button
            class="cm-color-button cm-selected"
            data-color="white"
            title="Blanco">
          </button>

          <button
            class="cm-color-button"
            data-color="yellow"
            title="Amarillo">
          </button>

          <button
            class="cm-color-button"
            data-color="red"
            title="Rojo">
          </button>

          <button
            class="cm-color-button"
            data-color="orange"
            title="Naranja">
          </button>

          <button
            class="cm-color-button"
            data-color="blue"
            title="Azul">
          </button>

          <button
            class="cm-color-button"
            data-color="green"
            title="Verde">
          </button>

        </div>


        <div
          id="cmCurrentFace"
          class="cm-current-face">
        </div>


        <div class="cm-scanner-actions">

          <button
            id="cmClearFace"
            class="secondary-button">
            Limpiar cara
          </button>

          <button
            id="cmNextFace"
            class="primary-button">
            Completa la cara
          </button>

        </div>


        <button
          id="cmCancel"
          class="cm-cancel-button">
          Cancelar
        </button>

      </div>

    </div>

  `;


  document.body.appendChild(
    scanner
  );


  addScannerStyles();

  setupScanner();

  renderCurrentFace();

}


// ==========================================
// ESTILOS DEL ESCÁNER
// ==========================================

function addScannerStyles() {

  if (
    document.getElementById(
      "cubeMasterScannerStyles"
    )
  ) {
    return;
  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "cubeMasterScannerStyles";


  style.textContent = `

    #cubeColorScanner {
      position: fixed;
      inset: 0;
      z-index: 99999;
    }

    .cm-scanner-overlay {
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.96);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow-y: auto;
    }

    .cm-scanner-card {
      width: min(560px, 100%);
      max-height: 95vh;
      overflow-y: auto;
      background: #0f172a;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 25px 80px rgba(0,0,0,.5);
      color: white;
    }

    .cm-scanner-top {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      margin-bottom: 22px;
    }

    .cm-scanner-icon {
      font-size: 32px;
    }

    .cm-scanner-top h2 {
      margin: 0 0 6px;
      font-size: 25px;
    }

    .cm-scanner-top p {
      margin: 0;
      color: #94a3b8;
      line-height: 1.5;
    }

    .cm-face-progress {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #020617;
      border-radius: 14px;
      padding: 13px 16px;
      margin-bottom: 18px;
    }

    .cm-face-progress strong {
      font-size: 17px;
    }

    .cm-face-progress span {
      color: #60a5fa;
      font-size: 14px;
    }

    .cm-color-selector {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin: 20px 0;
      flex-wrap: wrap;
    }

    .cm-color-button {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 3px solid #334155;
      cursor: pointer;
      position: relative;
      transition: .2s;
    }

    .cm-color-button[data-color="white"] {
      background: #ffffff;
    }

    .cm-color-button[data-color="yellow"] {
      background: #ffff00;
    }

    .cm-color-button[data-color="red"] {
      background: #ff0000;
    }

    .cm-color-button[data-color="orange"] {
      background: #ff8800;
    }

    .cm-color-button[data-color="blue"] {
      background: #0066ff;
    }

    .cm-color-button[data-color="green"] {
      background: #00aa00;
    }

    .cm-color-button.cm-selected {
      border-color: #ffffff;
      transform: scale(1.12);
      box-shadow: 0 0 0 4px rgba(96,165,250,.35);
    }

    .cm-current-face {
      display: grid;
      grid-template-columns: repeat(
        var(--cm-size),
        1fr
      );
      gap: 6px;
      width: min(360px, 100%);
      margin: 0 auto 24px;
      padding: 10px;
      background: #020617;
      border-radius: 16px;
    }

    .cm-color-square {
      aspect-ratio: 1;
      min-width: 0;
      border: 2px solid #475569;
      border-radius: 5px;
      background: #1e293b;
      cursor: pointer;
      transition: .15s;
    }

    .cm-color-square:hover {
      transform: scale(.94);
    }

    .cm-color-square.filled {
      border-color: rgba(255,255,255,.7);
    }

    .cm-scanner-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .cm-scanner-actions button {
      min-width: 150px;
    }

    .cm-cancel-button {
      display: block;
      margin: 18px auto 0;
      background: transparent;
      border: 0;
      color: #94a3b8;
      cursor: pointer;
      padding: 8px 15px;
      font-size: 14px;
    }

    .cm-cancel-button:hover {
      color: white;
    }

    @media (max-width: 500px) {

      .cm-scanner-card {
        padding: 18px;
        border-radius: 18px;
      }

      .cm-color-button {
        width: 38px;
        height: 38px;
      }

    }

  `;


  document.head.appendChild(
    style
  );

}


// ==========================================
// CONFIGURAR ESCÁNER
// ==========================================

function setupScanner() {

  const colorButtons =
    document.querySelectorAll(
      ".cm-color-button"
    );


  colorButtons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          colorButtons.forEach(
            function (item) {

              item.classList.remove(
                "cm-selected"
              );

            }
          );


          button.classList.add(
            "cm-selected"
          );


          scannerState.selectedColor =
            button.dataset.color;

        }
      );

    }
  );


  const clearButton =
    document.getElementById(
      "cmClearFace"
    );


  if (clearButton) {

    clearButton.addEventListener(
      "click",
      function () {

        const face =
          faceNames[
            scannerState.currentFace
          ];


        scannerState.faces[
          face.id
        ] =
          new Array(
            selectedCubeSize *
            selectedCubeSize
          ).fill(null);


        renderCurrentFace();

      }
    );

  }


  const nextButton =
    document.getElementById(
      "cmNextFace"
    );


  if (nextButton) {

    nextButton.addEventListener(
      "click",
      goToNextFace
    );

  }


  const cancelButton =
    document.getElementById(
      "cmCancel"
    );


  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      function () {

        const scanner =
          document.getElementById(
            "cubeColorScanner"
          );


        if (scanner) {
          scanner.remove();
        }

      }
    );

  }

}


// ==========================================
// MOSTRAR CARA ACTUAL
// ==========================================

function renderCurrentFace() {

  const face =
    faceNames[
      scannerState.currentFace
    ];


  const faceName =
    document.getElementById(
      "cmFaceName"
    );


  const faceNumber =
    document.getElementById(
      "cmFaceNumber"
    );


  const container =
    document.getElementById(
      "cmCurrentFace"
    );


  const nextButton =
    document.getElementById(
      "cmNextFace"
    );


  if (!face || !container) {
    return;
  }


  if (faceName) {

    faceName.textContent =
      face.name;

  }


  if (faceNumber) {

    faceNumber.textContent =
      "Cara " +
      (scannerState.currentFace + 1) +
      " de 6";

  }


  container.innerHTML = "";


  container.style.setProperty(
    "--cm-size",
    selectedCubeSize
  );


  const total =
    selectedCubeSize *
    selectedCubeSize;


  for (
    let i = 0;
    i < total;
    i++
  ) {

    const square =
      document.createElement(
        "button"
      );


    square.className =
      "cm-color-square";


    const color =
      scannerState.faces[
        face.id
      ][i];


    if (color) {

      square.style.background =
        CUBE_COLORS[color];

      square.classList.add(
        "filled"
      );

    }


    square.addEventListener(
      "click",
      function () {

        paintSquare(
          face.id,
          i,
          square
        );

      }
    );


    container.appendChild(
      square
    );

  }


  if (nextButton) {

    if (
      scannerState.currentFace ===
      faceNames.length - 1
    ) {

      nextButton.textContent =
        "🧠 Resolver cubo";

    } else {

      nextButton.textContent =
        "Completa la cara";

    }

  }

}


// ==========================================
// PINTAR CASILLA
// ==========================================

function paintSquare(
  faceId,
  index,
  square
) {

  const color =
    scannerState.selectedColor;


  scannerState.faces[
    faceId
  ][index] = color;


  square.style.background =
    CUBE_COLORS[color];


  square.classList.add(
    "filled"
  );

}


// ==========================================
// SIGUIENTE CARA
// ==========================================

function goToNextFace() {

  const face =
    faceNames[
      scannerState.currentFace
    ];


  const values =
    scannerState.faces[
      face.id
    ];


  const complete =
    values.every(
      function (value) {
        return value !== null;
      }
    );


  if (!complete) {

    alert(
      "Completa todas las casillas de esta cara antes de continuar."
    );

    return;

  }


  // ========================================
  // SI YA TERMINAMOS LAS 6 CARAS
  // ========================================

  if (
    scannerState.currentFace ===
    faceNames.length - 1
  ) {

    finishColorInput();

    return;

  }


  // ========================================
  // SIGUIENTE CARA
  // ========================================

  scannerState.currentFace++;


  renderCurrentFace();


  // Girar visualmente el cubo
  // para ayudar al usuario a seguir
  // la cara que debe introducir.

  rotateCubeToInputFace(
    scannerState.currentFace
  );

}


// ==========================================
// GIRAR CUBO HACIA LA CARA
// ==========================================

function rotateCubeToInputFace(
  faceIndex
) {

  if (!rubiksCube) {
    return;
  }


  const rotations = [

    {
      x: -0.35,
      y: 0.35
    },

    {
      x: -0.35,
      y: -1.2
    },

    {
      x: -0.25,
      y: 0
    },

    {
      x: 0.8,
      y: 0
    },

    {
      x: -0.25,
      y: 1.2
    },

    {
      x: 0.2,
      y: 3.14
    }

  ];


  const target =
    rotations[
      faceIndex
    ] || rotations[0];


  rubiksCube.rotation.x =
    target.x;


  rubiksCube.rotation.y =
    target.y;

}


// ==========================================
// TERMINAR ENTRADA
// ==========================================

function finishColorInput() {

  const scanner =
    document.getElementById(
      "cubeColorScanner"
    );


  if (scanner) {
    scanner.remove();
  }


  showSolutionPanel();

}


// ==========================================
// PANEL DE SOLUCIÓN
// ==========================================

function showSolutionPanel() {

  const panel =
    document.createElement(
      "div"
    );


  panel.id =
    "cubeSolutionPanel";


  panel.innerHTML = `

    <div class="cm-scanner-overlay">

      <div class="cm-scanner-card">

        <div class="cm-scanner-top">

          <span class="cm-scanner-icon">
            🧠
          </span>

          <div>

            <h2>
              Solución
            </h2>

            <p id="cmSolutionStatus">
              Analizando tu cubo...
            </p>

          </div>

        </div>


        <div
          id="cmSolutionMoves"
          style="
            background:#020617;
            border-radius:16px;
            padding:20px;
            text-align:center;
            margin-bottom:20px;
            color:#94a3b8;
          "
        >
          Preparando solución...
        </div>


        <div
          class="cm-scanner-actions"
        >

          <button
            id="cmStartSolution"
            class="primary-button">
            ▶ Seguir solución
          </button>

          <button
            id="cmCloseSolution"
            class="secondary-button">
            Cerrar
          </button>

        </div>

      </div>

    </div>

  `;


  document.body.appendChild(
    panel
  );


  setTimeout(
    function () {

      const status =
        document.getElementById(
          "cmSolutionStatus"
        );


      const moves =
        document.getElementById(
          "cmSolutionMoves"
        );


      if (status) {

        status.textContent =
          "Estado del cubo recibido correctamente.";

      }


      if (moves) {

        moves.innerHTML = `
          <strong style="
            display:block;
            color:white;
            font-size:18px;
            margin-bottom:8px;
          ">
            Cubo ${selectedCubeSize}×${selectedCubeSize}
          </strong>

          <span>
            Las 6 caras fueron registradas.
          </span>
        `;

      }

    },
    700
  );


  const closeButton =
    document.getElementById(
      "cmCloseSolution"
    );


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      function () {

        panel.remove();

      }
    );

  }


  const startButton =
    document.getElementById(
      "cmStartSolution"
    );


  if (startButton) {

    startButton.addEventListener(
      "click",
      function () {

        panel.remove();


        alert(
          "La entrada de colores funciona correctamente. El siguiente módulo será el algoritmo que calculará los movimientos reales para resolver el cubo."
        );

      }
    );

  }

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

    }
  );

}