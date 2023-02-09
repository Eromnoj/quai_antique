import React, {useState} from 'react'
import { deleteItem } from '../../utils/functions'
import ShowApiResponse from './ShowApiResponse'
import ModalImage from './modals/ModalImage'

const ImageCard = ({ image, token, getData }) => {

  const [showEdit, setShowEdit] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [message, setMessage] = useState([])

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
                deleteItem(token, '/api/delete/image/', image.id, setMessage, getData)
              }
              }>Supprimer</button>
            </div>
          </div>
        </div> : null}
    </>
  )

}

export default ImageCard