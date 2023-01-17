import React, { useReducer } from 'react'

const ModalBooking = ({ booking, showEdit }) => {

  const initialState = {
    name: booking ? booking.name : '',
    date: booking ? booking.date : '',
    time: booking ? booking.time : '',
    allergens: booking ? booking.allergens : ''
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'name':
        return { ...state, name: action.value }
      case 'date':
        return { ...state, date: action.value }
      case 'time':
        return { ...state, time: action.value }
      case 'allergens':
        return { ...state, allergens: action.value }
      default:
        return
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' onClick={showEdit}>Fermer</button></div>
        <div className='modal_body'>
          <form>
            <p>{booking ? `Modifier la réservation de ${booking.name}`:'Ajouter une réservation'}</p>
            <div className='name_div'>
              <label htmlFor="name">Nom</label>
              <input type="text" name="name" id="name" value={state.name} onChange={(e) => dispatch({ type: 'name', value: e.target.value })} />
            </div>
            <div className='date_div'>
              <label htmlFor="date">Description</label>
              <input type="date" name="date" id="date" value={state.date} onChange={(e) => dispatch({ type: 'date', value: e.target.value })} />
            </div>
            <div className='time_div'>
              <label htmlFor="time">Prix</label>
              <input type="time" name="time" id="time" value={state.time} onChange={(e) => dispatch({ type: 'time', value: e.target.value })} />
            </div>
            <div className='allergens_div'>
              <label htmlFor="allergens">Allergènes</label>
              <textarea name="allergens" id="allergens" value={state.allergens} onChange={(e) => dispatch({type:'allergens', value: e.target.value})}></textarea>
            </div>
            <input type="submit" value="Enregistrer" className='submit_button' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalBooking