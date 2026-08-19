import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ======================================================
// LOGIN
// ======================================================
const loginButton = document.getElementById("loginButton");
const emailInput = document.getElementById("emailInput");

loginButton?.addEventListener("click", login);

emailInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") login();
});

function login() {
  const email = emailInput.value.trim();
  if (!email) {
    alert("Escribe tu correo electrónico.");
    return;
  }
  if (!email.includes("@")) {
    alert("Escribe un correo electrónico válido.");
    return;
  }

  document.getElementById("loginScreen")?.classList.add("hidden");
  document.getElementById("appScreen")?.classList.add("active");

  const profileEmail = document.getElementById("profileEmail");
  const profileName = document.getElementById("profileName");
  const profileAvatar = document.getElementById("profileAvatar");

  if (profileEmail) profileEmail.textContent = email;
  if (profileName) profileName.textContent = email.split("@")[0];
  if (profileAvatar) profileAvatar.textContent = email.charAt(0).toUpperCase();
}

// ======================================================
// NAVEGACIÓN
// ======================================================
const navigationButtons = document.querySelectorAll(".nav-button");
const pages = document.querySelectorAll(".page");

navigationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const pageId = button.dataset.page;
    pages.forEach((page) => page.classList.remove("active-page"));
    navigationButtons.forEach((nav) => nav.classList.remove("active"));
    document.getElementById(pageId)?.classList.add("active-page");
    button.classList.add("active");
  });
});

// ======================================================
// TEMPORIZADOR
// ======================================================
let timerInterval = null;
let startTime = 0;
let elapsedTime = 0;
let timerRunning = false;

const timerDisplay = document.getElementById("timerDisplay");
const timerStatus = document.getElementById("timerStatus");
const resetTimerButton = document.getElementById("resetTimer");

function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function updateTimer() {
  elapsedTime = Date.now() - startTime;
  if (timerDisplay) timerDisplay.textContent = formatTime(elapsedTime);
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(updateTimer, 10);
  updateTimer();
  updateTimerInstruction();
}

function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
  updateTimerInstruction();
}

function updateTimerInstruction() {
  if (!timerStatus) return;
  if (timerRunning) {
    timerStatus.textContent = "⏱️ Temporizador funcionando...";
    return;
  }
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (elapsedTime > 0) {
    timerStatus.textContent = isMobile ? "👆 Toca el cronómetro para continuar" : "⌨️ Presiona ESPACIO para continuar";
    return;
  }
  timerStatus.textContent = isMobile ? "👆 Toca el cronómetro para iniciar y detener" : "⌨️ Presiona ESPACIO para iniciar y detener";
}

timerDisplay?.addEventListener("click", () => timerRunning ? stopTimer() : startTimer());
timerDisplay?.addEventListener("touchstart", (event) => {
  event.preventDefault();
  timerRunning ? stopTimer() : startTimer();
}, { passive: false });

resetTimerButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
  elapsedTime = 0;
  if (timerDisplay) timerDisplay.textContent = "00:00.00";
  updateTimerInstruction();
});

document.addEventListener("keydown", (event) => {
  if (event.code !== "Space") return;
  const target = event.target;
  const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable;
  if (isTyping) return;
  event.preventDefault();
  timerRunning ? stopTimer() : startTimer();
});
updateTimerInstruction();
window.addEventListener("resize", updateTimerInstruction);

// ======================================================
// CUBO 3D PRINCIPAL Y MOTOR (2x2 a 7x7)
// ======================================================
let cubeScene = null;
let cubeCamera = null;
let cubeRenderer = null;
let cubeControls = null;
let rubiksCube = null;
let cubePieces = [];
let selectedCubeSize = 3;

const cubeColors = { white: 0xffffff, yellow: 0xffff00, red: 0xff0000, orange: 0xff8800, blue: 0x0066ff, green: 0x00aa00 };
let moveQueue = [];
let moveRunning = false;
const MOVE_DURATION = 950;

document.querySelectorAll(".practice-button").forEach((button) => {
  button.addEventListener("click", () => {
    const size = Number(button.dataset.cube);
    if (size) openCubePractice(size);
  });
});

