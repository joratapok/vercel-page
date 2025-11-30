import * as THREE from "three";
import holographicVertex from './shaders/holographic/vertex.glsl';
import holographicFragment from './shaders/holographic/fragment.glsl';

export class HolographicMaterial {
  constructor(experience) {
    this.experience = experience;
    this.time = experience.time;
    this.debug = experience.debug;

    this.createMaterial();
  }

  createMaterial() {
    // Вынести в отдельный класс CommonMaterial
    this.materialParameters = {color: '#70c1ff'}
    this.instance = new THREE.ShaderMaterial({
      vertexShader: holographicVertex,
      fragmentShader: holographicFragment,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(this.materialParameters.color)}
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Material parameters');
      this.debugFolder
        .addColor(this.materialParameters, 'color')
        .onChange(() => {
          this.instance.uniforms.uColor.value.set(this.materialParameters.color);
        });
    }
  }
  update() {
    this.instance.uniforms.uTime.value = this.time.elapsed;
  }

}
