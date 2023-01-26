import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react';

const Home = () => {

  const [gallery, setGallery] = useState([]);

  const getGallery = async () => {
    try {
      const res = await axios.get('/api/gallery')

      const data = await res.data
      setGallery(data)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    getGallery()
  }, [])

  const showGallery = gallery.map(image => {
    return (
      <div className='image_container' key={image.id}>
            <div className='image'>
              <img src={`/img/${image.url}`} alt={image.description} />
            </div>
            <div className='description'>
              <p>{image.description}</p>
            </div>
          </div>
    )
  })
  return (
    <>
      <div className="home_content">

        <div className="home_catch">
          <p>La gourmandise est un vilain défaut...<br />promis on ne dira rien</p>
        </div>

        <div className='home_gallery'>
          {showGallery}
        </div>

      </div>
    </>
  )
}

export default Home