function openCubePractice(size) {
  selectedCubeSize = size;
  const title = document.getElementById("selectedCubeTitle");
  if (title) title.textContent = `Cubo ${size}×${size}`;
  pages.forEach((page) => page.classList.remove("active-page"));
  document.getElementById("cubePracticePage")?.classList.add("active-page");
  const nav = document.querySelector(".bottom-nav");
  if (nav) nav.style.display = "none";
  createRubiksCube(size);
}

function createRubiksCube(size) {
  const container = document.getElementById("rubiks3D");
  if (!container) return;
  container.innerHTML = "";
  cubePieces = [];
  moveQueue = [];
  moveRunning = false;
  cubeScene = new THREE.Scene();
  cubeScene.background = new THREE.Color(0x020617);
  cubeCamera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
  cubeCamera.position.set(size * 2.8, size * 2.4, size * 4.2);
  cubeCamera.lookAt(0, 0, 0);
  cubeRenderer = new THREE.WebGLRenderer({ antialias: true });
  cubeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(cubeRenderer.domElement);
  cubeScene.add(new THREE.AmbientLight(0xffffff, 2.2));
  const directional = new THREE.DirectionalLight(0xffffff, 3);
  directional.position.set(5, 8, 10);
  cubeScene.add(directional);
  rubiksCube = new THREE.Group();
  cubeScene.add(rubiksCube);
  createCubePieces(size);
  cubeControls = new OrbitControls(cubeCamera, cubeRenderer.domElement);
  cubeControls.enableDamping = true;
  cubeControls.dampingFactor = 0.08;
  cubeControls.enablePan = false;
  cubeControls.minDistance = size * 2;
  cubeControls.maxDistance = size * 7;
  cubeControls.target.set(0, 0, 0);
  resizeRubiksCube();
  animateCube();
}

function createCubePieces(size) {
  const start = -(size - 1) / 2;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        const geometry = new THREE.BoxGeometry(0.94, 0.94, 0.94);
        const materials = createStickerMaterials(x, y, z, size);
        const piece = new THREE.Mesh(geometry, materials);
        piece.position.set(start + x, start + y, start + z);
        piece.userData = { x, y, z, homeX: x, homeY: y, homeZ: z };
        rubiksCube.add(piece);
        cubePieces.push(piece);
      }
    }
  }
}

function createStickerMaterials(x, y, z, size) {
  const black = 0x101010;
  return [
    new THREE.MeshStandardMaterial({ color: x === size - 1 ? cubeColors.red : black }),
    new THREE.MeshStandardMaterial({ color: x === 0 ? cubeColors.orange : black }),
    new THREE.MeshStandardMaterial({ color: y === size - 1 ? cubeColors.white : black }),
    new THREE.MeshStandardMaterial({ color: y === 0 ? cubeColors.yellow : black }),
    new THREE.MeshStandardMaterial({ color: z === size - 1 ? cubeColors.green : black }),
    new THREE.MeshStandardMaterial({ color: z === 0 ? cubeColors.blue : black }),
  ];
}

function animateCube() {
  requestAnimationFrame(animateCube);
  cubeControls?.update();
  if (cubeRenderer && cubeScene && cubeCamera) cubeRenderer.render(cubeScene, cubeCamera);
}

function resizeRubiksCube() {
  const container = document.getElementById("rubiks3D");
  if (!container || !cubeRenderer || !cubeCamera) return;
  const width = container.clientWidth;
  const height = container.clientHeight;
  if (width <= 0 || height <= 0) return;
  cubeCamera.aspect = width / height;
  cubeCamera.updateProjectionMatrix();
  cubeRenderer.setSize(width, height, false);
}
window.addEventListener("resize", resizeRubiksCube);

function parseMove(move) {
  move = move.trim();
  if (!move) return null;
  let face = move.charAt(0).toUpperCase();
  let amount = 1;
  let direction = 1;
  if (move.includes("2")) amount = 2;
  if (move.includes("'")) direction = -1;
  return ["R", "L", "U", "D", "F", "B"].includes(face) ? { face, amount, direction } : null;
}

function getMoveAxis(face) { return ["R", "L"].includes(face) ? "x" : ["U", "D"].includes(face) ? "y" : "z"; }
function getRotationSign(face) { return ["R", "D", "F"].includes(face) ? -1 : 1; }
function isPieceOnFace(piece, face) {
  const max = selectedCubeSize - 1;
  switch (face) {
    case "R": return piece.userData.x === max;
    case "L": return piece.userData.x === 0;
    case "U": return piece.userData.y === max;
    case "D": return piece.userData.y === 0;
    case "F": return piece.userData.z === max;
    case "B": return piece.userData.z === 0;
    default: return false;
  }
}

