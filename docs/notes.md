```javascript
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


{
  "near_earth_objects": [
    {
      "id": "2000433",
      "data": {
        "name": "433 Eros (A898 PA)",
        "absolute_magnitude_h": 10.41,
        "estimated_diameter": 22.0067027115,
        "is_potentially_hazardous_asteroid": false,
        "orbiting_body": "Earth",
        "first_observation_date": "1893-10-29",
        "orbit_class_type": "AMO",
        "orbit_class_description": "Near-Earth asteroid orbits which cross the Earth’s orbit similar to that of 1862 Apollo",
        "close_approach_data": {
          "close_approach_date": "2025-11-30",
          "kilometers_per_hour": "88305.5845",
          "miss_distance": {
            "astronomical": "0.3976474744",
            "lunar": "154.6848675416",
            "kilometers": "59487215.181119528",
            "miles": "36963641.4867163664"
          }
        }
      }
    },
    {
      "id": "2001566",
      "data": {
        "name": "1566 Icarus (1949 MA)",
        "absolute_magnitude_h": 16.57,
        "estimated_diameter": 1.2898968334,
        "is_potentially_hazardous_asteroid": true,
        "first_observation_date": "undefined",
        "orbiting_body": "Earth",
        "orbit_class_type": "APO",
        "orbit_class_description": "Near-Earth asteroid orbits which cross the Earth’s orbit similar to that of 1862 Apollo",
        "close_approach_data": {
          "close_approach_date": "2025-05-24",
          "kilometers_per_hour": "88305.5845277078",
          "miss_distance": {
            "astronomical": "0.0719278071",
            "lunar": "27.9799169619",
            "kilometers": "10760246.735930877",
            "miles": "6686107.2827930226"
          }
        }
      }
    },
    {
      "id": "2001580",
      "data": {
        "name": "1580 Betulia (1950 KA)",
        "absolute_magnitude_h": 14.69,
        "estimated_diameter": 3.0658787593,
        "is_potentially_hazardous_asteroid": false,
        "first_observation_date": "undefined",
        "orbiting_body": "Earth",
        "orbit_class_type": "AMO",
        "orbit_class_description": "Near-Earth asteroid orbits similar to that of 1221 Amor",
        "close_approach_data": {
          "close_approach_date": "2028-06-07",
          "kilometers_per_hour": 114709.2535,
          "miss_distance": {
            "astronomical": 0.4778468036,
            "lunar": 185.8824066004,
            "kilometers": 71484864.004868332,
            "miles": 44418634.7731617016
          }
        }
      }
    },
        {
      "id": "2001620",
      "data": {
        "name": "1620 Geographos (1951 RA)",
        "absolute_magnitude_h": 15.27,
        "estimated_diameter": 2.3472263753,
        "is_potentially_hazardous_asteroid": true,
        "first_observation_date": "1951-11-02",
        "orbiting_body": "Earth",
        "orbit_class_type": "APO",
        "orbit_class_description": "Near-Earth asteroid orbits which cross the Earth’s orbit similar to that of 1862 Apollo",
        "close_approach_data": {
          "close_approach_date": "2026-08-12",
          "kilometers_per_hour": 30101.5269636165,
          "miss_distance": {
              "astronomical": 0.1704372834,
              "lunar": 66.3001032426,
              "kilometers": 25497054.565226358,
              "miles": 15843135.0508974204
          }
        }
      }
    },

      {
      "id": "2001627",
      "data": {
        "name": "1627 Ivar (1929 SH)",
        "absolute_magnitude_h":  12.84,
        "estimated_diameter": 7.1871213318,
        "is_potentially_hazardous_asteroid": false,
        "first_observation_date": "1929-12-02",
        "orbiting_body": "Earth",
        "orbit_class_type": "AMO",
        "orbit_class_description": "Near-Earth asteroid orbits similar to that of 1221 Amor",
        "close_approach_data": {
          "close_approach_date": "2041-06-29",
          "kilometers_per_hour": 49097.9953607782,
          "miss_distance": {
              "astronomical": 0.4353012174,
              "lunar": 169.33217356,
              "kilometers": 65120134.931446938,
              "miles": 40463775.5161982244
          }
        }
      }
    }
  ]
}
```


