/* https://www.youtube.com/watch?v=uJA5XSD56a8

Jack and Jill went up a hill
To get a pail of water
Jack fell down and broke his crown
And Jill went into a nod...
And did the loose booty!

*/

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Parameters for the wave
const amplitude = 1; // Maximum amplitude of the wave
const sigma = 1;     // Standard deviation of the Gaussian envelope
const frequency = 5; // Frequency of the wave
const damping = 0.02; // Damping factor to simulate wave decay
const waveSpeed = 2; // Speed of wave propagation

// Create a grid of points
const points = [];
const colors = []; // Array to store colors
const gridSize = 100;
const spacing = 0.1;

// Rainbow colors (7 colors)
const rainbowColors = [
    new THREE.Color(1, 0, 0),    // Red
    new THREE.Color(1, 0.5, 0),  // Orange
    new THREE.Color(1, 1, 0),    // Yellow
    new THREE.Color(0, 1, 0),    // Green
    new THREE.Color(0, 0, 1),    // Blue
    new THREE.Color(0.29, 0, 0.51), // Indigo
    new THREE.Color(0.93, 0.51, 0.93) // Violet
];

for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const x = (i - gridSize / 2) * spacing;
        const y = (j - gridSize / 2) * spacing;
        points.push(new THREE.Vector3(x, y, 0)); // Start with z = 0

        // Calculate distance from the center
        const distance = Math.sqrt(x * x + y * y);

        // Assign a color based on distance (cycling through rainbow colors)
        const colorIndex = Math.floor(distance * 2) % rainbowColors.length;
        colors.push(rainbowColors[colorIndex]);
    }
}

// Create a geometry from the points
const geometry = new THREE.BufferGeometry().setFromPoints(points);

// Add colors to the geometry
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors.flatMap(c => c.toArray()), 3));

// Create a material for the points
const material = new THREE.PointsMaterial({ 
    vertexColors: true, // Enable vertex colors
    size: 0.1 
});

// Create a points object and add it to the scene
const wavePoints = new THREE.Points(geometry, material);
scene.add(wavePoints);

// Position the camera
camera.position.z = 5;

// Time variable for animation
let time = 0;

// Windmill rotation speed
const windmillRotationSpeed = 0.01;

// Function to update wave heights
function updateWave() {
    const positions = wavePoints.geometry.attributes.position.array;

    for (let i = 0; i < points.length; i++) {
        const x = points[i].x;
        const y = points[i].y;

        // Calculate distance from the center
        const distance = Math.sqrt(x * x + y * y);

        // Simulate wave propagation and bouncing
        const wave = amplitude * Math.sin(frequency * distance - time * waveSpeed) * Math.exp(-damping * distance);

        // Update z value
        positions[i * 3 + 2] = wave;
    }

    // Mark the geometry as needing an update
    wavePoints.geometry.attributes.position.needsUpdate = true;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update wave heights
    updateWave();

    // Increment time for animation
    time += 0.05;

    // Apply windmill rotation effect
    wavePoints.rotation.z += windmillRotationSpeed; // Rotate around the Z-axis

    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});