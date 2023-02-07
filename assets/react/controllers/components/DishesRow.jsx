import React, {useState} from 'react'
import axios from 'axios'

import ModalDish from './modals/ModalDish'
import ShowApiResponse from './ShowApiResponse'

const DishesRow = ({ dish, categories, token }) => {

  const [showModalDish, setShowModalDish] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [message, setMessage] = useState([])

  const deleteDish = async (token) => {
    try {
      const res = await axios.delete(`/api/delete/dishes/${dish.id}`, {
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
    <tr>
      <td onClick={() => { setShowModalDish(prev => !prev) }}>{dish.name}</td>
      <td>{dish.category.name}</td>
      <td>{dish.description}</td>
      <td className='end'>{dish.price}</td>
      <td className='buttons'>
        <div className='buttons_div'>
          <div className='button_edit' onClick={() => { setShowModalDish(prev => !prev) }} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
          <div className='button_delete' onClick={() => setConfirmDelete(prev => !prev)}> <img src="../img/Trash.png" alt="delete" /></div>
        </div>
        {showModalDish ?
          <ModalDish dish={dish} categories={categories} showEdit={() => { setShowModalDish(prev => !prev) }} token={token} />
          : null}
        {confirmDelete ?
          <div className='confirm_delete_window'>
            <div className='confirm_delete_container'>
              <ShowApiResponse array={message} input={'message'} />
              <p>Voulez-vous vraiment supprimer le plat : {dish.name} ?</p>
              <div className='delete_buttons'>
                <button className='cancel_delete' onClick={() => setConfirmDelete(prev => !prev)}>Annuler</button>
                <button className='delete' onClick={() => {
                  // Manage deletion
                  deleteDish(token)
                }
                }>Supprimer</button>
              </div>
            </div>
          </div> : null}
      </td>
    </tr>
  )
}

export default DishesRow