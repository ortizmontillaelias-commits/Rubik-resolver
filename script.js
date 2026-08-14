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
  loginButton.addEventListener("click", login);
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


  if (!email) {

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
    ?.classList.add("hidden");


  document
    .getElementById("appScreen")
    ?.classList.add("active");


  const profileEmail =
    document.getElementById("profileEmail");

  const profileName =
    document.getElementById("profileName");

  const profileAvatar =
    document.getElementById("profileAvatar");


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
  document.querySelectorAll(".nav-button");

const pages =
  document.querySelectorAll(".page");


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


        const target =
          document.getElementById(pageId);


        if (target) {

          target.classList.add(
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
  document.getElementById("timerDisplay");

const timerStatus =
  document.getElementById("timerStatus");

const startTimerButton =
  document.getElementById("startTimer");

const stopTimerButton =
  document.getElementById("stopTimer");

const resetTimerButton =
  document.getElementById("resetTimer");


function formatTime(ms) {

  const minutes =
    Math.floor(ms / 60000);

  const seconds =
    Math.floor(
      (ms % 60000) / 1000
    );

  const centiseconds =
    Math.floor(
      (ms % 1000) / 10
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


      timerRunning = false;
      timerInterval = null;


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
          "Presiona iniciar para comenzar";

      }

    }
  );

}


// ==========================================
// VARIABLES DEL CUBO 3D
// ==========================================

let cubeScene = null;
let cubeCamera = null;
let cubeRenderer = null;
let cubeControls = null;
let rubiksCube = null;

let cubePieces = [];

let selectedCubeSize = 3;


// ==========================================
// BOTONES PRACTICAR
// ==========================================

document
  .querySelectorAll(".practice-button")
  .forEach(
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


  const page =
    document.getElementById(
      "cubePracticePage"
    );


  const title =
    document.getElementById(
      "selectedCubeTitle"
    );


  if (title) {

    title.textContent =
      `Cubo ${size}×${size}`;

  }


  document
    .querySelectorAll(".page")
    .forEach(
      page =>
        page.classList.remove(
          "active-page"
        )
    );


  page?.classList.add(
    "active-page"
  );


  const nav =
    document.querySelector(
      ".bottom-nav"
    );


  if (nav) {
    nav.style.display = "none";
  }


  createRubiksCube(size);

}


// ==========================================
// CREAR CUBO 3D PRINCIPAL
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
      200
    );


  /*
   * IMPORTANTE:
   * Antes la cámara estaba demasiado cerca
   * en cubos grandes como 6x6 y 7x7.
   */

  const distance =
    Math.max(
      7,
      size * 3.3
    );


  cubeCamera.position.set(
    distance,
    distance,
    distance
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


  cubeRenderer.outputColorSpace =
    THREE.SRGBColorSpace;


  cubeRenderer.domElement.style.width =
    "100%";

  cubeRenderer.domElement.style.height =
    "100%";

  cubeRenderer.domElement.style.display =
    "block";


  container.appendChild(
    cubeRenderer.domElement
  );


  const ambient =
    new THREE.AmbientLight(
      0xffffff,
      2.2
    );


  cubeScene.add(
    ambient
  );


  const directional =
    new THREE.DirectionalLight(
      0xffffff,
      3
    );


  directional.position.set(
    5,
    8,
    6
  );


  cubeScene.add(
    directional
  );


  const directional2 =
    new THREE.DirectionalLight(
      0xffffff,
      1.5
    );


  directional2.position.set(
    -5,
    3,
    -5
  );


  cubeScene.add(
    directional2
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
    size * 7;


  resizeRubiksCube();


  requestAnimationFrame(
    function () {
      resizeRubiksCube();
    }
  );

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

  const black =
    0x101010;

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
          : black,

      roughness: .45
    }),

    new THREE.MeshStandardMaterial({
      color:
        x === 0
          ? orange
          : black,

      roughness: .45
    }),

    new THREE.MeshStandardMaterial({
      color:
        y === size - 1
          ? white
          : black,

      roughness: .45
    }),

    new THREE.MeshStandardMaterial({
      color:
        y === 0
          ? yellow
          : black,

      roughness: .45
    }),

    new THREE.MeshStandardMaterial({
      color:
        z === size - 1
          ? green
          : black,

      roughness: .45
    }),

    new THREE.MeshStandardMaterial({
      color:
        z === 0
          ? blue
          : black,

      roughness: .45
    })

  ];

}


