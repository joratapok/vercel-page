import * as THREE from 'three';

export class TorusKnot {
  constructor(experience, material) {
    this.experience = experience;
    this.scene = experience.scene
    this.material = material;
    this.time = experience.time;

    this.setGeometry();
    this.createTorus();
  }

  setGeometry() {
    this.geometry = new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32);
  }

  createTorus() {
    this.mesh  = new THREE.Mesh(
      this.geometry,
      this.material
    )
    this.mesh.position.x = 3;
    this.scene.add(this.mesh);
  }

  update() {
    this.mesh.rotation.x = - this.time.elapsed * 0.0001;
    this.mesh.rotation.y = this.time.elapsed * 0.0002;
  }
}
