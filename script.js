// ==========================================
// CUBEMASTER
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

  const loginScreen = document.getElementById("loginScreen");
  const appScreen = document.getElementById("appScreen");

  if (loginScreen) {
    loginScreen.classList.add("hidden");
  }

  if (appScreen) {
    appScreen.classList.add("active");
  }

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

let turning = false;


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
    bottomNav.style.display = "none";
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

  cubeScene =
    new THREE.Scene();

  cubeScene.background =
    new THREE.Color(0x020617);


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


        rubiksCube.add(piece);

        cubePieces.push(piece);

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
// VOLVER
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