// ==========================================
// RESIZE CUBO PRINCIPAL
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
// ANIMACIÓN CUBO PRINCIPAL
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

      openCubeSolver();

    }
  );

}


// ==========================================
// ESTADO SOLUCIONADOR
// ==========================================

const solverFaces = [
  "U",
  "R",
  "F",
  "D",
  "L",
  "B"
];

let currentFaceIndex = 0;

let currentSelectedColor = "white";

let cubeInputData = {};


// ==========================================
// COLORES SOLUCIONADOR
// ==========================================

const solverColors = {

  white: "#ffffff",

  yellow: "#ffff00",

  red: "#ff0000",

  orange: "#ff8800",

  blue: "#0066ff",

  green: "#00aa00"

};


// ==========================================
// ABRIR SOLUCIONADOR
// ==========================================

function openCubeSolver() {

  closeCubeSolver();


  cubeInputData = {};


  solverFaces.forEach(
    face => {

      cubeInputData[face] =
        Array(
          selectedCubeSize *
          selectedCubeSize
        ).fill(null);

    }
  );


  currentFaceIndex = 0;

  currentSelectedColor = "white";


  const solver =
    document.createElement(
      "div"
    );


  solver.id =
    "cubeSolver";


  solver.innerHTML = `

    <div class="solver-wrapper">

      <div class="solver-title">

        <h1>
          🧠 Resolver
        </h1>

        <p>
          Coloca tu cubo frente a ti y selecciona los colores.
        </p>

      </div>


      <div class="reference-cube-box">

        <div id="referenceCube"></div>

      </div>


      <div
        id="faceInstruction"
        class="face-instruction">
      </div>


      <div
        id="faceProgress"
        class="face-progress">
      </div>


      <div class="solver-colors">

        <button
          class="solver-color selected"
          data-color="white"
          style="background:#ffffff">
        </button>

        <button
          class="solver-color"
          data-color="yellow"
          style="background:#ffff00">
        </button>

        <button
          class="solver-color"
          data-color="red"
          style="background:#ff0000">
        </button>

        <button
          class="solver-color"
          data-color="orange"
          style="background:#ff8800">
        </button>

        <button
          class="solver-color"
          data-color="blue"
          style="background:#0066ff">
        </button>

        <button
          class="solver-color"
          data-color="green"
          style="background:#00aa00">
        </button>

      </div>


      <div
        id="inputFaceContainer"
        class="input-face-container">
      </div>


      <div class="solver-actions">

        <button
          id="clearFaceButton"
          class="secondary-button">
          Limpiar cara
        </button>

        <button
          id="nextFaceButton"
          class="primary-button">
          Siguiente →
        </button>

        <button
          id="cancelSolverButton"
          class="secondary-button">
          Cancelar
        </button>

      </div>


      <div
        id="solutionPanel"
        class="solution-panel hidden">

        <h2>
          🧠 Solución
        </h2>

        <div
          id="solutionMove"
          class="solution-move">
        </div>

        <p
          id="solutionStatus"
          class="solution-status">
        </p>

        <button
          id="nextSolutionButton"
          class="primary-button">
          ▶ Siguiente movimiento
        </button>

        <button
          id="closeSolutionButton"
          class="secondary-button">
          Cerrar
        </button>

      </div>

    </div>

  `;


  document.body.appendChild(
    solver
  );


  createReferenceCube();


  setupSolverButtons();


  renderCurrentFace();

}


// ==========================================
// VARIABLES CUBO REFERENCIA
// ==========================================

let referenceScene = null;
let referenceCamera = null;
let referenceRenderer = null;
let referenceCube = null;


// ==========================================
// CREAR CUBO REFERENCIA
// ==========================================

