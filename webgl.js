const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(200, 200);
document.getElementById('webgl-container').appendChild(renderer.domElement);

// Create a group to hold the resultMesh
const meshGroup = new THREE.Group();
scene.add(meshGroup);

const geometry = new THREE.CubeGeometry(0.75, 0.75, 0.1);


// Cut out hole using ThreeBSP
const hole = new THREE.CubeGeometry(0.45, 0.75, 0.1);
// Move the hole to the right
hole.translate(0.15, 0.225, 0); // Move the hole to the right by 0.15 units

const hole2 = new THREE.CubeGeometry(0.75, 1, 0.1);
// Move the hole to the right
hole2.translate(0.6, 0, 0); // Move the hole to the right by 0.15 units

const holeBSP = new ThreeBSP(hole);
const holeBSP2 = new ThreeBSP(hole2);
const geometryBSP = new ThreeBSP(geometry);

let result = geometryBSP.subtract(holeBSP);
result = result.subtract(holeBSP2);
const resultMesh = result.toMesh();
resultMesh.geometry.computeFaceNormals();
resultMesh.geometry.computeVertexNormals();
resultMesh.material = new THREE.MeshStandardMaterial({
    // Set color of the square to gold
    color: 0xFFD700,
    roughness: 0.1, // Adjust roughness for smoother surface
    metalness: 0.9, // Adjust metalness for lighting effects
    transparent: true, // Enable transparency
    opacity: 1, // Set opacity level
});
meshGroup.add(resultMesh);

// camera position should be in front of the square
camera.position.z = 2; // Adjust the camera position
camera.position.x = -0.01;



const animate = () => {
    requestAnimationFrame(animate);

    meshGroup.rotation.y += 0.025; // Rotate the group instead of resultMesh

    renderer.render(scene, camera);
};

animate();