function animateMove(move) {
  return new Promise((resolve) => {
    if (!rubiksCube) { resolve(); return; }
    const parsed = parseMove(move);
    if (!parsed) { resolve(); return; }
    const { face, amount, direction } = parsed;
    const axis = getMoveAxis(face);
    const angle = (Math.PI / 2) * getRotationSign(face) * direction * amount;
    const pieces = cubePieces.filter((piece) => isPieceOnFace(piece, face));
    if (!pieces.length) { resolve(); return; }

    const rotationGroup = new THREE.Group();
    rubiksCube.add(rotationGroup);
    pieces.forEach((piece) => rotationGroup.attach(piece));

    const startRotation = rotationGroup.rotation[axis];
    const targetRotation = startRotation + angle;
    const startTime = performance.now();

    function animate(now) {
      const progress = Math.min(((now - startTime) / MOVE_DURATION) * (amount === 2 ? 1.15 : 1), 1);
      const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      rotationGroup.rotation[axis] = startRotation + (targetRotation - startRotation) * eased;

      if (progress < 1) { requestAnimationFrame(animate); return; }
      rotationGroup.rotation[axis] = targetRotation;
      pieces.forEach((piece) => {
        rubiksCube.attach(piece);
        piece.position.set(Math.round(piece.position.x), Math.round(piece.position.y), Math.round(piece.position.z));
      });
      rotationGroup.removeFromParent();
      updatePieceCoordinates();
      resolve();
    }
    requestAnimationFrame(animate);
  });
}

function updatePieceCoordinates() {
  const size = selectedCubeSize;
  const start = -(size - 1) / 2;
  cubePieces.forEach((piece) => {
    piece.userData.x = Math.max(0, Math.min(size - 1, Math.round(piece.position.x - start)));
    piece.userData.y = Math.max(0, Math.min(size - 1, Math.round(piece.position.y - start)));
    piece.userData.z = Math.max(0, Math.min(size - 1, Math.round(piece.position.z - start)));
  });
}

async function processMoveQueue() {
  if (moveRunning) return;
  moveRunning = true;
  while (moveQueue.length > 0) {
    const move = moveQueue.shift();
    await animateMove(move);
    await new Promise((resolve) => setTimeout(resolve, 180));
  }
  moveRunning = false;
}

function executeMove(move) {
  if (!rubiksCube) return;
  moveQueue.push(move);
  processMoveQueue();
}

// ======================================================
// SOLUCIONADOR Y CUBO DE REFERENCIA
// ======================================================
document.getElementById("solveButton")?.addEventListener("click", openCubeSolver);

let referenceScene = null, referenceCamera = null, referenceRenderer = null, referenceCube = null;
let referenceRotationAnimation = null, currentFaceIndex = 0, currentSelectedColor = "white", cubeInputData = {};

// Secuencia normal: F -> R -> B -> L -> D -> U
const solverFaces = ["F", "R", "B", "L", "D", "U"];
const solverColors = { white: "#ffffff", yellow: "#ffff00", red: "#ff0000", orange: "#ff8800", blue: "#0066ff", green: "#00aa00" };

