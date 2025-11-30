import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Camera {
  constructor(experience) {
    this.experience = experience;
    this.sizes = experience.sizes;
    this.scene = experience.scene;
    this.canvas = experience.canvas;

    this.instance = new THREE.PerspectiveCamera(
      25,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );

    this.setup();
    this.orbitControl();
  }

  setup() {
    this.instance.position.set(6, 4, 8);
    this.scene.add(this.instance);
  }

  orbitControl() {
    this.orbit = new OrbitControls(
      this.instance,
      this.canvas
    );
    this.orbit.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.orbit.update();
  }
}
