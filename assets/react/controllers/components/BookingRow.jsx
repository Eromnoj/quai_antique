import React, { useState } from 'react'
import moment from 'moment'

import ModalBooking from './modals/ModalBooking'
import ModalDelete from './modals/ModalDelete'

const BookingRow = ({ booking, token, getData }) => {

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
          <ModalBooking booking={booking} showEdit={() => { setShowModalBooking(prev => !prev) }} token={token} getData={getData} />
          : null}
        {confirmDelete ?

          <ModalDelete message={message}
            setMessage={setMessage}
            token={token}
            item={booking}
            setConfirmDelete={setConfirmDelete}
            getData={getData}
            url={'/api/delete/booking/'} />

          : null}
      </td>
    </tr>
  )
}

export default BookingRow
