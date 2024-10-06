import { MantineProvider } from '@mantine/core';
import Animation from './animations/components/Animation'
import './App.css'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Landing } from './animations/components/Landing';


function App() {


  return (
    <>
        <MantineProvider>
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Landing /> } />
          <Route path='/solar-system' element={<Animation />} />
      </Routes>
    </BrowserRouter>
          <Notifications position='top-center'  />
        </MantineProvider>
    </>
  )
}

export default App
