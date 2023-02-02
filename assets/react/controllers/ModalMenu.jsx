import React, { useState } from 'react'
import axios from 'axios'
import ShowApiResponse from './ShowApiResponse'

const ModalMenu = ({ menu, showEdit, token }) => {
  // Display response from API
  const [message, setMessage] = useState([])

  const [menuName, setMenuName] = menu ? useState(menu.name) : useState('')

  const submitMenu = async () => {
    let url = menu ? `/api/update/menus/${menu.id}` : '/api/add/menus'
    try {
      const res = menu ? await axios.put(url, { name: menuName, token: token }) : await axios.post(url, { name: menuName, token: token })
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
    }
  }
  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' onClick={showEdit}>Fermer</button></div>
        <div className='modal_body'>
          <ShowApiResponse array={message} input={'message'} />

          <form onSubmit={(e) => {
            e.preventDefault()
            setMessage([])
            submitMenu()
          }}>
            <p>{menu ? `Modifier le menu : ${menu.name}` : 'Ajouter un menu'}</p>
            <div className='name_div'>
              <label htmlFor="name">Nom du Menu</label>
              <input type="text" name="name" id="name" value={menuName} onChange={(e) => setMenuName(e.target.value)} />

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