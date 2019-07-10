var scene, renderer, camera, render, d_light, material, mouse_light, mouse, raycaster;

init();
animate();

function init() {
    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.physicallyCorrectLights = true; // todo: Use this at the end!
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(0, 5, 20);
    camera.lookAt(scene.position);

    // Lights
    var light = new THREE.AmbientLight( 0x404040, 2 ); // soft white light
    scene.add( light );
    
    var p_light1 = createSpotLight(0xffffff, 15, 3, 5, 900);
    scene.add(p_light1);

    var p_light2 = createSpotLight(0xffffff, -15, 3, 5, 900);
    scene.add(p_light2);

    mouse_light = createSpotLight(0xffffff, 0, 0, 15, 800);
    scene.add(mouse_light);

    // Load Texture
    var tex_disp = new THREE.TextureLoader().load( "./images/texture/Slate_Rock_001_DISP.png" );
    tex_disp.wrapS = THREE.RepeatWrapping;
    tex_disp.wrapT = THREE.RepeatWrapping;
    var tex_norm = new THREE.TextureLoader().load( "./images/texture/Slate_Rock_001_NORM.jpg" );
    var tex_rough = new THREE.TextureLoader().load( "./images/texture/Slate_Rock_001_ROUGH.jpg" );
    var tex_color = new THREE.TextureLoader().load( "./images/texture/Slate_Rock_001_COLOR.jpg" );
    var tex_ao = new THREE.TextureLoader().load( "./images/texture/Slate_Rock_001_OCC.jpg" );

    // The Sphere
    var geo1 = new THREE.SphereGeometry(8, 28, 28);
    material = new THREE.MeshStandardMaterial( { color: 0xff00ff} );
    material.roughness = 1;
    material.metalness = 0.4;
    material.displacementMap = tex_disp;
    material.normalMap = tex_norm;
    material.roughnessMap = tex_rough;
    material.bumpMap = tex_rough;
    material.map = tex_color;
    material.emissiveMap = tex_color;
    material.aoMap = tex_ao;
    var sphere = new THREE.Mesh( geo1, material );
    sphere.name = 'sphere';
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add( sphere );

    // The plane
    var plane1 = new THREE.PlaneGeometry(100, 100);
    var plane1_mat = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide, roughness: 0.65});
    plane1_mat.roughness = 0.15;
    plane1_mat.metalness = 0.4;
    var plane_mesh = new THREE.Mesh(plane1, plane1_mat);
    plane_mesh.receiveShadow = true;
    plane_mesh.name = "plane";
    plane_mesh.rotation.x = Math.PI/2;
    // scene.add( plane_mesh );
  

    // HELPERS
    // controls = new THREE.OrbitControls(camera, renderer.domElement);
    // var gridHelper = new THREE.GridHelper( 10, 20 );
    // scene.add( gridHelper );

    // Raycaster: Mouse check
    // raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('deviceorientation', onDeviceMove, false);
    document.addEventListener('mousemove', onMouseMove, false);

}


// Render & Animation
function animate() {
    my_sphere = scene.getObjectByName('sphere');
    my_sphere.rotation.y += 0.005;
    // controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

/* All functions */

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
}

function onMouseMove(event) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    mouse_light.position.x = 12 * mouse.x;
    mouse_light.position.y = 12 * mouse.y;

    // console.log(mouse);
    // raycaster.setFromCamera(mouse, camera);

    // To check for intersection
    // var intersects = raycaster.intersectObjects(scene.children, true);
    // for (var i = 0; i < intersects.length; i++){
    //     console.log(intersects[i]);
        
    // }
}

// For device orientation
function onDeviceMove(event) {
    mouse_light.position.x = event.alpha * 0.4;
    mouse_light.position.y = (event.beta - 60) / 1.66;
}

// Light helper function
function createSpotLight(color, x, y, z, power) {
    _light = new THREE.SpotLight(color);
    _light.intensity = 2;
    _light.power = power;
    _light.penumbra = 0.8;
    _light.decay = 2;
    _light.position.set(x, y, z);
    _light.castShadow = true;
    return _light;
}