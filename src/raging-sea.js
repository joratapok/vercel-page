import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import vertexShader from './shaders/rage/vertex.glsl'
import fragmentShader from './shaders/rage/fragment.glsl'
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const global = {};

// Loaders
const gltfLoader = new GLTFLoader();

// Canvas
const canvas = document.querySelector('#root');

// Scene
const scene = new THREE.Scene();

// Axes helper
// const axesHelper = new THREE.AxesHelper();
// axesHelper.position.set(0, 0.5, 0);
// scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 1);
scene.add(camera);

// Fog
const fog = new THREE.Fog('#262837', 1, 10);
scene.fog = fog;

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);
waterGeometry.deleteAttribute('normal');
waterGeometry.deleteAttribute('uv');

// Color
global.depthColor = '#ff4000';
global.surfaceColor = '#151c37';

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: {value: 0.0},
    uFrequency: {value: new THREE.Vector2(4, 1.5)},
    uElevation: {value: 0.2},
    uWaveSpeed: {value: 1.0},
    uColor: {value: new THREE.Color('#ffffff')},

    uSmallWavesElevation: {value: 0.15},
    uSmallWavesFrequency: {value: 3.0},
    uSmallWavesSpeed: {value: 0.2},
    uSmallIterations: {value: 4},

    uDepthColor: {value: new THREE.Color(global.depthColor)},
    uSurfaceColor: {value: new THREE.Color(global.surfaceColor)},
    uColorOffset: {value: 0.925},
    uColorMultiplier: {value: 1},

    cameraPosition: {value: camera.position},
    fogColor: {value: scene.fog.color},
    fogNear: {value: scene.fog.near},
    fogFar: {value: scene.fog.far}
  }
});

gui.add(waterMaterial.uniforms.uFrequency.value, 'x', 0, 10, 0.01).name('frequency x');
gui.add(waterMaterial.uniforms.uFrequency.value, 'y', 0, 10, 0.01).name('frequency y');
gui.add(waterMaterial.uniforms.uElevation, 'value', 0, 1, 0.01).name('elevation');
gui.add(waterMaterial.uniforms.uWaveSpeed, 'value', 0, 10, 0.01).name('wave speed');

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value', 0, 1, 0.01).name('small waves elevation');
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value', 0, 30, 0.01).name('Small Waves Frequency');
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value', 0, 4, 0.01).name('Small Waves Speed');
gui.add(waterMaterial.uniforms.uSmallIterations, 'value', 0, 5, 1).name('Small Waves Iterations');

gui.addColor(global, 'depthColor').name('depth color').onChange(() => {
  waterMaterial.uniforms.uDepthColor.value.set(global.depthColor);
});
gui.addColor(global, 'surfaceColor').name('surface color').onChange(() => {
  waterMaterial.uniforms.uDepthColor.value.set(global.surfaceColor);
});

gui.add(waterMaterial.uniforms.uColorOffset, 'value', 0, 1, 0.01).name('color offset');
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value', 0, 5, 0.01).name('color multiplier');

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = - Math.PI * 0.5;
scene.add(water);


/**
 * Lights
 */
const pointLight = new THREE.PointLight('#fff', 5);
pointLight.position.set(1, 3, 0);
scene.add(pointLight)

// Model
let duck = null;
gltfLoader.load('/models/Duck/glTF/Duck.gltf', (gltf) => {
  gltf.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.roughness = 0.4;
      child.material.metalness = 0.3;
      child.material.needsUpdate = true;
    }
  });

  duck = gltf.scene;
  scene.add(duck);
  // duck.position.set(0.5, 0, 0);
  // duck.rotateY(Math.PI/2);
  duck.rotation.z = 0.5;
  duck.scale.set(0.1, 0.1, 0.1);
})

window.addEventListener('resize', () =>
{
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastTime = 0;

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastTime;
  lastTime = elapsedTime;

  waterMaterial.uniforms.uTime.value = elapsedTime;

  if (duck) {
    const uFrequency = waterMaterial.uniforms.uFrequency.value;
    const uWaveSpeed = waterMaterial.uniforms.uWaveSpeed.value;
    const uElevation = waterMaterial.uniforms.uElevation.value;

    const elevation = Math.sin(
      duck.position.x * uFrequency.x - (elapsedTime * uWaveSpeed)
    ) * Math.sin(
      duck.position.z * uFrequency.y - (elapsedTime * uWaveSpeed)
    ) * uElevation;

    const rotationAngle = deltaTime * 0.8;
    if (elevation - 0.15 > duck.position.y) {
      duck.rotation.z -= rotationAngle;
    } else {
      duck.rotation.z += rotationAngle;
    }

    duck.position.y = elevation - 0.15;
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
