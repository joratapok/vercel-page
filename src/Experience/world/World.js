import * as THREE from 'three';
import { TorusKnot } from './TorusKnot.js';
import { Sphere } from './Sphere.js';
import {Suzanne} from "./Suzanne.js";
import {HolographicMaterial} from "./HolographicMaterial.js";
import {HalfToneMaterial} from "./HalfToneMaterial.js";
import {Hamburger} from "./Hamburger.js";
import {Lights} from "./Lights.js";

export class World {
  constructor(experience) {
    this.experience = experience;
    this.scene = experience.scene;
    this.resources = experience.resources;
    this.time = experience.time;
    this.debug = experience.debug;

    // Lights
    this.lights = new Lights(experience);

    // Holographic
    this.holographicMaterialInstance = new HolographicMaterial(experience);
    this.holographicMaterial = this.holographicMaterialInstance.instance;

    // Halftone
    this.halfToneMaterialInstance = new HalfToneMaterial(experience);
    this.halfToneMaterial = this.halfToneMaterialInstance.instance;

    this.resources.on('ready', () => {
      // Setup
      this.suzanne = new Suzanne(experience, this.halfToneMaterial);
      this.hamburger = new Hamburger(experience);
    });

    this.torusKnot = new TorusKnot(experience, this.holographicMaterial);
    // this.sphere = new Sphere(experience, this.halfToneMaterial);
  }
  update() {
    this.suzanne?.update();
    this.torusKnot.update();
    // this.sphere.update();
    this.hamburger?.update();
    this.holographicMaterialInstance.update();
  }
  resize() {
    this.halfToneMaterial.resize();
  }
}
