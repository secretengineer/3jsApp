import './style.css'

import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render( scene,camera );

// Add a torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x8d1463 } );
const torus = new THREE.Mesh(geometry, material);

scene.add(torus)

// Add lighting
const pointLight = new THREE.PointLight(0xffffff,100,1000);
pointLight.position.set(1,1,1);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Add helpers

//const lighthelper = new THREE.PointLightHelper(pointLight)
//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lighthelper, gridHelper);

//const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {

  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xf804a3 });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('src/space.jpg'); 
scene.background = spaceTexture;

// Avatar

const PatTexture = new THREE.TextureLoader().load('src/pat.png');

const Pat = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3),new THREE.MeshBasicMaterial({ map: PatTexture }))

  scene.add(Pat);

// Moon

const moonTexture = new THREE.TextureLoader().load('src/redplanet.jpg');
const normalTexture = new THREE.TextureLoader().load('src/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

Pat.position.z = -5;
Pat.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  Pat.rotation.y += 0.01;
  Pat.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  //controls.update();

  renderer.render( scene, camera );
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});