import React, {useState} from 'react'

import ModalMenu from './modals/ModalMenu'
import ModalFormula from './modals/ModalFormula'
import ModalDelete from './modals/ModalDelete'
import FormulasRow from './FormulasRow'

const MenuTables = ({ menu, tokenMenu, tokenFormula, getData}) => {

  const showFormulas = menu.formulas.map(formula => {
    return (
      <FormulasRow formula={formula} key={formula.id}  menuId={menu.id} token={tokenFormula} getData={getData} />
    )
  })

  const [showModalMenu, setShowModalMenu] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [message, setMessage] = useState([])
  const [showModalFormula, setShowModalFormula] = useState(false)

  return (
    <div className='div_table'>
    <table>
      <thead>
        <tr>
          <th>
            Nom du menu :
          </th>
          <td colSpan={2} className='menu_name'>

            {menu.name}

          </td>
          <td className='buttons menu_name'>
            <div className='buttons_div'>
              <div className='button_edit' onClick={() => { setShowModalMenu(prev => !prev) }} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
              <div className='button_delete' onClick={() => { setConfirmDelete(prev => !prev) }}> <img src="../img/Trash.png" alt="delete" /></div>
            </div>
            {showModalMenu ?
              <ModalMenu menu={menu} showEdit={() => { setShowModalMenu(prev => !prev) }} token={tokenMenu} getData={getData} />
              : null}
            {confirmDelete ?
              
          <ModalDelete message={message}
          setMessage={setMessage}
          token={tokenMenu}
          item={menu}
          setConfirmDelete={setConfirmDelete}
          getData={getData}
          url={'/api/delete/menus/'} />
              
               : null}
          </td>
        </tr>
        <tr>
          <th>Les formules</th>
          <th colSpan={3}>
            <button className='add_formula_button' onClick={() => {setShowModalFormula(prev=> !prev) }}>Ajouter une formule</button>
            {showModalFormula ? 
            <ModalFormula menuId={menu.id} showEdit={() => {setShowModalFormula(prev=> !prev) }} token={tokenFormula}  getData={getData}/>
          :null}
          </th>
        </tr>
        <tr>
          <th>Nom</th>
          <th>Description</th>
          <th>Prix</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {showFormulas}
      </tbody>
    </table>
    </div>
  )
}

export default MenuTables