import React from 'react'
import './Landing.css'
import { AspectRatio, Button, Divider, Image, Overlay } from '@mantine/core'
import { Link } from 'react-router-dom'
import logo from '../constants/images/logo.png'
import video from '../constants/images/demovideo.gif'

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
                <li>
                        <Link to={'/solar-system'}>Live Demo</Link>
                </li>
            </ul>
        </nav>
        <Divider /> 
        <main>
            <section className='section-intro'>
                <div className='content-image'>
                    <img src={video} />
                    <Link to={'/solar-system'} id='live-demo-button' style={{ color: "#121212"}}>Live Demo</Link>
                </div>
            </section>
        </main>
    </header>
    </>
  )
}
