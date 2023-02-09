import React, { useReducer, useState } from 'react'
import moment from 'moment/moment'
import {submitItem} from '../../../utils/functions'

import ShowApiResponse from '../ShowApiResponse'

const ModalBooking = ({ booking, showEdit, token, getData }) => {
  // Display response from API
  const [message, setMessage] = useState([])

  const initialState = {
    lastname: booking ? booking.lastname : '',
    date: booking ? booking.date : moment().utcOffset(0).toISOString(),
    time: booking ? booking.time : moment().utcOffset(0).toISOString(),
    allergies: booking ? booking.allergies : '',
    phone: booking ? booking.phone : '',
    shift: booking ? booking.shift : '',
    number: booking ? booking.number : 0,
    token: token,
    email: null
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'lastname':
        return { ...state, lastname: action.value }
      case 'date':
        let date = moment(action.value + "T00:00:00.000Z").utcOffset(0).toISOString()
        return { ...state, date: date }
      case 'time':
        let time = moment("1970-01-01T" + action.value).utcOffset(0).toISOString()
        return { ...state, time: time }
      case 'allergies':
        return { ...state, allergies: action.value }
      case 'phone':
        return { ...state, phone: action.value }
      case 'shift':
        return { ...state, shift: action.value }
      case 'number':
        return { ...state, number: Number(action.value) }
      default:
        return
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)


  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' 
        onClick={() => {
          getData()
          showEdit()
          }}>Fermer</button></div>
        <div className='modal_body'>
          <ShowApiResponse array={message} input={'message'} />

          <form onSubmit={(e) => {
            e.preventDefault()
            setMessage([])
            submitItem(booking, state, setMessage, getData, showEdit, 'booking')
          }}>
            <p>{booking ? `Modifier la réservation de ${booking.lastname}` : 'Ajouter une réservation'}</p>
            <div className='lastname_div'>
              <label htmlFor="lastname">Nom</label>
              <input type="text" name="lastname" id="lastname" value={state.lastname} onChange={(e) => dispatch({ type: 'lastname', value: e.target.value })} />

              <ShowApiResponse array={message} input={'lastname'} />

            </div>
            <div className='number_div'>
              <label htmlFor="number">Nombre de couverts</label>
              <input type="number" name="number" id="number" value={state.number} onChange={(e) => dispatch({ type: 'number', value: e.target.value })} />

              <ShowApiResponse array={message} input={'number'} />

            </div>
            <div className='date_div'>
              <label htmlFor="date">Date</label>
              <input type="date" name="date" id="date" value={moment(state.date).utcOffset(1).format('YYYY-MM-DD')} onChange={(e) => dispatch({ type: 'date', value: e.target.value })} />

              <ShowApiResponse array={message} input={'date'} />

            </div>
            <div className='shift_div'>
              <label htmlFor="shift">Service</label>
              <select name="shift" id="shift" onChange={(e) => dispatch({ type: 'shift', value: e.target.value })} value={state.shift}>
                <option value={''}>Choisissez un Service</option>
                <option value='midi'>Midi</option>
                <option value='soir'>Soir</option>
              </select>

              <ShowApiResponse array={message} input={'shift'} />

            </div>
            <div className='time_div'>
              <label htmlFor="time">Heure</label>
              <input type="time" name="time" id="time" value={moment(state.time).utcOffset(1).format('HH:mm')} onChange={(e) => dispatch({ type: 'time', value: e.target.value })} />

              <ShowApiResponse array={message} input={'time'} />

            </div>
            <div className='phone_div'>
              <label htmlFor="phone">Téléphone</label>
              <input type="tel" name="phone" id="phone" value={state.phone} onChange={(e) => dispatch({ type: 'phone', value: e.target.value })} />

              <ShowApiResponse array={message} input={'phone'} />

            </div>
            <div className='allergies_div'>
              <label htmlFor="allergies">Allergènes</label>
              <textarea name="allergies" id="allergies" value={state.allergies} onChange={(e) => dispatch({ type: 'allergies', value: e.target.value })}></textarea>

              <ShowApiResponse array={message} input={'allergies'} />

            </div>
            <input type="submit" value="Enregistrer" className='submit_button' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalBooking
