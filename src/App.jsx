import { MantineProvider } from '@mantine/core';
import Animation from './animations/components/Animation'
import './App.css'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications, showNotification } from '@mantine/notifications';
import { useEffect } from 'react';
import { IconComet } from '@tabler/icons-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  useEffect(() => {
    setTimeout(() => {
      showNotification({
        title: 'Apophis is nearer than ever!',
        message: 'Today October 6, 2024 Apophis is at a distance of 68585153.184325793 Km.',
        color: 'black',
        icon: <IconComet stroke={2} color='yellow' />,
        autoClose: 5000
      });
    }, 4000);
  }, []);

  return (
    <>
    <BrowserRouter>
      <Routes>
        <MantineProvider>
          <Route path='/' element={<div>hola</div>} />
          <Route path='/solar-system' element={<Animation />} />
          <Notifications position='top-center' withBorder  />
        </MantineProvider>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
