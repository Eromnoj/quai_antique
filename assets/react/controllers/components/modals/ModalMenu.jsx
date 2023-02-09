import React, { useState } from 'react'
import { submitItem } from '../../../utils/functions'
import ShowApiResponse from '../ShowApiResponse'

const ModalMenu = ({ menu, showEdit, token, getData }) => {
  // Display response from API
  const [message, setMessage] = useState([])

  const [menuData, setMenuData] = menu ?
    useState({
      name: menu.name,
      token: token
    })
    : useState({
      name: '',
      token: token
    })

  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button'
          onClick={() => {
            getData()
            showEdit()
          }}>Fermer</button></div>
        <div className='modal_body'>
          <ShowApiResponse array={message} input={'message'} />

          <form onSubmit={(e) => {
            e.preventDefault()
            setMessage([])
            submitItem(menu, menuData, setMessage, getData, showEdit, 'menus')
          }}>
            <p>{menu ? `Modifier le menu : ${menu.name}` : 'Ajouter un menu'}</p>
            <div className='name_div'>
              <label htmlFor="name">Nom du Menu</label>
              <input type="text" name="name" id="name" value={menuData.name} onChange={(e) => setMenuData(prev => {
                 return {...prev, name: e.target.value}
              })} />

              <ShowApiResponse array={message} input={'name'} />

            </div>
            <input type="submit" value="Enregistrer" className='submit_button' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalMenu
