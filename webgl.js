const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(200, 200);
document.getElementById('webgl-container').appendChild(renderer.domElement);

// Create a group to hold the resultMesh
const meshGroup = new THREE.Group();
scene.add(meshGroup);

const geometry = new THREE.CubeGeometry(0.75, 0.75, 0.1);
geometry.rotateZ(Math.PI / 4);

// Cut out hole using ThreeBSP
const hole = new THREE.CubeGeometry(0.45, 0.45, 0.1);
hole.rotateZ(-Math.PI / 4); // Rotate the hole in the opposite direction
const holeBSP = new ThreeBSP(hole);
const geometryBSP = new ThreeBSP(geometry);
const result = geometryBSP.subtract(holeBSP);
const resultMesh = result.toMesh();
resultMesh.geometry.computeFaceNormals();
resultMesh.geometry.computeVertexNormals();
resultMesh.material = new THREE.MeshStandardMaterial({
    // Set color of the square to gold
    color: 0xFFD700,
    roughness: 0.1, // Adjust roughness for smoother surface
    metalness: 0.95, // Adjust metalness for lighting effects
    transparent: true, // Enable transparency
    opacity: 1, // Set opacity level
});
meshGroup.add(resultMesh);

// camera position should be in front of the square
camera.position.z = 2; // Adjust the camera position

// Add a ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Add a light
const light = new THREE.PointLight(0xFFFFFF, 1, 1000);
light.position.set(0, 0, 2);
scene.add(light);

const animate = () => {
    requestAnimationFrame(animate);

    meshGroup.rotation.y += 0.025; // Rotate the group instead of resultMesh

    renderer.render(scene, camera);
};

animate();
