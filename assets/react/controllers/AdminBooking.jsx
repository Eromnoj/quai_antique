import React, { useState } from 'react'
import ModalBooking from './ModalBooking'
import axios from 'axios'
import { useEffect } from 'react'
import moment from 'moment/moment'
import ShowApiResponse from './ShowApiResponse'

const BookingRows = ({booking, token}) => {

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

const AdminBooking = ({BookingCSRFToken}) => {

  const [bookings, setBookings] = useState([])

  const [page, setPage] = useState(0)

  const [max, setMax] = useState(10)

  const [count, setCount] = useState(0)
  const getBookings = async () => {
    try {
      const res = await axios.get(`/api/booking?page=${page}&max=${max}`)
      const data = await res.data
      setCount(data.count)
      setBookings(data.booking)
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    getBookings()
  },[page])
  
  const showBookings = bookings.map(booking=> {
    return (
      <BookingRows booking={booking} key={booking.id} token={BookingCSRFToken} />
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
        <div className='pagination'>
          <button disabled={page === 0 ? true : false} onClick={() => setPage(prev => prev - 1)}><img src='../img/CaretLeft.png' /></button>
          <p>{page + 1}</p>
          <button onClick={() => setPage(prev => prev + 1)} disabled={count <= page * max + bookings.length ? true : false} ><img src='../img/CaretRight.png' /></button>
        </div>
        <button className='submit_button' onClick={() => { setShowAddBooking(prev => !prev)}}>Ajouter une réservation</button>
        {showAddBooking ?
        <ModalBooking showEdit={() => setShowAddBooking(prev => !prev)} token={BookingCSRFToken} />
      :null}
      </section>


    </div>
  )
}

export default AdminBooking