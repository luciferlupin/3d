// Global variables
let scene, camera, renderer, controls;
let autoRotate = false;
let lightingEnabled = true;
let displayCases = [];
let jewelryItems = [];
let ambientMode = 'normal'; // 'normal', 'warm', 'cool', 'romantic', 'lounge'
let allLights = [];
let wallArtworks = [];

// Initialize the 3D scene
function init() {
    console.log('Initializing store...');
    
    try {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);
        scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
        console.log('Scene created');

        // Create camera
        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 5, 25);
        console.log('Camera created');

        // Create renderer with performance optimizations
        renderer = new THREE.WebGLRenderer({ 
            antialias: false, // Disable antialiasing for performance
            powerPreference: "high-performance",
            alpha: false,
            stencil: false,
            depth: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = false; // Disable shadows for performance
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        
        // Aggressive performance optimizations
        renderer.setPixelRatio(1); // Force 1x pixel ratio
        renderer.info.autoReset = false;
        renderer.sortObjects = false;
        renderer.setClearColor(0x1a1a2e, 1);
        document.getElementById('container').appendChild(renderer.domElement);
        console.log('Renderer created');

        // Create controls with performance optimizations
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1; // Reduced for better performance
        controls.minDistance = 5;
        controls.maxDistance = 30;
        controls.maxPolarAngle = Math.PI / 2.2;
        controls.enableKeys = false; // Disable keyboard controls for performance
        controls.enablePan = false; // Disable panning for smoother experience
        controls.rotateSpeed = 0.5; // Slower rotation for smoother feel
        controls.zoomSpeed = 0.8; // Optimized zoom speed
        console.log('Controls created');

        // Create store environment
        createEnvironment();
        console.log('Environment created');

        // Create lighting
        createLighting();
        console.log('Lighting created');

        // Create display cases
        createDisplayCases();
        console.log('Display cases created');

        // Create jewelry items
        createJewelryItems();
        console.log('Jewelry items created');

        // Create additional store elements
        createStoreElements();
        console.log('Store elements created');

        // Apply premium lighting effects
        setTimeout(() => {
            createDynamicLightingEffects();
            console.log('Dynamic lighting effects applied');
        }, 500);

        // Hide loading message immediately after scene is ready
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
            console.log('Loading screen hidden');
        }
        
        // Add brand welcome message
        console.log('Welcome to Icing on the Neck - Luxury Jewelry Store');

        // Start animation loop
        animate();

        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // Fallback: Force hide loading screen after 5 seconds
        setTimeout(() => {
            const loadingElement = document.getElementById('loading');
            if (loadingElement && loadingElement.style.display !== 'none') {
                loadingElement.style.display = 'none';
                console.log('Loading screen hidden by fallback');
            }
        }, 5000);
        
        console.log('Store initialization complete');
        
    } catch (error) {
        console.error('Error during initialization:', error);
        // Hide loading screen even if there's an error
        document.getElementById('loading').style.display = 'none';
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ff6b6b;
            font-size: 18px;
            text-align: center;
            z-index: 300;
        `;
        errorDiv.innerHTML = '<h3>Store Loading Error</h3><p>Please refresh the page</p>';
        document.getElementById('container').appendChild(errorDiv);
    }
}

// Create store environment
function createEnvironment() {
    // Create floor
    createFloor();
    
    // Create walls
    createWalls();
    
    // Create ceiling
    createCeiling();
}

// Create floor
function createFloor() {
    const floorGeometry = new THREE.PlaneGeometry(40, 40); // Increased from 30x30
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c1810,
        roughness: 0.8,
        metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
}

// Create ceiling
function createCeiling() {
    const ceilingGeometry = new THREE.PlaneGeometry(40, 40); // Increased from 30x30
    const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.1
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 8;
    scene.add(ceiling);
}

// Create premium lighting setup
function createLighting() {
    // Store all lights for ambient mode control
    allLights = [];
    
    // Warm ambient lighting for luxury atmosphere
    const ambientLight = new THREE.AmbientLight(0x2c1810, 0.4);
    scene.add(ambientLight);
    allLights.push({ light: ambientLight, type: 'ambient', baseIntensity: 0.4, baseColor: 0x2c1810 });

    // Soft fill ambient light
    const fillAmbient = new THREE.AmbientLight(0x4a4a4a, 0.2);
    scene.add(fillAmbient);
    allLights.push({ light: fillAmbient, type: 'ambient', baseIntensity: 0.2, baseColor: 0x4a4a4a });

    // Premium track lighting system
    createTrackLighting();

    // Display case accent lighting
    createDisplayCaseLighting();

    // Wall wash lighting
    createWallWashLighting();

    // Accent spotlights
    createAccentSpotlights();

    // LED strip lighting
    createLEDStripLighting();
}

// Create track lighting system
function createTrackLighting() {
    // Main track lights
    const trackPositions = [
        { x: -6, y: 7.5, z: 0 },
        { x: 0, y: 7.5, z: 0 },
        { x: 6, y: 7.5, z: 0 },
        { x: -3, y: 7.5, z: -8 },
        { x: 3, y: 7.5, z: -8 },
        { x: -3, y: 7.5, z: 8 },
        { x: 3, y: 7.5, z: 8 }
    ];

    trackPositions.forEach((pos, index) => {
        // Track light fixture
        const trackLight = new THREE.SpotLight(0xfff5e6, 1.2);
        trackLight.position.set(pos.x, pos.y, pos.z);
        trackLight.angle = Math.PI / 8;
        trackLight.penumbra = 0.4;
        trackLight.decay = 1.5;
        trackLight.distance = 25;
        // trackLight.castShadow = true; // Removed for performance
        // trackLight.shadow.mapSize.width = 2048; // Removed for performance
        // trackLight.shadow.mapSize.height = 2048; // Removed for performance
        // trackLight.shadow.bias = -0.0001; // Removed for performance
        
        // Aim lights strategically
        if (index < 3) {
            trackLight.target.position.set(pos.x, 0, pos.z - 5);
        } else if (index < 5) {
            trackLight.target.position.set(pos.x, 0, pos.z + 5);
        } else {
            trackLight.target.position.set(pos.x - 5, 0, pos.z);
        }
        
        scene.add(trackLight);
        scene.add(trackLight.target);
        allLights.push({ light: trackLight, type: 'track', baseIntensity: 1.2, baseColor: 0xfff5e6 });
    });
}

// Create display case accent lighting (optimized)
function createDisplayCaseLighting() {
    displayCases.forEach((displayCase, index) => {
        // Only add spotlight to every other case for performance
        if (index % 2 === 0) {
            const caseSpotlight = new THREE.SpotLight(0xffffff, 0.8);
            const casePos = displayCase.position;
            caseSpotlight.position.set(casePos.x, 6, casePos.z);
            caseSpotlight.angle = Math.PI / 12;
            caseSpotlight.penumbra = 0.3;
            caseSpotlight.decay = 2;
            caseSpotlight.distance = 8;
            caseSpotlight.target.position.copy(casePos);
            caseSpotlight.target.position.y = 0.3;
            scene.add(caseSpotlight);
            scene.add(caseSpotlight.target);
            allLights.push({ light: caseSpotlight, type: 'spotlight', baseIntensity: 0.8, baseColor: 0xffffff });
        }

        // Only add side lights to VIP cases
        if (index >= 10) {
            const sideLight1 = new THREE.PointLight(0xffd700, 0.3, 3);
            sideLight1.position.set(casePos.x + 1, 1, casePos.z);
            displayCase.add(sideLight1);
            allLights.push({ light: sideLight1, type: 'accent', baseIntensity: 0.3, baseColor: 0xffd700 });

            const sideLight2 = new THREE.PointLight(0xffd700, 0.3, 3);
            sideLight2.position.set(casePos.x - 1, 1, casePos.z);
            displayCase.add(sideLight2);
            allLights.push({ light: sideLight2, type: 'accent', baseIntensity: 0.3, baseColor: 0xffd700 });
        }
    });
}

// Create wall wash lighting
function createWallWashLighting() {
    // Back wall wash
    const backWallLight = new THREE.RectAreaLight(0xfff5e6, 2, 25, 6);
    backWallLight.position.set(0, 4, -13);
    backWallLight.lookAt(0, 4, -14);
    scene.add(backWallLight);
    allLights.push({ light: backWallLight, type: 'wallwash', baseIntensity: 2, baseColor: 0xfff5e6 });

    // Side wall washes
    const leftWallLight = new THREE.RectAreaLight(0xfff5e6, 1.5, 6, 25);
    leftWallLight.position.set(-13, 4, 0);
    leftWallLight.rotation.y = Math.PI / 2;
    scene.add(leftWallLight);
    allLights.push({ light: leftWallLight, type: 'wallwash', baseIntensity: 1.5, baseColor: 0xfff5e6 });

    const rightWallLight = new THREE.RectAreaLight(0xfff5e6, 1.5, 6, 25);
    rightWallLight.position.set(13, 4, 0);
    rightWallLight.rotation.y = -Math.PI / 2;
    scene.add(rightWallLight);
    allLights.push({ light: rightWallLight, type: 'wallwash', baseIntensity: 1.5, baseColor: 0xfff5e6 });
}

// Create accent spotlights
function createAccentSpotlights() {
    // Counter spotlight
    const counterSpotlight = new THREE.SpotLight(0xffffff, 1.5);
    counterSpotlight.position.set(0, 8, 12);
    counterSpotlight.angle = Math.PI / 10;
    counterSpotlight.penumbra = 0.2;
    counterSpotlight.decay = 1.5;
    counterSpotlight.distance = 15;
    counterSpotlight.target.position.set(0, 1, 12);
    scene.add(counterSpotlight);
    scene.add(counterSpotlight.target);
    allLights.push({ light: counterSpotlight, type: 'spotlight', baseIntensity: 1.5, baseColor: 0xffffff });

    // Seating area warm lighting - attached to ceiling
    const seatingLight = new THREE.PointLight(0xffa500, 0.6, 8);
    seatingLight.position.set(0, 7.8, 9); // Moved to ceiling height
    scene.add(seatingLight);
    allLights.push({ light: seatingLight, type: 'accent', baseIntensity: 0.6, baseColor: 0xffa500 });

    // Display stand accent lights
    const standSpotlight1 = new THREE.SpotLight(0xffffff, 0.8);
    standSpotlight1.position.set(-12, 6, -8);
    standSpotlight1.angle = Math.PI / 8;
    standSpotlight1.penumbra = 0.3;
    standSpotlight1.target.position.set(-12, 1.5, -8);
    scene.add(standSpotlight1);
    scene.add(standSpotlight1.target);
    allLights.push({ light: standSpotlight1, type: 'spotlight', baseIntensity: 0.8, baseColor: 0xffffff });

    const standSpotlight2 = new THREE.SpotLight(0xffffff, 0.8);
    standSpotlight2.position.set(-12, 6, -5);
    standSpotlight2.angle = Math.PI / 8;
    standSpotlight2.penumbra = 0.3;
    standSpotlight2.target.position.set(-12, 1, -5);
    scene.add(standSpotlight2);
    scene.add(standSpotlight2.target);
    allLights.push({ light: standSpotlight2, type: 'spotlight', baseIntensity: 0.8, baseColor: 0xffffff });
}

// Create LED strip lighting
function createLEDStripLighting() {
    // Under-counter LED strips with proper mounting
    const underCounterLight = new THREE.RectAreaLight(0x4169e1, 0.8, 3.5, 0.1);
    underCounterLight.position.set(0, 0.9, 12);
    underCounterLight.rotation.x = -Math.PI / 2;
    
    // Add mounting bracket for under-counter light
    const bracketGeometry = new THREE.BoxGeometry(3.6, 0.05, 0.15);
    const bracketMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c2c2c,
        roughness: 0.5,
        metalness: 0.8
    });
    const bracket = new THREE.Mesh(bracketGeometry, bracketMaterial);
    bracket.position.set(0, 0.85, 12);
    scene.add(bracket);
    
    scene.add(underCounterLight);

    // Display case base LED strips (already properly mounted in cases)
    displayCases.forEach(displayCase => {
        const baseLED = new THREE.RectAreaLight(0xffffff, 0.5, 2.8, 0.05);
        const casePos = displayCase.position;
        baseLED.position.set(casePos.x, 0.15, casePos.z);
        baseLED.rotation.x = -Math.PI / 2;
        displayCase.add(baseLED);
    });

    // Wall shelf accent lighting with proper wall mounting
    for (let i = 0; i < 3; i++) {
        const shelfLED = new THREE.RectAreaLight(0xffd700, 0.6, 1.1, 0.02);
        shelfLED.position.set(-10, 2.3 + (i * 0.8), -14.7);
        shelfLED.rotation.y = Math.PI / 2;
        
        // Add wall mounting bracket for shelf LED
        const wallBracketGeometry = new THREE.BoxGeometry(0.1, 0.15, 1.2);
        const wallBracketMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.4,
            metalness: 0.9
        });
        const wallBracket = new THREE.Mesh(wallBracketGeometry, wallBracketMaterial);
        wallBracket.position.set(-10.05, 2.3 + (i * 0.8), -14.7);
        scene.add(wallBracket);
        
        scene.add(shelfLED);
    }

    // Floor perimeter lighting with proper floor stands
    const perimeterPositions = [
        { x: -14.5, z: 0, rot: 0 },
        { x: 14.5, z: 0, rot: Math.PI },
        { x: 0, z: -14.5, rot: Math.PI / 2 },
        { x: 0, z: 14.5, rot: -Math.PI / 2 }
    ];

    perimeterPositions.forEach(pos => {
        // Add floor stand for perimeter light (taller to reach light)
        const standGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.35, 16);
        const standMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c2c2c,
            roughness: 0.3,
            metalness: 0.8
        });
        const stand = new THREE.Mesh(standGeometry, standMaterial);
        stand.position.set(pos.x, 0.175, pos.z); // Centered at 0.175m height
        scene.add(stand);
        
        // Add base plate for floor stand
        const basePlateGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16);
        const basePlateMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.5,
            metalness: 0.7
        });
        const basePlate = new THREE.Mesh(basePlateGeometry, basePlateMaterial);
        basePlate.position.set(pos.x, 0.01, pos.z); // Sitting on floor
        scene.add(basePlate);
        
        // Add mounting bracket on top of stand
        const mountBracketGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.15);
        const mountBracketMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.4,
            metalness: 0.9
        });
        const mountBracket = new THREE.Mesh(mountBracketGeometry, mountBracketMaterial);
        mountBracket.position.set(pos.x, 0.35, pos.z); // Top of stand
        scene.add(mountBracket);
        
        // Position perimeter light directly on mount
        const perimeterLED = new THREE.RectAreaLight(0x4169e1, 0.3, 28, 0.02);
        perimeterLED.position.set(pos.x, 0.37, pos.z); // Sitting on mount
        perimeterLED.rotation.x = -Math.PI / 2;
        perimeterLED.rotation.y = pos.rot;
        scene.add(perimeterLED);
    });
}

// Create store environment
function createStoreEnvironment() {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c1810,
        roughness: 0.8,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    // floor.receiveShadow = true; // Removed for performance
    scene.add(floor);

    // Walls
    createWalls();

    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(30, 30);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.9,
        metalness: 0.1
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 8;
    scene.add(ceiling);
}

// Create premium luxury boutique walls
function createWalls() {
    // High-end boutique wall materials
    const marbleWallMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5f5dc, // Beige marble
        roughness: 0.1,
        metalness: 0.05
    });
    
    const accentWallMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a, // Premium dark accent
        roughness: 0.2,
        metalness: 0.3
    });
    
    const woodPanelMaterial = new THREE.MeshStandardMaterial({
        color: 0x3e2723, // Rich dark wood
        roughness: 0.4,
        metalness: 0.1
    });

    // Back wall - pure black wall with branding
    const backWallGeometry = new THREE.PlaneGeometry(40, 8);
    const backWall = new THREE.Mesh(backWallGeometry, accentWallMaterial);
    backWall.position.z = -20;
    backWall.position.y = 4;
    scene.add(backWall);
    
    // Add "Icing on the Neck" branding to payment counter wall
    createPaymentCounterBranding();

    // Left wall - marble with gold trim
    const leftWallGeometry = new THREE.PlaneGeometry(40, 8);
    const leftWall = new THREE.Mesh(leftWallGeometry, marbleWallMaterial);
    leftWall.position.x = -20;
    leftWall.position.y = 4;
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);
    
    // Gold trim strips on left wall
    for (let i = 0; i < 3; i++) {
        const trimGeometry = new THREE.BoxGeometry(0.05, 8, 0.1);
        const trimMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            roughness: 0.1,
            metalness: 0.9,
            emissive: 0xffd700,
            emissiveIntensity: 0.05
        });
        const trim = new THREE.Mesh(trimGeometry, trimMaterial);
        trim.position.set(-19.9, 4, -10 + i * 10);
        scene.add(trim);
    }

    // Right wall - marble with gold trim
    const rightWallGeometry = new THREE.PlaneGeometry(40, 8);
    const rightWall = new THREE.Mesh(rightWallGeometry, marbleWallMaterial);
    rightWall.position.x = 20;
    rightWall.position.y = 4;
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);
    
    // Gold trim strips on right wall
    for (let i = 0; i < 3; i++) {
        const trimGeometry = new THREE.BoxGeometry(0.05, 8, 0.1);
        const trimMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            roughness: 0.1,
            metalness: 0.9,
            emissive: 0xffd700,
            emissiveIntensity: 0.05
        });
        const trim = new THREE.Mesh(trimGeometry, trimMaterial);
        trim.position.set(19.9, 4, -10 + i * 10);
        scene.add(trim);
    }

    // Front accent wall sections - fully connected to entrance gate
    const frontLeftGeometry = new THREE.PlaneGeometry(17.5, 8); // Extended from 15 to 17.5
    const frontLeft = new THREE.Mesh(frontLeftGeometry, accentWallMaterial);
    frontLeft.position.set(-11.25, 4, 19.9); // Moved from -12.5 to -11.25 to reach gate
    scene.add(frontLeft);
    
    const frontRightGeometry = new THREE.PlaneGeometry(17.5, 8); // Extended from 15 to 17.5
    const frontRight = new THREE.Mesh(frontRightGeometry, accentWallMaterial);
    frontRight.position.set(11.25, 4, 19.9); // Moved from 12.5 to 11.25 to reach gate
    scene.add(frontRight);
    
    // Add premium crown molding
    const crownMoldingMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.15,
        metalness: 0.85,
        emissive: 0xffd700,
        emissiveIntensity: 0.03
    });
    
    // Crown molding on side walls only (removed from back wall)
    const moldingGeometry = new THREE.BoxGeometry(40, 0.3, 0.2);
    // const backMolding = new THREE.Mesh(moldingGeometry, crownMoldingMaterial);
    // backMolding.position.set(0, 7.85, -19.9);
    // scene.add(backMolding); // Removed crown molding from payment counter wall
    
    const leftMolding = new THREE.Mesh(moldingGeometry, crownMoldingMaterial);
    leftMolding.position.set(-19.9, 7.85, 0);
    leftMolding.rotation.y = Math.PI / 2;
    scene.add(leftMolding);
    
    const rightMolding = new THREE.Mesh(moldingGeometry, crownMoldingMaterial);
    rightMolding.position.set(19.9, 7.85, 0);
    rightMolding.rotation.y = Math.PI / 2;
    scene.add(rightMolding);
    
    const frontLeftMolding = new THREE.Mesh(new THREE.BoxGeometry(17.5, 0.3, 0.2), crownMoldingMaterial);
    frontLeftMolding.position.set(-11.25, 7.85, 19.9); // Updated to match new wall position
    scene.add(frontLeftMolding);
    
    const frontRightMolding = new THREE.Mesh(new THREE.BoxGeometry(17.5, 0.3, 0.2), crownMoldingMaterial);
    frontRightMolding.position.set(11.25, 7.85, 19.9); // Updated to match new wall position
    scene.add(frontRightMolding);
}

// Create "Icing on the Neck" branding using 3D text geometry
function createPaymentCounterBranding() {
    const textGroup = new THREE.Group();
    
    // Create elegant gold material for text
    const textMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0xffd700,
        emissiveIntensity: 0.15
    });
    
    // Load font and create text
    const loader = new THREE.FontLoader();
    
    // Create text using built-in font (fallback)
    function createTextLine(text, yPosition, fontSize = 0.8) {
        const textGeometry = new THREE.TextGeometry(text, {
            font: null, // Will use default font
            size: fontSize,
            height: 0.15,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelSegments: 5
        });
        
        textGeometry.center(); // Center the text
        
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, yPosition, -19.8); // Position on wall
        textGroup.add(textMesh);
        
        return textMesh;
    }
    
    // Since we can't load external fonts easily, create stylish text using alternative method
    // Create "ICING" text
    const icingGroup = createStylishText("ICING", 5.5, 1.2);
    textGroup.add(icingGroup);
    
    // Create "ON" text
    const onGroup = createStylishText("ON", 4.2, 1.0);
    textGroup.add(onGroup);
    
    // Create "THE" text
    const theGroup = createStylishText("THE", 2.9, 0.9);
    textGroup.add(theGroup);
    
    // Create "NECK" text
    const neckGroup = createStylishText("NECK", 1.6, 1.1);
    textGroup.add(neckGroup);
    
    scene.add(textGroup);
}

// Create stylish text using enhanced geometry (alternative to TextGeometry)
function createStylishText(text, yPosition, scale) {
    const textGroup = new THREE.Group();
    
    // Create elegant gold material for text
    const textMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.08,
        metalness: 0.92,
        emissive: 0xffd700,
        emissiveIntensity: 0.18
    });
    
    // Create each letter with enhanced styling
    const letterSpacing = scale * 0.8;
    const totalWidth = text.length * letterSpacing;
    const startX = -totalWidth / 2 + letterSpacing / 2;
    
    text.split('').forEach((letter, index) => {
        const letterMesh = createStylishLetter(letter, scale, textMaterial);
        letterMesh.position.set(startX + index * letterSpacing, yPosition, -19.8);
        textGroup.add(letterMesh);
    });
    
    return textGroup;
}

// Create individual stylish letters with premium design
function createStylishLetter(letter, scale, material) {
    const letterGroup = new THREE.Group();
    
    switch(letter.toUpperCase()) {
        case 'I':
            // Vertical stem with decorative ends
            const stem = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.15, scale * 0.8, scale * 0.12), material);
            stem.position.set(0, 0, 0);
            letterGroup.add(stem);
            
            // Top decorative cap
            const topCap = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.25, scale * 0.1, scale * 0.12), material);
            topCap.position.set(0, scale * 0.4, 0);
            letterGroup.add(topCap);
            
            // Bottom decorative base
            const bottomCap = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.25, scale * 0.1, scale * 0.12), material);
            bottomCap.position.set(0, -scale * 0.4, 0);
            letterGroup.add(bottomCap);
            break;
            
        case 'C':
            // Create elegant C with rounded appearance
            const cTop = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.6, scale * 0.12, scale * 0.12), material);
            cTop.position.set(0, scale * 0.35, 0);
            letterGroup.add(cTop);
            
            const cMiddle = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.12, scale * 0.6, scale * 0.12), material);
            cMiddle.position.set(-scale * 0.25, 0, 0);
            letterGroup.add(cMiddle);
            
            const cBottom = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.6, scale * 0.12, scale * 0.12), material);
            cBottom.position.set(0, -scale * 0.35, 0);
            letterGroup.add(cBottom);
            
            // Add rounded corners
            const cCorner1 = new THREE.Mesh(new THREE.SphereGeometry(scale * 0.08, 16, 16), material);
            cCorner1.position.set(scale * 0.25, scale * 0.35, 0);
            letterGroup.add(cCorner1);
            
            const cCorner2 = new THREE.Mesh(new THREE.SphereGeometry(scale * 0.08, 16, 16), material);
            cCorner2.position.set(scale * 0.25, -scale * 0.35, 0);
            letterGroup.add(cCorner2);
            break;
            
        case 'N':
            // Left vertical
            const nLeft = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.12, scale * 0.8, scale * 0.12), material);
            nLeft.position.set(-scale * 0.25, 0, 0);
            letterGroup.add(nLeft);
            
            // Right vertical
            const nRight = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.12, scale * 0.8, scale * 0.12), material);
            nRight.position.set(scale * 0.25, 0, 0);
            letterGroup.add(nRight);
            
            // Diagonal with elegant angle
            const nDiag = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.5, scale * 0.12, scale * 0.12), material);
            nDiag.position.set(0, 0, 0);
            nDiag.rotation.z = Math.PI / 4;
            letterGroup.add(nDiag);
            break;
            
        case 'G':
            // Main G structure
            const gTop = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.6, scale * 0.12, scale * 0.12), material);
            gTop.position.set(0, scale * 0.35, 0);
            letterGroup.add(gTop);
            
            const gLeft = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.12, scale * 0.6, scale * 0.12), material);
            gLeft.position.set(-scale * 0.25, 0, 0);
            letterGroup.add(gLeft);
            
            const gBottom = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.6, scale * 0.12, scale * 0.12), material);
            gBottom.position.set(0, -scale * 0.35, 0);
            letterGroup.add(gBottom);
            
            // G's horizontal bar
            const gBar = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.3, scale * 0.12, scale * 0.12), material);
            gBar.position.set(scale * 0.15, -scale * 0.35, 0);
            letterGroup.add(gBar);
            
            // G's vertical extension
            const gExt = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.12, scale * 0.2, scale * 0.12), material);
            gExt.position.set(scale * 0.25, -scale * 0.25, 0);
            letterGroup.add(gExt);
            break;
            
        case 'O':
            // Create elegant O with rounded appearance
            const oTop = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.5, scale * 0.12, scale * 0.12), material);
            oTop.position.set(0, scale * 0.35, 0);
            letterGroup.add(oTop);
            
            const oLeft = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.12, scale * 0.5, scale * 0.12), material);
            oLeft.position.set(-scale * 0.2, 0, 0);
            letterGroup.add(oLeft);
            
            const oRight = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.12, scale * 0.5, scale * 0.12), material);
            oRight.position.set(scale * 0.2, 0, 0);
            letterGroup.add(oRight);
            
            const oBottom = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.5, scale * 0.12, scale * 0.12), material);
            oBottom.position.set(0, -scale * 0.35, 0);
            letterGroup.add(oBottom);
            
            // Add rounded corners for elegance
            const corners = [
                { x: scale * 0.2, y: scale * 0.35 },
                { x: -scale * 0.2, y: scale * 0.35 },
                { x: scale * 0.2, y: -scale * 0.35 },
                { x: -scale * 0.2, y: -scale * 0.35 }
            ];
            
            corners.forEach(corner => {
                const sphere = new THREE.Mesh(new THREE.SphereGeometry(scale * 0.08, 16, 16), material);
                sphere.position.set(corner.x, corner.y, 0);
                letterGroup.add(sphere);
            });
            break;
            
        case 'T':
            // Top bar of T
            const tTop = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.7, scale * 0.12, scale * 0.12), material);
            tTop.position.set(0, scale * 0.35, 0);
            letterGroup.add(tTop);
            
            // Vertical stem of T
            const tStem = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.12, scale * 0.6, scale * 0.12), material);
            tStem.position.set(0, 0, 0);
            letterGroup.add(tStem);
            
            // Decorative base
            const tBase = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.2, scale * 0.08, scale * 0.12), material);
            tBase.position.set(0, -scale * 0.35, 0);
            letterGroup.add(tBase);
            break;
            
        case 'H':
            // Left vertical
            const hLeft = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.12, scale * 0.8, scale * 0.12), material);
            hLeft.position.set(-scale * 0.25, 0, 0);
            letterGroup.add(hLeft);
            
            // Right vertical
            const hRight = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.12, scale * 0.8, scale * 0.12), material);
            hRight.position.set(scale * 0.25, 0, 0);
            letterGroup.add(hRight);
            
            // Horizontal bar
            const hBar = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.5, scale * 0.12, scale * 0.12), material);
            hBar.position.set(0, 0, 0);
            letterGroup.add(hBar);
            break;
            
        case 'E':
            // Top bar
            const eTop = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.6, scale * 0.12, scale * 0.12), material);
            eTop.position.set(scale * 0.1, scale * 0.35, 0);
            letterGroup.add(eTop);
            
            // Middle bar
            const eMiddle = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.5, scale * 0.12, scale * 0.12), material);
            eMiddle.position.set(scale * 0.05, 0, 0);
            letterGroup.add(eMiddle);
            
            // Bottom bar
            const eBottom = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.6, scale * 0.12, scale * 0.12), material);
            eBottom.position.set(scale * 0.1, -scale * 0.35, 0);
            letterGroup.add(eBottom);
            
            // Vertical stem
            const eStem = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.12, scale * 0.8, scale * 0.12), material);
            eStem.position.set(-scale * 0.2, 0, 0);
            letterGroup.add(eStem);
            break;
            
        case 'K':
            // Vertical stem
            const kStem = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.12, scale * 0.8, scale * 0.12), material);
            kStem.position.set(-scale * 0.25, 0, 0);
            letterGroup.add(kStem);
            
            // Upper diagonal arm
            const kUpper = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.4, scale * 0.12, scale * 0.12), material);
            kUpper.position.set(scale * 0.05, scale * 0.2, 0);
            kUpper.rotation.z = -Math.PI / 4;
            letterGroup.add(kUpper);
            
            // Lower diagonal arm
            const kLower = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.4, scale * 0.12, scale * 0.12), material);
            kLower.position.set(scale * 0.05, -scale * 0.2, 0);
            kLower.rotation.z = Math.PI / 4;
            letterGroup.add(kLower);
            break;
    }
    
    return letterGroup;
}

// Create decorative wall panels
function createDecorativePanels() {
    // Premium wood paneling
    const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c1810,
        roughness: 0.6,
        metalness: 0.2
    });
    
    // Back wall panels
    for (let i = 0; i < 4; i++) {
        const panelGeometry = new THREE.BoxGeometry(3, 1.5, 0.02);
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.set(-9 + (i * 6), 1, -14.9);
        scene.add(panel);
    }
    
    // Decorative molding
    const moldingGeometry = new THREE.BoxGeometry(30, 0.1, 0.05);
    const moldingMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.2,
        metalness: 0.8
    });
    
    // Top molding
    const topMolding = new THREE.Mesh(moldingGeometry, moldingMaterial);
    topMolding.position.set(0, 7.9, -14.9);
    scene.add(topMolding);
    
    // Bottom molding
    const bottomMolding = new THREE.Mesh(moldingGeometry, moldingMaterial);
    bottomMolding.position.set(0, 0.1, -14.9);
    scene.add(bottomMolding);
}

// Create luxury wall sconces with proper ceiling connection
function createWallSconces() {
    const sconcePositions = [
        { x: -8, z: -14.8, rot: 0 },
        { x: 8, z: -14.8, rot: 0 },
        { x: -14.8, z: -4, rot: Math.PI / 2 },
        { x: 14.8, z: -4, rot: -Math.PI / 2 },
        { x: -14.8, z: 4, rot: Math.PI / 2 },
        { x: 14.8, z: 4, rot: -Math.PI / 2 }
    ];
    
    sconcePositions.forEach(pos => {
        const sconceGroup = new THREE.Group();
        
        // Ceiling mounting plate (connects to ceiling)
        const plateGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16);
        const plateMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            roughness: 0.2,
            metalness: 0.8
        });
        const plate = new THREE.Mesh(plateGeometry, plateMaterial);
        plate.position.set(pos.x, 7.95, pos.z); // Position at ceiling height
        sconceGroup.add(plate);
        
        // Vertical drop rod from ceiling
        const rodGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 16);
        const rodMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            roughness: 0.15,
            metalness: 0.85
        });
        const rod = new THREE.Mesh(rodGeometry, rodMaterial);
        rod.position.set(pos.x, 7.2, pos.z); // Centered between ceiling and sconce
        sconceGroup.add(rod);
        
        // Sconce main body
        const bodyGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            roughness: 0.2,
            metalness: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(pos.x, 6.4, pos.z); // Connected to rod
        body.rotation.z = Math.PI / 2;
        sconceGroup.add(body);
        
        // Sconce arm extending from wall
        const armGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
        const arm = new THREE.Mesh(armGeometry, bodyMaterial);
        arm.position.set(pos.x, 6.4, pos.z);
        arm.rotation.y = pos.rot;
        arm.position.x += pos.rot === 0 ? 0 : (pos.rot > 0 ? -0.15 : 0.15);
        arm.position.z += pos.rot === 0 ? -0.15 : 0;
        sconceGroup.add(arm);
        
        // Sconce shade
        const shadeGeometry = new THREE.ConeGeometry(0.12, 0.2, 16);
        const shadeMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c1810,
            roughness: 0.3,
            metalness: 0.2,
            side: THREE.BackSide
        });
        const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
        shade.position.set(pos.x, 6.4, pos.z);
        shade.rotation.y = pos.rot;
        shade.position.x += pos.rot === 0 ? 0 : (pos.rot > 0 ? -0.25 : 0.25);
        shade.position.z += pos.rot === 0 ? -0.25 : 0;
        sconceGroup.add(shade);
        
        // Light source inside shade
        const light = new THREE.PointLight(0xffd700, 0.4, 3);
        light.position.set(pos.x, 6.3, pos.z);
        light.position.x += pos.rot === 0 ? 0 : (pos.rot > 0 ? -0.2 : 0.2);
        light.position.z += pos.rot === 0 ? -0.2 : 0;
        sconceGroup.add(light);
        allLights.push({ light: light, type: 'sconce', baseIntensity: 0.4, baseColor: 0xffd700 });
        
        scene.add(sconceGroup);
    });
}

// Create display cases with premium boutique layout
function createDisplayCases() {
    // Ultra-premium boutique approach: very few, carefully placed displays
    // Each piece is a work of art deserving individual attention
    // Moved further back from entrance for better entrance experience
    
    // Entry zone - Moved further back from entrance gate
    const entryCases = [
        { x: -4, z: 6, rotation: Math.PI / 8 },   // Moved from z=10 to z=6
        { x: 4, z: 6, rotation: -Math.PI / 8 }     // More space from entrance
    ];
    
    // Main gallery - Moved back
    const galleryCases = [
        { x: -8, z: 2, rotation: Math.PI / 6 },    // Moved from z=6 to z=2
        { x: 0, z: 2, rotation: 0 },               // Main centerpiece
        { x: 8, z: 2, rotation: -Math.PI / 6 }
    ];
    
    // Premium collection - Moved further back
    const premiumCases = [
        { x: -6, z: -2, rotation: Math.PI / 4 },   // Moved from z=2 to z=-2
        { x: 6, z: -2, rotation: -Math.PI / 4 }
    ];
    
    // VIP suite - Removed display closest to payment counter
    // const vipCases = [
    //     { x: 0, z: -8, rotation: 0 }               // Removed to create space near payment counter
    // ];
    
    // Combine all positions for creation (VIP display removed)
    const allPositions = [...entryCases, ...galleryCases, ...premiumCases];
    
    allPositions.forEach((pos, index) => {
        const displayCase = createDisplayCase();
        displayCase.position.set(pos.x, 0, pos.z);
        displayCase.rotation.y = pos.rotation;
        scene.add(displayCase);
        displayCases.push(displayCase);
    });
}

// Create individual display case
function createDisplayCase() {
    const group = new THREE.Group();

    // Case base
    const baseGeometry = new THREE.BoxGeometry(3, 0.2, 2);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.3,
        metalness: 0.8
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.1;
    // base.castShadow = true; // Removed for performance
    group.add(base);

    // Glass panels
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        roughness: 0.1,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0
    });

    // Back panel
    const backPanel = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 0.05),
        glassMaterial
    );
    backPanel.position.set(0, 1, -0.95);
    group.add(backPanel);

    // Side panels
    const leftPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 2, 2),
        glassMaterial
    );
    leftPanel.position.set(-1.45, 1, 0);
    group.add(leftPanel);

    const rightPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 2, 2),
        glassMaterial
    );
    rightPanel.position.set(1.45, 1, 0);
    group.add(rightPanel);

    // Top panel (optional shelf)
    const topPanel = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.1, 1.8),
        new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.3,
            metalness: 0.8
        })
    );
    topPanel.position.set(0, 1.5, 0);
    group.add(topPanel);

    // LED lighting strip
    const ledLight = new THREE.PointLight(0xffffff, 0.5, 5);
    ledLight.position.set(0, 1.4, 0);
    group.add(ledLight);

    return group;
}

// Create jewelry items
function createJewelryItems() {
    displayCases.forEach((caseGroup, index) => {
        let jewelry;

        switch (index) {
            case 0:
                jewelry = createDiamondRing();
                break;
            case 1:
                jewelry = createEarrings();
                break;
            case 2:
                jewelry = createLuxuryWatch();
                break;
            case 3:
                jewelry = createPearlNecklace();
                break;
            case 4:
                jewelry = createCufflinks();
                break;
            case 5:
                jewelry = createCocktailRing();
                break;
        }

        if (jewelry) {
            jewelry.position.set(0, 0.3, 0);
            caseGroup.add(jewelry);
            jewelryItems.push(jewelry);
        }
    });
}

// Create a luxury diamond ring
function createDiamondRing() {
    const group = new THREE.Group();

    // Platinum band
    const bandGeometry = new THREE.TorusGeometry(0.5, 0.08, 16, 32);
    const bandMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe5e4e2,
        roughness: 0.05,
        metalness: 0.95,
        clearcoat: 1,
        clearcoatRoughness: 0
    });
    const band = new THREE.Mesh(bandGeometry, bandMaterial);
    band.rotation.x = Math.PI / 2;
    group.add(band);

    // Prong setting
    const prongGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
    const prongMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe5e4e2,
        roughness: 0.05,
        metalness: 0.95,
        clearcoat: 1,
        clearcoatRoughness: 0
    });
    
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const prong = new THREE.Mesh(prongGeometry, prongMaterial);
        prong.position.x = Math.cos(angle) * 0.15;
        prong.position.z = Math.sin(angle) * 0.15;
        prong.position.y = 0.5;
        group.add(prong);
    }

    // Main diamond
    const diamondGeometry = new THREE.OctahedronGeometry(0.2, 0);
    const diamondMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        roughness: 0,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transmission: 1,
        ior: 2.4
    });
    const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
    diamond.position.y = 0.5;
    diamond.position.z = 0.5;
    group.add(diamond);

    // Side diamonds
    for (let i = 0; i < 6; i++) {
        const sideDiamond = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.05, 0),
            diamondMaterial
        );
        const angle = (i / 6) * Math.PI * 2;
        sideDiamond.position.x = Math.cos(angle) * 0.5;
        sideDiamond.position.z = Math.sin(angle) * 0.5;
        sideDiamond.position.y = 0.1;
        group.add(sideDiamond);
    }

    return group;
}

// Create elegant earrings
function createEarrings() {
    const group = new THREE.Group();

    for (let side = -1; side <= 1; side += 2) {
        const earring = new THREE.Group();
        earring.position.x = side * 0.8;

        // Earring hook
        const hookGeometry = new THREE.TorusGeometry(0.1, 0.02, 8, 16);
        const hookMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffd700,
            roughness: 0.1,
            metalness: 1,
            clearcoat: 1,
            clearcoatRoughness: 0
        });
        const hook = new THREE.Mesh(hookGeometry, hookMaterial);
        hook.rotation.z = Math.PI / 2;
        hook.position.y = 0.3;
        earring.add(hook);

        // Main gem
        const gemGeometry = new THREE.OctahedronGeometry(0.15, 0);
        const gemMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color().setHSL(0.8, 0.8, 0.6),
            transparent: true,
            opacity: 0.9,
            roughness: 0.1,
            metalness: 0.3,
            clearcoat: 1,
            clearcoatRoughness: 0,
            transmission: 0.8,
            ior: 1.8
        });
        const gem = new THREE.Mesh(gemGeometry, gemMaterial);
        gem.position.y = 0.1;
        earring.add(gem);

        // Decorative elements
        for (let i = 0; i < 3; i++) {
            const decor = new THREE.Mesh(
                new THREE.SphereGeometry(0.03, 8, 8),
                new THREE.MeshPhysicalMaterial({
                    color: 0xffffff,
                    roughness: 0.1,
                    metalness: 0.8,
                    clearcoat: 1,
                    clearcoatRoughness: 0
                })
            );
            decor.position.y = -0.1 - (i * 0.08);
            earring.add(decor);
        }

        group.add(earring);
    }

    return group;
}

// Create luxury watch
function createLuxuryWatch() {
    const group = new THREE.Group();

    // Watch band
    const bandGeometry = new THREE.BoxGeometry(2, 0.15, 0.05);
    const bandMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a1a,
        roughness: 0.3,
        metalness: 0.8
    });
    const band = new THREE.Mesh(bandGeometry, bandMaterial);
    band.position.y = 0.3;
    group.add(band);

    // Watch case
    const caseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
    const caseMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        roughness: 0.05,
        metalness: 0.95,
        clearcoat: 1,
        clearcoatRoughness: 0
    });
    const watchCase = new THREE.Mesh(caseGeometry, caseMaterial);
    watchCase.position.set(0, 0.4, 0);
    watchCase.rotation.x = Math.PI / 2;
    group.add(watchCase);

    // Watch face
    const faceGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.02, 32);
    const faceMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.1
    });
    const face = new THREE.Mesh(faceGeometry, faceMaterial);
    face.position.set(0, 0.41, 0);
    face.rotation.x = Math.PI / 2;
    group.add(face);

    // Watch hands
    const handMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        roughness: 0.2,
        metalness: 0.8
    });

    // Hour hand
    const hourHand = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.15, 0.01),
        handMaterial
    );
    hourHand.position.set(0, 0.42, 0);
    hourHand.rotation.z = Math.PI / 6;
    group.add(hourHand);

    // Minute hand
    const minuteHand = new THREE.Mesh(
        new THREE.BoxGeometry(0.015, 0.25, 0.01),
        handMaterial
    );
    minuteHand.position.set(0, 0.42, 0);
    minuteHand.rotation.z = -Math.PI / 4;
    group.add(minuteHand);

    // Crown
    const crownGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.08, 8);
    const crown = new THREE.Mesh(crownGeometry, caseMaterial);
    crown.position.set(0.45, 0.4, 0);
    crown.rotation.x = Math.PI / 2;
    group.add(crown);

    return group;
}

// Create pearl necklace
function createPearlNecklace() {
    const group = new THREE.Group();

    // Create pearl strand
    const pearlCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.2, 0.2, 0),
        new THREE.Vector3(-0.8, 0.4, 0),
        new THREE.Vector3(-0.4, 0.55, 0),
        new THREE.Vector3(0, 0.6, 0),
        new THREE.Vector3(0.4, 0.55, 0),
        new THREE.Vector3(0.8, 0.4, 0),
        new THREE.Vector3(1.2, 0.2, 0)
    ]);

    const pearlMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf8f6f0,
        roughness: 0.2,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.1
    });

    // Create individual pearls
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const position = pearlCurve.getPoint(t);
        const pearl = new THREE.Mesh(
            new THREE.SphereGeometry(0.06, 16, 16),
            pearlMaterial
        );
        pearl.position.copy(position);
        pearl.position.y += 0.3;
        group.add(pearl);
    }

    // Clasp
    const claspGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.05);
    const claspMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        roughness: 0.1,
        metalness: 1,
        clearcoat: 1,
        clearcoatRoughness: 0
    });
    const clasp = new THREE.Mesh(claspGeometry, claspMaterial);
    clasp.position.set(-1.2, 0.5, 0);
    group.add(clasp);

    // Center pendant
    const pendantGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const pendantMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(0.15, 0.7, 0.5),
        roughness: 0.1,
        metalness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transmission: 0.6,
        ior: 1.5
    });
    const pendant = new THREE.Mesh(pendantGeometry, pendantMaterial);
    pendant.position.set(0, 0.9, 0);
    group.add(pendant);

    return group;
}

// Create luxury cufflinks
function createCufflinks() {
    const group = new THREE.Group();

    for (let side = -1; side <= 1; side += 2) {
        const cufflink = new THREE.Group();
        cufflink.position.x = side * 0.6;

        // Cufflink post
        const postGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
        const postMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xc0c0c0,
            roughness: 0.1,
            metalness: 1,
            clearcoat: 1,
            clearcoatRoughness: 0
        });
        const post = new THREE.Mesh(postGeometry, postMaterial);
        post.rotation.z = Math.PI / 2;
        cufflink.add(post);

        // Front face
        const faceGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
        const faceMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffd700,
            roughness: 0.05,
            metalness: 0.95,
            clearcoat: 1,
            clearcoatRoughness: 0
        });
        const face = new THREE.Mesh(faceGeometry, faceMaterial);
        face.position.x = side * 0.15;
        face.rotation.z = Math.PI / 2;
        cufflink.add(face);

        // Center stone
        const stoneGeometry = new THREE.OctahedronGeometry(0.08, 0);
        const stoneMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color().setHSL(0.6, 0.8, 0.5),
            transparent: true,
            opacity: 0.9,
            roughness: 0.1,
            metalness: 0.2,
            clearcoat: 1,
            clearcoatRoughness: 0,
            transmission: 0.8,
            ior: 1.8
        });
        const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
        stone.position.x = side * 0.15;
        cufflink.add(stone);

        // Back face
        const backFace = new THREE.Mesh(faceGeometry, faceMaterial);
        backFace.position.x = -side * 0.15;
        backFace.rotation.z = Math.PI / 2;
        cufflink.add(backFace);

        group.add(cufflink);
    }

    return group;
}

// Create cocktail ring
function createCocktailRing() {
    const group = new THREE.Group();

    // Ring band
    const bandGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 32);
    const bandMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        roughness: 0.1,
        metalness: 1,
        clearcoat: 1,
        clearcoatRoughness: 0
    });
    const band = new THREE.Mesh(bandGeometry, bandMaterial);
    band.rotation.x = Math.PI / 2;
    group.add(band);

    // Setting base
    const settingGeometry = new THREE.CylinderGeometry(0.3, 0.2, 0.15, 8);
    const settingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        roughness: 0.1,
        metalness: 1,
        clearcoat: 1,
        clearcoatRoughness: 0
    });
    const setting = new THREE.Mesh(settingGeometry, settingMaterial);
    setting.position.y = 0.4;
    setting.rotation.x = Math.PI / 2;
    group.add(setting);

    // Large center stone
    const centerStoneGeometry = new THREE.OctahedronGeometry(0.25, 0);
    const centerStoneMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(0.1, 0.9, 0.6),
        transparent: true,
        opacity: 0.9,
        roughness: 0.05,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transmission: 0.9,
        ior: 2.2
    });
    const centerStone = new THREE.Mesh(centerStoneGeometry, centerStoneMaterial);
    centerStone.position.y = 0.55;
    group.add(centerStone);

    // Surrounding smaller stones
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const smallStone = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.08, 0),
            new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.9,
                roughness: 0,
                metalness: 0,
                clearcoat: 1,
                clearcoatRoughness: 0,
                transmission: 1,
                ior: 2.4
            })
        );
        smallStone.position.x = Math.cos(angle) * 0.25;
        smallStone.position.z = Math.sin(angle) * 0.25;
        smallStone.position.y = 0.4;
        group.add(smallStone);
    }

    return group;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Auto-rotate jewelry products in display cases (not the scene) - reduced frequency
    if (autoRotate && jewelryItems.length > 0 && Math.random() > 0.3) { // 70% chance to skip
        jewelryItems.forEach((jewelry, index) => {
            // Rotate each jewelry item at different speeds for variety
            const rotationSpeed = 0.005 + (index * 0.002); // Varying speeds
            jewelry.rotation.y += rotationSpeed;
        });
    }
    
    // Update controls less frequently for better performance
    if (controls.enabled && Math.random() > 0.5) { // 50% chance to skip
        controls.update();
    }
    
    // Update dynamic lighting only if needed and less frequently
    if (dynamicLights.length > 0 && Math.random() > 0.7) { // 70% chance to skip update
        updateDynamicLighting();
    }
    
    // Render scene
    renderer.render(scene, camera);
    
    // Reset renderer stats less frequently
    if (renderer.info.render.calls > 1000) { // Increased threshold
        renderer.info.reset();
    }
}

// Dynamic lighting variables
let dynamicLights = [];
let time = 0;

// Create dynamic lighting effects (optimized)
function createDynamicLightingEffects() {
    // Reduced shimmer effects - only for first few jewelry items
    const maxShimmerItems = Math.min(jewelryItems.length, 8);
    for (let i = 0; i < maxShimmerItems; i++) {
        const shimmerLight = new THREE.PointLight(0xffffff, 0.2, 2);
        shimmerLight.position.set(0, 1, 0);
        jewelryItems[i].add(shimmerLight);
        dynamicLights.push({
            light: shimmerLight,
            baseIntensity: 0.2,
            phase: i * Math.PI / 4
        });
    }

    // Soft pulsing ambient light
    const pulsingAmbient = new THREE.AmbientLight(0xfff5e6, 0.1);
    scene.add(pulsingAmbient);
    dynamicLights.push({
        light: pulsingAmbient,
        baseIntensity: 0.1,
        phase: 0
    });
    
    // Add lounge mode effects (reduced)
    createLoungeEffects();
}

// Create lounge-specific effects
function createLoungeEffects() {
    // UV/blacklight-like effects for lounge mode - attached to ceiling
    const uvLight1 = new THREE.PointLight(0x9400d3, 0.8, 15);
    uvLight1.position.set(-8, 7.8, 0); // Moved to ceiling height
    scene.add(uvLight1);
    allLights.push({ light: uvLight1, type: 'accent', baseIntensity: 0.8, baseColor: 0x9400d3 });
    
    const uvLight2 = new THREE.PointLight(0x4b0082, 0.6, 12);
    uvLight2.position.set(8, 7.8, 0); // Moved to ceiling height
    scene.add(uvLight2);
    allLights.push({ light: uvLight2, type: 'accent', baseIntensity: 0.6, baseColor: 0x4b0082 });
    
    // Additional red and blue lights for lounge mode - attached to ceiling
    const redLight1 = new THREE.PointLight(0xff0000, 0.7, 10);
    redLight1.position.set(-5, 7.8, -5); // Moved to ceiling height
    scene.add(redLight1);
    allLights.push({ light: redLight1, type: 'accent', baseIntensity: 0.7, baseColor: 0xff0000 });
    
    const blueLight1 = new THREE.PointLight(0x0066ff, 0.7, 10);
    blueLight1.position.set(5, 7.8, -5); // Moved to ceiling height
    scene.add(blueLight1);
    allLights.push({ light: blueLight1, type: 'accent', baseIntensity: 0.7, baseColor: 0x0066ff });
    
    const redLight2 = new THREE.PointLight(0xff0040, 0.6, 8);
    redLight2.position.set(-5, 7.8, 5); // Moved to ceiling height
    scene.add(redLight2);
    allLights.push({ light: redLight2, type: 'accent', baseIntensity: 0.6, baseColor: 0xff0040 });
    
    const blueLight2 = new THREE.PointLight(0x0080ff, 0.6, 8);
    blueLight2.position.set(5, 7.8, 5); // Moved to ceiling height
    scene.add(blueLight2);
    allLights.push({ light: blueLight2, type: 'accent', baseIntensity: 0.6, baseColor: 0x0080ff });
    
    // Strobe light - attached to ceiling
    const strobeLight = new THREE.PointLight(0xffffff, 0.3, 20);
    strobeLight.position.set(0, 8, 0);
    scene.add(strobeLight);
    dynamicLights.push({
        light: strobeLight,
        baseIntensity: 0.3,
        phase: Math.PI / 2,
        isStrobe: true
    });
    
    // Color-changing beam lights
    createBeamLights();
}

// Create dynamic beam lights for lounge effect
function createBeamLights() {
    const beamPositions = [
        { x: -10, y: 7, z: -10 },
        { x: 10, y: 7, z: -10 },
        { x: -10, y: 7, z: 10 },
        { x: 10, y: 7, z: 10 }
    ];
    
    const beamColors = [0xff0000, 0x0066ff, 0xff0040, 0x0080ff];
    
    beamPositions.forEach((pos, index) => {
        const beamLight = new THREE.SpotLight(beamColors[index], 1.0);
        beamLight.position.set(pos.x, pos.y, pos.z);
        beamLight.angle = Math.PI / 6;
        beamLight.penumbra = 0.3;
        beamLight.decay = 2;
        beamLight.distance = 20;
        beamLight.target.position.set(0, 0, 0);
        scene.add(beamLight);
        scene.add(beamLight.target);
        
        allLights.push({ 
            light: beamLight, 
            type: 'track', 
            baseIntensity: 1.0, 
            baseColor: beamColors[index] 
        });
    });
}

// Update dynamic lighting (optimized for performance)
function updateDynamicLighting() {
    time += 0.005; // Slower time increment for smoother performance
    
    dynamicLights.forEach(({ light, baseIntensity, phase, isStrobe }) => {
        if (isStrobe && ambientMode === 'lounge') {
            // Fast strobe effect for lounge mode
            const strobe = Math.sin(time * 6 + phase) > 0.3 ? 1 : 0.1; // Reduced frequency
            light.intensity = baseIntensity * strobe;
        } else if (ambientMode === 'lounge' && light instanceof THREE.PointLight) {
            // Slower pulsing for lounge mode with color cycling
            const pulse = Math.sin(time * 1.5 + phase) * 0.3 + 0.7; // Slower pulse
            light.intensity = baseIntensity * pulse;
            
            // Add color cycling for certain lights in lounge mode (reduced frequency)
            if (phase === 0 && Math.random() > 0.8) { // Only update 20% of the time
                const colorCycle = Math.floor(time * 0.5) % 4;
                if (colorCycle === 0) light.color.setHex(0xff0000); // Red
                else if (colorCycle === 1) light.color.setHex(0x0066ff); // Blue  
                else if (colorCycle === 2) light.color.setHex(0x9400d3); // Purple
                else light.color.setHex(0xff0040); // Pink
            }
        } else {
            // Normal gentle shimmer (reduced frequency)
            const pulse = Math.sin(time * 0.8 + phase) * 0.2 + 0.8;
            light.intensity = baseIntensity * pulse;
        }
    });
}

// Create additional store elements (ultra-premium)
function createStoreElements() {
    createCashCounter();
    createSecuritySystem();
    createSignage();
    createLightingFixtures();
    createEntranceGate();
    createBoutiqueZones();
}

// Create distinct boutique zones (ultra-minimalist)
function createBoutiqueZones() {
    // Premium entrance carpet
    createEntranceCarpet();
    
    // VIP consultation area only
    createVIPConsultationArea();
}

// Create premium entrance carpet aligned with gate
function createEntranceCarpet() {
    // Main carpet - moved forward to align with entrance gate
    const carpetGeometry = new THREE.PlaneGeometry(8, 4);
    const carpetMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.9,
        metalness: 0.05
    });
    const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.01, 16); // Moved from z=10 to z=16 to align with gate
    scene.add(carpet);
    
    // Gold border
    const borderGeometry = new THREE.PlaneGeometry(8.2, 4.2);
    const borderMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.3,
        metalness: 0.7
    });
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.rotation.x = -Math.PI / 2;
    border.position.set(0, 0.005, 16);
    scene.add(border);
}

// Create VIP consultation area (ultra-premium)
function createVIPConsultationArea() {
    // Elegant consultation desk only
    const deskGroup = new THREE.Group();
    
    // Desk surface
    const deskGeometry = new THREE.BoxGeometry(2.5, 0.1, 1.2); // Smaller, more intimate
    const deskMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c1810,
        roughness: 0.2, // More polished
        metalness: 0.8
    });
    const desk = new THREE.Mesh(deskGeometry, deskMaterial);
    desk.position.set(0, 1, -8);
    deskGroup.add(desk);
    
    // Removed elegant desk legs (4 rods) - keeping clean surface
    
    scene.add(deskGroup);
}

// Create individual display stand
function createDisplayStand() {
    const standGroup = new THREE.Group();
    
    // Stand base
    const baseGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.1, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.3,
        metalness: 0.8
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.05;
    standGroup.add(base);
    
    // Stand pole
    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
    const poleMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.2,
        metalness: 0.8
    });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 0.6;
    standGroup.add(pole);
    
    // Display top
    const topGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
    const topMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.1,
        metalness: 0.9
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 1.15;
    standGroup.add(top);
    
    return standGroup;
}

// Create jewelry display stands
function createDisplayStands() {
    // Necklace display stand
    const neckStandGroup = new THREE.Group();
    
    // Stand base
    const baseGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.1, 16);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.3,
        metalness: 0.8
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.05;
    neckStandGroup.add(base);
    
    // Stand pole
    const poleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
    const pole = new THREE.Mesh(poleGeometry, baseMaterial);
    pole.position.y = 0.75;
    neckStandGroup.add(pole);
    
    // Display head
    const headGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b7355,
        roughness: 0.8,
        metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    neckStandGroup.add(head);
    
    neckStandGroup.position.set(-12, 0, -8);
    scene.add(neckStandGroup);
    
    // Ring display stand
    const ringStandGroup = new THREE.Group();
    
    const ringBase = new THREE.Mesh(baseGeometry, baseMaterial);
    ringBase.position.y = 0.05;
    ringStandGroup.add(ringBase);
    
    const ringPole = new THREE.Mesh(poleGeometry, baseMaterial);
    ringPole.position.y = 0.5;
    ringStandGroup.add(ringPole);
    
    // Ring display cone
    const coneGeometry = new THREE.ConeGeometry(0.2, 0.4, 16);
    const cone = new THREE.Mesh(coneGeometry, headMaterial);
    cone.position.y = 1;
    ringStandGroup.add(cone);
    
    ringStandGroup.position.set(-12, 0, -5);
    scene.add(ringStandGroup);
}

// Create premium boutique payment counter
function createCashCounter() {
    const counterGroup = new THREE.Group();
    
    // Luxury marble counter top with premium finish
    const topGeometry = new THREE.BoxGeometry(4.5, 0.3, 2.2);
    const topMaterial = new THREE.MeshStandardMaterial({
        color: 0xf8f8f8,
        roughness: 0.05,
        metalness: 0.1
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.set(0, 1.1, -12);
    counterGroup.add(top);
    
    // Premium gold inlay edge with enhanced detail
    const inlayGeometry = new THREE.BoxGeometry(4.6, 0.32, 2.3);
    const inlayMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.08,
        metalness: 0.95,
        emissive: 0xffd700,
        emissiveIntensity: 0.12
    });
    const inlay = new THREE.Mesh(inlayGeometry, inlayMaterial);
    inlay.position.set(0, 1.08, -12);
    counterGroup.add(inlay);
    
    // High-end cabinet base with premium wood finish
    const baseGeometry = new THREE.BoxGeometry(4.4, 1, 2.1);
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c1810,
        roughness: 0.3,
        metalness: 0.2
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, 0.5, -12);
    counterGroup.add(base);
    
    // Luxury gold decorative handles with enhanced design
    const handleGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 16);
    const handleMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.05,
        metalness: 0.95,
        emissive: 0xffd700,
        emissiveIntensity: 0.15
    });
    
    // Left handle with decorative base
    const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    leftHandle.position.set(-1.8, 1.1, -12);
    leftHandle.rotation.z = Math.PI / 2;
    counterGroup.add(leftHandle);
    
    // Right handle with decorative base
    const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    rightHandle.position.set(1.8, 1.1, -12);
    rightHandle.rotation.z = Math.PI / 2;
    counterGroup.add(rightHandle);
    
    // Add decorative handle bases
    const handleBaseGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16);
    const handleBaseMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.05,
        metalness: 0.95,
        emissive: 0xffd700,
        emissiveIntensity: 0.1
    });
    
    const leftHandleBase = new THREE.Mesh(handleBaseGeometry, handleBaseMaterial);
    leftHandleBase.position.set(-1.8, 0.7, -12);
    counterGroup.add(leftHandleBase);
    
    const rightHandleBase = new THREE.Mesh(handleBaseGeometry, handleBaseMaterial);
    rightHandleBase.position.set(1.8, 0.7, -12);
    counterGroup.add(rightHandleBase);
    
    // Ultra-premium payment terminal with sleek design
    const terminalGeometry = new THREE.BoxGeometry(0.7, 0.18, 0.45);
    const terminalMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.02,
        metalness: 0.98
    });
    const terminal = new THREE.Mesh(terminalGeometry, terminalMaterial);
    terminal.position.set(0, 1.28, -12);
    counterGroup.add(terminal);
    
    // Premium touchscreen display with enhanced detail
    const screenGeometry = new THREE.BoxGeometry(0.6, 0.35, 0.02);
    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.0,
        metalness: 1.0,
        emissive: 0x002244,
        emissiveIntensity: 0.3
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1.38, -11.75);
    screen.rotation.x = -Math.PI / 6;
    counterGroup.add(screen);
    
    // Add screen bezel
    const bezelGeometry = new THREE.BoxGeometry(0.65, 0.4, 0.03);
    const bezelMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.1,
        metalness: 0.9
    });
    const bezel = new THREE.Mesh(bezelGeometry, bezelMaterial);
    bezel.position.set(0, 1.38, -11.75);
    bezel.rotation.x = -Math.PI / 6;
    counterGroup.add(bezel);
    
    // Luxury LED lighting system under counter
    const ledLight = new THREE.PointLight(0xffffff, 0.5, 4);
    ledLight.position.set(0, 0.9, -12);
    counterGroup.add(ledLight);
    allLights.push({ light: ledLight, type: 'accent', baseIntensity: 0.5, baseColor: 0xffffff });
    
    // Add accent LED strips along counter edge
    const stripLight1 = new THREE.PointLight(0xffd700, 0.3, 2);
    stripLight1.position.set(-2, 1.15, -12);
    counterGroup.add(stripLight1);
    allLights.push({ light: stripLight1, type: 'accent', baseIntensity: 0.3, baseColor: 0xffd700 });
    
    const stripLight2 = new THREE.PointLight(0xffd700, 0.3, 2);
    stripLight2.position.set(2, 1.15, -12);
    counterGroup.add(stripLight2);
    allLights.push({ light: stripLight2, type: 'accent', baseIntensity: 0.3, baseColor: 0xffd700 });
    
    scene.add(counterGroup);
}

// Create wall-mounted displays and mirrors
function createWallDisplays() {
    // Wall display case REMOVED - was creating golden board above payment counter area
    
    // Mirror
    const mirrorGeometry = new THREE.BoxGeometry(1.5, 2, 0.05);
    const mirrorMaterial = new THREE.MeshStandardMaterial({
        color: 0xe0e0e0,
        roughness: 0,
        metalness: 1
    });
    const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    mirror.position.set(10, 2, -14.8);
    scene.add(mirror);
    
    // Wall shelves
    for (let i = 0; i < 3; i++) {
        const shelfGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.3);
        const shelfMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.7,
            metalness: 0.1
        });
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        shelf.position.set(-10, 2 + (i * 0.8), -14.8);
        scene.add(shelf);
    }
}

// Create security system
function createSecuritySystem() {
    // Security cameras
    const cameraPositions = [
        { x: -10, y: 6, z: -10 },
        { x: 10, y: 6, z: -10 },
        { x: 0, y: 6, z: 10 }
    ];
    
    cameraPositions.forEach(pos => {
        const cameraGroup = new THREE.Group();
        
        // Camera body
        const bodyGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.2);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.3,
            metalness: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        cameraGroup.add(body);
        
        // Camera lens
        const lensGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.05, 8);
        const lensMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.1,
            metalness: 0.9
        });
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        lens.rotation.x = Math.PI / 2;
        lens.position.z = 0.1;
        cameraGroup.add(lens);
        
        cameraGroup.position.set(pos.x, pos.y, pos.z);
        cameraGroup.lookAt(0, 0, 0);
        scene.add(cameraGroup);
    });
    
    // Motion sensor
    const sensorGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const sensorMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0xff0000,
        emissiveIntensity: 0.2
    });
    const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
    sensor.position.set(0, 7.5, 0);
    scene.add(sensor);
}

// Create customer seating area (moved to side for boutique layout)
function createSeatingArea() {
    // Luxury chairs positioned for consultation area
    const chairPositions = [
        { x: -3, z: 6 },
        { x: 3, z: 6 }
    ];
    
    chairPositions.forEach(pos => {
        const chairGroup = new THREE.Group();
        
        // Seat
        const seatGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.6);
        const seatMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a4a4a,
            roughness: 0.5,
            metalness: 0.2
        });
        const seat = new THREE.Mesh(seatGeometry, seatMaterial);
        seat.position.y = 0.5;
        chairGroup.add(seat);
        
        // Backrest
        const backGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.1);
        const back = new THREE.Mesh(backGeometry, seatMaterial);
        back.position.set(0, 0.9, -0.25);
        chairGroup.add(back);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c2c2c,
            roughness: 0.3,
            metalness: 0.7
        });
        
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            const x = (i % 2 === 0 ? -0.25 : 0.25);
            const z = (i < 2 ? -0.25 : 0.25);
            leg.position.set(x, 0.25, z);
            chairGroup.add(leg);
        }
        
        chairGroup.position.set(pos.x, 0, pos.z);
        scene.add(chairGroup);
    });
    
    // Coffee table between chairs
    const tableGroup = new THREE.Group();
    
    const tableTopGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.6);
    const tableMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c1810,
        roughness: 0.4,
        metalness: 0.3
    });
    const tableTop = new THREE.Mesh(tableTopGeometry, tableMaterial);
    tableTop.position.y = 0.5;
    tableGroup.add(tableTop);
    
    // Table legs
    const tableLegGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8);
    const tableLegMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.3,
        metalness: 0.8
    });
    
    for (let i = 0; i < 4; i++) {
        const leg = new THREE.Mesh(tableLegGeometry, tableLegMaterial);
        const x = (i % 2 === 0 ? -0.5 : 0.5);
        const z = (i < 2 ? -0.25 : 0.25);
        leg.position.set(x, 0.25, z);
        tableGroup.add(leg);
    }
    
    tableGroup.position.set(0, 0, 7);
    scene.add(tableGroup);
}

// Create signage and price displays
function createSignage() {
    // Store sign REMOVED - was golden board floating above payment counter
    
    // Price display stands
    const pricePositions = [
        { x: -8, z: -5 },
        { x: 0, z: -5 },
        { x: 8, z: -5 }
    ];
    
    pricePositions.forEach(pos => {
        const priceGroup = new THREE.Group();
        
        // Price tag
        const tagGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.01);
        const tagMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.1
        });
        const tag = new THREE.Mesh(tagGeometry, tagMaterial);
        tag.position.set(0, 1.2, 0.5);
        priceGroup.add(tag);
        
        // Stand
        const standGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 8);
        const standMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.3,
            metalness: 0.8
        });
        const stand = new THREE.Mesh(standGeometry, standMaterial);
        stand.position.y = 1.05;
        priceGroup.add(stand);
        
        priceGroup.position.set(pos.x, 0, pos.z);
        scene.add(priceGroup);
    });
}

// Create lighting fixtures and chandeliers
function createLightingFixtures() {
    // Premium crystal chandelier
    const chandelierGroup = new THREE.Group();
    
    // Main frame
    const frameGeometry = new THREE.RingGeometry(0.8, 1, 16);
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.05,
        metalness: 0.95,
        emissive: 0xffd700,
        emissiveIntensity: 0.05
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.rotation.x = Math.PI / 2;
    chandelierGroup.add(frame);
    
    // Upper decorative ring
    const upperRing = new THREE.Mesh(
        new THREE.RingGeometry(0.6, 0.7, 16),
        frameMaterial
    );
    upperRing.rotation.x = Math.PI / 2;
    upperRing.position.y = 0.3;
    chandelierGroup.add(upperRing);
    
    // Crystal pendants with varying sizes
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 0.9 + (i % 3) * 0.1;
        const size = 0.04 + (i % 2) * 0.02;
        
        const crystalGeometry = new THREE.OctahedronGeometry(size, 0);
        const crystalMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9,
            roughness: 0,
            metalness: 0,
            clearcoat: 1,
            clearcoatRoughness: 0,
            transmission: 1,
            ior: 2.4,
            reflectivity: 0.9
        });
        const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
        crystal.position.x = Math.cos(angle) * radius;
        crystal.position.z = Math.sin(angle) * radius;
        crystal.position.y = -0.2 - (i % 3) * 0.1;
        chandelierGroup.add(crystal);
    }
    
    // Multiple light sources for realistic chandelier
    const centerLight = new THREE.PointLight(0xfff5e6, 1.2, 15);
    centerLight.position.y = -0.3;
    // centerLight.castShadow = true; // Removed for performance
    chandelierGroup.add(centerLight);
    
    // Surrounding lights
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const surroundLight = new THREE.PointLight(0xffffff, 0.4, 8);
        surroundLight.position.x = Math.cos(angle) * 0.5;
        surroundLight.position.z = Math.sin(angle) * 0.5;
        surroundLight.position.y = -0.1;
        chandelierGroup.add(surroundLight);
    }
    
    // Hanging chains
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const chainGeometry = new THREE.CylinderGeometry(0.005, 0.005, 2, 8);
        const chainMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            roughness: 0.1,
            metalness: 0.9
        });
        const chain = new THREE.Mesh(chainGeometry, chainMaterial);
        chain.position.x = Math.cos(angle) * 0.3;
        chain.position.z = Math.sin(angle) * 0.3;
        chain.position.y = 1;
        chandelierGroup.add(chain);
    }
    
    chandelierGroup.position.set(0, 7.5, 0);
    scene.add(chandelierGroup);
    
    // Additional pendant lights
    createPendantLights();
}

// Create additional pendant lights
function createPendantLights() {
    const pendantPositions = [
        { x: -6, y: 6, z: -6 },
        { x: 6, y: 6, z: -6 },
        { x: -6, y: 6, z: 6 },
        { x: 6, y: 6, z: 6 }
    ];
    
    pendantPositions.forEach(pos => {
        const pendantGroup = new THREE.Group();
        
        // Pendant cord
        const cordGeometry = new THREE.CylinderGeometry(0.002, 0.002, 1.5, 8);
        const cordMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c2c2c,
            roughness: 0.5,
            metalness: 0.3
        });
        const cord = new THREE.Mesh(cordGeometry, cordMaterial);
        cord.position.y = 0.75;
        pendantGroup.add(cord);
        
        // Pendant shade
        const shadeGeometry = new THREE.ConeGeometry(0.2, 0.3, 16);
        const shadeMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c1810,
            roughness: 0.3,
            metalness: 0.2,
            side: THREE.BackSide
        });
        const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
        shade.position.y = 0.15;
        pendantGroup.add(shade);
        
        // Light source
        const pendantLight = new THREE.PointLight(0xfff5e6, 0.8, 6);
        pendantLight.position.y = 0;
        // pendantLight.castShadow = true; // Removed for performance
        pendantGroup.add(pendantLight);
        
        pendantGroup.position.set(pos.x, pos.y, pos.z);
        scene.add(pendantGroup);
    });
}

// Create storage cabinets and work area
function createStorageArea() {
    // Storage cabinets
    const cabinetPositions = [
        { x: -12, z: 10 },
        { x: -10, z: 10 }
    ];
    
    cabinetPositions.forEach(pos => {
        const cabinetGroup = new THREE.Group();
        
        // Cabinet body
        const cabinetGeometry = new THREE.BoxGeometry(1.5, 2, 0.6);
        const cabinetMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c2c2c,
            roughness: 0.4,
            metalness: 0.5
        });
        const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
        cabinet.position.y = 1;
        cabinetGroup.add(cabinet);
        
        // Drawers
        for (let i = 0; i < 4; i++) {
            const drawerGeometry = new THREE.BoxGeometry(1.4, 0.4, 0.05);
            const drawerMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                roughness: 0.3,
                metalness: 0.7
            });
            const drawer = new THREE.Mesh(drawerGeometry, drawerMaterial);
            drawer.position.set(0, 0.3 + (i * 0.5), 0.3);
            cabinetGroup.add(drawer);
        }
        
        cabinetGroup.position.set(pos.x, 0, pos.z);
        scene.add(cabinetGroup);
    });
    
    // Work bench
    const benchGroup = new THREE.Group();
    
    const benchGeometry = new THREE.BoxGeometry(2, 0.1, 1);
    const benchMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c1810,
        roughness: 0.6,
        metalness: 0.2
    });
    const bench = new THREE.Mesh(benchGeometry, benchMaterial);
    bench.position.y = 0.9;
    benchGroup.add(bench);
    
    // Work tools
    const toolGeometry = new THREE.BoxGeometry(0.1, 0.02, 0.3);
    const toolMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b7355,
        roughness: 0.5,
        metalness: 0.3
    });
    const tool = new THREE.Mesh(toolGeometry, toolMaterial);
    tool.position.set(0.3, 0.96, 0.2);
    tool.rotation.z = Math.PI / 6;
    benchGroup.add(tool);
    
    benchGroup.position.set(12, 0, 10);
    scene.add(benchGroup);
}

// Create grand entrance gate attached to front wall
function createEntranceGate() {
    const entranceGroup = new THREE.Group();
    
    // Create gate frame structure
    createGateFrame(entranceGroup);
    
    // Create luxury glass door
    createGlassDoor(entranceGroup);
    
    // Create entrance lighting
    createEntranceLighting(entranceGroup);
    
    // Create entrance signage
    createEntranceSignage(entranceGroup);
    
    // Position entrance attached to front wall
    entranceGroup.position.set(0, 0, 19.8);
    entranceGroup.rotation.y = Math.PI;
    scene.add(entranceGroup);
}

// Create gate frame structure
function createGateFrame(parent) {
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.1,
        metalness: 0.9
    });
    
    // Main vertical posts
    const postGeometry = new THREE.BoxGeometry(0.3, 8, 0.3);
    
    const leftPost = new THREE.Mesh(postGeometry, frameMaterial);
    leftPost.position.set(-2.5, 4, 0);
    parent.add(leftPost);
    
    const rightPost = new THREE.Mesh(postGeometry, frameMaterial);
    rightPost.position.set(2.5, 4, 0);
    parent.add(rightPost);
    
    // Top horizontal beam
    const topBeamGeometry = new THREE.BoxGeometry(5.3, 0.4, 0.3);
    const topBeam = new THREE.Mesh(topBeamGeometry, frameMaterial);
    topBeam.position.set(0, 7.8, 0);
    parent.add(topBeam);
    
    // Decorative elements
    const decorMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.05,
        metalness: 0.95
    });
    
    // Top decorative finials
    const finialGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const leftFinial = new THREE.Mesh(finialGeometry, decorMaterial);
    leftFinial.position.set(-2.5, 8.1, 0);
    parent.add(leftFinial);
    
    const rightFinial = new THREE.Mesh(finialGeometry, decorMaterial);
    rightFinial.position.set(2.5, 8.1, 0);
    parent.add(rightFinial);
    
    // Side decorative panels
    const panelGeometry = new THREE.BoxGeometry(0.05, 6, 0.2);
    const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c1810,
        roughness: 0.6,
        metalness: 0.2
    });
    
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    leftPanel.position.set(-2.15, 4, 0);
    parent.add(leftPanel);
    
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    rightPanel.position.set(2.15, 4, 0);
    parent.add(rightPanel);
}

// Create luxury glass door
function createGlassDoor(parent) {
    const doorGroup = new THREE.Group();
    
    // Door frame
    const doorFrameMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.1,
        metalness: 0.9
    });
    
    // Door frame parts
    const frameThickness = 0.1;
    const doorWidth = 2.2;
    const doorHeight = 3.5;
    
    // Left frame
    const leftFrame = new THREE.Mesh(
        new THREE.BoxGeometry(frameThickness, doorHeight, frameThickness),
        doorFrameMaterial
    );
    leftFrame.position.set(-doorWidth/2 - frameThickness/2, doorHeight/2, 0);
    doorGroup.add(leftFrame);
    
    // Right frame
    const rightFrame = new THREE.Mesh(
        new THREE.BoxGeometry(frameThickness, doorHeight, frameThickness),
        doorFrameMaterial
    );
    rightFrame.position.set(doorWidth/2 + frameThickness/2, doorHeight/2, 0);
    doorGroup.add(rightFrame);
    
    // Top frame
    const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(doorWidth + frameThickness*2, frameThickness, frameThickness),
        doorFrameMaterial
    );
    topFrame.position.set(0, doorHeight - frameThickness/2, 0);
    doorGroup.add(topFrame);
    
    // Bottom frame
    const bottomFrame = new THREE.Mesh(
        new THREE.BoxGeometry(doorWidth + frameThickness*2, frameThickness, frameThickness),
        doorFrameMaterial
    );
    bottomFrame.position.set(0, frameThickness/2, 0);
    doorGroup.add(bottomFrame);
    
    // Glass panel
    const glassGeometry = new THREE.PlaneGeometry(doorWidth, doorHeight - frameThickness*2);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transmission: 0.9,
        ior: 1.5
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.set(0, doorHeight/2, 0);
    doorGroup.add(glass);
    
    // Door handle
    createDoorHandle(doorGroup, doorWidth, doorHeight);
    
    parent.add(doorGroup);
}

// Create door handle
function createDoorHandle(parent, doorWidth, doorHeight) {
    const handleMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.1,
        metalness: 0.9
    });
    
    // Handle base
    const handleBaseGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 16);
    const handleBase = new THREE.Mesh(handleBaseGeometry, handleMaterial);
    handleBase.position.set(doorWidth/2 - 0.2, doorHeight/2, 0.05);
    handleBase.rotation.z = Math.PI / 2;
    parent.add(handleBase);
    
    // Handle lever
    const handleLeverGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 16);
    const handleLever = new THREE.Mesh(handleLeverGeometry, handleMaterial);
    handleLever.position.set(doorWidth/2 - 0.2, doorHeight/2 + 0.1, 0.05);
    handleLever.rotation.x = Math.PI / 2;
    parent.add(handleLever);
    
    // Lock mechanism
    const lockGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.05);
    const lock = new THREE.Mesh(lockGeometry, handleMaterial);
    lock.position.set(doorWidth/2 - 0.2, doorHeight/2 - 0.3, 0.05);
    parent.add(lock);
}

// Create entrance lighting
function createEntranceLighting(parent) {
    // Welcome lights with proper mounting to gate structure
    const welcomeLight1 = new THREE.PointLight(0xffd700, 1.0, 8);
    welcomeLight1.position.set(-2, 6, 1);
    
    // Add mounting bracket for welcome light 1
    const welcomeBracket1Geometry = new THREE.BoxGeometry(0.15, 0.1, 0.1);
    const welcomeBracket1Material = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.4,
        metalness: 0.8
    });
    const welcomeBracket1 = new THREE.Mesh(welcomeBracket1Geometry, welcomeBracket1Material);
    welcomeBracket1.position.set(-2, 6.5, 1);
    parent.add(welcomeBracket1);
    
    parent.add(welcomeLight1);
    allLights.push({ light: welcomeLight1, type: 'accent', baseIntensity: 1.0, baseColor: 0xffd700 });
    
    const welcomeLight2 = new THREE.PointLight(0xffd700, 1.0, 8);
    welcomeLight2.position.set(2, 6, 1);
    
    // Add mounting bracket for welcome light 2
    const welcomeBracket2 = new THREE.Mesh(welcomeBracket1Geometry, welcomeBracket1Material);
    welcomeBracket2.position.set(2, 6.5, 1);
    parent.add(welcomeBracket2);
    
    parent.add(welcomeLight2);
    allLights.push({ light: welcomeLight2, type: 'accent', baseIntensity: 1.0, baseColor: 0xffd700 });
    
    // Ground lighting with proper floor mounting
    const groundLightGeometry = new THREE.RectAreaLight(0xffffff, 0.5, 4, 0.1);
    const groundLight = new THREE.RectAreaLight(0xffffff, 0.5, 4, 0.1);
    groundLight.position.set(0, 0.1, 0.5);
    groundLight.rotation.x = -Math.PI / 2;
    
    // Add floor mount for ground light
    const groundMountGeometry = new THREE.BoxGeometry(4.1, 0.02, 0.2);
    const groundMountMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c2c2c,
        roughness: 0.6,
        metalness: 0.5
    });
    const groundMount = new THREE.Mesh(groundMountGeometry, groundMountMaterial);
    groundMount.position.set(0, 0.01, 0.5);
    parent.add(groundMount);
    
    parent.add(groundLight);
    allLights.push({ light: groundLight, type: 'wallwash', baseIntensity: 0.5, baseColor: 0xffffff });
}

// Create entrance signage
function createEntranceSignage(parent) {
    // "Icing on the Neck" sign on gate - REMOVED (golden board)
    
    // "Welcome" sign
    const welcomeGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.05);
    const welcomeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.3,
        emissive: 0xffffff,
        emissiveIntensity: 0.05
    });
    const welcomeSign = new THREE.Mesh(welcomeGeometry, welcomeMaterial);
    welcomeSign.position.set(0, 2, 0.2);
    parent.add(welcomeSign);
    
    // Open/Closed sign indicator
    const indicatorLight = new THREE.PointLight(0x00ff00, 0.8, 3);
    indicatorLight.position.set(0, 5, 0.3);
    parent.add(indicatorLight);
    allLights.push({ light: indicatorLight, type: 'accent', baseIntensity: 0.8, baseColor: 0x00ff00 });
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Control functions
function resetCamera() {
    camera.position.set(0, 5, 15);
    controls.reset();
}

function toggleLighting() {
    lightingEnabled = !lightingEnabled;
    scene.traverse((child) => {
        if (child instanceof THREE.Light && !(child instanceof THREE.AmbientLight)) {
            child.visible = lightingEnabled;
        }
    });
}

function toggleRotation() {
    autoRotate = !autoRotate;
    
    // Update button text to show current state
    const rotateBtn = document.querySelector('button[onclick="toggleRotation()"]');
    if (rotateBtn) {
        rotateBtn.textContent = autoRotate ? 'Stop Jewelry Rotation' : 'Rotate Jewelry';
        rotateBtn.style.background = autoRotate ? '#e74c3c' : '#4a90e2';
    }
    
    console.log('Jewelry rotation:', autoRotate ? 'ON' : 'OFF');
}

// Add keyboard shortcut for jewelry rotation (Space key)
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        toggleRotation();
    }
});

// Ambient lighting mode functions
function setAmbientMode(mode) {
    ambientMode = mode;
    updateAmbientLighting();
}

function updateAmbientLighting() {
    allLights.forEach(({ light, type, baseIntensity, baseColor }) => {
        switch (ambientMode) {
            case 'warm':
                if (type === 'ambient') {
                    light.color.setHex(0x2c1810);
                    light.intensity = baseIntensity * 1.3;
                } else if (type === 'accent') {
                    light.color.setHex(0xffa500);
                    light.intensity = baseIntensity * 1.2;
                } else {
                    light.color.setHex(0xffd700);
                    light.intensity = baseIntensity * 0.8;
                }
                break;
            case 'cool':
                if (type === 'ambient') {
                    light.color.setHex(0x1a2f4a);
                    light.intensity = baseIntensity * 1.2;
                } else if (type === 'accent') {
                    light.color.setHex(0x87ceeb);
                    light.intensity = baseIntensity * 1.1;
                } else {
                    light.color.setHex(0xe6f3ff);
                    light.intensity = baseIntensity * 0.9;
                }
                break;
            case 'romantic':
                if (type === 'ambient') {
                    light.color.setHex(0x4a1a2c);
                    light.intensity = baseIntensity * 0.7;
                } else if (type === 'accent') {
                    light.color.setHex(0xff69b4);
                    light.intensity = baseIntensity * 1.5;
                } else {
                    light.color.setHex(0xffb6c1);
                    light.intensity = baseIntensity * 0.6;
                }
                break;
            case 'lounge':
                if (type === 'ambient') {
                    light.color.setHex(0x0a0a0a);
                    light.intensity = baseIntensity * 0.3;
                } else if (type === 'accent' || type === 'sconce') {
                    // Cycle between purple, red, and blue for accent lights
                    const colorCycle = Math.floor(time * 0.5) % 3;
                    if (colorCycle === 0) {
                        light.color.setHex(0x9400d3); // Purple
                    } else if (colorCycle === 1) {
                        light.color.setHex(0xff0000); // Red
                    } else {
                        light.color.setHex(0x0066ff); // Blue
                    }
                    light.intensity = baseIntensity * 2.0;
                } else if (type === 'track') {
                    // Mix of indigo and blue for track lights
                    const trackCycle = Math.floor(time * 0.3) % 2;
                    light.color.setHex(trackCycle === 0 ? 0x4b0082 : 0x0066ff);
                    light.intensity = baseIntensity * 0.5;
                } else {
                    // Mix of violet and red for other lights
                    const otherCycle = Math.floor(time * 0.4) % 2;
                    light.color.setHex(otherCycle === 0 ? 0x8a2be2 : 0xff0040);
                    light.intensity = baseIntensity * 0.4;
                }
                break;
            default: // normal
                light.color.setHex(baseColor);
                light.intensity = baseIntensity;
                break;
        }
    });
    
    // Update scene background for different moods
    switch (ambientMode) {
        case 'warm':
            scene.background.setHex(0x2a1810);
            scene.fog.color.setHex(0x2a1810);
            break;
        case 'cool':
            scene.background.setHex(0x1a1a2e);
            scene.fog.color.setHex(0x1a1a2e);
            break;
        case 'romantic':
            scene.background.setHex(0x2a0a1a);
            scene.fog.color.setHex(0x2a0a1a);
            break;
        case 'lounge':
            scene.background.setHex(0x000000);
            scene.fog.color.setHex(0x000000);
            break;
        default:
            scene.background.setHex(0x1a1a2e);
            scene.fog.color.setHex(0x1a1a2e);
            break;
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    try {
        init();
    } catch (error) {
        console.error('Error initializing store:', error);
        // Hide loading screen even if there's an error
        document.getElementById('loading').style.display = 'none';
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ff6b6b;
            font-size: 18px;
            text-align: center;
            z-index: 300;
        `;
        errorDiv.innerHTML = '<h3>Store Loading Error</h3><p>Please refresh the page</p>';
        document.getElementById('container').appendChild(errorDiv);
    }
});
