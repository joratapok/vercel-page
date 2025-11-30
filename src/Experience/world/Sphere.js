import * as THREE from "three";

export class Sphere {
  constructor(experience, material) {
    this.experience = experience;
    this.scene = experience.scene
    this.material = material;
    this.time = experience.time;

    this.setGeometry();
    this.createTorus();
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry();
  }

  createTorus() {
    this.mesh  = new THREE.Mesh(
      this.geometry,
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.1,
      }),
    )
    this.mesh.position.x = -6;
    this.scene.add(this.mesh);
  }

  update() {
    this.mesh.rotation.x = - this.time.elapsed * 0.0001;
    this.mesh.rotation.y = this.time.elapsed * 0.0002;
  }
}
