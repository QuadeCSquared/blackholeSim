// Base code taken from: https://medium.com/@cadenmarinozzi/simulating-a-schwarzschild-black-hole-part-1-the-background-and-raytracer-7de436a56b7e

import * as three from 'three';
import vertexShader from "./vertexShader.js";
import fragmentShader from "./fragmentShader.js";
import {OrbitControls} from './files/jsm/OrbitControls.js';

const scene = new three.Scene();

const width = window.innerWidth;
const height = window.innerHeight;
const aspectRatio = width / height;

const camera = new three.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.z = 1;

const renderer = new three.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// Full-screen quad
const canvasGeometry = new three.PlaneGeometry(2 * aspectRatio, 2);

// Load space texture
const loader = new three.TextureLoader();
const spaceTexture = loader.load('./8kSpace.jpg');
spaceTexture.wrapS = three.RepeatWrapping;
spaceTexture.wrapT = three.MirroredRepeatWrapping;

const canvasMaterial = new three.ShaderMaterial({
  uniforms: {
    uSpaceTexture: { value: spaceTexture },
    uResolution: { value: new three.Vector2(width, height) },
    uTime: { value: 0}
  },
  vertexShader,
  fragmentShader
});

const clock = new three.Clock();
const canvasMesh = new three.Mesh(canvasGeometry, canvasMaterial);
scene.add(canvasMesh);

function animate() {
  requestAnimationFrame(animate);

  canvasMaterial.uniforms.uTime.value = clock.getElapsedTime();

  renderer.render(scene, camera);
}

animate();