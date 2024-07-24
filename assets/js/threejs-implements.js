let particles;
let mouseX = 0, mouseY = 0;

var scene, camera, renderer, document= null;

document.addEventListener('DOMContentLoaded', () => {
  init();
  animate();
});

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create a particle system (example)
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20;
    vertices.push(x, y, z);
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  camera.position.z = 5;

  // Event Listener for mouse movement
  document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - window.innerWidth / 2) * 0.01; 
  mouseY = (event.clientY - window.innerHeight / 2) * 0.01;
}

function animate() {
  requestAnimationFrame(animate);
  
  // Add some animation to the particles
  particles.rotation.x += 0.001;
  particles.rotation.y += 0.002;

  // Camera movement based on mouse position (subtle)
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position); 

  renderer.render(scene, camera);
}