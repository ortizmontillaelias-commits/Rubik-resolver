// ==========================================
// CUBEMASTER
// ==========================================

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
// THREE.JS
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

let turning = false;


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


  pages.forEach(
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


  createCubePieces(
    size
  );


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
// PIEZAS
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
// COLORES
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
// SISTEMA DE ENTRADA DE COLORES
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


const cubeColors = {

  white: "#ffffff",

  yellow: "#ffff00",

  red: "#ff0000",

  orange: "#ff8800",

  blue: "#0066ff",

  green: "#00aa00"

};


let currentFaceIndex = 0;

let currentSelectedColor =
  "white";


let enteredCubeColors = {

  U: [],
  R: [],
  F: [],
  D: [],
  L: [],
  B: []

};


// ==========================================
// ABRIR SOLUCIONADOR
// ==========================================

const solveButton =
  document.getElementById(
    "solveButton"
  );


if (solveButton) {

  solveButton.addEventListener(
    "click",
    function () {

      openColorInput();

    }
  );

}


// ==========================================
// ABRIR ENTRADA DE COLORES
// ==========================================

function openColorInput() {

  currentFaceIndex = 0;


  enteredCubeColors = {

    U: [],
    R: [],
    F: [],
    D: [],
    L: [],
    B: []

  };


  const panel =
    document.getElementById(
      "cubeInputPanel"
    );


  const solutionPanel =
    document.getElementById(
      "solutionPanel"
    );


  if (solutionPanel) {

    solutionPanel.classList.add(
      "hidden"
    );

  }


  if (panel) {

    panel.classList.remove(
      "hidden"
    );

  }


  updateColorFace();

}


// ==========================================
// CREAR CARA
// ==========================================

function updateColorFace() {

  const face =
    cubeFaces[
      currentFaceIndex
    ];


  const faceName =
    document.getElementById(
      "scannerFaceName"
    );


  const progress =
    document.getElementById(
      "scannerProgress"
    );


  const container =
    document.getElementById(
      "activeColorFace"
    );


  if (!face || !container) {
    return;
  }


  if (faceName) {

    faceName.textContent =
      face.name;

  }


  if (progress) {

    progress.textContent =
      "Cara " +
      (currentFaceIndex + 1) +
      " de 6";

  }


  const total =
    selectedCubeSize *
    selectedCubeSize;


  container.innerHTML = "";


  const title =
    document.createElement(
      "h3"
    );


  title.textContent =
    face.name +
    " · " +
    selectedCubeSize +
    "×" +
    selectedCubeSize;


  container.appendChild(
    title
  );


  const grid =
    document.createElement(
      "div"
    );


  grid.className =
    "dynamic-color-grid";


  grid.style.gridTemplateColumns =
    `repeat(${selectedCubeSize}, 1fr)`;


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
      "color-square";


    square.dataset.index =
      i;


    const savedColor =
      enteredCubeColors[
        face.id
      ][i];


    if (savedColor) {

      square.style.background =
        cubeColors[savedColor];

      square.dataset.color =
        savedColor;

    }


    square.addEventListener(
      "click",
      function () {

        paintColorSquare(
          square,
          face.id
        );

      }
    );


    grid.appendChild(
      square
    );

  }


  container.appendChild(
    grid
  );


  updateNextButton();

}


// ==========================================
// PINTAR CASILLA
// ==========================================

function paintColorSquare(
  square,
  faceId
) {

  const index =
    Number(
      square.dataset.index
    );


  square.style.background =
    cubeColors[
      currentSelectedColor
    ];


  square.dataset.color =
    currentSelectedColor;


  enteredCubeColors[
    faceId
  ][index] =
    currentSelectedColor;


  updateNextButton();

}


// ==========================================
// SELECCIONAR COLOR
// ==========================================

const colorButtons =
  document.querySelectorAll(
    ".color-option"
  );


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


        currentSelectedColor =
          button.dataset.color;

      }
    );

  }
);


// ==========================================
// COMPROBAR CARA
// ==========================================

function isCurrentFaceComplete() {

  const face =
    cubeFaces[
      currentFaceIndex
    ];


  const total =
    selectedCubeSize *
    selectedCubeSize;


  if (
    !enteredCubeColors[
      face.id
    ]
  ) {

    return false;

  }


  for (
    let i = 0;
    i < total;
    i++
  ) {

    if (
      !enteredCubeColors[
        face.id
      ][i]
    ) {

      return false;

    }

  }


  return true;

}


// ==========================================
// ACTUALIZAR BOTÓN
// ==========================================

function updateNextButton() {

  const button =
    document.getElementById(
      "nextColorFace"
    );


  if (!button) {
    return;
  }


  if (
    isCurrentFaceComplete()
  ) {

    if (
      currentFaceIndex ===
      cubeFaces.length - 1
    ) {

      button.textContent =
        "✓ Terminar cubo";

    } else {

      button.textContent =
        "Siguiente →";

    }

  } else {

    button.textContent =
      "Completa la cara";

  }

}


// ==========================================
// SIGUIENTE CARA
// ==========================================

const nextColorFace =
  document.getElementById(
    "nextColorFace"
  );