function openCubeSolver() {
  cubeInputData = {};
  solverFaces.forEach((face) => cubeInputData[face] = Array(selectedCubeSize * selectedCubeSize).fill(null));
  currentFaceIndex = 0; currentSelectedColor = "white";
  document.getElementById("cubeSolver")?.remove();

  const solver = document.createElement("div");
  solver.id = "cubeSolver";
  solver.innerHTML = `
    <div class="solver-wrapper">
      <div class="solver-title"><h1>🧠 Resolver (${selectedCubeSize}x${selectedCubeSize})</h1><p>Introduce los colores de tu cubo.</p></div>
      <div class="reference-cube-box"><div id="referenceCube"></div></div>
      <div id="faceInstruction" class="face-instruction"></div>
      <div id="faceProgress" class="face-progress"></div>
      <div class="solver-colors">
        ${Object.entries(solverColors).map(([name, hex]) => `<button class="solver-color ${name === 'white' ? 'selected' : ''}" data-color="${name}" style="background:${hex}"></button>`).join('')}
      </div>
      <div id="inputFaceContainer" class="input-face-container"></div>
      <div class="solver-actions">
        <button id="clearFaceButton" class="secondary-button">Limpiar cara</button>
        <button id="nextFaceButton" class="primary-button">Siguiente →</button>
        <button id="cancelSolverButton" class="secondary-button">Cancelar</button>
      </div>
      <div id="solutionPanel" class="solution-panel hidden">
        <h2>🧠 Solución</h2>
        <div id="solutionMove" class="solution-move"></div>
        <p id="solutionStatus" class="solution-status"></p>
        <button id="nextSolutionButton" class="primary-button">▶ Siguiente movimiento</button>
        <button id="closeSolutionButton" class="secondary-button">Cerrar</button>
      </div>
    </div>`;
  document.body.appendChild(solver);
  createReferenceCube();
  setupSolverButtons();
  renderCurrentFace();
}

function createReferenceCube() {
  const container = document.getElementById("referenceCube");
  if (!container) return;
  referenceScene = new THREE.Scene();
  referenceScene.background = new THREE.Color(0x0f172a);
  referenceCamera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  referenceCamera.position.set(0, 0, selectedCubeSize * 2.8);
  referenceCamera.lookAt(0, 0, 0);
  referenceRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  referenceRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(referenceRenderer.domElement);
  referenceScene.add(new THREE.AmbientLight(0xffffff, 2.3));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(5, 8, 10);
  referenceScene.add(light);
  referenceCube = new THREE.Group();
  referenceScene.add(referenceCube);
  createReferencePieces();
  resizeReferenceCube();
  animateReferenceCube();
}

function createReferencePieces() {
  const size = selectedCubeSize;
  const start = -(size - 1) / 2;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        const materials = createStickerMaterials(x, y, z, size);
        const piece = new THREE.Mesh(geometry, materials);
        piece.position.set(start + x, start + y, start + z);
        piece.userData = { x, y, z };
        referenceCube.add(piece);
      }
    }
  }
  updateReferenceColors();
}

function updateReferenceColors() {
  if (!referenceCube) return;
  const size = selectedCubeSize;
  referenceCube.children.forEach((piece) => {
    const { x, y, z } = piece.userData;
    piece.material.forEach((mat) => mat.color.setHex(0x101010));
    if (x === size - 1) setReferenceSticker(piece.material[0], "R", x, y, z);
    if (x === 0) setReferenceSticker(piece.material[1], "L", x, y, z);
    if (y === size - 1) setReferenceSticker(piece.material[2], "U", x, y, z);
    if (y === 0) setReferenceSticker(piece.material[3], "D", x, y, z);
    if (z === size - 1) setReferenceSticker(piece.material[4], "F", x, y, z);
    if (z === 0) setReferenceSticker(piece.material[5], "B", x, y, z);
  });
}

function getFaceIndex(face, x, y, z) {
  const size = selectedCubeSize;
  switch (face) {
    case "F": return (size - 1 - y) * size + x;
    case "R": return (size - 1 - y) * size + (size - 1 - z);
    case "B": return (size - 1 - y) * size + (size - 1 - x);
    case "L": return (size - 1 - y) * size + z;
    case "D": return (size - 1 - z) * size + x;
    case "U": return z * size + x;
  }
}

function setReferenceSticker(material, face, x, y, z) {
  const data = cubeInputData[face];
  if (!data) return;
  const color = data[getFaceIndex(face, x, y, z)];
  if (color) material.color.set(solverColors[color]);
}

// Transición limpia paso a paso mediante rotación basada en el objetivo
function getTargetQuaternionForFace(targetFace) {
  const q = new THREE.Quaternion();
  switch (targetFace) {
    case "F":
      q.setFromEuler(new THREE.Euler(0, 0, 0));
      break;
    case "R":
      q.setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0));
      break;
    case "B":
      q.setFromEuler(new THREE.Euler(0, -Math.PI, 0));
      break;
    case "L":
      q.setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
      break;
    case "D": {
      // Inclinación directa desde la vista L
      const qL = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
      const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
      q.multiplyQuaternions(qPitch, qL);
      break;
    }
    case "U": {
      // Inclinación hacia arriba
      q.setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
      break;
    }
  }
  return q;
}

