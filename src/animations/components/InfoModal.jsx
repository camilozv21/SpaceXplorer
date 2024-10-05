import { Modal, Text } from '@mantine/core';

const InfoModal = ({ opened, onClose,neoInfo}) => {

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="NEO'S INFORMATION"
      transitionProps={{ transition: 'fade', duration: 300, timingFunction: 'linear' }}
    >
     {neoInfo && (
        <div>
          <strong>{neoInfo.name}</strong><br />
          Magnitud: {neoInfo.magnitude}<br />
          Tipo: {neoInfo.tipo}<br />
          <img src={neoInfo.img} alt={neoInfo.name} style={{ width: '100%' }} />
        </div>
     )}
    </Modal>
  );
};

export default InfoModal;
