import React, { useState, useEffect, useReducer } from 'react'
import EditSchedule from './EditSchedule'
import ModalImage from './ModalImage'
import axios from 'axios'
import moment from 'moment/moment'

const TableRow = ({ day }) => {

  const [showEdit, setShowEdit] = useState(false)
  return (
    <>
      <tr>
        <td className="day">{day.day}</td>
        {day.noonClosed ?
          <>
            <td></td>
            <td></td>
          </>
          :
          <>
            <td>{moment(day.noonStart).utcOffset(1).format('HH:mm')}</td>
            <td>{moment(day.noonEnd).utcOffset(1).format('HH:mm')}</td>
          </>
      }
        <td className='closed'>{day.noonClosed ? 'x' : null }</td>
        {day.eveningClosed ?
          <>
            <td></td>
            <td></td>
          </>
          :
          <>
            <td>{moment(day.eveningStart).utcOffset(1).format('HH:mm')}</td>
            <td>{moment(day.eveningEnd).utcOffset(1).format('HH:mm')}</td>
          </>
      }
        <td className='closed'>{day.eveningClosed ? 'x' : null }</td>
        <td><div onClick={() => {
          setShowEdit(prev => !prev)

        }}><img src="../img/Edit-alt.png" alt="edit" /></div>
          {showEdit ? <EditSchedule day={day} setEdit={() => setShowEdit(prev => !prev)} /> : null}

        </td>
      </tr>
    </>
  )
}

const ImageCard = ({ image }) => {

  const [showEdit, setShowEdit] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const deleteImage = async () => {
    try {
      const res = await axios.delete(`/api/delete/image/${image.id}`)

      const data = await res.data
      setTimeout(() => {
        window.location.reload(true)
      },
        1000)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className='card'>
        <div className='card_image'>
          <img src={`../img/${image.url}`} alt={image.description} />
        </div>
        <div className='card_description'>
          <p>{image.description}</p>
        </div>
        <div className='card_buttons'>
          <div className='button_edit' onClick={() => setShowEdit(prev => !prev)} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
          <div className='button_delete' onClick={() => setConfirmDelete(prev => !prev)}> <img src="../img/Trash.png" alt="delete" /></div>
        </div>
      </div>
      {showEdit ?
        <ModalImage image={image} showEdit={() => setShowEdit(prev => !prev)} />
        : null}
      {confirmDelete ?
        <div className='confirm_delete_window'>
          <div className='confirm_delete_container'>
            <p>Voulez-vous vraiment supprimer l'image {image.description} ?</p>
            <div className='delete_buttons'>
              <button className='cancel_delete' onClick={() => setConfirmDelete(prev => !prev)}>Annuler</button>
              <button className='delete' onClick={() => {
                // Manage deletion
                deleteImage()
              }
              }>Supprimer</button>
            </div>
          </div>
        </div> : null}
    </>
  )

}


const AdminRestaurant = () => {

  const [schedule, setSchedule] = useState([])

  const [gallery, setGallery] = useState([])

  const initialState = {
    id: '',
    address: '',
    city: '',
    phone: '',
    post_code: '',
    max_capacity: ''
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
        return { ...state, max_capacity: action.value }
      default:
        return
    }
  }
  const [restaurant, dispatch] = useReducer(reducer, initialState)

  const getRestaurant = async () => {
    try {
      const res = await axios.get('/api/restaurant')
      const data = await res.data
      dispatch({ type: 'id', value: data[0].id })
      dispatch({ type: 'address', value: data[0].address })
      dispatch({ type: 'city', value: data[0].city })
      dispatch({ type: 'phone', value: data[0].phone })
      dispatch({ type: 'post_code', value: data[0].post_code })
      dispatch({ type: 'max_capacity', value: data[0].max_capacity })
    } catch (error) {
      console.log(error);
    }
  }

  const updateRestaurant = async () => {
    try {
      const res = await axios.put(`/api/update/restaurant/${restaurant.id}`, restaurant)
      window.location.reload(true)
    } catch (error) {

    }
  }

  const getGallery = async () => {
    try {
      const res = await axios.get('/api/gallery')

      const data = await res.data
      setGallery(data)
    } catch (error) {
      console.log(error);
    }
  }

  const getSchedule = async () => {
    try {
      const res = await axios.get('/api/schedule')

      const data = await res.data
      setSchedule(data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getGallery()
    getRestaurant()
    getSchedule()
  }, [])


  const tableRows = schedule.map(day => {
    return (
      <TableRow day={day} key={day.id} />
    )
  })

  const imageCards = gallery.map((image) => {
    return (
      <ImageCard image={image} key={image.id} />
    )
  })

  const [showModalImage, setShowModalImage] = useState(false)
  return (
    <div className='admin_container'>
      <section>
        <h3>Information du Restaurant</h3>
        <form className='info_form' onSubmit={(e) => {
          e.preventDefault()
          updateRestaurant()
        }}>
          <div className='form_inputs'>

            <div className='addess_div'>
              <label htmlFor="address">Adresse :</label>
              <input type="text" name="address" id="address" value={restaurant.address} onChange={(e) => dispatch({ type: 'address', value: e.target.value })} />
            </div>
            <div className='city_div'>
              <label htmlFor="city">Ville :</label>
              <input type="text" name="city" id="city" value={restaurant.city} onChange={(e) => dispatch({ type: 'city', value: e.target.value })} />
            </div>
            <div className='postcode_div'>
              <label htmlFor="post_code">Code Postal :</label>
              <input type="number" name="post_code" id="post_code" value={restaurant.post_code} onChange={(e) => dispatch({ type: 'post_code', value: e.target.value })} />
            </div>
            <div className='phone_div'>
              <label htmlFor="phone">Numéro de téléphone :</label>
              <input type="tel" name="phone" id="phone" value={restaurant.phone} onChange={(e) => dispatch({ type: 'phone', value: e.target.value })} />
            </div>
            <div className='maxcapacity_div'>
              <label htmlFor="max_capacity">Capacité maximale :</label>
              <input type="tel" name="max_capacity" id="max_capacity" value={restaurant.max_capacity} onChange={(e) => dispatch({ type: 'max_capacity', value: e.target.value })} />
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
              {tableRows}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3>Images de la page d'accueil</h3>
        <div className='image_showcase'>
          {imageCards}
        </div>
        <button className='submit_button' onClick={() => setShowModalImage(prev => !prev)}>Ajouter une image</button>
      </section>
      {showModalImage ?
        <ModalImage showEdit={() => setShowModalImage(prev => !prev)} />
        : null}

    </div>
  )
}

export default AdminRestaurant