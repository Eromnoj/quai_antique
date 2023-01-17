import React, { useState } from 'react'
import EditSchedule from './EditSchedule'
import ModalImage from './ModalImage'

const TableRow = ({ day }) => {

  const [showEdit, setShowEdit] = useState(false)

  return (
    <>
      <tr>
        <td className="day">{day}</td>
        <td>12:00</td>
        <td>15:00</td>
        <td className='closed'>x</td>
        <td>19:00</td>
        <td>22:30</td>
        <td className='closed'></td>
        <td><div onClick={() => {
          setShowEdit(prev => !prev)

        }}><img src="../img/Edit-alt.png" alt="edit" /></div>
          {showEdit ? <EditSchedule day={day} setEdit={() => setShowEdit(prev => !prev)} /> : null}

        </td>
      </tr>
    </>
  )
}

const ImageCard = ({ image }) => {

  const [showEdit, setShowEdit] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  return (
    <>
      <div className='card'>
        <div className='card_image'>
          <img src={image.url} alt={image.description} />
        </div>
        <div className='card_description'>
          <p>{image.description}</p>
        </div>
        <div className='card_buttons'>
          <div className='button_edit' onClick={()=> setShowEdit(prev => !prev)} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
          <div className='button_delete' onClick={()=> setConfirmDelete(prev => !prev)}> <img src="../img/Trash.png" alt="delete" /></div>
        </div>
      </div>
      {showEdit ?
      <ModalImage image={image} showEdit={()=> setShowEdit(prev => !prev)} />
      : null}
      {confirmDelete ? 
      <div className='confirm_delete_window'>
        <div className='confirm_delete_container'>
          <p>Voulez-vous vraiment supprimer l'image {image.description} ?</p>
          <div className='delete_buttons'>
            <button className='cancel_delete' onClick={()=> setConfirmDelete(prev => !prev)}>Annuler</button>
            <button className='delete' onClick={()=> {
              // Manage deletion
              confirmDelete(prev => !prev)}
              }>Supprimer</button>
          </div>
        </div>
      </div> : null}
    </>
  )

}


const AdminRestaurant = () => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

  const images = [
    { url: '../img/image_un.jpg', description: 'Lorem Ipsum' },
    { url: '../img/image_deux.jpg', description: 'Batristrzeg' },
    { url: '../img/image_trois.jpg', description: 'sdfsdfsdf sdfze voergpn' }]



  const tableRows = days.map((day, i) => {
    return (
      <TableRow day={day} key={i} />
    )
  })

  const imageCards = images.map((image, i) => {
    return (
      <ImageCard image={image} key={i} />
    )
  })

  const [showModalImage, setShowModalImage] = useState(false)
  return (
    <div className='admin_container'>
      <section>
        <h3>Information du Restaurant</h3>
        <form className='info_form'>
          <div className='form_inputs'>

            <div className='addess_div'>
              <label htmlFor="address">Adresse :</label>
              <input type="text" name="address" id="address" />
            </div>
            <div className='city_div'>
              <label htmlFor="city">Adresse :</label>
              <input type="text" name="city" id="city" />
            </div>
            <div className='postcode_div'>
              <label htmlFor="postcode">Code Postal :</label>
              <input type="number" name="postcode" id="postcode" />
            </div>
            <div className='phone_div'>
              <label htmlFor="phone">Numéro de téléphone :</label>
              <input type="tel" name="phone" id="phone" />
            </div>
          </div>
          <button type="submit" className='submit_button'>Sauvegarder</button>
        </form>
      </section>

      <section>
        <h3>Modifier les horaires : </h3>


        <div className='div_table'>

          <table>
            <thead>
              <tr>
                <th></th>
                <th colSpan={3}>Midi</th>
                <th colSpan={3}>Soir</th>
                <th></th>
              </tr>
              <tr>
                <th></th>
                <th>Début</th>
                <th>Fin</th>
                <th>Fermé</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Fermé</th>
                <th>Modifier</th>
              </tr>
            </thead>
            <tbody>
              {tableRows}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3>Images de la page d'accueil</h3>
        <div className='image_showcase'>
          {imageCards}
        </div>
        <button className='submit_button' onClick={()=> setShowModalImage(prev=>!prev)}>Ajouter une image</button>
      </section>
      {showModalImage? 
      <ModalImage showEdit={()=> setShowModalImage(prev=>!prev)} />
      :null}

    </div>
  )
}

export default AdminRestaurant