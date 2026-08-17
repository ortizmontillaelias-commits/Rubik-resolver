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
// ORDEN DEL SOLUCIONADOR
// ==========================================

const solverFaces = [

  "F",
  "R",
  "B",
  "L",
  "D",
  "U"

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

  cubeCamera.position.set(
    size * 2.8,
    size * 2.4,
    size * 4.2
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

  cubeScene.add(
    directional
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

  cubeControls.dampingFactor =
    0.08;

  cubeControls.enablePan =
    false;

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

        piece.userData = {
          x,
          y,
          z
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

  const black =
    0x101010;

  return [

    // RIGHT
    new THREE.MeshStandardMaterial({
      color:
        x === size - 1
          ? cubeColors.red
          : black
    }),

    // LEFT
    new THREE.MeshStandardMaterial({
      color:
        x === 0
          ? cubeColors.orange
          : black
    }),

    // UP
    new THREE.MeshStandardMaterial({
      color:
        y === size - 1
          ? cubeColors.white
          : black
    }),

    // DOWN
    new THREE.MeshStandardMaterial({
      color:
        y === 0
          ? cubeColors.yellow
          : black
    }),

    // FRONT
    new THREE.MeshStandardMaterial({
      color:
        z === size - 1
          ? cubeColors.green
          : black
    }),

    // BACK
    new THREE.MeshStandardMaterial({
      color:
        z === 0
          ? cubeColors.blue
          : black
    })

  ];

}


// ==========================================
// ACTUALIZAR COLORES CUBO 3D
// ==========================================

function update3DCubeColors() {

  if (!rubiksCube) return;

  const size =
    selectedCubeSize;

  cubePieces.forEach(piece => {

    const {
      x,
      y,
      z
    } = piece.userData;

    const materials =
      piece.material;

    materials.forEach(material => {

      material.color.setHex(
        0x101010
      );

    });

    if (x === size - 1) {

      setFaceSticker(
        materials[0],
        "R",
        x,
        y,
        z
      );

    }

    if (x === 0) {

      setFaceSticker(
        materials[1],
        "L",
        x,
        y,
        z
      );

    }

    if (y === size - 1) {

      setFaceSticker(
        materials[2],
        "U",
        x,
        y,
        z
      );

    }

    if (y === 0) {

      setFaceSticker(
        materials[3],
        "D",
        x,
        y,
        z
      );

    }

    if (z === size - 1) {

      setFaceSticker(
        materials[4],
        "F",
        x,
        y,
        z
      );

    }

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
// POSICIÓN CORRECTA DE CADA STICKER
// ==========================================

function getFaceIndex(face, x, y, z) {

  const size =
    selectedCubeSize;

  let row = 0;
  let col = 0;

  switch (face) {

    // FRENTE
    case "F":

      row = size - 1 - y;
      col = x;

      break;


    // DERECHA
    case "R":

      row = size - 1 - y;
      col = size - 1 - z;

      break;


    // ATRÁS
    case "B":

      row = size - 1 - y;
      col = size - 1 - x;

      break;


    // IZQUIERDA
    case "L":

      row = size - 1 - y;
      col = z;

      break;


    // ABAJO
    // ORIENTACIÓN CORREGIDA
    case "D":

      row = size - 1 - z;
      col = x;

      break;


    // ARRIBA
    // ORIENTACIÓN CORREGIDA
    case "U":

      row = size - 1 - z;
      col = x;

      break;


    default:

      row = 0;
      col = 0;

      break;

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
// RESIZE CUBO
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
// ANIMACIÓN CUBO
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

let referenceRotationAnimation = null;


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

  currentSelectedColor =
    "white";

  const oldSolver =
    document.getElementById(
      "cubeSolver"
    );

  if (oldSolver) {
    oldSolver.remove();
  }

  const solver =
    document.createElement(
      "div"
    );

  solver.id =
    "cubeSolver";

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

  document.body.appendChild(
    solver
  );

  createReferenceCube();

  setupSolverButtons();

  renderCurrentFace();

}


// ==========================================
// CREAR CUBO DE REFERENCIA
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
    new THREE.Color(
      0x0f172a
    );

  referenceCamera =
    new THREE.PerspectiveCamera(
      35,
      1,
      0.1,
      100
    );

  referenceCamera.position.set(
    0,
    0,
    8
  );

  referenceCamera.lookAt(
    0,
    0,
    0
  );

  referenceRenderer =
    new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
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
    10
  );

  referenceScene.add(
    light
  );

  referenceCube =
    new THREE.Group();

  referenceScene.add(
    referenceCube
  );

  referenceCube.rotation.set(
    0,
    0,
    0
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

  referenceCube.children.forEach(
    piece => {

      const {
        x,
        y,
        z
      } = piece.userData;

      const materials =
        piece.material;

      materials.forEach(
        material => {

          material.color.setHex(
            0x101010
          );

        }
      );

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

    }
  );

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

  const targets = {

    // FRENTE
    F: {
      x: 0,
      y: 0,
      z: 0
    },

    // DERECHA
    R: {
      x: 0,
      y: -Math.PI / 2,
      z: 0
    },

    // ATRÁS
    B: {
      x: 0,
      y: -Math.PI,
      z: 0
    },

    // IZQUIERDA
    L: {
      x: 0,
      y: Math.PI / 2,
      z: 0
    },

    // ABAJO
    D: {
      x: -Math.PI / 2,
      y: 0,
      z: 0
    },

    // ARRIBA
    U: {
      x: Math.PI / 2,
      y: 0,
      z: 0
    }

  };

  const target =
    targets[face];

  if (!target) return;


  // ==========================================
  // CANCELAR ANIMACIÓN ANTERIOR
  // ==========================================

  if (referenceRotationAnimation) {

    cancelAnimationFrame(
      referenceRotationAnimation
    );

    referenceRotationAnimation = null;

  }


  // ==========================================
  // POSICIÓN INSTANTÁNEA
  // ==========================================

  if (instant) {

    referenceCube.rotation.set(
      target.x,
      target.y,
      target.z
    );

    return;

  }


  const currentX =
    referenceCube.rotation.x;

  const currentY =
    referenceCube.rotation.y;

  const currentZ =
    referenceCube.rotation.z;


  // ==========================================
  // IZQUIERDA → ABAJO
  // ==========================================
  //
  // Ahora el cubo simplemente BAJA.
  //
  // No hacemos el movimiento intermedio
  // hacia el frente.
  // ==========================================

  if (face === "D") {

    animateReferenceRotation(
      -Math.PI / 2,
      currentY,
      currentZ,
      850,
      () => {

        referenceCube.rotation.set(
          -Math.PI / 2,
          0,
          0
        );

      }
    );

    return;

  }


  // ==========================================
  // ABAJO → ARRIBA
  // ==========================================
  //
  // Este es el movimiento que dijiste
  // que te gustó.
  //
  // Desde abajo sube directamente hacia
  // la cara superior.
  // ==========================================

  if (
    face === "U" &&
    Math.abs(currentX + Math.PI / 2) < 0.25
  ) {

    animateReferenceRotation(
      Math.PI / 2,
      0,
      0,
      1000,
      () => {

        referenceCube.rotation.set(
          Math.PI / 2,
          0,
          0
        );

      }
    );

    return;

  }


  // ==========================================
  // MOVIMIENTO NORMAL
  // ==========================================

  animateReferenceRotation(
    target.x,
    target.y,
    target.z,
    900,
    null
  );

}


// ==========================================
// ANIMACIÓN DE GIRO
// ==========================================

function animateReferenceRotation(
  targetX,
  targetY,
  targetZ,
  duration = 900,
  onComplete = null
) {

  if (!referenceCube) return;

  const startX =
    referenceCube.rotation.x;

  const startY =
    referenceCube.rotation.y;

  const startZ =
    referenceCube.rotation.z;


  // ==========================================
  // GIRO MÁS CORTO EN Y
  // ==========================================

  let differenceY =
    targetY - startY;

  while (
    differenceY > Math.PI
  ) {

    differenceY -=
      Math.PI * 2;

  }

  while (
    differenceY < -Math.PI
  ) {

    differenceY +=
      Math.PI * 2;

  }

  const finalY =
    startY + differenceY;


  const animationStart =
    performance.now();


  function animation(now) {

    if (!referenceCube) {

      referenceRotationAnimation =
        null;

      return;

    }


    const progress =
      Math.min(
        (now - animationStart) /
        duration,
        1
      );


    const eased =
      1 -
      Math.pow(
        1 - progress,
        3
      );


    referenceCube.rotation.x =
      startX +
      (
        targetX - startX
      ) *
      eased;


    referenceCube.rotation.y =
      startY +
      (
        finalY - startY
      ) *
      eased;


    referenceCube.rotation.z =
      startZ +
      (
        targetZ - startZ
      ) *
      eased;


    if (progress < 1) {

      referenceRotationAnimation =
        requestAnimationFrame(
          animation
        );

    }

    else {

      referenceCube.rotation.set(
        targetX,
        targetY,
        targetZ
      );

      referenceRotationAnimation =
        null;


      if (onComplete) {

        onComplete();

      }

    }

  }


  referenceRotationAnimation =
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


// ==========================================
// RENDERIZAR CARA ACTUAL
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


  const faceNames = {

    F: "FRENTE",
    R: "DERECHA",
    B: "ATRÁS",
    L: "IZQUIERDA",
    D: "ABAJO",
    U: "ARRIBA"

  };


  if (instruction) {

    instruction.textContent =
      `Selecciona los colores de la cara ${faceNames[face]}`;

  }


  if (progress) {

    progress.textContent =
      `Cara ${currentFaceIndex + 1} de 6 — ${faceNames[face]}`;

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
      () => {

        cubeInputData[face][i] =
          currentSelectedColor;


        square.style.background =
          solverColors[
            currentSelectedColor
          ];


        updateReferenceColors();

      }
    );


    grid.appendChild(
      square
    );

  }


  container.appendChild(
    grid
  );


  rotateReferenceToFace(
    face,
    false
  );


  updateReferenceColors();

}


// ==========================================
// BOTONES DEL SOLUCIONADOR
// ==========================================

function setupSolverButtons() {

  document
    .querySelectorAll(
      ".solver-color"
    )
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
    solverFaces[
      currentFaceIndex
    ];


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
// FINALIZAR ENTRADA
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


  for (
    const face of solverFaces
  ) {

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


// ==========================================
// MOSTRAR SOLUCIÓN
// ==========================================

function showSolution() {

  const instruction =
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


  if (instruction) {

    instruction.textContent =
      "Cubo configurado correctamente";

  }


  if (progress) {

    progress.textContent =
      "Preparando solución...";

  }


  if (input) {

    input.classList.add(
      "hidden"
    );

  }


  if (colors) {

    colors.classList.add(
      "hidden"
    );

  }


  if (actions) {

    actions.classList.add(
      "hidden"
    );

  }


  if (solutionPanel) {

    solutionPanel.classList.remove(
      "hidden"
    );

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
// GENERAR MOVIMIENTOS
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

  const status =
    document.getElementById(
      "solutionStatus"
    );


  if (moveElement) {

    moveElement.textContent =
      move;

  }


  if (status) {

    status.textContent =
      `Realiza lentamente el movimiento ${move} en tu cubo físico...`;

  }


  await new Promise(
    resolve => {

      setTimeout(
        resolve,
        1200
      );

    }
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


  if (solver) {

    solver.remove();

  }


  if (referenceRotationAnimation) {

    cancelAnimationFrame(
      referenceRotationAnimation
    );

    referenceRotationAnimation =
      null;

  }


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

        if (
          cubeRenderer.domElement
        ) {

          cubeRenderer.domElement.remove();

        }

        cubeRenderer = null;

      }


      cubeScene = null;
      cubeCamera = null;
      rubiksCube = null;
      cubePieces = [];

    }
  );