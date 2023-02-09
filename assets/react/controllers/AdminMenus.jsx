import React, { useState, useEffect } from 'react'

import { getMenus } from '../utils/functions'
import ModalMenu from './components/modals/ModalMenu'
import MenuTables from './components/MenuTables'
import ShowApiResponse from './components/ShowApiResponse'

const AdminMenus = ({MenuCSRFToken, FormulaCSRFToken }) => {
  //const to store response from API
  const [message, setMessage] = useState([])

  //const to store data from the Database
  const [menus, setMenus] = useState([])

  // Const to display or not the modal allowing to add a menu
  const [showModalMenu, setShowModalMenu] = useState(false)

  // fetching data
  useEffect(()=> {
    let ignore = false
    if(!ignore){
      getMenus(setMenus, setMessage)
    }
    return () => {
      ignore = true
    }
  },[])
 
  // Mapping through menu datas to display tables
  const showMenus = menus.map(menu => {
    return (
      <MenuTables menu={menu} key={menu.id} tokenMenu={MenuCSRFToken} tokenFormula={FormulaCSRFToken}
      getData={()=> {
        getMenus(setMenus, setMessage)
      }}
      />
    )
  })
  return (
    <div className='admin_container'>
      <section>
        <h3>Gérer les menus :</h3>
        <ShowApiResponse array={message} input={'message'} />
          {showMenus}
       

        <button className='submit_button' onClick={() => { setShowModalMenu(prev => !prev) }}>Ajouter un menu</button>

        {showModalMenu ?
          <ModalMenu showEdit={() => setShowModalMenu(prev => !prev)} token={MenuCSRFToken}
          getData={()=> {
            getMenus(setMenus, setMessage)
          }} />
          : null}
      </section>

    </div>
  )
}

export default AdminMenus


// getting function
