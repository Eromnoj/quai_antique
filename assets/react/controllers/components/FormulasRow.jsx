import React, {useState} from 'react'
import ModalFormula from './modals/ModalFormula'
import ModalDelete from './modals/ModalDelete'

const FormulasRow = ({ formula, menuId, token, getData }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showModalFormula, setShowModalFormula] = useState(false)
  const [message, setMessage] = useState([])

  return (
    <tr>
      <td>{formula.name}</td>
      <td>{formula.description}</td>
      <td className='end'>{formula.price} €</td>
      <td className='buttons'><div className='buttons_div'>
        <div className='button_edit' onClick={() => {setShowModalFormula(prev => !prev) }} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
        <div className='button_delete' onClick={() => { setConfirmDelete(prev => !prev) }}> <img src="../img/Trash.png" alt="delete" /></div>
      </div>
      {showModalFormula ?
      <ModalFormula formula={formula}  menuId={menuId} showEdit={() => {setShowModalFormula(prev => !prev) }} token={token} getData={getData} />
      :null}
      {confirmDelete ?
              
          <ModalDelete message={message}
          setMessage={setMessage}
          token={token}
          item={formula}
          setConfirmDelete={setConfirmDelete}
          getData={getData}
          url={'/api/delete/formulas/'} />
              
               : null}
      </td>
    </tr>
  )
}


export default FormulasRow