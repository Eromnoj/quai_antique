import React, { useState } from 'react'
import ModalBooking from './ModalBooking'
import axios from 'axios'
import { useEffect } from 'react'
import moment from 'moment/moment'

const BookingRows = ({booking}) => {

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showModalBooking, setShowModalBooking] = useState(false)

  const deleteBooking = async () => {
    try {
      const res = await axios.delete(`/api/delete/booking/${booking.id}`)
      const data = await res.data

      console.log(data);
      setTimeout(()=> {
        window.location.reload(true)
      },1000)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <tr>
      <td>{booking.lastname}</td>
      <td>{moment(booking.date).format('DD/MM/YYYY')}</td>
      <td>{moment(booking.time).utcOffset(1).format('HH:mm')}</td>
      <td className='end'>{booking.allergies}</td>
      <td className='buttons'><div className='buttons_div'>
        <div className='button_edit' onClick={() => { setShowModalBooking(prev => !prev) }} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
        <div className='button_delete' onClick={() => { setConfirmDelete(prev => !prev) }}> <img src="../img/Trash.png" alt="delete" /></div>
      </div>
      {showModalBooking ?
      <ModalBooking booking={booking} showEdit={() => {setShowModalBooking(prev => !prev)}} />
    :null}
      {confirmDelete ?
              <div className='confirm_delete_window'>
                <div className='confirm_delete_container'>
                  <p>Voulez-vous vraiment supprimer la reservation de : {booking.lastname} ?</p>
                  <div className='delete_buttons'>
                    <button className='cancel_delete' onClick={() => setConfirmDelete(prev => !prev)}>Annuler</button>
                    <button className='delete' onClick={() => {
                      // Manage deletion
                      deleteBooking()
                    }
                    }>Supprimer</button>
                  </div>
                </div>
              </div> : null}
      </td>
    </tr>
  )
}

const AdminBooking = () => {

  const [bookings, setBookings] = useState([])

  const getBookings = async () => {
    try {
      const res = await axios.get('/api/booking')
      const data = await res.data
      console.log(data);
      setBookings(data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getBookings()
  },[])
  
  const showBookings = bookings.map(booking=> {
    return (
      <BookingRows booking={booking} key={booking.id} />
    )
  })

  const [showAddBooking, setShowAddBooking] = useState(false)
  return (
    <div className='admin_container'>
      <section>
        <h3>Visualiser et gérer les réservations :</h3>

        <div className='div_table'>

        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Date</th>
              <th>Heure</th>
              <th>Allergènes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {showBookings}
          </tbody>
        </table>
        </div>

        <button className='submit_button' onClick={() => { setShowAddBooking(prev => !prev)}}>Ajouter une réservation</button>
        {showAddBooking ?
        <ModalBooking showEdit={() => setShowAddBooking(prev => !prev)} />
      :null}
      </section>


    </div>
  )
}

export default AdminBooking