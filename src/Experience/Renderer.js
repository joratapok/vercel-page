import * as THREE from 'three';

export class Renderer {
  constructor(experience) {
    this.experience = experience;
    this.canvas = experience.canvas;
    this.scene = experience.scene;
    this.sizes = experience.sizes;
    this.camera = experience.camera;
    this.debug = this.experience.debug;
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Clear Color');
    }

    this.setup();
  }

  setup() {
    const debugObject = {clearColor: '#1d1f2a'};
    this.instance.setClearColor(debugObject.clearColor);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (this.debug.active) {
      this.debugFolder.add(debugObject, 'clearColor');
    }
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
