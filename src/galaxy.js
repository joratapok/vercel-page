import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('#root');

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {};
parameters.count = 10000;
parameters.size = 0.02;
parameters.radius = 5;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.insideColor = '#ff6030';
parameters.outsideColor = '#1b3984';

let geometry = null;
let material = null;
let points = null;

function invertAndScale(value) {
  const minIn = 0;
  const maxIn = 0.3;
  const minOut = 1;
  const maxOut = 8;

  // Линейная инверсия с масштабированием
  return minOut + (maxOut - minOut) * ((maxIn - value) / (maxIn - minIn));
}

const randomCorrection = (randomnessPower, randomness, radius, maxRadius) => {
  const powRandom = Math.pow(Math.random(), randomnessPower);
  const shift = (Math.random() < 0.5 ? 1 : -1);
  let multiplierByLength = radius;
  if (radius / maxRadius < 0.3) {
    multiplierByLength = invertAndScale(radius / maxRadius);
  }
  return powRandom * shift * randomness * multiplierByLength
}


const generateGalaxy = () => {

  /**
   * Destroy old galaxy
   */
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();
  material = new THREE.PointsMaterial();
  points = new THREE.Points(geometry, material);
  const vertices = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  const angle = Math.PI * 2 / parameters.branches;
  for (let i = 0; i < parameters.count; i++) {

    // position
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;
    const branch = i % parameters.branches;
    const spinAngle = radius * parameters.spin;

    const randomX = randomCorrection(parameters.randomnessPower, parameters.randomness, radius, parameters.radius);
    const randomY = randomCorrection(parameters.randomnessPower, parameters.randomness, radius, parameters.radius);
    const randomZ = randomCorrection(parameters.randomnessPower, parameters.randomness, radius, parameters.radius);

    vertices[i3] = Math.cos((angle * branch) + spinAngle) * radius + randomX;
    vertices[i3 + 1] = randomY;
    vertices[i3 + 2] = Math.sin((angle * branch) + spinAngle) * radius + randomZ;

    // color
    const mixedColor = colorInside.clone().lerp(colorOutside, radius / parameters.radius);

    colors[i3] = mixedColor.r;
    colors[i3+1] = mixedColor.g;
    colors[i3+2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  console.log(colors[0], colors[1], colors[2]);
  material.size = parameters.size;
  material.sizeAttenuation = true;
  material.depthWrite = false;
  material.blending = THREE.AdditiveBlending;
  material.vertexColors = true;
  scene.add(points);
};

generateGalaxy();

gui.add(parameters, 'count').min(100).max(100000).step(10).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(0.001).max(0.5).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.1).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(10).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(0.1).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness').min(0).max(2).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.1).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
