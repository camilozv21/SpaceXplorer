import '../../App.css';
import data from '../constants/data.json';
import dataPlanets from '../constants/dataPlanets.json';
import { IconStar, IconComet, IconAlertCircle, IconShieldHalf, IconPlanet, IconCalendar, IconHelp, IconDownload, IconBrightness2, IconWeight, IconRuler, IconTemperature, IconMoon } from '@tabler/icons-react';
import { Modal, Tooltip, Button } from '@mantine/core';

const InfoModal = ({ opened, onClose, neoInfo }) => {
  const isPlanetOrStar = neoInfo.type === 'Planet' || neoInfo.type === 'Star';
  const selectedData = isPlanetOrStar ? dataPlanets.near_earth_objects : data.near_earth_objects;
  const selectedObject = isPlanetOrStar ? selectedData.find(obj => obj.data.name === neoInfo.name) : selectedData.find(obj => obj.data.name === neoInfo.data.name);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      transitionProps={{ transition: 'fade', duration: 300, timingFunction: 'linear' }}
      className='modal-menu'
      overlayProps={{
        backgroundOpacity: 0,
      }}
      zIndex={0}
      closeOnClickOutside={false}
      withOverlay={false}
    >
      {selectedObject && (
        <>
          <div className='close-button-modal'>
            <div className='title-card'>
              <h1>{selectedObject.data.name}</h1>
            </div>
            <Modal.CloseButton style={{ color: '#00dbe3' }} />
          </div>
          <div className='list-card-container'>
            <IconBrightness2 color='#00dbe3' stroke={2} /> Absolute magnitude: {selectedObject.data.absolute_magnitude_h}{' '}
            <Tooltip multiline w={220} withArrow transitionProps={{ duration: 200 }} label="The brightness of the object as seen from a distance of 1 AU (astronomical unit).">
              <IconHelp stroke={2} color='yellow' />
            </Tooltip>
          </div>
          {selectedObject.data.is_potentially_hazardous_asteroid !== undefined && (
            <div className='list-card-container'>
              {selectedObject.data.is_potentially_hazardous_asteroid ? (
                <IconAlertCircle stroke={2} color='#ff0000' />
              ) : (
                <IconShieldHalf stroke={2} color='#00ff00' />
              )}{' '}
              Potentially hazardous: {selectedObject.data.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}{' '}
              <Tooltip multiline w={220} withArrow transitionProps={{ duration: 200 }} label="Indicates whether the object poses a potential threat to Earth.">
                <IconHelp stroke={2} color='yellow' />
              </Tooltip>
            </div>
          )}
          {!isPlanetOrStar && (
            <div className='list-card-container'>
              <IconPlanet stroke={2} color='#ffb917' /> Orbiting body: {selectedObject.data.orbiting_body}{' '}
              <Tooltip multiline w={220} withArrow transitionProps={{ duration: 200 }} label="The celestial body around which the object orbits.">
                <IconHelp stroke={2} color='yellow' />
              </Tooltip>
            </div>
          )}
          {isPlanetOrStar && (
            <>
              <div className='list-card-container'>
                <IconWeight stroke={2} color='#ff5733' /> Gravity: {selectedObject.data.gravity}{' '}
                <Tooltip multiline w={220} withArrow transitionProps={{ duration: 200 }} label="The gravity of the celestial body.">
                  <IconHelp stroke={2} color='yellow' />
                </Tooltip>
              </div>
              <div className='list-card-container'>
                <IconRuler stroke={2} color='#33ff57' /> Estimated diameter: {selectedObject.data.estimated_diameter} km{' '}
                <Tooltip multiline w={220} withArrow transitionProps={{ duration: 200 }} label="The estimated diameter of the celestial body.">
                  <IconHelp stroke={2} color='yellow' />
                </Tooltip>
              </div>
              <div className='list-card-container'>
                <IconTemperature stroke={2} color='#3357ff' /> Surface temperature: {selectedObject.data.surface_temperature}{' '}
                <Tooltip multiline w={220} withArrow transitionProps={{ duration: 200 }} label="The surface temperature of the celestial body.">
                  <IconHelp stroke={2} color='yellow' />
                </Tooltip>
              </div>
              <div className='list-card-container'>
                <IconMoon stroke={2} color='#ff33a8' /> Number of moons: {selectedObject.data.number_of_moons}{' '}
                <Tooltip multiline w={220} withArrow transitionProps={{ duration: 200 }} label="The number of moons orbiting the celestial body.">
                  <IconHelp stroke={2} color='yellow' />
                </Tooltip>
              </div>
              <div className='list-card-container'>
                <IconStar stroke={2} color='#ff5733' /> Albedo: {selectedObject.data.albedo}{' '}
                <Tooltip multiline w={220} withArrow transitionProps={{ duration: 200 }} label="The albedo of the celestial body.">
                  <IconHelp stroke={2} color='yellow' />
                </Tooltip>
              </div>
            </>
          )}
          <div className='list-card-container'>
            <IconCalendar stroke={2} color='#ff00ff' /> First observation date: {selectedObject.data.first_observation_date}{' '}
            <Tooltip multiline w={220} withArrow transitionProps={{ duration: 200 }} label="The date when the object was first observed.">
              <IconHelp stroke={2} color='yellow' />
            </Tooltip>
          </div>
          <div className='list-card-container'>
            <IconPlanet stroke={2} color='#ff9900' /> Orbit class type: {selectedObject.data.orbit_class_type}{' '}
            <Tooltip multiline w={220} withArrow transitionProps={{ duration: 200 }} label="The classification of the object's orbit.">
              <IconHelp stroke={2} color='yellow' />
            </Tooltip>
          </div>
          <div className='list-card-container'>
            Orbit class description: {selectedObject.data.orbit_class_description}{' '}
          </div>
          {selectedObject.data?.close_approach_data && (
            <>
              <div className='list-card-container'>
                <IconCalendar stroke={2} color='#ff00ff' /> Close approach date: {selectedObject.data.close_approach_data[0]?.close_approach_date}{' '}
                <Tooltip multiline w={220} withArrow transitionProps={{ duration: 200 }} label="The date of the object's close approach to Earth.">
                  <IconHelp stroke={2} color='yellow' />
                </Tooltip>
              </div>
              <div className='list-card-container'>
                <IconComet stroke={2} color='#00dbe3' /> Miss distance: {selectedObject.data.close_approach_data[0]?.miss_distance.kilometers} km{' '}
                <Tooltip multiline w={220} withArrow transitionProps={{ duration: 200 }} label="The distance at which the object will miss Earth.">
                  <IconHelp stroke={2} color='yellow' />
                </Tooltip>
              </div>
            </>
          )}
          <div>
          <a href="https://github.com/camilozv21/SpaceXplorer/blob/main/src/animations/constants/stl/neo.stl?raw=true" download>
              <Button color='#00dbe3' autoContrast fullWidth>
                <IconDownload stroke={2} /> Download STL
              </Button>
            </a>
          </div>
        </>
      )}
    </Modal>
  );
};

export default InfoModal;