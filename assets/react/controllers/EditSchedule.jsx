import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useReducer } from 'react'
import moment from 'moment/moment'
import ShowApiResponse from './ShowApiResponse'

const EditSchedule = ({ day, setEdit, token }) => {

  // Display response from API
  const [message, setMessage] = useState([])

  const initialSchedule = {
    id: day.id,
    day: day.day,
    noonStart: day.noonStart,
    noonEnd: day.noonEnd,
    noonClosed: day.noonClosed,
    eveningStart: day.eveningStart,
    eveningEnd: day.eveningEnd,
    evening_closed: day.eveningClosed,
    token: token
  }

  const scheduleReducer = (state, action) => {
    switch (action.type) {
      case 'noonStart':
        let noonStart = moment("1970-01-01T" + action.value).utcOffset(0).toJSON()
        return { ...state, noonStart: noonStart }
      case 'noonEnd':
        let noonEnd = moment("1970-01-01T" + action.value).utcOffset(0).toJSON()
        return { ...state, noonEnd: noonEnd }
      case 'noonClosed':
        return { ...state, noonClosed: action.value }
      case 'eveningStart':
        let eveningStart = moment("1970-01-01T" + action.value).utcOffset(0).toJSON()
        return { ...state, eveningStart: eveningStart }
      case 'eveningEnd':
        let eveningEnd = moment("1970-01-01T" + action.value).utcOffset(0).toJSON()
        return { ...state, eveningEnd: eveningEnd }
      case 'eveningClosed':
        return { ...state, evening_closed: action.value }
      default:
        return
    }
  }

  const [schedule, dispatch] = useReducer(scheduleReducer, initialSchedule)

  console.log(schedule);
  const submitChange = async () => {
    try {
      const res = await axios.put(`/api/update/schedule/${day.id}`, schedule)
      const data = await res.data
      if (data.message) {
        setMessage(array => [...array, { type: 'info', input: 'message', message: data.message }])
      }
      setTimeout(() => {
        window.location.reload(true)
      }, 1000)
    } catch (error) {
      if (error.response.data.violations) {
        const violation = error.response.data.violations
        violation.forEach(element => {
          setMessage(array => [...array, { type: 'error', input: element.propertyPath, message: element.title }])
          console.log(element.propertyPath);
          console.log(element.title);
        });
      } else {
        setMessage(array => [...array, { type: 'error', input: 'message', message: error.response.data.message }])
        console.log(error.response.data.message);
      }
    }
  }
  
  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' onClick={setEdit}>Fermer</button></div>
        <div className='modal_body'>

        <ShowApiResponse array={message} input={'message'} />

          <p>Changer les horaires de {day.day}</p>
          <form onSubmit={(e) => {
            e.preventDefault()
            setMessage([])
            submitChange()
          }}>
            <div className='noon_schedule'>
              <p>Service du midi</p>
              <div>
                <label htmlFor="noonStart">Début du service</label>
                <input type="time" name="noonStart" id="noonStart" value={moment(schedule.noonStart).utcOffset(1).format('HH:mm')} onChange={(e) => dispatch({ type: 'noonStart', value: e.target.value })} />
                <ShowApiResponse array={message} input={'noonStart'} />

              </div>
              <div>
                <label htmlFor="noonEnd">Fin du service</label>
                <input type="time" name="noonEnd" id="noonEnd" value={moment(schedule.noonEnd).utcOffset(1).format('HH:mm')} onChange={(e) => dispatch({ type: 'noonEnd', value: e.target.value })} />
                
                <ShowApiResponse array={message} input={'noonEnd'} />

              </div>
              <div className='noonClosed_div'>
                <label htmlFor="noonClosed">Cochez pour indiquer la fermeture de la salle</label>
                <input type="checkbox" name="noonClosed" id="noonClosed" checked={schedule.noonClosed} onChange={(e) => dispatch({ type: 'noonClosed', value: e.target.checked })} />
              </div>

            </div>
            <div className='evening_schedule'>

              <p>Service du soir</p>
              <div>
                <label htmlFor="eveningStart">Début du service</label>
                <input type="time" name="eveningStart" id="eveningStart" value={moment(schedule.eveningStart).utcOffset(1).format('HH:mm')} onChange={(e) => dispatch({ type: 'eveningStart', value: e.target.value })} />
                <ShowApiResponse array={message} input={'eveningStart'} />

              </div>
              <div>
                <label htmlFor="eveningEnd">Fin du service</label>
                <input type="time" name="eveningEnd" id="eveningEnd" value={moment(schedule.eveningEnd).utcOffset(1).format('HH:mm')} onChange={(e) => dispatch({ type: 'eveningEnd', value: e.target.value })} />
                <ShowApiResponse array={message} input={'eveningEnd'} />
              </div>
              <div className='evening_closed_div'>
                <label htmlFor="eveningClosed">Cochez pour indiquer la fermeture de la salle</label>
                <input type="checkbox" name="eveningClosed" id="eveningClosed" checked={schedule.evening_closed} onChange={(e) => dispatch({ type: 'eveningClosed', value: e.target.checked })} />
              </div>
            </div>
            <input type="submit" value="Enregistrer" className='submit_button' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditSchedule