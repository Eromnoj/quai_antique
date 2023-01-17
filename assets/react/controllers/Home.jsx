import React from 'react'

const Home = ({ data }) => {
  return (
    <>
      <div className="home_content">

        <div className="home_catch">
          <p>La gourmandise est un vilain défaut...<br />promis on ne dira rien</p>
        </div>

        <div className='home_gallery'>
          <div className='image_container'>
            <div className='image'>
              <img src="img/image_deux.jpg" alt="Lorem" />
            </div>
            <div className='description'>
              <p>Lorem Ipsum</p>
            </div>
          </div>

          <div className='image_container'>
            <div className='image'>
              <img src="img/image_deux.jpg" alt="Lorem" />
            </div>
            <div className='description'>
              <p>Lorem Ipsum</p>
            </div>
          </div>

          <div className='image_container'>
            <div className='image'>
              <img src="img/image_trois.jpg" alt="Lorem" />
            </div>
            <div className='description'>
              <p>Lorem Ipsum</p>
            </div>
          </div>

        </div>

      </div>
    </>
  )
}

export default Home