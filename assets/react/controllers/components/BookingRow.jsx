import React, {useState} from 'react'
import axios from 'axios'
import moment from 'moment'

import ModalBooking from './modals/ModalBooking'
import ShowApiResponse from './ShowApiResponse'

const BookingRow = ({booking, token}) => {

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showModalBooking, setShowModalBooking] = useState(false)
  const [message, setMessage] = useState([])

  const deleteBooking = async (token) => {
    try {
      const res = await axios.delete(`/api/delete/booking/${booking.id}`, {
        data: {
          token: token
        }
      })
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
        console.log(error.response.data.message);
        setMessage(array => [...array, { type: 'info', input: 'message', message: error.response.data.message }])
      }
      console.log(error);
    }
  }
  return (
    <tr>
      <td onClick={() => { setShowModalBooking(prev => !prev) }}>{booking.lastname}</td>
      <td>{moment(booking.date).format('DD/MM/YYYY')}</td>
      <td>{moment(booking.time).utcOffset(1).format('HH:mm')}</td>
      <td className='end'>{booking.allergies}</td>
      <td className='buttons'><div className='buttons_div'>
        <div className='button_edit' onClick={() => { setShowModalBooking(prev => !prev) }} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
        <div className='button_delete' onClick={() => { setConfirmDelete(prev => !prev) }}> <img src="../img/Trash.png" alt="delete" /></div>
      </div>
      {showModalBooking ?
      <ModalBooking booking={booking} showEdit={() => {setShowModalBooking(prev => !prev)}} token={token} />
    :null}
      {confirmDelete ?
              <div className='confirm_delete_window'>
                <div className='confirm_delete_container'>
                <ShowApiResponse array={message} input={'message'} />
                  <p>Voulez-vous vraiment supprimer la reservation de : {booking.lastname} ?</p>
                  <div className='delete_buttons'>
                    <button className='cancel_delete' onClick={() => setConfirmDelete(prev => !prev)}>Annuler</button>
                    <button className='delete' onClick={() => {
                      // Manage deletion
                      deleteBooking(token)
                    }
                    }>Supprimer</button>
                  </div>
                </div>
              </div> : null}
      </td>
    </tr>
  )
}

export default BookingRow