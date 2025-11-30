import * as THREE from "three";
import halftoneVertex from './shaders/halftone/vertex.glsl';
import halftoneFragment from './shaders/halftone/fragment.glsl';

export class HalfToneMaterial {
  constructor(experience) {
    this.experience = experience;
    this.sizes = experience.sizes;
    this.debug = experience.debug;

    this.createMaterial();
  }

  createMaterial() {
    this.materialParameters = {};
    this.materialParameters.color = '#ff794d';
    this.materialParameters.shadowColor = '#8e19b8';
    this.materialParameters.lightColor = '#e5ffe0';

    this.instance = new THREE.ShaderMaterial({
      vertexShader: halftoneVertex,
      fragmentShader: halftoneFragment,
      uniforms: {
        uColor: new THREE.Uniform(new THREE.Color(this.materialParameters.color)),
        uShadeColor: new THREE.Uniform(new THREE.Color(this.materialParameters.shadeColor)),
        uResolution: new THREE.Uniform(new THREE.Vector2(
          this.sizes.width * this.sizes.pixelRatio,
          this.sizes.height * this.sizes.pixelRatio,
        )),
        uShadowRepetitions: new THREE.Uniform(100.0),
        uShadowColor: new THREE.Uniform(new THREE.Color(this.materialParameters.shadowColor)),
        uLightRepetitions: new THREE.Uniform(130.0),
        uLightColor: new THREE.Uniform(new THREE.Color(this.materialParameters.lightColor)),
      },
      // transparent: true,
      // side: THREE.DoubleSide,
      // depthTest: false,
      // blending: THREE.AdditiveBlending,
    });

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Material parameters');
      this.debugFolder
        .addColor(this.materialParameters, 'color')
        .onChange(() => {
          this.instance.uniforms.uColor.value.set(this.materialParameters.color);
        });
      this.debugFolder
        .add(this.instance.uniforms.uShadowRepetitions, 'value')
        .min(1)
        .max(300)
        .step(1)
      this.debugFolder
        .addColor(this.materialParameters, 'shadowColor')
        .onChange(() => {
          this.instance.uniforms.uShadowColor.value.set(this.materialParameters.shadowColor);
        });
      this.debugFolder
        .add(this.instance.uniforms.uLightRepetitions, 'value')
        .min(1)
        .max(300)
        .step(1)
      this.debugFolder
        .addColor(this.materialParameters, 'lightColor')
        .onChange(() => {
          this.instance.uniforms.uLightColor.value.set(this.materialParameters.lightColor);
        });
    }
  }
  resize() {
    this.instance.uniforms.uResolution.value.set(
      this.sizes.width * this.sizes.pixelRatio,
      this.sizes.height * this.sizes.pixelRatio
    )
  }
}
