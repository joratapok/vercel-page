import * as THREE from "three";

export class Hamburger {
  constructor(experience) {
    this.experience = experience;
    this.scene = experience.scene;
    this.resources = experience.resources;
    this.time = experience.time;


    this.model = this.resources.items['hamburgerGLTF'];

    this.setModel();
  }

  setModel() {

    this.model.scene.position.x = -3;
    this.model.scene.scale.set(0.2, 0.2, 0.2);
    this.scene.add(this.model.scene);
  }

  update() {
    this.model.scene.rotation.x = - this.time.elapsed * 0.00006;
    this.model.scene.rotation.y = this.time.elapsed * 0.0002;
  }
}
