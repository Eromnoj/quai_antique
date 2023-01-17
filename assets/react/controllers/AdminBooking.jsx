import React, { useState } from 'react'
import ModalBooking from './ModalBooking'


const BookingRows = ({booking}) => {

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showModalBooking, setShowModalBooking] = useState(false)
  return (
    <tr>
      <td>{booking.name}</td>
      <td>{booking.date}</td>
      <td>{booking.time}</td>
      <td className='end'>{booking.allergens}</td>
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
                  <p>Voulez-vous vraiment supprimer la reservation de : {booking.name} ?</p>
                  <div className='delete_buttons'>
                    <button className='cancel_delete' onClick={() => setConfirmDelete(prev => !prev)}>Annuler</button>
                    <button className='delete' onClick={() => {
                      // Manage deletion
                      setConfirmDelete(prev => !prev)
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

  const bookings = [
    {
      name: 'Igor Bogdanov',
      date: '18/02/23',
      time: '12:00',
      allergens: 'lupîn'
    },
    {
      name: 'Louis Philippe',
      date: '19/02/23',
      time: '12:30',
      allergens: ''
    },
    {
      name: 'Louise Michele',
      date: '18/02/23',
      time: '19:00',
      allergens: 'fruits à coque'
    },
    {
      name: 'Donald Trump',
      date: '20/02/23',
      time: '13:00',
      allergens: 'poisson, crustacé, gluten'
    },
  ]

  const showBookings = bookings.map((booking, i)=> {
    return (
      <BookingRows booking={booking} key={i} />
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