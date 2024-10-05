//import { sourceMapsEnabled } from 'process';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//Creación de la escena, camara y canvas.
const w =  window.innerWidth;
const h =  window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 100);
camera.position.z = 6;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('Public/Textures/Eris.jpg');  // Ajusta el path según tu carpeta
//const asteroidTexture = textureLoader.load('Public/Textures/Eris.jpg');  // Ajusta el path según tu carpeta

//Creo objetos con Mesh.

//color
//const sunmaterial = new THREE.MeshBasicMaterial({color: 0xFFD700})
const asteroidmaterial = new THREE.MeshBasicMaterial({color: 0x4B4B4B})

const sunmaterial = new THREE.MeshBasicMaterial({map: sunTexture})

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(3,16,16), sunmaterial
)

const asteroid = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,0.2,20), asteroidmaterial
)

//Puedo mover los objetos en la escena modificando la posición
asteroid.position.x = 15
asteroid.position.y = 1
sun.position.x = -3

scene.add(asteroid, sun)

//NOTE - sun light (point light)
const sunLight = new THREE.PointLight(0xffffff, 4, 300);
scene.add(sunLight);
//////////////////////////////////////

//////////////////////////////////////
//NOTE - ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);
//Construyo catálogo de objetos quemado

const objectCatalog = {
    asteroid: {
      name: "1566 Icarus (1949 MA)",
      magnitude: "16.57",
      tipo: "NEO",
    },
    sun: {
      name: "Sol",
      magnitude: "-100",
      tipo: "Estrella",
    }
  };

asteroid.name = "asteroid";
sun.name      = 'sun';

// Raycaster para detectar clics
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Función para detectar clic
function onMouseClick(event) {
    // Calcular la posición del mouse en coordenadas normalizadas (-1 a 1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Actualizar el raycaster con la cámara y la posición del mouse
    raycaster.setFromCamera(mouse, camera);

    // Detectar intersecciones con los objetos en la escena
    const intersects = raycaster.intersectObjects([asteroid, sun]);

    // Si hay intersección
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        // Obtener información del catálogo basada en el nombre del objeto
        const info = objectCatalog[clickedObject.name];
    
        // Crear un label o un popup con la información
        if (info) {
          const label = document.createElement('div');
          label.style.position = 'absolute';
          label.style.color = 'white';
          label.style.backgroundColor = 'black';
          label.style.padding = '10px';
          label.innerHTML = `
            <strong>${info.name}</strong><br>
            ${info.magnitude}<br>
            ${info.tipo}
          `;
          label.style.left = `${event.clientX}px`;
          label.style.top = `${event.clientY}px`;
          document.body.appendChild(label);
    
          // Quitar el label después de 3 segundos
          setTimeout(() => {
            label.remove();
          }, 3000);
        }
      }
    }

window.addEventListener('click', onMouseClick);

// Agregar controles orbitales
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Efecto de suavizado
controls.dampingFactor = 0.05; // Valor de suavizado
controls.enableZoom = true; // Habilitar zoom con el mouse

// Animación
function animate() {
  requestAnimationFrame(animate);
  
  // Actualizar los controles orbitales
  controls.update();

  renderer.render(scene, camera);
}

animate();
