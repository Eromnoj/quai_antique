import React, { useState } from 'react'
import ModalCategory from './ModalCategory'
import ModalDish from './ModalDish'
import axios from 'axios'
import { useEffect } from 'react'
import ShowApiResponse from './ShowApiResponse'

const CategoryRows = ({ category, token }) => {

  const [showModalCategory, setShowModalCategory] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [message, setMessage] = useState([])

  const deleteCategory = async (token) => {
    try {
      const res = await axios.delete(`/api/delete/categories/${category.id}`, {
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
      <td onClick={() => { setShowModalCategory(prev => !prev) }}>{category.name}</td>
      <td className='end'>{category.rank_display}</td>
      <td className='buttons'>
        <div className='buttons_div'>
          <div className='button_edit' onClick={() => { setShowModalCategory(prev => !prev) }} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
          <div className='button_delete' onClick={() => setConfirmDelete(prev => !prev)}> <img src="../img/Trash.png" alt="delete" /></div>
        </div>
        {showModalCategory ?
          <ModalCategory cat={category} showEdit={() => { setShowModalCategory(prev => !prev) }} token={token} />
          : null}
        {confirmDelete ?
          <div className='confirm_delete_window'>
            <div className='confirm_delete_container'>
              <ShowApiResponse array={message} input={'message'} />
              <p>Voulez-vous vraiment supprimer la catégorie {category.name} ?</p>
              <div className='delete_buttons'>
                <button className='cancel_delete' onClick={() => setConfirmDelete(prev => !prev)}>Annuler</button>
                <button className='delete' onClick={() => {
                  // Manage deletion
                  deleteCategory(token)
                }
                }>Supprimer</button>
              </div>
            </div>
          </div> : null}
      </td>
    </tr>
  )
}

const DishesRows = ({ dish, categories, token }) => {

  const [showModalDish, setShowModalDish] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [message, setMessage] = useState([])

  const deleteDish = async (token) => {
    try {
      const res = await axios.delete(`/api/delete/dishes/${dish.id}`, {
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
      <td onClick={() => { setShowModalDish(prev => !prev) }}>{dish.name}</td>
      <td>{dish.category.name}</td>
      <td>{dish.description}</td>
      <td className='end'>{dish.price}</td>
      <td className='buttons'>
        <div className='buttons_div'>
          <div className='button_edit' onClick={() => { setShowModalDish(prev => !prev) }} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
          <div className='button_delete' onClick={() => setConfirmDelete(prev => !prev)}> <img src="../img/Trash.png" alt="delete" /></div>
        </div>
        {showModalDish ?
          <ModalDish dish={dish} categories={categories} showEdit={() => { setShowModalDish(prev => !prev) }} token={token} />
          : null}
        {confirmDelete ?
          <div className='confirm_delete_window'>
            <div className='confirm_delete_container'>
              <ShowApiResponse array={message} input={'message'} />
              <p>Voulez-vous vraiment supprimer le plat : {dish.name} ?</p>
              <div className='delete_buttons'>
                <button className='cancel_delete' onClick={() => setConfirmDelete(prev => !prev)}>Annuler</button>
                <button className='delete' onClick={() => {
                  // Manage deletion
                  deleteDish(token)
                }
                }>Supprimer</button>
              </div>
            </div>
          </div> : null}
      </td>
    </tr>
  )
}

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
      <CategoryRows category={category} key={category.id} token={CategoryCSRFToken} />
    )
  })

  const showDishes = dishes.map(dish => {
    return (
      <DishesRows dish={dish} categories={categories} key={dish.id} token={DishesCSRFToken} />
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