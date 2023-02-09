import React, {useState} from 'react'
import moment from 'moment'
import { deleteItem } from '../../utils/functions'

import ModalBooking from './modals/ModalBooking'
import ShowApiResponse from './ShowApiResponse'

const BookingRow = ({booking, token, getData}) => {

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showModalBooking, setShowModalBooking] = useState(false)
  const [message, setMessage] = useState([])

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
      <ModalBooking booking={booking} showEdit={() => {setShowModalBooking(prev => !prev)}} token={token} getData={getData} />
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
                      deleteItem(token,'/api/delete/booking/', booking.id, setMessage, getData)
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
