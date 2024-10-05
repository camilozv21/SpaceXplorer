import { MantineProvider } from '@mantine/core';
import Animation from './animations/components/Animation'
import './App.css'
import '@mantine/core/styles.css';

function App() {

  return (
    <>
    <MantineProvider>
      <Animation />
    </MantineProvider>
    </>
  )
}

export default App