function createReferenceCube() {

  const container =
    document.getElementById(
      "referenceCube"
    );


  if (!container) {
    return;
  }


  referenceScene =
    new THREE.Scene();


  referenceScene.background =
    new THREE.Color(
      0x0f172a
    );


  referenceCamera =
    new THREE.PerspectiveCamera(
      38,
      1,
      0.1,
      200
    );


  /*
   * La cámara ahora se aleja
   * automáticamente para 2x2, 3x3...
   * hasta 7x7.
   */

  const distance =
    Math.max(
      6,
      selectedCubeSize * 2.9
    );


  referenceCamera.position.set(
    distance,
    distance,
    distance
  );


  referenceCamera.lookAt(
    0,
    0,
    0
  );


  referenceRenderer =
    new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });


  referenceRenderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  );


  referenceRenderer.outputColorSpace =
    THREE.SRGBColorSpace;


  referenceRenderer.domElement.style.width =
    "100%";

  referenceRenderer.domElement.style.height =
    "100%";

  referenceRenderer.domElement.style.display =
    "block";


  container.appendChild(
    referenceRenderer.domElement
  );


  const ambient =
    new THREE.AmbientLight(
      0xffffff,
      2.3
    );


  referenceScene.add(
    ambient
  );


  const light =
    new THREE.DirectionalLight(
      0xffffff,
      3
    );


  light.position.set(
    5,
    8,
    5
  );


  referenceScene.add(
    light
  );


  const light2 =
    new THREE.DirectionalLight(
      0xffffff,
      1.5
    );


  light2.position.set(
    -5,
    4,
    -5
  );


  referenceScene.add(
    light2
  );


  referenceCube =
    new THREE.Group();


  referenceScene.add(
    referenceCube
  );


  createReferencePieces();


  resizeReferenceCube();


  requestAnimationFrame(
    function () {
      resizeReferenceCube();
    }
  );

}


// ==========================================
// PIEZAS REFERENCIA
// ==========================================

function createReferencePieces() {

  const size =
    selectedCubeSize;


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
            0.9,
            0.9,
            0.9
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


        referenceCube.add(
          piece
        );

      }

    }

  }

}


// ==========================================
// ORIENTACIÓN DE REFERENCIA
// ==========================================

function updateReferenceOrientation() {

  if (!referenceCube) {
    return;
  }


  const face =
    solverFaces[currentFaceIndex];


  referenceCube.rotation.set(
    0,
    0,
    0
  );


  /*
   * Cada orientación coloca la cara
   * correspondiente hacia el usuario.
   */

  if (face === "U") {

    referenceCube.rotation.x =
      -0.55;

    referenceCube.rotation.y =
      0.45;

  }


  if (face === "R") {

    referenceCube.rotation.x =
      0.20;

    referenceCube.rotation.y =
      -0.85;

  }


  if (face === "F") {

    referenceCube.rotation.x =
      0.10;

    referenceCube.rotation.y =
      0.05;

  }


  if (face === "D") {

    referenceCube.rotation.x =
      0.75;

    referenceCube.rotation.y =
      0.40;

  }


  if (face === "L") {

    referenceCube.rotation.x =
      0.20;

    referenceCube.rotation.y =
      0.85;

  }


  if (face === "B") {

    referenceCube.rotation.x =
      0.10;

    referenceCube.rotation.y =
      Math.PI;

  }

}


// ==========================================
// RESIZE REFERENCIA
// ==========================================

function resizeReferenceCube() {

  const container =
    document.getElementById(
      "referenceCube"
    );


  if (
    !container ||
    !referenceRenderer ||
    !referenceCamera
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


  referenceCamera.aspect =
    width / height;


  referenceCamera.updateProjectionMatrix();


  referenceRenderer.setSize(
    width,
    height,
    false
  );

}


window.addEventListener(
  "resize",
  resizeReferenceCube
);


// ==========================================
// ANIMACIÓN REFERENCIA
// ==========================================

function animateReferenceCube() {

  requestAnimationFrame(
    animateReferenceCube
  );


  if (
    referenceRenderer &&
    referenceScene &&
    referenceCamera
  ) {

    referenceRenderer.render(
      referenceScene,
      referenceCamera
    );

  }

}


animateReferenceCube();


// ==========================================
// RENDERIZAR CARA
// ==========================================

function renderCurrentFace() {

  const face =
    solverFaces[currentFaceIndex];


  const size =
    selectedCubeSize;


  const instruction =
    document.getElementById(
      "faceInstruction"
    );


  const progress =
    document.getElementById(
      "faceProgress"
    );


  const container =
    document.getElementById(
      "inputFaceContainer"
    );


  if (!container) {
    return;
  }


  if (instruction) {

    instruction.textContent =
      "Mira el cubo 3D y coloca los colores de la cara que se muestra.";

  }


  if (progress) {

    progress.textContent =
      `Cara ${currentFaceIndex + 1} de 6`;

  }


  container.innerHTML = "";


  const grid =
    document.createElement(
      "div"
    );


  grid.className =
    "input-face-grid";


  grid.style.setProperty(
    "--cube-size",
    size
  );


  const total =
    size * size;


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
      "input-square";


    const savedColor =
      cubeInputData[face][i];


    if (savedColor) {

      square.style.background =
        solverColors[savedColor];

    }


    square.addEventListener(
      "click",
      function () {

        cubeInputData[face][i] =
          currentSelectedColor;


        square.style.background =
          solverColors[
            currentSelectedColor
          ];

      }
    );


    grid.appendChild(
      square
    );

  }


  container.appendChild(
    grid
  );


  updateReferenceOrientation();

}