if (nextColorFace) {

  nextColorFace.addEventListener(
    "click",
    function () {

      if (
        !isCurrentFaceComplete()
      ) {

        alert(
          "Completa todos los colores de esta cara antes de continuar."
        );

        return;

      }


      if (
        currentFaceIndex <
        cubeFaces.length - 1
      ) {

        currentFaceIndex++;


        updateColorFace();


        return;

      }


      finishColorInput();

    }
  );

}


// ==========================================
// LIMPIAR CARA
// ==========================================

const clearCurrentFace =
  document.getElementById(
    "clearCurrentFace"
  );


if (clearCurrentFace) {

  clearCurrentFace.addEventListener(
    "click",
    function () {

      const face =
        cubeFaces[
          currentFaceIndex
        ];


      enteredCubeColors[
        face.id
      ] = [];


      updateColorFace();

    }
  );

}


// ==========================================
// TERMINAR ENTRADA
// ==========================================

function finishColorInput() {

  const total =
    selectedCubeSize *
    selectedCubeSize;


  const totalSquares =
    total * 6;


  let entered =
    0;


  Object.values(
    enteredCubeColors
  ).forEach(
    function (face) {

      face.forEach(
        function (color) {

          if (color) {
            entered++;
          }

        }
      );

    }
  );


  if (
    entered !== totalSquares
  ) {

    alert(
      "Faltan colores por introducir."
    );

    return;

  }


  // --------------------------------------
  // COMPROBAR CANTIDAD DE CADA COLOR
  // --------------------------------------

  const colorCount = {

    white: 0,
    yellow: 0,
    red: 0,
    orange: 0,
    blue: 0,
    green: 0

  };


  Object.values(
    enteredCubeColors
  ).forEach(
    function (face) {

      face.forEach(
        function (color) {

          if (
            colorCount[color] !==
            undefined
          ) {

            colorCount[color]++;

          }

        }
      );

    }
  );


  const expected =
    selectedCubeSize *
    selectedCubeSize;


  const invalidColorCount =
    Object.entries(
      colorCount
    ).some(
      function ([color, count]) {

        return count !== expected;

      }
    );


  if (invalidColorCount) {

    alert(
      "El cubo no es válido: cada color debe aparecer exactamente " +
      expected +
      " veces."
    );

    return;

  }


  console.log(
    "Cubo introducido:",
    enteredCubeColors
  );


  const panel =
    document.getElementById(
      "cubeInputPanel"
    );


  if (panel) {

    panel.classList.add(
      "hidden"
    );

  }


  showSolutionPreparation();

}


// ==========================================
// PREPARAR SOLUCIÓN
// ==========================================

function showSolutionPreparation() {

  const solutionPanel =
    document.getElementById(
      "solutionPanel"
    );


  const status =
    document.getElementById(
      "solutionStatus"
    );


  const moves =
    document.getElementById(
      "solutionMoves"
    );


  if (!solutionPanel) {
    return;
  }


  solutionPanel.classList.remove(
    "hidden"
  );


  if (status) {

    status.textContent =
      "Estado del cubo recibido correctamente.";

  }


  if (moves) {

    moves.innerHTML = `

      <div class="solver-message">

        <strong>
          Cubo ${selectedCubeSize}×${selectedCubeSize}
        </strong>

        <p>
          Los 6 lados fueron introducidos correctamente.
          El siguiente paso es conectar el solucionador
          para generar los movimientos exactos.
        </p>

      </div>

    `;

  }

}


// ==========================================
// CERRAR SOLUCIÓN
// ==========================================

const closeSolution =
  document.getElementById(
    "closeSolution"
  );


if (closeSolution) {

  closeSolution.addEventListener(
    "click",
    function () {

      const panel =
        document.getElementById(
          "solutionPanel"
        );


      if (panel) {

        panel.classList.add(
          "hidden"
        );

      }

    }
  );

}


// ==========================================
// BOTÓN SEGUIR SOLUCIÓN
// ==========================================

const startSolution =
  document.getElementById(
    "startSolution"
  );


if (startSolution) {

  startSolution.addEventListener(
    "click",
    function () {

      alert(
        "El motor de movimientos todavía no está conectado. La entrada de colores ya está preparada para 2×2 hasta 7×7."
      );

    }
  );

}


// ==========================================
// CANCELAR ENTRADA
// ==========================================

const cancelColorInput =
  document.getElementById(
    "cancelColorInput"
  );


if (cancelColorInput) {

  cancelColorInput.addEventListener(
    "click",
    function () {

      const panel =
        document.getElementById(
          "cubeInputPanel"
        );


      if (panel) {

        panel.classList.add(
          "hidden"
        );

      }

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

      pages.forEach(
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


      const inputPanel =
        document.getElementById(
          "cubeInputPanel"
        );


      const solutionPanel =
        document.getElementById(
          "solutionPanel"
        );


      if (inputPanel) {

        inputPanel.classList.add(
          "hidden"
        );

      }


      if (solutionPanel) {

        solutionPanel.classList.add(
          "hidden"
        );

      }

    }
  );

}