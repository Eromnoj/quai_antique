import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useReducer } from 'react'


const EditSchedule = ({ day, setEdit }) => {

  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')
  const initialSchedule = {
    id: day.id,
    day: day.day,
    noon_start: day.noonStart,
    noon_end: day.noonEnd,
    noon_closed: day.noonClosed,
    evening_start: day.eveningStart,
    evening_end: day.eveningEnd,
    evening_closed: day.eveningClosed,
  }

  const scheduleReducer = (state, action) => {
    switch (action.type) {
      case 'noonStart':
        return { ...state, noon_start: action.value }
      case 'noonEnd':
        return { ...state, noon_end: action.value }
      case 'noonClosed':
        return { ...state, noon_closed: action.value }
      case 'eveningStart':
        return { ...state, evening_start: action.value }
      case 'eveningEnd':
        return { ...state, evening_end: action.value }
      case 'eveningClosed':
        return { ...state, evening_closed: action.value }
      default:
        return
    }
  }

  const [schedule, dispatch] = useReducer(scheduleReducer, initialSchedule)


  const submitChange = async () => {
    try {
      const res = await axios.put(`/api/update/schedule/${day.id}`, schedule)
      const data = await res.data

      setMessage(data.message)
      setShowMessage(true)
      setTimeout(()=> {
        window.location.reload(true)
      },3000)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' onClick={setEdit}>Fermer</button></div>
        <div className='modal_body'>
          {showMessage ? <p>{message}</p> : null}
          <p>Changer les horaires de {day.day}</p>
          <form onSubmit={(e) => {
            e.preventDefault()
            submitChange()
          }}>
            <div className='noon_schedule'>
              <p>Service du midi</p>
              <div>
                <label htmlFor="noonStart">Début du service</label>
                <input type="time" name="noonStart" id="noonStart" value={schedule.noon_start} onChange={(e)=> dispatch({type:'noonStart', value : e.target.value})} />
              </div>
              <div>

                <label htmlFor="noonEnd">Fin du service</label>
                <input type="time" name="noonEnd" id="noonEnd" value={schedule.noon_end} onChange={(e)=> dispatch({type:'noonEnd', value : e.target.value})} />
              </div>
              <div className='noon_closed_div'>
                <label htmlFor="noonClosed">Cochez pour indiquer la fermeture de la salle</label>
                <input type="checkbox" name="noonClosed" id="noonClosed" checked={schedule.noon_closed} onChange={(e)=> dispatch({type:'noonClosed', value : e.target.checked})} />
              </div>

            </div>
            <div className='evening_schedule'>

              <p>Service du soir</p>
              <div>

                <label htmlFor="eveningStart">Début du service</label>
                <input type="time" name="eveningStart" id="eveningStart" value={schedule.evening_start} onChange={(e)=> dispatch({type:'eveningStart', value : e.target.value})}/>
              </div>
              <div>

                <label htmlFor="eveningEnd">Fin du service</label>
                <input type="time" name="eveningEnd" id="eveningEnd" value={schedule.evening_end} onChange={(e)=> dispatch({type:'eveningEnd', value : e.target.value})} />
              </div>
              <div className='evening_closed_div'>
                <label htmlFor="eveningClosed">Cochez pour indiquer la fermeture de la salle</label>
                <input type="checkbox" name="eveningClosed" id="eveningClosed" checked={schedule.evening_closed} onChange={(e)=> dispatch({type:'eveningClosed', value : e.target.checked})} />
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