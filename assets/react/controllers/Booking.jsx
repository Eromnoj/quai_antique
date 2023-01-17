import React from 'react'

const Booking = () => {
  return (
    <div className='booking_container'>
      <div className='booking_title'>
        <h2>Réserver une table</h2>

      </div>
        <form className='form'>
          <div className='booking_infos'>
            <div className='date_div'>
              <label htmlFor="date">Date :</label>
              <input type="date" name="date" id="date" />
            </div>
            <div className='number_div'>
              <label htmlFor="number">Couverts :</label>
              <input type="number" name="number" id="number" />
            </div>
            <div className='shift_div'>
              <label htmlFor="shift">Service :</label>
              <select name="shift" id="shift">
                <option value="noon">Midi</option>
                <option value="evening">Soir</option>
              </select>
            </div>
          </div>
          <div className='available'>
            <p>Place disponible : <span>23</span></p>
          </div>
          <div className='hour_choice'>
            <div className='hours'>
              <input type="radio" name="hour_to_choose" id="time_1" value="12:00" />
              <label htmlFor="time_1">12:00</label>
            </ div>
            <div className='hours'>
              <input type="radio" name="hour_to_choose" id="time_2" value="12:15" />
              <label htmlFor="time_2">12:15</label>
            </ div>
            <div className='hours'>
              <input type="radio" name="hour_to_choose" id="time_3" value="12:30" />
              <label htmlFor="time_3">12:30</label>
            </ div>
            <div className='hours'>
              <input type="radio" name="hour_to_choose" id="time_4" value="12:45" />
              <label htmlFor="time_4">12:45</label>
            </ div>
            <div className='hours'>
              <input type="radio" name="hour_to_choose" id="time_5" value="13:00" />
              <label htmlFor="time_5">13:00</label>
            </ div>
            <div className='hours'>
              <input type="radio" name="hour_to_choose" id="time_6" value="13:45" />
              <label htmlFor="time_6">13:15</label>
            </ div>
            <div className='hours'>
              <input type="radio" name="hour_to_choose" id="time_7" value="13:30" />
              <label htmlFor="time_7">13:30</label>
            </ div>
            <div className='hours'>
              <input type="radio" name="hour_to_choose" id="time_8" value="13:45" />
              <label htmlFor="time_8">13:45</label>
            </ div>
            <div className='hours'>
              <input type="radio" name="hour_to_choose" id="time_9" value="14:00" />
              <label htmlFor="time_9">14:00</label>
            </ div>
          </div>
          <div className='allergen_div'>
            <label htmlFor="allergen">Veuillez signaler d'éventuelles allergies</label>
            <textarea name="allergen" id="allergen"></textarea>
          </div>
          <div className='user_info'>
            <div className='name_div'>
              <label htmlFor="name">Votre nom :</label>
              <input type="text" name="name" id="name" />
            </div>
            <div className='email_div'>
              <label htmlFor="email">Votre email :</label>
              <input type="email" name="email" id="email" />
            </div>
            <div className='phone_div'>
              <label htmlFor="phone">Votre téléphone :</label>
              <input type="tel" name="phone" id="phone" />
            </div>
          </div>
          <div className='disclaimer'>
            <p>Le restaurant est susceptible de vous appeler pour confirmer la réservation</p>
          </div>

          <button type="submit" className='submit_button'>Confirmer la réservation</button>


        </form>
    </div>
  )
}

export default Booking