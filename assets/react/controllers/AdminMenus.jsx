import React, { useState, useEffect } from 'react'
import axios from 'axios'

import ModalMenu from './components/modals/ModalMenu'
import MenuTables from './components/MenuTables'

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
    let ignore = false
    if(!ignore){
      getMenus()
    }
    return () => {
      ignore = true
    }
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