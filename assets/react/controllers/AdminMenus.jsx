import React, { useState } from 'react'
import ModalMenu from './ModalMenu'
import ModalFormula from './ModalFormula'
import axios from 'axios'
import { useEffect } from 'react'
import ShowApiResponse from './ShowApiResponse'

const FormulasRows = ({ formula, menuId, token }) => {
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

const MenuTables = ({ menu, tokenMenu, tokenFormula}) => {

  const showFormulas = menu.formulas.map(formula => {
    return (
      <FormulasRows formula={formula} key={formula.id}  menuId={menu.id} token={tokenFormula} />
    )
  })

  const [showModalMenu, setShowModalMenu] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [message, setMessage] = useState([])
  const [showModalFormula, setShowModalFormula] = useState(false)

  const deleteMenu = async (token) => {
    try {
      const res = await axios.delete(`/api/delete/menus/${menu.id}`, {
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
              <ModalMenu menu={menu} showEdit={() => { setShowModalMenu(prev => !prev) }} token={tokenMenu} />
              : null}
            {confirmDelete ?
              <div className='confirm_delete_window'>
                <div className='confirm_delete_container'>
                <ShowApiResponse array={message} input={'message'} />
                  <p>Voulez-vous vraiment supprimer le menu : {menu.name} ?</p>
                  <div className='delete_buttons'>
                    <button className='cancel_delete' onClick={() => setConfirmDelete(prev => !prev)}>Annuler</button>
                    <button className='delete' onClick={() => {
                      // Manage deletion
                      deleteMenu(tokenMenu)
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
            <ModalFormula menuId={menu.id} showEdit={() => {setShowModalFormula(prev=> !prev) }} token={tokenFormula}/>
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



const AdminMenus = ({MenuCSRFToken, FormulaCSRFToken }) => {

  const [menus, setMenus] = useState([])

  const getMenus = async () => {
    try {
      const res = await axios.get('/api/menus')
      const data = await res.data
      setMenus(data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    getMenus()
  },[])
 
  const [showModalMenu, setShowModalMenu] = useState(false)

  const showMenus = menus.map(menu => {
    return (
      <MenuTables menu={menu} key={menu.id} tokenMenu={MenuCSRFToken} tokenFormula={FormulaCSRFToken}/>
    )
  })
  return (
    <div className='admin_container'>
      <section>
        <h3>Gérer les menus :</h3>
        
          {showMenus}
       

        <button className='submit_button' onClick={() => { setShowModalMenu(prev => !prev) }}>Ajouter un menu</button>

        {showModalMenu ?
          <ModalMenu showEdit={() => setShowModalMenu(prev => !prev)} token={MenuCSRFToken} />
          : null}
      </section>

    </div>
  )
}

export default AdminMenus