// ==========================================
// BOTONES SOLUCIONADOR
// ==========================================

function setupSolverButtons() {

  document
    .querySelectorAll(
      ".solver-color"
    )
    .forEach(
      function (button) {

        button.addEventListener(
          "click",
          function () {

            document
              .querySelectorAll(
                ".solver-color"
              )
              .forEach(
                b =>
                  b.classList.remove(
                    "selected"
                  )
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


  const clearButton =
    document.getElementById(
      "clearFaceButton"
    );


  if (clearButton) {

    clearButton.addEventListener(
      "click",
      function () {

        const face =
          solverFaces[
            currentFaceIndex
          ];


        cubeInputData[face] =
          Array(
            selectedCubeSize *
            selectedCubeSize
          ).fill(null);


        renderCurrentFace();

      }
    );

  }


  const nextButton =
    document.getElementById(
      "nextFaceButton"
    );


  if (nextButton) {

    nextButton.addEventListener(
      "click",
      nextFace
    );

  }


  const cancelButton =
    document.getElementById(
      "cancelSolverButton"
    );


  if (cancelButton) {

    cancelButton.addEventListener(
      "click",
      closeCubeSolver
    );

  }


  const nextSolution =
    document.getElementById(
      "nextSolutionButton"
    );


  if (nextSolution) {

    nextSolution.addEventListener(
      "click",
      playNextSolutionMove
    );

  }


  const closeSolution =
    document.getElementById(
      "closeSolutionButton"
    );


  if (closeSolution) {

    closeSolution.addEventListener(
      "click",
      closeCubeSolver
    );

  }

}


// ==========================================
// SIGUIENTE CARA
// ==========================================

function nextFace() {

  const face =
    solverFaces[currentFaceIndex];


  const values =
    cubeInputData[face];


  if (
    values.some(
      color => !color
    )
  ) {

    alert(
      "Completa todos los colores de esta cara antes de continuar."
    );

    return;

  }


  if (
    currentFaceIndex <
    solverFaces.length - 1
  ) {

    currentFaceIndex++;

    renderCurrentFace();

    return;

  }


  finishColorInput();

}


// ==========================================
// FINALIZAR COLORES
// ==========================================

function finishColorInput() {

  const counts = {

    white: 0,
    yellow: 0,
    red: 0,
    orange: 0,
    blue: 0,
    green: 0

  };


  for (const face of solverFaces) {

    for (
      const color of cubeInputData[face]
    ) {

      if (
        counts[color] !== undefined
      ) {

        counts[color]++;

      }

    }

  }


  const expected =
    selectedCubeSize *
    selectedCubeSize;


  const valid =
    Object.values(counts)
      .every(
        count =>
          count === expected
      );


  if (!valid) {

    alert(
      `El cubo debe tener ${expected} piezas de cada color. Revisa los colores introducidos.`
    );

    return;

  }


  showSolution();

}


// ==========================================
// SOLUCIÓN
// ==========================================

let solutionMoves = [];

let solutionIndex = 0;

let solving = false;


function showSolution() {

  const faceInstruction =
    document.getElementById(
      "faceInstruction"
    );


  const progress =
    document.getElementById(
      "faceProgress"
    );


  const input =
    document.getElementById(
      "inputFaceContainer"
    );


  const colors =
    document.querySelector(
      ".solver-colors"
    );


  const actions =
    document.querySelector(
      ".solver-actions"
    );


  const solutionPanel =
    document.getElementById(
      "solutionPanel"
    );


  if (faceInstruction) {

    faceInstruction.textContent =
      "Cubo configurado correctamente";

  }


  if (progress) {

    progress.textContent =
      "Preparando solución...";

  }


  if (input) {
    input.classList.add("hidden");
  }


  if (colors) {
    colors.classList.add("hidden");
  }


  if (actions) {
    actions.classList.add("hidden");
  }


  if (solutionPanel) {
    solutionPanel.classList.remove("hidden");
  }


  solutionMoves =
    generateSolutionMoves(
      selectedCubeSize
    );


  solutionIndex = 0;

  solving = false;


  showCurrentSolutionMove();

}


// ==========================================
// MOVIMIENTOS TEMPORALES
// ==========================================

function generateSolutionMoves(size) {

  const base = [

    "R",
    "U",
    "R'",
    "U'",
    "F",
    "R",
    "F'",
    "U"

  ];


  const amount =
    Math.max(
      8,
      size * 2
    );


  const moves = [];


  for (
    let i = 0;
    i < amount;
    i++
  ) {

    moves.push(
      base[
        i % base.length
      ]
    );

  }


  return moves;

}


// ==========================================
// MOSTRAR MOVIMIENTO
// ==========================================

function showCurrentSolutionMove() {

  const moveElement =
    document.getElementById(
      "solutionMove"
    );


  const status =
    document.getElementById(
      "solutionStatus"
    );


  const button =
    document.getElementById(
      "nextSolutionButton"
    );


  if (
    solutionIndex >=
    solutionMoves.length
  ) {

    if (moveElement) {

      moveElement.textContent =
        "✓";

    }


    if (status) {

      status.textContent =
        "Cubo resuelto.";

    }


    if (button) {

      button.textContent =
        "✓ Terminado";

      button.disabled =
        true;

    }


    return;

  }


  if (button) {

    button.disabled =
      false;

    button.textContent =
      "▶ Siguiente movimiento";

  }


  if (moveElement) {

    moveElement.textContent =
      solutionMoves[
        solutionIndex
      ];

  }


  if (status) {

    status.textContent =
      `Movimiento ${solutionIndex + 1} de ${solutionMoves.length}. Pulsa el botón para continuar.`;

  }

}


// ==========================================
// SIGUIENTE MOVIMIENTO
// ==========================================

async function playNextSolutionMove() {

  if (solving) {
    return;
  }


  if (
    solutionIndex >=
    solutionMoves.length
  ) {
    return;
  }


  solving = true;


  const move =
    solutionMoves[
      solutionIndex
    ];


  const moveElement =
    document.getElementById(
      "solutionMove"
    );


  if (moveElement) {

    moveElement.textContent =
      move;

  }


  await animateSolutionMove(move);


  solutionIndex++;


  solving = false;


  showCurrentSolutionMove();

}


// ==========================================
// ANIMAR MOVIMIENTO
// ==========================================

function animateSolutionMove(move) {

  return new Promise(
    function (resolve) {

      const status =
        document.getElementById(
          "solutionStatus"
        );


      if (status) {

        status.textContent =
          `Realiza lentamente el movimiento ${move} en tu cubo físico...`;

      }


      setTimeout(
        function () {

          resolve();

        },
        1500
      );

    }
  );

}


// ==========================================
// CERRAR SOLUCIONADOR
// ==========================================

function closeCubeSolver() {

  const solver =
    document.getElementById(
      "cubeSolver"
    );


  if (solver) {

    solver.remove();

  }


  referenceScene = null;
  referenceCamera = null;
  referenceRenderer = null;
  referenceCube = null;

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
          page =>
            page.classList.remove(
              "active-page"
            )
        );


      document
        .getElementById(
          "homePage"
        )
        ?.classList.add(
          "active-page"
        );


      const nav =
        document.querySelector(
          ".bottom-nav"
        );


      if (nav) {

        nav.style.display =
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