import React, {useState} from 'react'
import ModalFormula from './modals/ModalFormula'
import axios from 'axios'
import ShowApiResponse from './ShowApiResponse'


const FormulasRow = ({ formula, menuId, token }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showModalFormula, setShowModalFormula] = useState(false)
  const [message, setMessage] = useState([])

  const deleteFormula = async (token) => {
    try {
      const res = await axios.delete(`/api/delete/formulas/${formula.id}`, {
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
      <td>{formula.name}</td>
      <td>{formula.description}</td>
      <td className='end'>{formula.price} €</td>
      <td className='buttons'><div className='buttons_div'>
        <div className='button_edit' onClick={() => {setShowModalFormula(prev => !prev) }} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
        <div className='button_delete' onClick={() => { setConfirmDelete(prev => !prev) }}> <img src="../img/Trash.png" alt="delete" /></div>
      </div>
      {showModalFormula ?
      <ModalFormula formula={formula}  menuId={menuId} showEdit={() => {setShowModalFormula(prev => !prev) }} token={token} />
      :null}
      {confirmDelete ?
              <div className='confirm_delete_window'>
                <div className='confirm_delete_container'>
                <ShowApiResponse array={message} input={'message'} />
                  <p>Voulez-vous vraiment supprimer le menu : {formula.name} ?</p>
                  <div className='delete_buttons'>
                    <button className='cancel_delete' onClick={() => setConfirmDelete(prev => !prev)}>Annuler</button>
                    <button className='delete' onClick={() => {
                      // Manage deletion
                      deleteFormula(token)
                    }
                    }>Supprimer</button>
                  </div>
                </div>
              </div> : null}
      </td>
    </tr>
  )
}


export default FormulasRow