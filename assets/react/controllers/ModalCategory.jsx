import React, { useState } from 'react'

const ModalCategory = ({cat, showEdit}) => {

  const [category, setCategory] = cat ? useState(cat) : useState('')
  return (
    <div className='modal_window'>
    <div className='modal_container'>
      <div className='modal_header'><button className='close_button' onClick={showEdit}>Fermer</button></div>
      <div className='modal_body'>
        <form>
        <p>{cat ? `Modifier ${cat}` : 'Ajouter une catégorie'}</p>
          <div className='description_div'>
            <label htmlFor="description">Changer le nom de la catégorie</label>
            <input type="text" name="description" id="description" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <input type="submit" value="Enregistrer" className='submit_button' />
        </form>
      </div>
    </div>
  </div>
  )
}

export default ModalCategory