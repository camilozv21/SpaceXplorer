import React from 'react'
import './Landing.css'
import { Divider, Image } from '@mantine/core'
import { Link } from 'react-router-dom'
import logo from '../constants/images/logo.png'
import astronauta from '../constants/images/fondoastronauta.jpeg'

export const Landing = () => {
  return (
    <>
    <header>
        <aside className='banner-header'>
            <p>Beyond the Limits!</p>
        </aside>
        <nav>
            <ul className='navbar-list'>
                <li><Link to={'/'}><Image src={logo} style={{ filter: 'invert(100%)', width: '100%', maxWidth: '160px'}} /></Link></li>
                <li><Link>About us</Link></li>
                <li><Link to={'/solar-system'}>Live Demo</Link></li>
            </ul>
        </nav>
        <Divider /> 
        <main>
            <section className='section-intro'>
                <div className='content-text'>asdf</div>
                <div className='content-image'><Image src={astronauta} /></div>
            </section>
        </main>
    </header>
    </>
  )
}
