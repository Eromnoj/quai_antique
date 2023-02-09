import React, { useState, useEffect } from 'react'

import { getCategory, getDish } from '../utils/functions'
import ModalCategory from './components/modals/ModalCategory'
import ModalDish from './components/modals/ModalDish'
import ShowApiResponse from './components/ShowApiResponse'

import CategoryRow from './components/CategoryRow'
import DishesRow from './components/DishesRow'


const AdminDishes = ({ CategoryCSRFToken, DishesCSRFToken }) => {

    //const to store response from API
    const [message, setMessage] = useState([])

  // const to store datas
  const [categories, setCategories] = useState([])
  const [dishes, setDishes] = useState([])

  // const to manage pagination and filtering
  const [page, setPage] = useState(0)
  const [max, setMax] = useState(10)
  const [count, setCount] = useState(0)
  const [categoryId, setCategoryId] = useState(null)

  // const allowing to display or not modals to add category or dish
  const [showModalCategory, setShowModalCategory] = useState(false)
  const [showModalDish, setShowModalDish] = useState(false)

  // Fetching Datas
  useEffect(() => {
    let ignore = false
    if(!ignore){
      getCategory(setCategories, setMessage)
    }
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false
    if(!ignore){
      getDish(page, max, categoryId, setCount, setDishes, setMessage)
    }
    return () => {
      ignore = true
    }
  }, [page, categoryId]) //re-fetch if page or filter are changing

  // Mapping through category datas to display rows
  const showCategories = categories.map(category => {
    return (
      <CategoryRow category={category} key={category.id} token={CategoryCSRFToken}
      getData={()=> {
        getCategory(setCategories, setMessage)
        getDish(page, max, categoryId, setCount, setDishes, setMessage)
      }}
      />
    )
  })

  // Mapping through dish datas to display rows
  const showDishes = dishes.map(dish => {
    return (
      <DishesRow dish={dish} categories={categories} key={dish.id} token={DishesCSRFToken}
      getData={()=> {
        setPage(0)
        getDish(page, max, categoryId, setCount, setDishes, setMessage)
      }}
       />
    )
  })


  return (
    <div className='admin_container'>
      <section>
        <h3>Gérer les catégories :</h3>
        <ShowApiResponse array={message} input={'message'} />
        <div className='div_table'>

          <table>
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Ordre d'affichage</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {showCategories}
            </tbody>
          </table>
        </div>

        <button className='submit_button' onClick={() => { setShowModalCategory(prev => !prev) }}>Ajouter une catégorie</button>

        {showModalCategory ?
          <ModalCategory showEdit={() => setShowModalCategory(prev => !prev)} token={CategoryCSRFToken} 
          getData={()=> {
            getCategory(setCategories, setMessage)
            getDish(page, max, categoryId, setCount, setDishes, setMessage)
          }}/>
          : null}
      </section>

      <section>
        <div className='select_category_div'>
          <h3>Gérer les plats :</h3>
          <select name="show_by_category" id="show_by_category" onChange={(e) => {
            setCategoryId(e.target.value)
            setPage(0)
          }}>
            <option value={null} >Choisir une catégorie</option>
            {
              categories.map(category => {
                return (
                  <option value={category.id} key={category.id}>{category.name}</option>
                )
              })
            }
          </select>
        </div>
        <div className='div_table'>

          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Description</th>
                <th>Prix</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {showDishes}
            </tbody>
          </table>
        </div>
          <div className='pagination'>
            <button disabled={page === 0 ? true : false} onClick={() => setPage(prev => prev - 1)}><img src='../img/CaretLeft.png' /></button>
            <p>{page + 1}</p>
            <button onClick={() => setPage(prev => prev + 1)} disabled={count <= page * max + dishes.length ? true : false} ><img src='../img/CaretRight.png' /></button>
          </div>

        <button className='submit_button' onClick={() => setShowModalDish(prev => !prev)}>Ajouter un plat</button>

        {showModalDish ?
          <ModalDish categories={categories} showEdit={() => setShowModalDish(prev => !prev)} token={DishesCSRFToken}
          getData={()=> {
            setPage(0)
            getDish(page, max, categoryId, setCount, setDishes, setMessage)
          }} />
          : null}
      </section>



    </div>
  )
}

export default AdminDishes

//getting functions

