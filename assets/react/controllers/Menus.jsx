import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'

const Menus = () => {
  const [menus, setMenus] = useState([])

  const getMenusWithFormulas = async () => {
    try {
      const res = await axios.get('/api/menu_with_formulas')
      const data = await res.data
      setMenus(data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMenusWithFormulas()
  }, [])

  const showMenus = menus.map(menu => {
    return (
      <div className='item' key={menu.id}>
        <div className='item_title'><h3>{menu.name}</h3></div>
      <div className='item_body'>

        {
          menu.formulas.map(formula => {
            return (
              <div className='item_formula' key={formula.id}>
                <div className='formula_title'>
                  <h4>{formula.name}</h4>
                </div>
                <div className='formula_description'>{formula.description}</div>
                <div className='formula_price'>{formula.price} €</div>
              </div>
            )
          })
        }
        </div>
      </div>
    )
  })
  return (
    <div className='menus_container'>
      <div className='page_title'><h2>Les Menus</h2></div>

      <div className='menus_items'>

        {showMenus}

      </div>

    </div>
  )
}

export default Menus