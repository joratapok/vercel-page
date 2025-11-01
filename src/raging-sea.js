import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import vertexShader from './shaders/rage/vertex.glsl'
import fragmentShader from './shaders/rage/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const global = {};

// Canvas
const canvas = document.querySelector('#root');

// Scene
const scene = new THREE.Scene();

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
const fog = new THREE.Fog('#262837', 1, 5);
scene.fog = fog;

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

// Color
global.depthColor = '#186691';
global.surfaceColor = '#9bd8ff';

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

    uSmallWavesElevation: {value: 0.15},
    uSmallWavesFrequency: {value: 3.0},
    uSmallWavesSpeed: {value: 0.2},
    uSmallIterations: {value: 3.0},

    uDepthColor: {value: new THREE.Color(global.depthColor)},
    uSurfaceColor: {value: new THREE.Color(global.surfaceColor)},
    uColorOffset: {value: 0.17},
    uColorMultiplier: {value: 5},

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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime();

  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
