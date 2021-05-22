import { useEffect, useRef } from "react";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import "./App.css";

function App() {
  let mount = useRef(null);

  useEffect(() => {
    if (!mount.current) {
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      var renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      mount.appendChild(renderer.domElement);
      camera.position.setZ(30);

      var geometry = new THREE.TorusGeometry(10, 3, 16, 100);
      var material = new THREE.MeshStandardMaterial({ color: 0xff3647 });
      var torus = new THREE.Mesh(geometry, material);
      scene.add(torus);

      const pointLight = new THREE.PointLight(0xffffff);
      pointLight.position.set(5, 5, 5);
      const ambientLight = new THREE.AmbientLight(0xffffff);
      scene.add(pointLight, ambientLight);

      const lightHelper = new THREE.PointLightHelper(pointLight);
      const gridHelper = new THREE.GridHelper(200, 50);
      scene.add(lightHelper, gridHelper);

      const controls = new OrbitControls(camera, renderer.domElement);

      let loader = new GLTFLoader();
      loader.load(
        `${process.env.PUBLIC_URL}/assets/char.glb`,
        function (gltf) {
          console.log(gltf);
          let character = gltf.scene.children[0];
          character.position.set(0, 0, 0);
          character.scale.set(3, 3, 3);
          scene.add(gltf.scene);
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (error) {
          console.error(error);
        }
      );

      var animate = function () {
        requestAnimationFrame(animate);
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.005;
        torus.rotation.y += 0.01;

        controls.update();

        renderer.render(scene, camera);
      };
      animate();
    }
  }, [mount]);

  return (
    <div className="App">
      <div className="canvas" ref={(ref) => (mount = ref)} />
    </div>
  );
}

export default App;
