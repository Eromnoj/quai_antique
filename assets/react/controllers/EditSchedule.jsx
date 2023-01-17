import React from 'react'

const EditSchedule = ({ day, setEdit }) => {
  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' onClick={setEdit}>Fermer</button></div>
        <div className='modal_body'>
          <p>Changer les horaires de {day}</p>
          <form>
            <div className='noon_schedule'>
              <p>Service du midi</p>
              <div>
                <label htmlFor="noonStart">Début du service</label>
                <input type="time" name="noonStart" id="noonStart" />
              </div>
              <div>

                <label htmlFor="noonEnd">Fin du service</label>
                <input type="time" name="noonEnd" id="noonEnd" />
              </div>
              <div className='noon_closed_div'>
                <label htmlFor="noonClosed">Cochez pour indiquer la fermeture de la salle</label>
                <input type="checkbox" name="noonClosed" id="noonClosed" />
              </div>

            </div>
            <div className='evening_schedule'>

              <p>Service du soir</p>
              <div>

                <label htmlFor="eveningStart">Début du service</label>
                <input type="time" name="eveningStart" id="eveningStart" />
              </div>
              <div>

                <label htmlFor="eveningEnd">Fin du service</label>
                <input type="time" name="eveningEnd" id="eveningEnd" />
              </div>
              <div className='evening_closed_div'>
                <label htmlFor="eveningClosed">Cochez pour indiquer la fermeture de la salle</label>
                <input type="checkbox" name="eveningClosed" id="eveningClosed" />
              </div>
            </div>
            <input type="submit" value="Enregistrer" className='submit_button'/>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditSchedule