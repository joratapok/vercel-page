import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {FontLoader} from "three/addons/loaders/FontLoader.js";
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';

const canvas = document.querySelector('#root');

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Update on resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize( sizes.width, sizes.height );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

// Fullscreen on double Click
window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    document.exitFullscreen().catch(err => {
      console.log('Error attempting to exit full-screen mode:', err.message);
    });
  }
})

// Cursor
const cursor = {x: 0, y: 0};
window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = - (e.clientY / sizes.height - 0.5);
})

// Scene
const scene = new THREE.Scene();

// Textures
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const matcapTexture = textureLoader.load('/textures/matcaps/10.png');
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Hello world', {
    font,
    size: 0.5,
    height: 0.2,
    depth: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.computeBoundingBox();
  // const shiftX = -(textGeometry.boundingBox.max.x - 0.02)/2;
  // const shiftY = -(textGeometry.boundingBox.max.y - 0.02)/2;
  // const shiftZ = -(textGeometry.boundingBox.max.z - 0.03)/2;
  // textGeometry.translate(shiftX, shiftY, shiftZ);
  textGeometry.center();

  const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture});
  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  console.time('donuts');

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 40);
  const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture});

  // adding donuts
  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;
    scene.add(donut);
  }
  console.timeEnd('donuts');
});


// Objects

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls( camera, canvas );
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

// Animate
const tick = () => {


  const elapsedTime = clock.getElapsedTime();

  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
