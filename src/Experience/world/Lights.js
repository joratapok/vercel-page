import * as THREE from "three";

export class Lights {
  constructor(experience) {
    this.experience = experience;
    this.scene = experience.scene

    this.createLights();
  }
  createLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.3);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 5.8)
    this.directionalLight.position.set(-5, 5, 5);

    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);
  }
}
