import React, { useReducer } from 'react'
import moment from 'moment/moment'
import axios from 'axios'

const ModalBooking = ({ booking, showEdit }) => {

  const initialState = {
    lastname: booking ? booking.lastname : '',
    date: booking ? booking.date : '',
    time: booking ? booking.time : '',
    allergies: booking ? booking.allergies : '',
    phone: booking ? booking.phone : '',
    shift: booking ? booking.shift : '',
    number: booking ? booking.number : 1,
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

  const bookingSubmit = async () => {
    let url = booking ? `/api/update/booking/${booking.id}` : '/api/add/booking'
    try {
      const res = booking ? await axios.put(url, state) : await axios.put(url, state)
      const data = await res.data

      console.log(data);
      setTimeout(() => {
        window.location.reload(true)
      }, 1000)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' onClick={showEdit}>Fermer</button></div>
        <div className='modal_body'>
          <form onSubmit={(e) => {
            e.preventDefault()
            bookingSubmit()
          }}>
            <p>{booking ? `Modifier la réservation de ${booking.lastname}` : 'Ajouter une réservation'}</p>
            <div className='lastname_div'>
              <label htmlFor="lastname">Nom</label>
              <input type="text" name="lastname" id="lastname" value={state.lastname} onChange={(e) => dispatch({ type: 'lastname', value: e.target.value })} />
            </div>
            <div className='number_div'>
              <label htmlFor="number">Nombre de couverts</label>
              <input type="number" name="number" id="number" value={state.number} onChange={(e) => dispatch({ type: 'number', value: e.target.value })} />
            </div>
            <div className='date_div'>
              <label htmlFor="date">Date</label>
              <input type="date" name="date" id="date" value={moment(state.date).utcOffset(1).format('YYYY-MM-DD')} onChange={(e) => dispatch({ type: 'date', value: e.target.value })} />
            </div>
            <div className='shift_div'>
              <label htmlFor="shift">Service</label>
              <select name="shift" id="shift" onChange={(e) => dispatch({ type: 'shift', value: e.target.value })} value={state.shift}>
                <option value={''}>Choisissez une Catégorie</option>
                <option value='midi'>Midi</option>
                <option value='soir'>Soir</option>
              </select>
            </div>
            <div className='time_div'>
              <label htmlFor="time">Heure</label>
              <input type="time" name="time" id="time" value={moment(state.time).utcOffset(1).format('HH:mm')} onChange={(e) => dispatch({ type: 'time', value: e.target.value })} />
            </div>
            <div className='phone_div'>
              <label htmlFor="phone">Téléphone</label>
              <input type="tel" name="phone" id="phone" value={state.phone} onChange={(e) => dispatch({ type: 'phone', value: e.target.value })} />
            </div>
            <div className='allergies_div'>
              <label htmlFor="allergies">Allergènes</label>
              <textarea name="allergies" id="allergies" value={state.allergies} onChange={(e) => dispatch({ type: 'allergies', value: e.target.value })}></textarea>
            </div>
            <input type="submit" value="Enregistrer" className='submit_button' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalBooking