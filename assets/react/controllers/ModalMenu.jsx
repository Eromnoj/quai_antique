import React, { useState } from 'react'

const ModalMenu = ({name, showEdit}) => {

  const [menu, setMenu] = name ? useState('name') : useState('')

  return (
    <div className='modal_window'>
    <div className='modal_container'>
      <div className='modal_header'><button className='close_button' onClick={showEdit}>Fermer</button></div>
      <div className='modal_body'>
        <form>
        <p>{name ? `Modifier le menu : ${name}` : 'Ajouter un menu'}</p>
          <div className='name_div'>
            <label htmlFor="name">Nom du Menu</label>
            <input type="text" name="name" id="name" value={menu} onChange={(e) => setMenu(e.target.value)} />
          </div>
          <input type="submit" value="Enregistrer" className='submit_button' />
        </form>
      </div>
    </div>
  </div>
  )
}

export default ModalMenu