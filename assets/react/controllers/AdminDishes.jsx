import React, { useState, useEffect } from 'react'
import axios from 'axios'

import ModalCategory from './components/modals/ModalCategory'
import ModalDish from './components/modals/ModalDish'

import CategoryRow from './components/CategoryRow'
import DishesRow from './components/DishesRow'


const AdminDishes = ({ CategoryCSRFToken, DishesCSRFToken }) => {

  const [categories, setCategories] = useState([])

  const [dishes, setDishes] = useState([])

  const [page, setPage] = useState(0)

  const [max, setMax] = useState(10)

  const [count, setCount] = useState(0)

  const [categoryId, setCategoryId] = useState(null)
  const getCategory = async () => {
    try {
      const res = await axios.get('/api/categories')

      const data = await res.data

      setCategories(data);
    } catch (error) {

    }
  }

  const getDish = async () => {
    try {
      const res = await axios.get(`/api/dishes?page=${page}&max=${max}&category=${categoryId}`)

      const data = await res.data
      setCount(data.count)
      setDishes(data.dish);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let ignore = false
    if(!ignore){
      getCategory()
    }
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false
    if(!ignore){
      getDish()
    }
    return () => {
      ignore = true
    }
  }, [page, categoryId])


  const showCategories = categories.map(category => {
    return (
      <CategoryRow category={category} key={category.id} token={CategoryCSRFToken} />
    )
  })

  const showDishes = dishes.map(dish => {
    return (
      <DishesRow dish={dish} categories={categories} key={dish.id} token={DishesCSRFToken} />
    )
  })

  const [showModalCategory, setShowModalCategory] = useState(false)
  const [showModalDish, setShowModalDish] = useState(false)

  return (
    <div className='admin_container'>
      <section>
        <h3>Gérer les catégories :</h3>

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
          <ModalCategory showEdit={() => setShowModalCategory(prev => !prev)} token={CategoryCSRFToken} />
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
          <ModalDish categories={categories} showEdit={() => setShowModalDish(prev => !prev)} token={DishesCSRFToken} />
          : null}
      </section>



    </div>
  )
}

export default AdminDishes