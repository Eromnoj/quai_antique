import React, { useState } from 'react'

import ModalCategory from './modals/ModalCategory'
import ModalDelete from './modals/ModalDelete'  
const CategoryRow = ({ category, token, getData }) => {

  const [showModalCategory, setShowModalCategory] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [message, setMessage] = useState([])

  return (
    <tr>
      <td onClick={() => { setShowModalCategory(prev => !prev) }}>{category.name}</td>
      <td className='end'>{category.rank_display}</td>
      <td className='buttons'>
        <div className='buttons_div'>
          <div className='button_edit' onClick={() => { setShowModalCategory(prev => !prev) }} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
          <div className='button_delete' onClick={() => setConfirmDelete(prev => !prev)}> <img src="../img/Trash.png" alt="delete" /></div>
        </div>
        {showModalCategory ?
          <ModalCategory cat={category} showEdit={() => { setShowModalCategory(prev => !prev) }} token={token} getData={() => { getData() }} />
          : null}
        {confirmDelete ?

          <ModalDelete message={message}
            setMessage={setMessage}
            token={token}
            item={category}
            setConfirmDelete={setConfirmDelete}
            getData={getData}
            url={'/api/delete/categories/'} />

          : null}
      </td>
    </tr>
  )
}

export default CategoryRow
