import React, {useState} from 'react'

import ModalImage from './modals/ModalImage'
import ModalDelete from './modals/ModalDelete'

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
        
        <ModalDelete message={message}
        setMessage={setMessage}
        token={token}
        item={image}
        setConfirmDelete={setConfirmDelete}
        getData={getData}
        url={'/api/delete/image/'} />
        
        : null}
    </>
  )

}

export default ImageCard