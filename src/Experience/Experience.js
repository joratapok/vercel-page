import * as THREE from 'three';

import { Camera } from './Camera.js';
import { Renderer } from './Renderer.js';
import { World } from './world/World.js';
import { Sizes } from './utils/Sizes.js';
import { Time } from './utils/Time.js';
import {Debug} from "./utils/Debug.js";
import { Resources } from './utils/Resources.js';
import { sources } from './sources.js';

export class Experience {
  constructor(canvas) {
    // Global access
    window.experience = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);
    this.resources = new Resources(sources);
    this.world = new World(this);

    // resize event
    this.sizes.on('resize', this.resize.bind(this));

    // tick event
    this.time.on('tick', this.update.bind(this));

  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
    this.world.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off('resize');
    this.sizes.off('tick');

    // Traverse whole scene
    this.scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        for (const key in child.material) {
          const value = child.material[key];
          if (value && typeof value === 'function') {
            value.dispose();
          }
        }
      }
    })

    this.camera.orbit.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }
}
