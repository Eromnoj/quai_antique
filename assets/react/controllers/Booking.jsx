import React, { useEffect, useReducer } from 'react'
import moment from 'moment/moment'
import axios from 'axios'
import { useState } from 'react'

const Booking = ({ userLastname, userFirstname, userAllergies, userPhone, userNumber, BookingCSRFToken}) => {

  const initialState = {
    lastname: userLastname ? userLastname : '',
    firstname: userFirstname ? userFirstname : '',
    date: moment().format('YYYY-MM-DD') + 'T00:00:00.000Z',
    time: '',
    allergies: userAllergies ? userAllergies : '',
    phone: userPhone ? userPhone : '',
    shift: 'midi',
    number: userNumber ? userNumber : 1,
    token: BookingCSRFToken
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'lastname':
        return { ...state, lastname: action.value }
      case 'firstname':
        return { ...state, firstname: action.value }
      case 'date':
        let date = moment(action.value + 'T00:00:00.000Z').utcOffset(0).toISOString()
        return { ...state, date: date }
      case 'time':
        let time = moment('1970-01-01T' + action.value).utcOffset(0).toISOString()
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
    '/api/add/booking'
    try {
      const res = await axios.put('/api/add/booking', state)
      const data = await res.data

      setTimeout(() => {
        window.location.reload(true)
      }, 1000)
    } catch (error) {
      console.log(error);
    }
  }

  const [seatsLeft, setSeatsLeft] = useState(0)
  const [isShiftClosed, setIsShiftClosed] = useState(false)

  const [hourArray, setHourArray] = useState([])

  const getAvailableSeatsAndSchedule = async () => {
    try {
      const res = await axios.get(`/api/booking/getavailable?date=${state.date}&shift=${state.shift}`)
      const data = await res.data
      setSeatsLeft(data.seatsLeft)
      setIsShiftClosed(data.shiftClosed)

      let tempArray = []
      for (let i = moment(data.shiftStart).utcOffset(0); i <= moment(data.shiftEnd).utcOffset(0).subtract(1, 'h'); i = moment(i).add(15, 'm')) {
        tempArray.push(moment(i).utcOffset(1).format('HH:mm'));
      }
      setHourArray(tempArray)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAvailableSeatsAndSchedule()
  }, [state.date, state.shift])


  const timeOptions = hourArray.map((hour, i) => {
    return (
      <div className='hours' key={i}>
        <input type="radio" name="hour_to_choose" id={`time_${i}`} value={hour} onChange={(e) => dispatch({ type: 'time', value: e.target.value })} />
        <label htmlFor={`time_${i}`}>{hour}</label>
      </ div>
    )
  })

  return (
    <div className='booking_container'>
      <div className='booking_title'>
        <h2>Réserver une table</h2>

      </div>
      <form className='form' onSubmit={(e) => {
        e.preventDefault()
        bookingSubmit()
      }}>
        <div className='booking_infos'>
          <div className='date_div'>
            <label htmlFor="date">Date :</label>
            <input type="date" name="date" id="date"
              min={moment().format('YYYY-MM-DD')}
              onChange={(e) => {
                dispatch({ type: 'date', value: e.target.value })
              }} required />
          </div>
          <div className='number_div'>
            <label htmlFor="number">Couverts :</label>
            <input type="number" name="number" id="number" value={state.number} onChange={(e) => dispatch({ type: 'number', value: e.target.value })} required />
          </div>
          <div className='shift_div'>
            <label htmlFor="shift">Service :</label>
            <select name="shift" id="shift"
              onChange={(e) => {
                dispatch({ type: 'shift', value: e.target.value })

              }} required>
              <option value="midi">Midi</option>
              <option value="soir">Soir</option>
            </select>
          </div>
        </div>

        {seatsLeft === 0 || isShiftClosed ?

          <div>
            <p>Le restaurant est fermé, ou il n'y a plus de places disponibles</p>
          </div> :
          <>
            <div className='available'>
              {seatsLeft !== 0 ?
                <p>Place disponible : <span>{seatsLeft}</span></p>
                : null
              }
            </div>
            <div className='hour_choice'>
              {timeOptions}
            </div>
          </>
        }

        <div className='allergies_div'>
          <label htmlFor="allergies">Veuillez signaler d'éventuelles allergies</label>
          <textarea name="allergies" id="allergies" value={state.allergies} onChange={(e) => dispatch({ type: 'allergies', value: e.target.value })}></textarea>
        </div>
        <div className='user_info'>
          <div className='lastname_div'>
            <label htmlFor="lastname">Votre nom :</label>
            <input type="text" name="lastname" id="lastname" value={state.lastname} onChange={(e) => dispatch({ type: 'lastname', value: e.target.value })} required />
          </div>
          <div className='firstname_div'>
            <label htmlFor="firstname">Votre prénom :</label>
            <input type="text" name="firstname" id="firstname" value={state.firstname} onChange={(e) => dispatch({ type: 'firstname', value: e.target.value })} required />
          </div>
          <div className='phone_div'>
            <label htmlFor="phone">Votre téléphone :</label>
            <input type="tel" name="phone" id="phone" value={state.phone} onChange={(e) => dispatch({ type: 'phone', value: e.target.value })} required />
          </div>
        </div>
        <div className='disclaimer'>
          <p>Le restaurant est susceptible de vous appeler pour confirmer la réservation</p>
        </div>

        <button type="submit" className='submit_button' disabled={seatsLeft === 0 || isShiftClosed ? true : false}>Confirmer la réservation</button>


      </form>
    </div>
  )
}

export default Booking