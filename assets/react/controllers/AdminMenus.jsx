import React, { useState } from 'react'
import ModalMenu from './ModalMenu'
import ModalFormula from './ModalFormula'

const FormulasRows = ({ formula }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showModalFormula, setShowModalFormula] = useState(false)
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
      <ModalFormula formula={formula} showEdit={() => {setShowModalFormula(prev => !prev) }} />
      :null}
      {confirmDelete ?
              <div className='confirm_delete_window'>
                <div className='confirm_delete_container'>
                  <p>Voulez-vous vraiment supprimer le menu : {formula.name} ?</p>
                  <div className='delete_buttons'>
                    <button className='cancel_delete' onClick={() => setConfirmDelete(prev => !prev)}>Annuler</button>
                    <button className='delete' onClick={() => {
                      // Manage deletion
                      setConfirmDelete(prev => !prev)
                    }
                    }>Supprimer</button>
                  </div>
                </div>
              </div> : null}
      </td>
    </tr>
  )
}

const MenuTables = ({ menu }) => {

  const showFormulas = menu.formulas.map((formula, i) => {
    return (
      <FormulasRows formula={formula} key={i} />
    )
  })

  const [showModalMenu, setShowModalMenu] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

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
              <ModalMenu name={menu.name} showEdit={() => { setShowModalMenu(prev => !prev) }} />
              : null}
            {confirmDelete ?
              <div className='confirm_delete_window'>
                <div className='confirm_delete_container'>
                  <p>Voulez-vous vraiment supprimer le menu : {menu.name} ?</p>
                  <div className='delete_buttons'>
                    <button className='cancel_delete' onClick={() => setConfirmDelete(prev => !prev)}>Annuler</button>
                    <button className='delete' onClick={() => {
                      // Manage deletion
                      setConfirmDelete(prev => !prev)
                    }
                    }>Supprimer</button>
                  </div>
                </div>
              </div> : null}
          </td>
        </tr>
        <tr>
          <th>Les formules</th>
          <th colSpan={3}>
            <button className='add_formula_button' onClick={() => {setShowModalFormula(prev=> !prev) }}>Ajouter une formule</button>
            {showModalFormula ? 
            <ModalFormula showEdit={() => {setShowModalFormula(prev=> !prev) }} />
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



const AdminMenus = () => {

  const menus = [
    {
      name: 'Un menu',
      formulas: [
        {
          name: 'une formule',
          description: 'une description',
          price: '15'
        },
        {
          name: 'une autre formule',
          description: 'une description',
          price: '25'
        },
        {
          name: 'encore une formule',
          description: 'une description',
          price: '35'
        }
      ]
    },
    {
      name: 'Un autre menu',
      formulas: [
        {
          name: 'une formule encore',
          description: 'une description',
          price: '15'
        },
        {
          name: 'une autre formule encore',
          description: 'une description',
          price: '25'
        },
        {
          name: 'encore une formule...',
          description: 'une description',
          price: '3500'
        }
      ]
    }
  ]

  const [showModalMenu, setShowModalMenu] = useState(false)

  const showMenus = menus.map((menu, i) => {
    return (
      <MenuTables menu={menu} key={i} />
    )
  })
  return (
    <div className='admin_container'>
      <section>
        <h3>Gérer les menus :</h3>
        
          {showMenus}
       

        <button className='submit_button' onClick={() => { setShowModalMenu(prev => !prev) }}>Ajouter un menu</button>

        {showModalMenu ?
          <ModalMenu showEdit={() => setShowModalMenu(prev => !prev)} />
          : null}
      </section>

    </div>
  )
}

export default AdminMenus