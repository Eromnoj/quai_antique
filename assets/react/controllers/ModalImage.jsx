import React, { useState } from 'react'

const ModalImage = ({ image, showEdit }) => {

  const [description, setDescription] = image ? useState(image.description) : useState('')

  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' onClick={showEdit}>Fermer</button></div>
        <div className='modal_body'>
          <form encType='multipart/form-data'>
          <p>{image ? `Modifier ${image.description}` : 'Ajouter une image'}</p>
            <div className='img_div'>
              <label htmlFor="image">Changer l'image</label>
              <input type="file" name="image" id="image" />
            </div>
            <div className='description_div'>
              <label htmlFor="description">Changer la description</label>
              <input type="text" name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <input type="submit" value="Enregistrer" className='submit_button' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalImage