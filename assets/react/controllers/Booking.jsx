import React, { useEffect, useReducer, useState } from 'react'
import moment from 'moment/moment'

import { bookingSubmit, getAvailableSeatsAndSchedule } from '../utils/functions'
import ShowApiResponse from './components/ShowApiResponse'

const Booking = ({ userEmail, userLastname, userFirstname, userAllergies, userPhone, userNumber, BookingCSRFToken }) => {
  // Display response from API
  const [message, setMessage] = useState([])

  //const to store data
  const [seatsLeft, setSeatsLeft] = useState(0)
  const [isShiftClosed, setIsShiftClosed] = useState(false)
  const [hourArray, setHourArray] = useState([])

  const initialState = {
    lastname: userLastname ? userLastname : '',
    firstname: userFirstname ? userFirstname : '',
    email: userEmail ? userEmail : '',
    date: moment().add(1, 'days').format('YYYY-MM-DD') + 'T00:00:00.000Z',
    time: '',
    allergies: userAllergies ? userAllergies : '',
    phone: userPhone ? userPhone : '',
    shift: 'midi',
    number: userNumber ? userNumber : 0,
    token: BookingCSRFToken
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'lastname':
        return { ...state, lastname: action.value }
      case 'firstname':
        return { ...state, firstname: action.value }
      case 'email':
        return { ...state, email: action.value }
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

  const [bookingState, dispatch] = useReducer(reducer, initialState)

  // const to display or not the booking confirmation and a waiting status
  const [confirmBooking, setConfirmBooking] = useState(false)
  const [isBookingSent, setIsBookingSent] = useState(false)

  // fetching data
  useEffect(() => {
    let ignore = false
    if (!ignore) {
      getAvailableSeatsAndSchedule(bookingState.date, bookingState.shift, setSeatsLeft, setIsShiftClosed, setHourArray, setMessage, dispatch)
    }
    return () => {
      ignore = true
    }
  }, [bookingState.date, bookingState.shift])


  // mapping through hour array to display available booking times
  const timeOptions = hourArray.map((hour, i) => {
    return (
      <div className='hours' key={i}>
        <input type="radio" name="hour_to_choose" id={`time_${i}`} value={hour} onChange={(e) => dispatch({ type: 'time', value: e.target.value })} />
        <label htmlFor={`time_${i}`}>{hour}</label>
      </ div>
    )
  })

  // Show Confirmation
  if (confirmBooking) {
    return (
      <div className='booking_container'>
        <div className='booking_title'>
          <h2>Réserver une table</h2>
          <ShowApiResponse array={message} input={'message'} />
        </div>
      </div>
    )
  }

  return (
    <div className='booking_container'>
      <div className='booking_title'>
        <h2>Réserver une table</h2>
      </div>

      <form className='form' onSubmit={(e) => {
        e.preventDefault()
        setIsBookingSent(true)
        setMessage([])
        bookingSubmit(bookingState, setConfirmBooking, setMessage, setIsBookingSent)
      }}>
        <ShowApiResponse array={message} input={'errorMessage'} />
        <div className='booking_infos'>
          <div className='date_div'>
            <label htmlFor="date">Date : </label>
            <input type="date" name="date" id="date"
              min={moment().add(1, 'days').format('YYYY-MM-DD')}
              value={moment(bookingState.date).format('YYYY-MM-DD')}
              onChange={(e) => {
                dispatch({ type: 'date', value: e.target.value })
              }} />
            <ShowApiResponse array={message} input={'date'} />
          </div>

          <div className='number_div'>
            <label htmlFor="number">Couverts :</label>
            <input type="number" name="number" id="number" value={bookingState.number}
              onChange={(e) => dispatch({ type: 'number', value: e.target.value })} />
            <ShowApiResponse array={message} input={'number'} />
          </div>

          <div className='shift_div'>
            <label htmlFor="shift">Service :</label>
            <select name="shift" id="shift"
              onChange={(e) => {
                dispatch({ type: 'shift', value: e.target.value })
              }} >
              <option value="midi">Midi</option>
              <option value="soir">Soir</option>
            </select>
            <ShowApiResponse array={message} input={'shift'} />
          </div>
        </div>
        {/* If there isn't any place available, or if shift is closed, show message and hide hours */}
        {seatsLeft <= 0 || isShiftClosed ?
          <div>
            <p>Le restaurant est fermé sur ce service, ou il n'y a plus de places disponibles</p>
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
              <ShowApiResponse array={message} input={'time'} />
            </div>
          </>
        }

        <div className='allergies_div'>
          <label htmlFor="allergies">Veuillez signaler d'éventuelles allergies</label>
          <textarea name="allergies" id="allergies" value={bookingState.allergies}
            onChange={(e) => dispatch({ type: 'allergies', value: e.target.value })}></textarea>
          <ShowApiResponse array={message} input={'allergies'} />
        </div>

        <div className='user_info'>
          <div className='lastname_div'>
            <label htmlFor="lastname">Votre nom :</label>
            <input type="text" name="lastname" id="lastname" value={bookingState.lastname}
              onChange={(e) => dispatch({ type: 'lastname', value: e.target.value })} />
            <ShowApiResponse array={message} input={'lastname'} />
          </div>

          <div className='firstname_div'>
            <label htmlFor="firstname">Votre prénom :</label>
            <input type="text" name="firstname" id="firstname" value={bookingState.firstname}
              onChange={(e) => dispatch({ type: 'firstname', value: e.target.value })} />
            <ShowApiResponse array={message} input={'firstname'} />
          </div>

          <div className='email_div'>
            <label htmlFor="email">Votre email :</label>
            <input type="email" name="email" id="email" value={bookingState.email}
              onChange={(e) => dispatch({ type: 'email', value: e.target.value })} />
            <ShowApiResponse array={message} input={'firstname'} />
          </div>

          <div className='phone_div'>
            <label htmlFor="phone">Votre téléphone :</label>
            <input type="tel" name="phone" id="phone" value={bookingState.phone}
              onChange={(e) => dispatch({ type: 'phone', value: e.target.value })} />
            <ShowApiResponse array={message} input={'phone'} />
          </div>
        </div>

        <div className='disclaimer'>
          <p>Le restaurant est susceptible de vous appeler pour confirmer la réservation</p>
        </div>

        <button type="submit" className='submit_button'
          disabled={seatsLeft <= 0 || isShiftClosed ? true :
            seatsLeft - bookingState.number < 0 ? true :
              isBookingSent ? true : false}>{isBookingSent ? 'Patientez...' : 'Confirmer la réservation'}</button>

      </form>
    </div>
  )
}

export default Booking

