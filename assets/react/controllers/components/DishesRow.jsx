import React, {useState} from 'react'
import { deleteItem } from '../../utils/functions'

import ModalDish from './modals/ModalDish'
import ShowApiResponse from './ShowApiResponse'

const DishesRow = ({ dish, categories, token, getData}) => {

  const [showModalDish, setShowModalDish] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [message, setMessage] = useState([])

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
          <ModalDish dish={dish} categories={categories} showEdit={() => { setShowModalDish(prev => !prev) }} token={token} getData={getData}/>
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
                  deleteItem(token, '/api/delete/dishes/', dish.id, setMessage, getData)
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



