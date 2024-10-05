import { Modal, Text } from '@mantine/core';
 import '../../App.css';

const InfoModal = ({ opened, onClose,neoInfo}) => {

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="NEO'S INFORMATION"
      transitionProps={{ transition: 'fade', duration: 300, timingFunction: 'linear' }}
      className='modal-menu'
    >
     {neoInfo && (
        <div>
          <strong>{neoInfo.name}</strong><br />
          Magnitud: {neoInfo.magnitude}<br />
          Tipo: {neoInfo.tipo}<br />
        </div>
     )}
    </Modal>
  );
};

export default InfoModal;
