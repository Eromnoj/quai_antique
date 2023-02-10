import React, { useState } from 'react'

import ModalDish from './modals/ModalDish'
import ModalDelete from './modals/ModalDelete'

const DishesRow = ({ dish, categories, token, getData }) => {

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
          <ModalDish dish={dish} categories={categories} showEdit={() => { setShowModalDish(prev => !prev) }} token={token} getData={getData} />
          : null}
        {confirmDelete ?

          <ModalDelete message={message}
            setMessage={setMessage}
            token={token}
            item={dish}
            setConfirmDelete={setConfirmDelete}
            getData={getData}
            url={'/api/delete/dishes/'} />

          : null}
      </td>
    </tr>
  )
}

export default DishesRow



