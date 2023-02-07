import React, {useState} from 'react'
import axios from 'axios'
import ShowApiResponse from './ShowApiResponse'
import ModalImage from './modals/ModalImage'

const ImageCard = ({ image, token }) => {

  const [showEdit, setShowEdit] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [message, setMessage] = useState([])

  const deleteImage = async (token) => {
    try {
      const res = await axios.delete(`/api/delete/image/${image.id}`, {
        data: {
          token
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
    <>
      <div className='card'>
        <div className='card_image'>
          <img src={`../img/upload/${image.url}`} alt={image.description} />
        </div>
        <div className='card_description'>
          <p>{image.description}</p>
        </div>
        <div className='card_buttons'>
          <div className='button_edit' onClick={() => setShowEdit(prev => !prev)} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
          <div className='button_delete' onClick={() => setConfirmDelete(prev => !prev)}> <img src="../img/Trash.png" alt="delete" /></div>
        </div>
      </div>
      {showEdit ?
        <ModalImage image={image} token={token} showEdit={() => setShowEdit(prev => !prev)} />
        : null}
      {confirmDelete ?
        <div className='confirm_delete_window'>
          <div className='confirm_delete_container'>
                <ShowApiResponse array={message} input={'message'} />
            <p>Voulez-vous vraiment supprimer l'image {image.description} ?</p>
            <div className='delete_buttons'>
              <button className='cancel_delete' onClick={() => setConfirmDelete(prev => !prev)}>Annuler</button>
              <button className='delete' onClick={() => {
                // Manage deletion
                deleteImage(token)
              }
              }>Supprimer</button>
            </div>
          </div>
        </div> : null}
    </>
  )

}


export default ImageCard