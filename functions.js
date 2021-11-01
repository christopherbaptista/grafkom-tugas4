import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js";

/** @type {THREE.PerspectiveCamera} */
let camera;
/** @type {THREE.Scene} */
let scene;
/** @type {THREE.WebGLRenderer} */
let renderer;

let sphere, material;
let count = 0,
  cubeCamera1,
  cubeCamera2,
  cubeRenderTarget1,
  cubeRenderTarget2;

(function init() {
  // three.js scene
  scene = new THREE.Scene();
  const color = 0xffffff; // white
  const near = 5;
  const far = 60;
  scene.fog = new THREE.Fog(color, near, far);

  //lights
  const ambientLight = new THREE.AmbientLight("white", 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 0.8);
  directionalLight.position.set(-20, 40, 80);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Camera
  camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100);
  camera.position.z = 5;

  // Skybox
  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    "assets/images/1_kY8Q5mqqqMz6r8YxcEcU6w.jpeg",
    () => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(renderer, texture);
      scene.background = rt.texture;
    }
  );

  // Cube
  const cubeTexture = new THREE.TextureLoader().load(
    "assets/images/texture-brick.png"
  );
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshPhongMaterial({
    color: 0xffb703,
    map: cubeTexture,
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(0, 1, 0);
  scene.add(cube);

  // Sand Worms
  const sandWorms = new GLTFLoader();
  sandWorms.load("assets/models/sandWorm/scene.gltf", (gltf) => {
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.position.set(0, 20, -3);
        node.scale.set(1.5, 1.5, 1.5);
      }
    });
    scene.add(gltf.scene);
  });

  // Ancient Ruins
  const ancientRuins = new GLTFLoader();
  ancientRuins.load("assets/models/ruins/scene.gltf", (gltf) => {
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.position.set(-0.5, 12, -1.5);
        node.scale.set(1, 1, 1);
      }
    });
    scene.add(gltf.scene);
  });

  // Dragons
  const dragons = new GLTFLoader();
  dragons.load("assets/models/dragon2/scene.gltf", (gltf) => {
    gltf.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.position.set(11, 1, -2.2);
        node.scale.set(1, 1, 1);
      }
    });
    scene.add(gltf.scene);
  });

  // Reflective
  cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    encoding: THREE.sRGBEncoding,
  });

  cubeCamera1 = new THREE.CubeCamera(1, 1000, cubeRenderTarget1);

  cubeRenderTarget2 = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    encoding: THREE.sRGBEncoding,
  });

  cubeCamera2 = new THREE.CubeCamera(1, 1000, cubeRenderTarget2);

  const refGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const refMaterial = new THREE.MeshBasicMaterial({
    envMap: cubeRenderTarget2.texture,
    combine: THREE.MultiplyOperation,
    reflectivity: 1,
  });
  const reflective = new THREE.Mesh(refGeometry, refMaterial);

  reflective.castShadow = true;
  reflective.receiveShadow = true;

  reflective.position.set(0, -0.35, 0);
  scene.add(reflective);

  // Render
  renderer = new THREE.WebGLRenderer({ antialias: true });

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement);

  function animation() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;

    if (count % 2 === 0) {
      cubeCamera1.update(renderer, scene);
    } else {
      cubeCamera2.update(renderer, scene);
    }

    count++;

    renderer.render(scene, camera);
    requestAnimationFrame(animation);
  }
  animation();
})();
