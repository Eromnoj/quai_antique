import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react';


const Dishes = () => {

  const [categories, setCategories] = useState([]);

  const getCategoriesWithDishes = async () => {
    try {
      const res = await axios.get('/api/category_with_dishes')
      const data = await res.data

      setCategories(data)
    } catch (error) {
      console.log(error);
    }

  }
  useEffect(() => {
    getCategoriesWithDishes()
  }, [])

  const showCategories = categories.map(category => {
    return (
      <div className='category_container' key={category.id} style={{display: category.dishes.length <= 0 ? 'none' : null}}>
        <div className='category_title'>
          <h3>{category.name}</h3>
        </div>

        <div className='category_items'>
          {category.dishes.map((dish) => {
            return (
              <div className='item' key={dish.id}>
                <div className='item_name'>
                  {dish.name}
                </div>
                <div className='item_description'>
                  {dish.description}
                </div>
                <div className='item_price'>
                  {dish.price} €
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  })
  return (
    <div className='dishes_container'>
      <div className='page_title'><h2>La Carte</h2></div>

      {showCategories}
    </div>
  )
}

export default Dishes 