import React, { useState, useEffect, useReducer } from 'react'

import { getRestaurant, updateRestaurant, getGallery, getSchedule } from '../utils/functions'
import ModalImage from './components/modals/ModalImage'
import ShowApiResponse from './components/ShowApiResponse'
import ScheduleRow from './components/ScheduleRow'
import ImageCard from './components/ImageCard'


const AdminRestaurant = ({ RestaurantCSRFToken, ScheduleCSRFToken, ImageCSRFToken }) => {

  //const to store response from API
  const [message, setMessage] = useState([])

  //const to store data from the Database
  const [schedule, setSchedule] = useState([])
  const [gallery, setGallery] = useState([])

  const initialState = {
    id: '',
    address: '',
    city: '',
    phone: '',
    post_code: '',
    max_capacity: 0,
    token: RestaurantCSRFToken
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'id':
        return { ...state, id: action.value }
      case 'address':
        return { ...state, address: action.value }
      case 'city':
        return { ...state, city: action.value }
      case 'phone':
        return { ...state, phone: action.value }
      case 'post_code':
        return { ...state, post_code: action.value }
      case 'max_capacity':
        return { ...state, max_capacity: Number(action.value) }
      default:
        return
    }
  }
  const [restaurant, dispatch] = useReducer(reducer, initialState)

  // Const to display or not the modal allowing to add an image
  const [showModalImage, setShowModalImage] = useState(false)

// Fetching data
  useEffect(() => {
    let ignore = false
    if(!ignore){
      getGallery(setGallery, setMessage)
      getRestaurant(dispatch, setMessage)
      getSchedule(setSchedule, setMessage)
  }
    return () => {
      ignore = true
    }
  }, [])

  // Mapping through schedule datas to display rows
  const ScheduleRows = schedule.map(day => {
    return (
      <ScheduleRow day={day} key={day.id} token={ScheduleCSRFToken}
      getData={()=> {
        getSchedule(setSchedule, setMessage)
      }} />
    )
  })

  // Mapping through gallery datas to display cards
  const imageCards = gallery.map((image) => {
    return (
      <ImageCard image={image} key={image.id} token={ImageCSRFToken}
      getData={()=> {
        getGallery(setGallery, setMessage)
      }}
      />
    )
  })



  return (
    <div className='admin_container'>
      <section>
        <h3>Information du Restaurant</h3>
        <ShowApiResponse array={message} input={'message'} />

        <form className='info_form' onSubmit={(e) => {
          e.preventDefault()
          setMessage([])
          updateRestaurant(restaurant, setMessage, dispatch)
        }}>
          <div className='form_inputs'>

            <div className='addess_div'>
              <label htmlFor="address">Adresse :</label>
              <input type="text" name="address" id="address" value={restaurant.address} onChange={(e) => dispatch({ type: 'address', value: e.target.value })} />
              <ShowApiResponse array={message} input={'address'} />
            </div>

            <div className='city_div'>
              <label htmlFor="city">Ville :</label>
              <input type="text" name="city" id="city" value={restaurant.city} onChange={(e) => dispatch({ type: 'city', value: e.target.value })} />
              <ShowApiResponse array={message} input={'city'} />
            </div>

            <div className='postcode_div'>
              <label htmlFor="post_code">Code Postal :</label>
              <input type="number" name="post_code" id="post_code" value={restaurant.post_code} onChange={(e) => dispatch({ type: 'post_code', value: e.target.value })} />
                    <ShowApiResponse array={message} input={'post_code'} />
            </div>

            <div className='phone_div'>
              <label htmlFor="phone">Numéro de téléphone :</label>
              <input type="tel" name="phone" id="phone" value={restaurant.phone} onChange={(e) => dispatch({ type: 'phone', value: e.target.value })} />
              <ShowApiResponse array={message} input={'phone'} />
            </div>

            <div className='maxcapacity_div'>
              <label htmlFor="max_capacity">Capacité maximale :</label>
              <input type="number" name="max_capacity" id="max_capacity" value={restaurant.max_capacity} onChange={(e) => dispatch({ type: 'max_capacity', value: e.target.value })} />
              <ShowApiResponse array={message} input={'max_capacity'} />
            </div>
            
          </div>
          <button type="submit" className='submit_button'>Sauvegarder</button>
        </form>
      </section>

      <section>
        <h3>Modifier les horaires : </h3>
        <div className='div_table'>
          <table>
            <thead>
              <tr>
                <th></th>
                <th colSpan={3}>Midi</th>
                <th colSpan={3}>Soir</th>
                <th></th>
              </tr>
              <tr>
                <th></th>
                <th>Début</th>
                <th>Fin</th>
                <th>Fermé</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Fermé</th>
                <th>Modifier</th>
              </tr>
            </thead>
            <tbody>
              {ScheduleRows}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3>Images de la page d'accueil :</h3>
        <div className='image_showcase'>
          {imageCards}
        </div>
        <button className='submit_button' onClick={() => setShowModalImage(prev => !prev)}>Ajouter une image</button>
      </section>
      {showModalImage ?
        <ModalImage showEdit={() => setShowModalImage(prev => !prev)} token={ImageCSRFToken} 
        getData={() => {
          getGallery(setGallery, setMessage)
        }}
        />
        : null}

    </div>
  )
}

export default AdminRestaurant
