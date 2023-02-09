import React, { useState, useEffect } from 'react'

import { getBookings } from '../utils/functions'
import ModalBooking from './components/modals/ModalBooking'
import BookingRow from './components/BookingRow'

const AdminBooking = ({ BookingCSRFToken }) => {

  // const to store datas
  const [bookings, setBookings] = useState([])

  // Const to manage pagination
  const [page, setPage] = useState(0)
  const [max, setMax] = useState(10)
  const [count, setCount] = useState(0)

  // const to manage filter by name
  const [nameFilter, setNameFilter] = useState('')

  // Const to display or not the modal allowing to add a booking
  const [showAddBooking, setShowAddBooking] = useState(false)

  useEffect(() => {
    let ignore = false
    if (!ignore) {
      getBookings(page, max, setCount, setBookings, nameFilter)
    }
    return () => {
      ignore = true
    }
  }, [page, nameFilter])

  // Mapping through booking datas to display rows
  const showBookings = bookings.map(booking => {
    return (
      <BookingRow booking={booking} key={booking.id} token={BookingCSRFToken}
        getData={() => {
          setPage(0)
          setNameFilter('')
          getBookings(page, max, setCount, setBookings, nameFilter)
        }} />
    )
  })

  return (
    <div className='admin_container'>
      <section>
        <h3>Visualiser et gérer les réservations :</h3>

        <div className='lastname_div'>
          <label htmlFor="lastname">Recherche Par nom :</label>
          <input type="text" name="lastname" id="lastname" value={nameFilter} onChange={(e) => {
            setNameFilter(e.target.value)
            setPage(0)
          }

          } />
        </div>
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
        <button className='submit_button' onClick={() => { setShowAddBooking(prev => !prev) }}>Ajouter une réservation</button>
        {showAddBooking ?
          <ModalBooking showEdit={() => setShowAddBooking(prev => !prev)} token={BookingCSRFToken}
            getData={() => {
              setPage(0)
              setNameFilter('')
              getBookings(page, max, setCount, setBookings, nameFilter)
            }} />
          : null}
      </section>


    </div>
  )
}

export default AdminBooking

//Getting function 

