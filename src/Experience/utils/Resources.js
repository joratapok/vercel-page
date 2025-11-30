import * as THREE from 'three';
import { EventEmitter } from './EventEmitter.js';
import { GLTFLoader } from "three/addons";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export class Resources extends EventEmitter {
  constructor(sources) {
    super();
    //* @type {name: string, type: string, path: string[]}[]
    this.sources = [];
    if (Array.isArray(sources)) {
      this.sources = sources;
    } else {
      console.error('Sources must be an array of objects.');
    }

    // Setup
    //* @type {[name: string]: file}
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;
    this.loaders = {};

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.gltfLoader.setDRACOLoader(dracoLoader);
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  startLoading() {
    // Load all sources
    for (const source of this.sources) {
      switch (source.type) {
        case 'gltfModel': {
          this.loaders.gltfLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        }
        case 'texture': {
          this.loaders.textureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        }
        case 'cubeTexture': {
          this.loaders.cubeTextureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        }
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;
    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
