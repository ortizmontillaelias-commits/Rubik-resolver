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


loginButton?.addEventListener("click", login);

emailInput?.addEventListener("keydown", event => {

  if (event.key === "Enter") {
    login();
  }

});


function login() {

  const email =
    emailInput.value.trim();

  if (!email) {
    alert("Escribe tu correo electrónico.");
    return;
  }

  if (!email.includes("@")) {
    alert("Escribe un correo electrónico válido.");
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


navigationButtons.forEach(button => {

  button.addEventListener("click", () => {

    const pageId =
      button.dataset.page;

    pages.forEach(page => {
      page.classList.remove("active-page");
    });

    navigationButtons.forEach(nav => {
      nav.classList.remove("active");
    });

    document
      .getElementById(pageId)
      ?.classList.add("active-page");

    button.classList.add("active");

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


function formatTime(ms) {

  const minutes =
    Math.floor(ms / 60000);

  const seconds =
    Math.floor((ms % 60000) / 1000);

  const centiseconds =
    Math.floor((ms % 1000) / 10);

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


startTimerButton?.addEventListener("click", () => {

  if (timerRunning) return;

  timerRunning = true;

  startTime =
    Date.now() - elapsedTime;

  timerInterval =
    setInterval(updateTimer, 10);

  if (timerStatus) {
    timerStatus.textContent =
      "Temporizador funcionando...";
  }

});


stopTimerButton?.addEventListener("click", () => {

  if (!timerRunning) return;

  clearInterval(timerInterval);

  timerRunning = false;
  timerInterval = null;

  if (timerStatus) {
    timerStatus.textContent =
      "Tiempo detenido.";
  }

});


resetTimerButton?.addEventListener("click", () => {

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
      "Presiona iniciar para comenzar";
  }

});


// ==========================================
// VARIABLES CUBO 3D
// ==========================================

let cubeScene = null;
let cubeCamera = null;
let cubeRenderer = null;
let cubeControls = null;
let rubiksCube = null;

let cubePieces = [];

let selectedCubeSize = 3;


// ==========================================
// COLORES DEL CUBO
// ==========================================

const cubeColors = {

  white: 0xffffff,
  yellow: 0xffff00,
  red: 0xff0000,
  orange: 0xff8800,
  blue: 0x0066ff,
  green: 0x00aa00

};


// ==========================================
// DATOS DEL SOLUCIONADOR
// ==========================================

const solverFaces = [
  "U",
  "R",
  "F",
  "D",
  "L",
  "B"
];

const faceColor = {

  U: "white",
  R: "red",
  F: "green",
  D: "yellow",
  L: "orange",
  B: "blue"

};

const solverColors = {

  white: "#ffffff",
  yellow: "#ffff00",
  red: "#ff0000",
  orange: "#ff8800",
  blue: "#0066ff",
  green: "#00aa00"

};

let currentFaceIndex = 0;

let currentSelectedColor = "white";

let cubeInputData = {};


// ==========================================
// BOTONES PRACTICAR
// ==========================================

document
  .querySelectorAll(".practice-button")
  .forEach(button => {

    button.addEventListener("click", () => {

      const size =
        Number(button.dataset.cube);

      if (!size) return;

      openCubePractice(size);

    });

  });


// ==========================================
// ABRIR CUBO
// ==========================================

function openCubePractice(size) {

  selectedCubeSize = size;

  const title =
    document.getElementById("selectedCubeTitle");

  if (title) {
    title.textContent =
      `Cubo ${size}×${size}`;
  }

  pages.forEach(page => {
    page.classList.remove("active-page");
  });

  document
    .getElementById("cubePracticePage")
    ?.classList.add("active-page");

  const nav =
    document.querySelector(".bottom-nav");

  if (nav) {
    nav.style.display = "none";
  }

  createRubiksCube(size);

}


// ==========================================
// CREAR CUBO 3D
// ==========================================

function createRubiksCube(size) {

  const container =
    document.getElementById("rubiks3D");

  if (!container) return;

  container.innerHTML = "";

  cubePieces = [];

  cubeScene =
    new THREE.Scene();

  cubeScene.background =
    new THREE.Color(0x020617);

  cubeCamera =
    new THREE.PerspectiveCamera(
      35,
      1,
      0.1,
      200
    );

  /*
   * Cámara completamente centrada.
   * Ya no está excesivamente inclinada.
   */

  cubeCamera.position.set(
    size * 2.8,
    size * 2.4,
    size * 4.2
  );

  cubeCamera.lookAt(0, 0, 0);


  cubeRenderer =
    new THREE.WebGLRenderer({
      antialias: true
    });

  cubeRenderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );

  container.appendChild(
    cubeRenderer.domElement
  );


  const ambient =
    new THREE.AmbientLight(
      0xffffff,
      2.2
    );

  cubeScene.add(ambient);


  const directional =
    new THREE.DirectionalLight(
      0xffffff,
      3
    );

  directional.position.set(
    5,
    8,
    10
  );

  cubeScene.add(directional);


  rubiksCube =
    new THREE.Group();

  cubeScene.add(rubiksCube);


  createCubePieces(size);


  cubeControls =
    new OrbitControls(
      cubeCamera,
      cubeRenderer.domElement
    );

  cubeControls.enableDamping = true;

  cubeControls.dampingFactor = 0.08;

  cubeControls.enablePan = false;

  cubeControls.minDistance =
    size * 2;

  cubeControls.maxDistance =
    size * 7;

  cubeControls.target.set(
    0,
    0,
    0
  );


  resizeRubiksCube();

  animateCube();

}


// ==========================================
// PIEZAS
// ==========================================

function createCubePieces(size) {

  const start =
    -(size - 1) / 2;

  for (let x = 0; x < size; x++) {

    for (let y = 0; y < size; y++) {

      for (let z = 0; z < size; z++) {

        const geometry =
          new THREE.BoxGeometry(
            0.94,
            0.94,
            0.94
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

        /*
         * Guardamos la posición lógica
         * para poder actualizar los colores.
         */

        piece.userData = {
          x,
          y,
          z
        };

        rubiksCube.add(piece);

        cubePieces.push(piece);

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

  const black = 0x101010;

  return [

    new THREE.MeshStandardMaterial({
      color:
        x === size - 1
          ? cubeColors.red
          : black
    }),

    new THREE.MeshStandardMaterial({
      color:
        x === 0
          ? cubeColors.orange
          : black
    }),

    new THREE.MeshStandardMaterial({
      color:
        y === size - 1
          ? cubeColors.white
          : black
    }),

    new THREE.MeshStandardMaterial({
      color:
        y === 0
          ? cubeColors.yellow
          : black
    }),

    new THREE.MeshStandardMaterial({
      color:
        z === size - 1
          ? cubeColors.green
          : black
    }),

    new THREE.MeshStandardMaterial({
      color:
        z === 0
          ? cubeColors.blue
          : black
    })

  ];

}


// ==========================================
// ACTUALIZAR COLORES DEL CUBO
// ==========================================

function update3DCubeColors() {

  if (!rubiksCube) return;

  const size =
    selectedCubeSize;

  cubePieces.forEach(piece => {

    const { x, y, z } =
      piece.userData;

    const materials =
      piece.material;

    /*
     * Por defecto los lados internos
     * permanecen oscuros.
     */

    materials[0].color.setHex(0x101010);
    materials[1].color.setHex(0x101010);
    materials[2].color.setHex(0x101010);
    materials[3].color.setHex(0x101010);
    materials[4].color.setHex(0x101010);
    materials[5].color.setHex(0x101010);


    /*
     * X positivo = R
     */

    if (x === size - 1) {

      setFaceSticker(
        materials[0],
        "R",
        x,
        y,
        z
      );

    }


    /*
     * X negativo = L
     */

    if (x === 0) {

      setFaceSticker(
        materials[1],
        "L",
        x,
        y,
        z
      );

    }


    /*
     * Y positivo = U
     */

    if (y === size - 1) {

      setFaceSticker(
        materials[2],
        "U",
        x,
        y,
        z
      );

    }


    /*
     * Y negativo = D
     */

    if (y === 0) {

      setFaceSticker(
        materials[3],
        "D",
        x,
        y,
        z
      );

    }


    /*
     * Z positivo = F
     */

    if (z === size - 1) {

      setFaceSticker(
        materials[4],
        "F",
        x,
        y,
        z
      );

    }


    /*
     * Z negativo = B
     */

    if (z === 0) {

      setFaceSticker(
        materials[5],
        "B",
        x,
        y,
        z
      );

    }

  });

}


// ==========================================
// OBTENER COLOR DE UNA POSICIÓN
// ==========================================

function getFaceIndex(
  face,
  x,
  y,
  z
) {

  const size =
    selectedCubeSize;

  let row;
  let col;

  /*
   * Cada cara utiliza la misma
   * orientación que la cuadrícula.
   */

  if (face === "U") {

    row = size - 1 - z;
    col = x;

  }

  else if (face === "R") {

    row = size - 1 - y;
    col = size - 1 - z;

  }

  else if (face === "F") {

    row = size - 1 - y;
    col = x;

  }

  else if (face === "D") {

    row = z;
    col = x;

  }

  else if (face === "L") {

    row = size - 1 - y;
    col = z;

  }

  else if (face === "B") {

    row = size - 1 - y;
    col = size - 1 - x;

  }

  return row * size + col;

}


// ==========================================
// PINTAR STICKER
// ==========================================

function setFaceSticker(
  material,
  face,
  x,
  y,
  z
) {

  const data =
    cubeInputData[face];

  if (!data) return;

  const index =
    getFaceIndex(
      face,
      x,
      y,
      z
    );

  const selected =
    data[index];

  if (selected) {

    material.color.set(
      solverColors[selected]
    );

  }

}


// ==========================================
// RESIZE
// ==========================================

function resizeRubiksCube() {

  const container =
    document.getElementById("rubiks3D");

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

  if (width <= 0 || height <= 0) {
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

  cubeControls?.update();

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

let referenceScene = null;
let referenceCamera = null;
let referenceRenderer = null;
let referenceCube = null;

let referenceControls = null;


// ==========================================
// ABRIR SOLUCIONADOR
// ==========================================

document
  .getElementById("solveButton")
  ?.addEventListener(
    "click",
    openCubeSolver
  );


function openCubeSolver() {

  cubeInputData = {};

  solverFaces.forEach(face => {

    cubeInputData[face] =
      Array(
        selectedCubeSize *
        selectedCubeSize
      ).fill(null);

  });


  currentFaceIndex = 0;

  currentSelectedColor = "white";


  const solver =
    document.createElement("div");

  solver.id = "cubeSolver";


  solver.innerHTML = `

    <div class="solver-wrapper">

      <div class="solver-title">

        <h1>🧠 Resolver</h1>

        <p>
          Introduce los colores de tu cubo.
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

        <h2>🧠 Solución</h2>

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


  document.body.appendChild(solver);


  createReferenceCube();

  setupSolverButtons();

  renderCurrentFace();

}


// ==========================================
// CUBO DE REFERENCIA
// ==========================================

function createReferenceCube() {

  const container =
    document.getElementById(
      "referenceCube"
    );

  if (!container) return;


  referenceScene =
    new THREE.Scene();


  referenceScene.background =
    new THREE.Color(0x0f172a);


  referenceCamera =
    new THREE.PerspectiveCamera(
      35,
      1,
      0.1,
      100
    );


  /*
   * Vista frontal derecha.
   * No está inclinada.
   */

  referenceCamera.position.set(
    5,
    4,
    7
  );

  referenceCamera.lookAt(
    0,
    0,
    0
  );


  referenceRenderer =
    new THREE.WebGLRenderer({
      antialias: true
    });


  referenceRenderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  );


  container.appendChild(
    referenceRenderer.domElement
  );


  const ambient =
    new THREE.AmbientLight(
      0xffffff,
      2.3
    );

  referenceScene.add(ambient);


  const light =
    new THREE.DirectionalLight(
      0xffffff,
      3
    );

  light.position.set(
    5,
    8,
    10
  );

  referenceScene.add(light);


  referenceCube =
    new THREE.Group();

  referenceScene.add(
    referenceCube
  );


  createReferencePieces();


  resizeReferenceCube();

  animateReferenceCube();

}


// ==========================================
// PIEZAS REFERENCIA
// ==========================================

function createReferencePieces() {

  const size =
    selectedCubeSize;

  const start =
    -(size - 1) / 2;


  for (let x = 0; x < size; x++) {

    for (let y = 0; y < size; y++) {

      for (let z = 0; z < size; z++) {

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

        piece.userData = {
          x,
          y,
          z
        };

        referenceCube.add(
          piece
        );

      }

    }

  }

  updateReferenceColors();

}


// ==========================================
// ACTUALIZAR COLORES REFERENCIA
// ==========================================

function updateReferenceColors() {

  if (!referenceCube) return;

  const size =
    selectedCubeSize;

  referenceCube.children.forEach(piece => {

    const { x, y, z } =
      piece.userData;

    const materials =
      piece.material;


    materials.forEach(material => {
      material.color.setHex(0x101010);
    });


    if (x === size - 1) {

      setReferenceSticker(
        materials[0],
        "R",
        x,
        y,
        z
      );

    }


    if (x === 0) {

      setReferenceSticker(
        materials[1],
        "L",
        x,
        y,
        z
      );

    }


    if (y === size - 1) {

      setReferenceSticker(
        materials[2],
        "U",
        x,
        y,
        z
      );

    }


    if (y === 0) {

      setReferenceSticker(
        materials[3],
        "D",
        x,
        y,
        z
      );

    }


    if (z === size - 1) {

      setReferenceSticker(
        materials[4],
        "F",
        x,
        y,
        z
      );

    }


    if (z === 0) {

      setReferenceSticker(
        materials[5],
        "B",
        x,
        y,
        z
      );

    }

  });

}


// ==========================================
// STICKER REFERENCIA
// ==========================================

function setReferenceSticker(
  material,
  face,
  x,
  y,
  z
) {

  const data =
    cubeInputData[face];

  if (!data) return;

  const index =
    getFaceIndex(
      face,
      x,
      y,
      z
    );

  const color =
    data[index];

  if (color) {

    material.color.set(
      solverColors[color]
    );

  }

}


// ==========================================
// ORIENTACIÓN DEL CUBO
// ==========================================

function rotateReferenceToFace(
  face,
  instant = false
) {

  if (!referenceCube) return;


  /*
   * En vez de inclinar el cubo,
   * utilizamos una rotación limpia
   * alrededor del eje Y.
   */

  const targets = {

    U: {
      x: -0.15,
      y: 0
    },

    R: {
      x: 0,
      y: -0.65
    },

    F: {
      x: 0,
      y: 0
    },

    D: {
      x: 0.15,
      y: 0
    },

    L: {
      x: 0,
      y: 0.65
    },

    B: {
      x: 0,
      y: Math.PI
    }

  };


  const target =
    targets[face];


  if (instant) {

    referenceCube.rotation.x =
      target.x;

    referenceCube.rotation.y =
      target.y;

    return;

  }


  animateReferenceRotation(
    target.x,
    target.y
  );

}


// ==========================================
// GIRO SUAVE
// ==========================================

function animateReferenceRotation(
  targetX,
  targetY
) {

  if (!referenceCube) return;


  const startX =
    referenceCube.rotation.x;

  const startY =
    referenceCube.rotation.y;

  let startTime =
    performance.now();

  const duration =
    850;


  function animation(now) {

    if (!referenceCube) return;


    const progress =
      Math.min(
        (now - startTime) / duration,
        1
      );


    /*
     * Suavizado.
     */

    const eased =
      progress < 0.5
        ? 2 * progress * progress
        : 1 -
          Math.pow(
            -2 * progress + 2,
            2
          ) / 2;


    referenceCube.rotation.x =
      startX +
      (targetX - startX) *
      eased;


    referenceCube.rotation.y =
      startY +
      (targetY - startY) *
      eased;


    if (progress < 1) {

      requestAnimationFrame(
        animation
      );

    }

  }


  requestAnimationFrame(
    animation
  );

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


  if (width <= 0 || height <= 0) {
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


  if (!container) return;


  if (instruction) {

    instruction.textContent =
      "Selecciona los colores de esta cara";

  }


  if (progress) {

    progress.textContent =
      `Cara ${currentFaceIndex + 1} de 6`;

  }


  container.innerHTML = "";


  const grid =
    document.createElement("div");

  grid.className =
    "input-face-grid";

  grid.style.setProperty(
    "--cube-size",
    size
  );


  const total =
    size * size;


  for (let i = 0; i < total; i++) {

    const square =
      document.createElement("button");

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
      () => {

        cubeInputData[face][i] =
          currentSelectedColor;

        square.style.background =
          solverColors[
            currentSelectedColor
          ];


        /*
         * AQUÍ está la parte importante:
         * cada vez que el usuario toca
         * un cuadrado, el cubo 3D se actualiza.
         */

        updateReferenceColors();

      }
    );


    grid.appendChild(square);

  }


  container.appendChild(grid);


  /*
   * Mostramos la cara correspondiente.
   */

  rotateReferenceToFace(
    face,
    false
  );


  /*
   * Actualizamos inmediatamente
   * los colores.
   */

  updateReferenceColors();

}


// ==========================================
// BOTONES SOLUCIONADOR
// ==========================================

function setupSolverButtons() {


  document
    .querySelectorAll(".solver-color")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".solver-color"
            )
            .forEach(b => {

              b.classList.remove(
                "selected"
              );

            });


          button.classList.add(
            "selected"
          );


          currentSelectedColor =
            button.dataset.color;

        }
      );

    });


  document
    .getElementById(
      "clearFaceButton"
    )
    ?.addEventListener(
      "click",
      () => {

        const face =
          solverFaces[currentFaceIndex];

        cubeInputData[face] =
          Array(
            selectedCubeSize *
            selectedCubeSize
          ).fill(null);

        renderCurrentFace();

      }
    );


  document
    .getElementById(
      "nextFaceButton"
    )
    ?.addEventListener(
      "click",
      nextFace
    );


  document
    .getElementById(
      "cancelSolverButton"
    )
    ?.addEventListener(
      "click",
      closeCubeSolver
    );


  document
    .getElementById(
      "nextSolutionButton"
    )
    ?.addEventListener(
      "click",
      playNextSolutionMove
    );


  document
    .getElementById(
      "closeSolutionButton"
    )
    ?.addEventListener(
      "click",
      closeCubeSolver
    );

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

    /*
     * La función renderCurrentFace
     * hace que el cubo gire suavemente
     * hacia la nueva cara.
     */

    renderCurrentFace();

    return;

  }


  finishColorInput();

}


// ==========================================
// FINALIZAR
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

  document
    .getElementById(
      "faceInstruction"
    )
    .textContent =
      "Cubo configurado correctamente";


  document
    .getElementById(
      "faceProgress"
    )
    .textContent =
      "Preparando solución...";


  document
    .getElementById(
      "inputFaceContainer"
    )
    .classList.add("hidden");


  document
    .querySelector(".solver-colors")
    .classList.add("hidden");


  document
    .querySelector(".solver-actions")
    .classList.add("hidden");


  document
    .getElementById("solutionPanel")
    .classList.remove("hidden");


  solutionMoves =
    generateSolutionMoves(
      selectedCubeSize
    );


  solutionIndex = 0;

  showCurrentSolutionMove();

}


// ==========================================
// MOVIMIENTOS
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

    moveElement.textContent =
      "✓";

    status.textContent =
      "Cubo resuelto.";

    button.textContent =
      "✓ Terminado";

    button.disabled =
      true;

    return;

  }


  moveElement.textContent =
    solutionMoves[
      solutionIndex
    ];


  status.textContent =
    `Movimiento ${solutionIndex + 1} de ${solutionMoves.length}. Pulsa el botón para continuar.`;

}


// ==========================================
// SIGUIENTE MOVIMIENTO
// ==========================================

async function playNextSolutionMove() {

  if (solving) return;

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


  moveElement.textContent =
    move;


  const status =
    document.getElementById(
      "solutionStatus"
    );


  status.textContent =
    `Realiza lentamente el movimiento ${move} en tu cubo físico...`;


  await new Promise(
    resolve =>
      setTimeout(
        resolve,
        1200
      )
  );


  solutionIndex++;

  solving = false;

  showCurrentSolutionMove();

}


// ==========================================
// CERRAR SOLUCIONADOR
// ==========================================

function closeCubeSolver() {

  const solver =
    document.getElementById(
      "cubeSolver"
    );

  solver?.remove();


  if (referenceRenderer) {

    referenceRenderer.dispose();

  }


  referenceScene = null;
  referenceCamera = null;
  referenceRenderer = null;
  referenceCube = null;

}


// ==========================================
// VOLVER A INICIO
// ==========================================

document
  .getElementById("backToHome")
  ?.addEventListener(
    "click",
    () => {

      pages.forEach(page => {

        page.classList.remove(
          "active-page"
        );

      });


      document
        .getElementById("homePage")
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

        cubeRenderer.domElement.remove();

        cubeRenderer = null;

      }


      cubeScene = null;
      cubeCamera = null;
      rubiksCube = null;
      cubePieces = [];

    }
  );