export class Suzanne {
  constructor(experience, material) {
    this.experience = experience;
    this.scene = experience.scene;
    this.resources = experience.resources;
    this.time = experience.time;
    this.material = material;

    this.model = this.resources.items['suzanneGLTF'];

    this.setModel();
  }

  setModel() {
    this.model.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = this.material;
      }
    })
    this.scene.add(this.model.scene);
  }

  update() {
    this.model.scene.rotation.x = - this.time.elapsed * 0.0002;
    this.model.scene.rotation.y = this.time.elapsed * 0.0005;
  }
}
