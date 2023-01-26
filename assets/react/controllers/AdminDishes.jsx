import React, { useState } from 'react'
import ModalCategory from './ModalCategory'
import ModalDish from './ModalDish'
import axios from 'axios'
import { useEffect } from 'react'

const CategoryRows = ({ category }) => {

  const [showModalCategory, setShowModalCategory] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const deleteCategory = async () => {
    try {
      const res = await axios.delete(`/api/delete/categories/${category.id}`)
      const data = await res.data

      console.log(data);
      setTimeout(()=> {
        window.location.reload(true)
      }, 1000)
    } catch (error) {
      console.log(error);      
    }
  }
  return (
    <tr>
      <td>{category.name}</td>
      <td className='end'>{category.rank_display}</td>
      <td className='buttons'>
        <div className='buttons_div'>
          <div className='button_edit' onClick={() => {setShowModalCategory(prev=> !prev)}} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
          <div className='button_delete' onClick={() => setConfirmDelete(prev => !prev)}> <img src="../img/Trash.png" alt="delete" /></div>
        </div>
        {showModalCategory ?
        <ModalCategory cat={category} showEdit={() => {setShowModalCategory(prev=> !prev)}} />
        :null}
        {confirmDelete ? 
      <div className='confirm_delete_window'>
        <div className='confirm_delete_container'>
          <p>Voulez-vous vraiment supprimer la catégorie {category.name} ?</p>
          <div className='delete_buttons'>
            <button className='cancel_delete' onClick={()=> setConfirmDelete(prev => !prev)}>Annuler</button>
            <button className='delete' onClick={()=> {
              // Manage deletion
              deleteCategory()}
              }>Supprimer</button>
          </div>
        </div>
      </div> : null}
      </td>
    </tr>
  )
}

const DishesRows = ({ dish, categories }) => {

  const [showModalDish, setShowModalDish] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const deleteDish = async () => {
    try {
      const res = await axios.delete(`/api/delete/dishes/${dish.id}`)
      const data = await res.data

      console.log(data);
      setTimeout(()=> {
        window.location.reload(true)
      }, 1000)
    } catch (error) {
      console.log(error);      
    }
  }

  return (
    <tr>
      <td>{dish.name}</td>
      <td>{dish.category.name}</td>
      <td>{dish.description}</td>
      <td className='end'>{dish.price}</td>
      <td className='buttons'>
        <div className='buttons_div'>
          <div className='button_edit' onClick={() => {setShowModalDish(prev=>!prev)}} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
          <div className='button_delete' onClick={() => setConfirmDelete(prev => !prev)}> <img src="../img/Trash.png" alt="delete" /></div>
        </div>
        {showModalDish? 
        <ModalDish dish={dish} categories={categories} showEdit={() => {setShowModalDish(prev=>!prev)}} />
        :null}
        {confirmDelete ? 
      <div className='confirm_delete_window'>
        <div className='confirm_delete_container'>
          <p>Voulez-vous vraiment supprimer le plat : {dish.name} ?</p>
          <div className='delete_buttons'>
            <button className='cancel_delete' onClick={()=> setConfirmDelete(prev => !prev)}>Annuler</button>
            <button className='delete' onClick={()=> {
              // Manage deletion
              deleteDish()}
              }>Supprimer</button>
          </div>
        </div>
      </div> : null}
      </td>
    </tr>
  )
}

const AdminDishes = () => {

  const [categories, setCategories] = useState([])

  const [dishes, setDishes] = useState([])

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
      const res = await axios.get('/api/dishes')

      const data = await res.data

      setDishes(data);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    getCategory()
    getDish()
  }, [])


  const showCategories = categories.map( category => {
    return (
      <CategoryRows category={category} key={category.id} />
    )
  })

  const showDishes = dishes.map(dish => {
    return (
      <DishesRows dish={dish} categories={categories} key={dish.id} />
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

        <button className='submit_button' onClick={() => {setShowModalCategory(prev => !prev) }}>Ajouter une catégorie</button>

        {showModalCategory ? 
        <ModalCategory showEdit={() => setShowModalCategory(prev => !prev)} />
        :null}
      </section>

      <section>
        <h3>Gérer les plats :</h3>

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

        <button className='submit_button' onClick={() => setShowModalDish(prev => !prev)}>Ajouter un plat</button>

        {showModalDish ? 
        <ModalDish  categories={categories} showEdit={() => setShowModalDish(prev => !prev)} />
        :null}
      </section>



    </div>
  )
}

export default AdminDishes