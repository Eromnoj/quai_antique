import React, { useState } from 'react'
import axios from 'axios'
const ModalMenu = ({menu, showEdit}) => {

  const [menuName, setMenuName] = menu ? useState(menu.name) : useState('')

  const submitMenu = async () => {
    let url = menu ? `/api/update/menus/${menu.id}` : '/api/add/menus'
    try {
      const res = menu ? await axios.put(url, {name: menuName}) : await axios.post(url, {name: menuName})
      const data = await res.data
      console.log(data.message);
      setTimeout(()=> {
        window.location.reload(true)
      }, 1000)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='modal_window'>
    <div className='modal_container'>
      <div className='modal_header'><button className='close_button' onClick={showEdit}>Fermer</button></div>
      <div className='modal_body'>
        <form onSubmit={(e)=> {
          e.preventDefault()
          submitMenu()
        }}>
        <p>{menu ? `Modifier le menu : ${menu.name}` : 'Ajouter un menu'}</p>
          <div className='name_div'>
            <label htmlFor="name">Nom du Menu</label>
            <input type="text" name="name" id="name" value={menuName} onChange={(e) => setMenuName(e.target.value)} />
          </div>
          <input type="submit" value="Enregistrer" className='submit_button' />
        </form>
      </div>
    </div>
  </div>
  )
}

export default ModalMenu