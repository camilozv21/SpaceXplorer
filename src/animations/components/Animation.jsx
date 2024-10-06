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
import asteroidImg from '../constants/images/asteroid.jpg';
import { objectCatalog } from '../constants/objectCatalog';
import { useDisclosure } from '@mantine/hooks';
import InfoModal from './InfoModal';
import { cameraPosition } from 'three/webgpu';
import data from '../constants/data.json';
import dataPlanets from '../constants/dataPlanets.json';

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
  const optionsRef = useRef({ 'Real view': true, 'Show path': true, 'Show labels': true, 'Show NEO Orbit': true, speed: 1, 'Orbit type': 'All','Object type':'All' });
  //const optionsRef = useRef({ 'Real view': true, 'Show path': true, speed: 1 });
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

    toggleLabels(true);
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
      const info = objectCatalog[clickedObject.name] ? objectCatalog[clickedObject.name] : data.near_earth_objects.find(obj => obj.data.name === clickedObject.name);

      // Obtener coordenadas globales del objeto clicado
      const worldPosition = new THREE.Vector3();
      //Variable de control para velocidad de transición
      const transitionSpeed = 0.01;
      clickedObject.geometry.parameters.radius + 10
      clickedObject.getWorldPosition(worldPosition);

      // Crear un label o un popup con la información
      if (info) {

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

        toggleLabels(false);

        camera.position.set(
          worldPosition.x,
          clickedObject.geometry.parameters.radius + 10,
          worldPosition.z,
        );
        // Orientar la cámara hacia el Planet seleccionado
        camera.lookAt(worldPosition);
        setNeoInfo(info);
        open();
      }
    }
  }

  const filterOrbitType = (type) => {
    scene.traverse((child) => {
    if (child.isMesh) {
      if (type === 'All') {
        child.visible = true;
      } else {
        const info = objectCatalog[child.name];
        const neoData = data.near_earth_objects.find(obj => obj.data.name === child.name);

        if (info && info.type === type) {
          child.visible = true;
        } else if (neoData && neoData.data.orbit_class_type === type) {
          child.visible = true;
        } else {
          child.visible = false;
        }
      }
    }
  });

  };

  const filterObjectType = (type) => {
    scene.traverse((child) => {
    if (child.isMesh) {
      if (type === 'All') {
        child.visible = true;
      } else {
        const info = objectCatalog[child.name];
        const neoData = data.near_earth_objects.find(obj => obj.data.name === child.name);

        if (info && info.type === type) {
          child.visible = true;
        } else if (neoData && neoData.data.orbit_class_type === type) {
          child.visible = true;
        } else {
          child.visible = false;
        }
      }
    }
  });

  };

  const toggleLabels = (showLabels) => {
    scene.traverse((child) => {
      if (child.isSprite) {
        child.visible = showLabels;
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
    camera.position.set(-50, 90, 150);
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
    const asteroidTexture = textureLoader.load(asteroidImg);

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

    const createLabel = (name, position) => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;  // Set canvas width before drawing anything
      canvas.height = 128;
      const context = canvas.getContext('2d');

      context.fillStyle = 'transparent';  // Set the background color
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.font = 'bold 100px Arial';  // Set font properties after canvas width
      context.fillStyle = 'white';
      context.fillText(name, 20, 64);  // Draw the name on the canvas at a visible position

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      const labelMaterial = new THREE.SpriteMaterial({ map: texture });
      const labelSprite = new THREE.Sprite(labelMaterial);
      labelSprite.scale.set(10, 5, 1);  // Adjust size as necessary
      labelSprite.position.copy(position);  // Set position to match the planet

      return labelSprite;
    };


    // Generate planets  //Crear que el Planet tenga una etiqueta al momento de que se renderiza. 
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
      planetObj.add(planet);
      scene.add(planetObj);

      const labelSprite = createLabel(name, planet.position.clone().add(new THREE.Vector3(0, size + 5, 0)));
      //const labelSprite = createLabel(name, planet.position.clone());
      // scene.add(labelSprite);
      planetObj.add(labelSprite);

      createLineLoopWithMesh(x * scaleFactor, 0xffffff, 3);
      return { planetObj, planet, labelSprite };
    };

    // Función para crear un asteroide con una forma deformada
    function createDeformedAsteroid(size, name) {
      const geometry = new THREE.SphereGeometry(size, 8, 8); // menor resolución para deformar
      const asteroidmaterial = new THREE.MeshBasicMaterial({ map: asteroidTexture });
      const material = asteroidmaterial;

      // Deformar el objeto (puedes modificar los valores de la escala)
      const asteroid = new THREE.Mesh(geometry, material);
      asteroid.scale.set(
        1 + Math.random() * 0.3, // Deformación aleatoria en el eje x
        1 + Math.random() * 0.3, // Deformación aleatoria en el eje y
        1 + Math.random() * 0.3  // Deformación aleatoria en el eje z
      );

      asteroid.name = name

      return asteroid;
    }

    // Crear 10 NEOs
    const neoCount = 7;
    const neos = [];
    const path_of_neos = []

    for (let i = 0; i < neoCount; i++) {
      const neo = createDeformedAsteroid(1, data.near_earth_objects[i].data.name); // Tamaño del NEO
      // Generar un radio de órbita aleatorio
      const neoOrbitRadius = Math.random() * 80 + 40; // Rango de radio entre 10 y 30
      const angleOffset = Math.random() * Math.PI * 2; // Desfase angular aleatorio

      // Asignar la posición inicial en su órbita circular
      neo.position.x = neoOrbitRadius * Math.cos(angleOffset);
      neo.position.z = neoOrbitRadius * Math.sin(angleOffset);

      // Guardar el radio de órbita y el desfase angular en el NEO
      neo.neoOrbitRadius = neoOrbitRadius;
      neo.angleOffset = angleOffset;
      createNEOOrbit(neo);

      neos.push(neo); // Guardar el NEO en el array
      scene.add(neo); // Añadir el NEO a la escena


    }


    // Create NEO Orbit
    function createNEOOrbit(neo) {

      const radius = neo.neoOrbitRadius;
      const color = 0xff0000; // Color of the orbit
      const width = 3; // Width of the orbit line

      const material = new THREE.LineBasicMaterial({ color: color, linewidth: width });
      const geometry = new THREE.BufferGeometry();
      const lineLoopPoints = [];
      const numSegments = 100; // Puedes ajustar este valor si es necesario
      // Generate points for the elliptical orbit
      for (let i = 0; i < Math.min(numSegments, 100); i++) {

        const angle = (i / numSegments) * Math.PI * 2;
        // Define semi-axes of the ellipse
        const semiMajorAxis = radius; // Semi-major axis
        const semiMinorAxis = radius * 0.6; // Semi-minor axis

        // Calculate the new position in the elliptical orbit
        const x = semiMajorAxis * Math.cos(angle);
        const z = semiMinorAxis * Math.sin(angle); // Inverted z for clockwise orbit

        lineLoopPoints.push(x, 0, z);
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(lineLoopPoints, 3));
      const lineLoop = new THREE.LineLoop(geometry, material);
      scene.add(lineLoop);
      path_of_neos.push(lineLoop);
    }


    // Función para animar los asteroides
    const animateAsteroids = () => {
      // neos.forEach((neo) => {

      //   // Actualizar la posición del NEO para que gire alrededor del sol
      //   neo.angleOffset += 0.01;  // Aumentamos el ángulo pero ajustaremos la dirección con coseno y seno
      //   // Invertir el sentido de la rotación cambiando el signo del seno
      //   neo.position.x = neo.neoOrbitRadius * Math.cos(neo.angleOffset);
      //   neo.position.z = neo.neoOrbitRadius * -Math.sin(neo.angleOffset);  // Cambiar el signo aquí para rotación inversa

      //   // Rotación del asteroide sobre su propio eje
      //   neo.rotation.x += 0.01; // Rotación en el eje X
      //   neo.rotation.y += 0.01; // Rotación en el eje Y
      //   neo.rotation.z += 0.01; // Rotación en el eje Z
      // });
      neos.forEach((neo) => {
        neo.angleOffset += 0.01 * optionsRef.current.speed;  // Avanzar el ángulo para la animación

        // Definir semi-ejes de la elipse
        const semiMajorAxis = neo.neoOrbitRadius; // Semi-eje mayor
        const semiMinorAxis = neo.neoOrbitRadius * 0.6; // Semi-eje menor (más pequeño que el mayor)

        // Calcular la nueva posición elíptica
        neo.position.x = semiMajorAxis * Math.cos(neo.angleOffset);
        neo.position.z = semiMinorAxis * -Math.sin(neo.angleOffset); // Órbita elíptica en eje z

        // Aquí podrías también cambiar el eje y para una órbita inclinada si es necesario
      });

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

    const asteroids = [
      { ...createDeformedAsteroid(3.3, '') }
    ]

    const orbitTypes = ['All', 'Apollo', 'Amor', 'Asteroid', 'Mars-Crossing Asteroid', 'Main-Belt Asteroid', 'TransNeptunian Object', 'Planet', 'Star', 'Moon']; // Lista de tipos de orbita
    const objectTypes = ['All',"NEO'S", "PHA'S"]; // Lista de tipos de objeto

    // GUI
    const gui = new GUI();
    guiRef.current = gui;
    gui.add(optionsRef.current, 'Real view').onChange(e => { ambientLight.intensity = e ? 0 : 0.5; });
    gui.add(optionsRef.current, 'Show NEO Orbit').onChange(e => { path_of_neos.forEach(dpath => { dpath.visible = e; }) });
    gui.add(optionsRef.current, 'Show path').onChange(e => { path_of_planets.forEach(dpath => { dpath.visible = e; }); });
    gui.add(optionsRef.current, 'Show labels').onChange(e => { toggleLabels(e); });
    const maxSpeed = new URL(window.location.href).searchParams.get('ms') * 1;
    gui.add(optionsRef.current, 'Orbit type', orbitTypes).onChange(value => {
      optionsRef.current['Orbit type'] = value;
      filterOrbitType(value); // Lógica para filtrar tipo de orbita
    });
    gui.add(optionsRef.current, 'Object type', objectTypes).onChange(value => {
      optionsRef.current['Object type'] = value;
      filterObjectType(value); // Lógica para filtrar tipos de objetos
    });
    gui.add(optionsRef.current, 'speed', 0, maxSpeed ? maxSpeed : 20).onChange(value => {
      optionsRef.current.speed = value;
    });

    // Animation
    const animate = time => {
      sun.rotateY(optionsRef.current.speed * 0.004);
      planets.forEach(({ planetObj, planet, rotaing_speed_around_sun, self_rotation_speed, labelSprite }) => {
        planetObj.rotateY(optionsRef.current.speed * rotaing_speed_around_sun);
        planet.rotateY(optionsRef.current.speed * self_rotation_speed);

        labelSprite.position.copy(planet.position);
        labelSprite.position.y += 15;

      });

      animateAsteroids();

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