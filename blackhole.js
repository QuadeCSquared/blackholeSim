// Base code taken from: https://medium.com/@cadenmarinozzi/simulating-a-schwarzschild-black-hole-part-1-the-background-and-raytracer-7de436a56b7e

import * as three from 'three';
import vertexShader from "./vertexShader.js";
import fragmentShader from "./fragmentShader.js";

const scene = new three.Scene();

const width = window.innerWidth; // These can be changed
const height = window.innerHeight; // These can be changed
const aspectRatio = width / height;

const camera = new three.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.z = 1;

const renderer = new three.WebGLRenderer({
  antialias: true,
});
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// Converts degrees to radians
function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

const fovRadians = degToRad(camera.fov);
const yFov = camera.position.z * Math.tan(fovRadians / 2) * 2;

const canvasGeometry = new three.PlaneGeometry(yFov * camera.aspect, yFov);
const spaceTexture = new three.TextureLoader().load("8kSpace.jpg", () =>
  renderer.render(scene, camera)
);


const canvasMaterial = new three.ShaderMaterial({
  uniforms: {
    uSpaceTexture: {
      value: spaceTexture,
    },
    uResolution: {
      value: new three.Vector2(width, height),
    }
  },
  vertexShader,
  fragmentShader
});

const canvasMesh = new three.Mesh(canvasGeometry, canvasMaterial);
scene.add(canvasMesh);

// renderer.render(scene, camera);