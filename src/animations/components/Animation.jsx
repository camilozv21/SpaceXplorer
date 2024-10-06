import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { GUI } from 'dat.gui';
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';

import starImg from '../constants/images/stars.jpg';
import sunImg from '../constants/images/sun.jpg';
import mercuryImg from '../constants/images/mercury.jpg';
import venusImg from '../constants/images/venus.jpg';
import earthImg from '../constants/images/earth.jpg';
import marsImg from '../constants/images/mars.jpg';
import jupiterImg from '../constants/images/jupiter.jpg';
import saturnImg from '../constants/images/saturn.jpg';
import uranusImg from '../constants/images/uranus.jpg';
import neptuneImg from '../constants/images/neptune.jpg';
import plutoImg from '../constants/images/pluto.jpg';
import saturnRingImg from '../constants/images/saturn_ring.png';
import uranusRingImg from '../constants/images/uranus_ring.png';
import { objectCatalog } from '../constants/objectCatalog';
import { useDisclosure } from '@mantine/hooks';
import InfoModal from './InfoModal';

// Definir variables globales
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let scene = new THREE.Scene();
// Factor de escala para exagerar la distancia entre órbitas
const scaleFactor = 1;

const Animation = () => {
  const mountRef = useRef(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [neoInfo, setNeoInfo] = useState(null);
  // const [options, setOptions] = useState({ 'Real view': true, 'Show path': true, speed: 1 });
  // const optionsRef = useRef({ 'Real view': true, 'Show path': true, speed: 1, 'Test':true });
  const optionsRef = useRef({ 'Real view': true, 'Show path': true, speed: 1, 'Celestial type': 'All' });
  const guiRef = useRef(null);

   const onCloseModal = () => {
    close();
  
    // Restablecer la posición de la cámara
    camera.position.set(-50, 90, 150);
    camera.lookAt(scene.position); // Asegúrate de que la cámara esté mirando hacia el centro de la escena
  
    // Actualizar el raycaster con la nueva posición de la cámara
    raycaster.setFromCamera(mouse, camera);
  
    // Restablecer la velocidad
    optionsRef.current.speed = 1;
    if (guiRef.current) {
      guiRef.current.__controllers.forEach(controller => {
        if (controller.property === 'speed') {
          controller.setValue(1);
        }
      });
    }
  };



  const onNeoSelected = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Actualizar el raycaster con la cámara y la posición del mouse
    raycaster.setFromCamera(mouse, camera);

    // Recopilar todos los objetos en la escena
    const objects = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        objects.push(child);
      }
    });

    // Detectar intersecciones con los objetos en la escena
    const intersects = raycaster.intersectObjects(objects);

    // Si hay intersección
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
  
        // Obtener información del catálogo basada en el nombre del objeto
        const info = objectCatalog[clickedObject.name];


    // Obtener coordenadas globales del objeto clicado
    const worldPosition = new THREE.Vector3();
    clickedObject.getWorldPosition(worldPosition);

    // Mostrar las coordenadas en la consola
    console.log(`Objeto clicado: ${clickedObject.name}`);
    console.log(`Coordenadas del objeto: x=${worldPosition.x}, y=${worldPosition.y}, z=${worldPosition.z}`);

        // Crear un label o un popup con la información
        if (info) {
          
          // setOptions((prevOptions) => ({ ...prevOptions, speed: 0 })); // Detener el movimiento
          optionsRef.current.speed = 0; // Detener el movimiento
          if (guiRef.current) {
            guiRef.current.__controllers.forEach(controller => {
              if (controller.property === 'speed') {
                controller.setValue(0);
              }
            });
          }

          camera.position.set(
            worldPosition.x,
            clickedObject.geometry.parameters.radius + 10,
            worldPosition.z,
          );
          // Orientar la cámara hacia el planeta seleccionado
          camera.lookAt(worldPosition);
          setNeoInfo(info);
          open();
        }
      }
    }

    const filterCelestialBodies = (type) => {
      scene.traverse((child) => {
        if (child.isMesh) {
          if (type === 'All') {
            child.visible = true;
          } else {
            const info = objectCatalog[child.name];
            if (info && info.type === type) {
              child.visible = true;
            } else {
              child.visible = false;
            }
          }
        }
      });
    };
  

  useEffect(() => {
    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Scene
    // const scene = new THREE.Scene();

    // Camera
    // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-50, 90, 150); // EFECTO ONCLOSE SETTEARLO 
    // camera.position.set(0,0,50);

    // Controls
    const orbit = new OrbitControls(camera, renderer.domElement);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const starTexture = textureLoader.load(starImg);
    const sunTexture = textureLoader.load(sunImg);
    const mercuryTexture = textureLoader.load(mercuryImg);
    const venusTexture = textureLoader.load(venusImg);
    const earthTexture = textureLoader.load(earthImg);
    const marsTexture = textureLoader.load(marsImg);
    const jupiterTexture = textureLoader.load(jupiterImg);
    const saturnTexture = textureLoader.load(saturnImg);
    const uranusTexture = textureLoader.load(uranusImg);
    const neptuneTexture = textureLoader.load(neptuneImg);
    const plutoTexture = textureLoader.load(plutoImg);
    const saturnRingTexture = textureLoader.load(saturnRingImg);
    const uranusRingTexture = textureLoader.load(uranusRingImg);

    // Background
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const cubeTexture = cubeTextureLoader.load([
      starImg,
      starImg,
      starImg,
      starImg,
      starImg,
      starImg,
    ]);
    scene.background = cubeTexture;
    // scene.background = starTexture;

    // Sun
    const sungeo = new THREE.SphereGeometry(15, 50, 50);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sun = new THREE.Mesh(sungeo, sunMaterial);
    sun.name = 'sun';
    sun.type = 'Star';
    scene.add(sun);

    // Lights
    const sunLight = new THREE.PointLight(0xffffff, 4, 300);
    scene.add(sunLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    scene.add(ambientLight);

    // Planet paths
    const path_of_planets = [];
    function createLineLoopWithMesh(radius, color, width) {
      const material = new THREE.LineBasicMaterial({ color, linewidth: width });
      const geometry = new THREE.BufferGeometry();
      const lineLoopPoints = [];
      const numSegments = 100;
      for (let i = 0; i <= numSegments; i++) {
        const angle = (i / numSegments) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        lineLoopPoints.push(x, 0, z);
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(lineLoopPoints, 3));
      const lineLoop = new THREE.LineLoop(geometry, material);
      scene.add(lineLoop);
      path_of_planets.push(lineLoop);
    }

    // Generate planets
    const genratePlanet = (type, name, size, planetTexture, x, ring) => {
      const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
      const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      const planetObj = new THREE.Object3D();
      planet.position.set(x * scaleFactor, 0, 0);
      planet.name = name;
      planet.type = type;

      if (ring) {
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
        const ringMat = new THREE.MeshBasicMaterial({ map: ring.ringmat, side: THREE.DoubleSide });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        planetObj.add(ringMesh);
        ringMesh.position.set(x * scaleFactor, 0, 0);
        ringMesh.rotation.x = -0.5 * Math.PI;
      }
      scene.add(planetObj);
      planetObj.add(planet);
      createLineLoopWithMesh(x * scaleFactor, 0xffffff, 3);
      return { planetObj, planet };
    };

    const planets = [
      { ...genratePlanet('Planet', 'mercury', 3.2, mercuryTexture, 28), rotaing_speed_around_sun: 0.004, self_rotation_speed: 0.004 },
      { ...genratePlanet('Planet', 'venus', 5.8, venusTexture, 44), rotaing_speed_around_sun: 0.015, self_rotation_speed: 0.002 },
      { ...genratePlanet('Planet', 'earth', 6, earthTexture, 62), rotaing_speed_around_sun: 0.01, self_rotation_speed: 0.02 },
      { ...genratePlanet('Planet', 'mars', 4, marsTexture, 78), rotaing_speed_around_sun: 0.008, self_rotation_speed: 0.018 },
      { ...genratePlanet('Planet', 'jupiter', 12, jupiterTexture, 100), rotaing_speed_around_sun: 0.002, self_rotation_speed: 0.04 },
      { ...genratePlanet('Planet', 'saturn', 10, saturnTexture, 138, { innerRadius: 10, outerRadius: 20, ringmat: saturnRingTexture }), rotaing_speed_around_sun: 0.0009, self_rotation_speed: 0.038 },
      { ...genratePlanet('Planet', 'uranus', 7, uranusTexture, 176, { innerRadius: 7, outerRadius: 12, ringmat: uranusRingTexture }), rotaing_speed_around_sun: 0.0004, self_rotation_speed: 0.03 },
      { ...genratePlanet('Planet', 'neptune', 7, neptuneTexture, 200), rotaing_speed_around_sun: 0.0001, self_rotation_speed: 0.032 },
      { ...genratePlanet('Planet', 'pluto', 2.8, plutoTexture, 216), rotaing_speed_around_sun: 0.0007, self_rotation_speed: 0.008 },
    ];

    const celestialTypes = ['All', 'Planeta', 'Estrella', 'Moon']; // Lista de tipos de cuerpos celestes

    // GUI
    const gui = new GUI();
    guiRef.current = gui;
    gui.add(optionsRef.current, 'Real view').onChange(e => { ambientLight.intensity = e ? 0 : 0.5; });
   // gui.add(optionsRef.current, 'Test').onChange(e => {path_of_planets.forEach(dpath => { dpath.visible = e; }) });
    gui.add(optionsRef.current, 'Show path').onChange(e => { path_of_planets.forEach(dpath => { dpath.visible = e; }); });
    const maxSpeed = new URL(window.location.href).searchParams.get('ms') * 1;
    gui.add(optionsRef.current, 'Celestial type', celestialTypes).onChange(value => {
      optionsRef.current['Celestial type'] = value;
      filterCelestialBodies(value); // Lógica para filtrar cuerpos celestes
    });
    gui.add(optionsRef.current, 'speed', 0, maxSpeed ? maxSpeed : 20).onChange(value => {
      optionsRef.current.speed = value;
    });

    // Animation
    const animate = time => {
      sun.rotateY(optionsRef.current.speed * 0.004);
      planets.forEach(({ planetObj, planet, rotaing_speed_around_sun, self_rotation_speed }) => {
        planetObj.rotateY(optionsRef.current.speed * rotaing_speed_around_sun);
        planet.rotateY(optionsRef.current.speed * self_rotation_speed);
      });

      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    // Resize event
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Add event listener for NEO selection
    const handleMouseClick = (event) => {
      onNeoSelected(event);
    };
    renderer.domElement.addEventListener('click', handleMouseClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // useEffect(() => {
  //   // if (options.speed === 0) {
  //     setOptions((prevOptions) => ({ ...prevOptions, speed: 0 }));
  //   // }
  // }, [options.speed]);

  return (
    <div ref={mountRef}>
      {neoInfo && (
        <InfoModal opened={opened} onClose={onCloseModal} neoInfo={neoInfo} />

      )}
    </div>
  );
};

export default Animation;