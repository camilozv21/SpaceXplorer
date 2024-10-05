# Bloque que habilita el evento click con objeto 

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

