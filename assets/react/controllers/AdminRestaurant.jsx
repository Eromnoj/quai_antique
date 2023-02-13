import React, { useState, useEffect, useReducer } from 'react'

import { getRestaurant, updateRestaurant, getGallery, getSchedule, getEmail, updateClient } from '../utils/functions'
import ModalImage from './components/modals/ModalImage'
import ShowApiResponse from './components/ShowApiResponse'
import ScheduleRow from './components/ScheduleRow'
import ImageCard from './components/ImageCard'


const AdminRestaurant = ({ userId, ProfilCSRFToken, RestaurantCSRFToken, ScheduleCSRFToken, ImageCSRFToken }) => {

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
  const [restaurant, dispatchRestaurant] = useReducer(reducer, initialState)

  // Const to display or not the modal allowing to add an image
  const [showModalImage, setShowModalImage] = useState(false)

  // Fetching data
  useEffect(() => {
    let ignore = false
    if (!ignore) {
      getGallery(setGallery, setMessage)
      getRestaurant(dispatchRestaurant, setMessage)
      getSchedule(setSchedule, setMessage)
    }
    return () => {
      ignore = true
    }
  }, [])

  // update login info
  const [deletePassword, setDeletePassword] = useState('')
  const initialUser = {
    email: '',
    password: '',
    verifPwd: '',
    token: ProfilCSRFToken
  }

  const userReducer = (state, action) => {
    switch (action.type) {
      case 'email':
        return { ...state, email: action.value }
      case 'password':
        return { ...state, password: action.value }
      case 'verifPwd':
        return { ...state, verifPwd: action.value }
      default:
        return
    }
  }

  const [user, dispatchUser] = useReducer(userReducer, initialUser)


  useEffect(() => {
    let ignore = false
    if (!ignore) {
      getEmail(userId, dispatchUser)
    }
    return () => {
      ignore = true
    }
  }, [])


  // Mapping through schedule datas to display rows
  const ScheduleRows = schedule.map(day => {
    return (
      <ScheduleRow day={day} key={day.id} token={ScheduleCSRFToken}
        getData={() => {
          getSchedule(setSchedule, setMessage)
        }} />
    )
  })

  // Mapping through gallery datas to display cards
  const imageCards = gallery.map((image) => {
    return (
      <ImageCard image={image} key={image.id} token={ImageCSRFToken}
        getData={() => {
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
          updateRestaurant(restaurant, setMessage, dispatchRestaurant)
        }}>
          <div className='form_inputs'>

            <div className='addess_div'>
              <label htmlFor="address">Adresse :</label>
              <input type="text" name="address" id="address" value={restaurant.address} onChange={(e) => dispatchRestaurant({ type: 'address', value: e.target.value })} />
              <ShowApiResponse array={message} input={'address'} />
            </div>

            <div className='city_div'>
              <label htmlFor="city">Ville :</label>
              <input type="text" name="city" id="city" value={restaurant.city} onChange={(e) => dispatchRestaurant({ type: 'city', value: e.target.value })} />
              <ShowApiResponse array={message} input={'city'} />
            </div>

            <div className='postcode_div'>
              <label htmlFor="post_code">Code Postal :</label>
              <input type="number" name="post_code" id="post_code" value={restaurant.post_code} onChange={(e) => dispatchRestaurant({ type: 'post_code', value: e.target.value })} />
              <ShowApiResponse array={message} input={'post_code'} />
            </div>

            <div className='phone_div'>
              <label htmlFor="phone">Numéro de téléphone :</label>
              <input type="tel" name="phone" id="phone" value={restaurant.phone} onChange={(e) => dispatchRestaurant({ type: 'phone', value: e.target.value })} />
              <ShowApiResponse array={message} input={'phone'} />
            </div>

            <div className='maxcapacity_div'>
              <label htmlFor="max_capacity">Capacité maximale :</label>
              <input type="number" name="max_capacity" id="max_capacity" value={restaurant.max_capacity} onChange={(e) => dispatchRestaurant({ type: 'max_capacity', value: e.target.value })} />
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
      <section>
        <h3>Gérer mon compte</h3>
        <form className='user_form' onSubmit={(e) => {
          e.preventDefault()
          setMessage([])
          updateClient(userId, user, setMessage, dispatchUser, setDeletePassword)
        }}>
          <div className='form_inputs'>

          <ShowApiResponse array={message} input={'message1'} />
          <div className='email_div'>
            <label htmlFor="email">Modifier mon E-mail :</label>
            <input type="email" name="email" id="email" value={user.email} onChange={(e) => dispatchUser({ type: 'email', value: e.target.value })} />
            <ShowApiResponse array={message} input={'email'} />
          </div>
          <div className='password_div'>
            <label htmlFor="password">Modifier mon mot de passe :</label>
            <input type="password" name="password" id="password" value={user.password} onChange={(e) => dispatchUser({ type: 'password', value: e.target.value })} />
            <ShowApiResponse array={message} input={'password'} />
          </div>
          <div className='password_verif_div'>
            <label htmlFor="password_verif">Entrez votre mot de passe actuel pour confirmer les changements :</label>
            <input type="password" name="password_verif" id="password_verif" value={user.verifPwd} onChange={(e) => dispatchUser({ type: 'verifPwd', value: e.target.value })} />
          </div>
          </div>
          <input type="submit" value="Sauvergarder mes données" className='submit_button' />
        </form>
      </section>
    </div>
  )
}

export default AdminRestaurant