function rotateReferenceToFace(face, instant = false) {
  if (!referenceCube) return;
  const targetQuaternion = getTargetQuaternionForFace(face);

  if (referenceRotationAnimation) {
    cancelAnimationFrame(referenceRotationAnimation);
    referenceRotationAnimation = null;
  }

  if (instant) {
    referenceCube.quaternion.copy(targetQuaternion);
    return;
  }

  const startQuaternion = referenceCube.quaternion.clone();
  const animationStart = performance.now();

  function animate(now) {
    if (!referenceCube) { referenceRotationAnimation = null; return; }
    const progress = Math.min((now - animationStart) / 600, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    
    // Transición esférica suave sin giros extras
    referenceCube.quaternion.copy(startQuaternion).slerp(targetQuaternion, eased);

    if (progress < 1) {
      referenceRotationAnimation = requestAnimationFrame(animate);
    } else {
      referenceCube.quaternion.copy(targetQuaternion);
      referenceRotationAnimation = null;
    }
  }
  referenceRotationAnimation = requestAnimationFrame(animate);
}

function resizeReferenceCube() {
  const container = document.getElementById("referenceCube");
  if (!container || !referenceRenderer || !referenceCamera) return;
  referenceCamera.aspect = container.clientWidth / container.clientHeight;
  referenceCamera.updateProjectionMatrix();
  referenceRenderer.setSize(container.clientWidth, container.clientHeight, false);
}
window.addEventListener("resize", resizeReferenceCube);

function animateReferenceCube() {
  requestAnimationFrame(animateReferenceCube);
  if (referenceRenderer && referenceScene && referenceCamera) referenceRenderer.render(referenceScene, referenceCamera);
}

function renderCurrentFace() {
  const face = solverFaces[currentFaceIndex];
  const size = selectedCubeSize;
  const faceNames = { F: "FRENTE", R: "DERECHA", B: "ATRÁS", L: "IZQUIERDA", D: "ABAJO", U: "ARRIBA" };

  const instruction = document.getElementById("faceInstruction");
  const progress = document.getElementById("faceProgress");
  const container = document.getElementById("inputFaceContainer");
  if (!container) return;

  if (instruction) instruction.textContent = `Selecciona los colores de la cara ${faceNames[face]}`;
  if (progress) progress.textContent = `Cara ${currentFaceIndex + 1} de 6 — ${faceNames[face]}`;

  container.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "input-face-grid";
  grid.style.setProperty("--cube-size", size);

  for (let i = 0; i < size * size; i++) {
    const square = document.createElement("button");
    square.className = "input-square";
    const savedColor = cubeInputData[face][i];
    if (savedColor) square.style.background = solverColors[savedColor];
    
    square.addEventListener("click", () => {
      cubeInputData[face][i] = currentSelectedColor;
      square.style.background = solverColors[currentSelectedColor];
      updateReferenceColors();
    });
    grid.appendChild(square);
  }
  container.appendChild(grid);
  rotateReferenceToFace(face, false);
  updateReferenceColors();
}

function setupSolverButtons() {
  document.querySelectorAll(".solver-color").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".solver-color").forEach(b => b.classList.remove("selected"));
      button.classList.add("selected");
      currentSelectedColor = button.dataset.color;
    });
  });

  document.getElementById("clearFaceButton")?.addEventListener("click", () => {
    cubeInputData[solverFaces[currentFaceIndex]].fill(null);
    renderCurrentFace();
  });

  document.getElementById("nextFaceButton")?.addEventListener("click", nextFace);
  document.getElementById("cancelSolverButton")?.addEventListener("click", closeCubeSolver);
  document.getElementById("nextSolutionButton")?.addEventListener("click", playNextSolutionMove);
  document.getElementById("closeSolutionButton")?.addEventListener("click", closeCubeSolver);
}

function nextFace() {
  const face = solverFaces[currentFaceIndex];
  if (cubeInputData[face].some(color => !color)) {
    alert("Completa todos los colores de esta cara antes de continuar.");
    return;
  }
  if (currentFaceIndex < solverFaces.length - 1) {
    currentFaceIndex++;
    renderCurrentFace();
  } else {
    finishColorInput();
  }
}

function finishColorInput() {
  const counts = { white: 0, yellow: 0, red: 0, orange: 0, blue: 0, green: 0 };
  solverFaces.forEach(face => cubeInputData[face].forEach(c => { if (c) counts[c]++; }));
  const expected = selectedCubeSize * selectedCubeSize;
  if (!Object.values(counts).every(count => count === expected)) {
    alert(`El cubo debe tener ${expected} piezas de cada color. Revisa los colores introducidos.`);
    return;
  }
  showSolution();
}

// ======================================================
// SOLUCIÓN Y EJECUCIÓN
// ======================================================
let solutionMoves = [], solutionIndex = 0, solving = false;

function generateSolutionMoves(size) {
  const algs = {
    2: ["R", "U", "R'", "U'", "F", "R", "F'", "U"],
    3: ["R", "U", "R'", "U'", "F", "R", "F'", "U", "L", "U", "L'", "U'"],
    4: ["R", "U", "R'", "U'", "F", "R", "F'", "U"],
    5: ["R", "U", "R'", "U'", "F", "R", "F'", "U"],
    6: ["R", "U", "R'", "U'", "F", "R", "F'", "U"],
    7: ["R", "U", "R'", "U'", "F", "R", "F'", "U"]
  };
  return algs[size] || algs[3];
}

function showSolution() {
  document.getElementById("faceInstruction").textContent = "Cubo configurado correctamente";
  document.getElementById("faceProgress").textContent = "Motor preparado";
  document.getElementById("inputFaceContainer")?.classList.add("hidden");
  document.querySelector(".solver-colors")?.classList.add("hidden");
  document.querySelector(".solver-actions")?.classList.add("hidden");
  document.getElementById("solutionPanel")?.classList.remove("hidden");
  
  solutionMoves = generateSolutionMoves(selectedCubeSize);
  solutionIndex = 0; solving = false;
  showCurrentSolutionMove();
}

function showCurrentSolutionMove() {
  const moveEl = document.getElementById("solutionMove"), statusEl = document.getElementById("solutionStatus"), btn = document.getElementById("nextSolutionButton");
  if (solutionIndex >= solutionMoves.length) {
    if (moveEl) moveEl.textContent = "✓";
    if (statusEl) statusEl.textContent = "Prueba del motor terminada.";
    if (btn) { btn.textContent = "✓ Terminado"; btn.disabled = true; }
    return;
  }
  if (moveEl) moveEl.textContent = solutionMoves[solutionIndex];
  if (statusEl) statusEl.textContent = `Movimiento ${solutionIndex + 1} de ${solutionMoves.length}. Pulsa para ejecutar el giro lentamente.`;
  if (btn) { btn.textContent = "▶ Ejecutar movimiento"; btn.disabled = false; }
}

async function playNextSolutionMove() {
  if (solving || solutionIndex >= solutionMoves.length) return;
  solving = true;
  const move = solutionMoves[solutionIndex];
  document.getElementById("solutionMove").textContent = move;
  document.getElementById("solutionStatus").textContent = `Ejecutando ${move} lentamente...`;
  
  executeMove(move);
  await new Promise(r => setTimeout(r, MOVE_DURATION + 250));
  solutionIndex++; solving = false;
  showCurrentSolutionMove();
}

function closeCubeSolver() {
  document.getElementById("cubeSolver")?.remove();
  if (referenceRotationAnimation) cancelAnimationFrame(referenceRotationAnimation);
  referenceRotationAnimation = null;
  if (referenceRenderer) referenceRenderer.dispose();
  referenceScene = null; referenceCamera = null; referenceRenderer = null; referenceCube = null;
}

// ======================================================
// VOLVER A INICIO
// ======================================================
document.getElementById("backToHome")?.addEventListener("click", () => {
  pages.forEach(page => page.classList.remove("active-page"));
  document.getElementById("homePage")?.classList.add("active-page");
  const nav = document.querySelector(".bottom-nav");
  if (nav) nav.style.display = "flex";
  
  moveQueue = []; moveRunning = false;
  if (cubeControls) { cubeControls.dispose(); cubeControls = null; }
  if (cubeRenderer) { cubeRenderer.dispose(); cubeRenderer.domElement?.remove(); cubeRenderer = null; }
  cubeScene = null; cubeCamera = null; rubiksCube = null; cubePieces = [];
});