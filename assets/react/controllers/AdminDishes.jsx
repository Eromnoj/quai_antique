import React, { useState } from 'react'
import ModalCategory from './ModalCategory'
import ModalDish from './ModalDish'

const CategoryRows = ({ name }) => {

  const [showModalCategory, setShowModalCategory] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  return (
    <tr>
      <td className='end'>{name}</td>
      <td className='buttons'>
        <div className='buttons_div'>
          <div className='button_edit' onClick={() => {setShowModalCategory(prev=> !prev)}} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
          <div className='button_delete' onClick={() => setConfirmDelete(prev => !prev)}> <img src="../img/Trash.png" alt="delete" /></div>
        </div>
        {showModalCategory ?
        <ModalCategory cat={name} showEdit={() => {setShowModalCategory(prev=> !prev)}} />
        :null}
        {confirmDelete ? 
      <div className='confirm_delete_window'>
        <div className='confirm_delete_container'>
          <p>Voulez-vous vraiment supprimer la catégorie {name} ?</p>
          <div className='delete_buttons'>
            <button className='cancel_delete' onClick={()=> setConfirmDelete(prev => !prev)}>Annuler</button>
            <button className='delete' onClick={()=> {
              // Manage deletion
              confirmDelete(prev => !prev)}
              }>Supprimer</button>
          </div>
        </div>
      </div> : null}
      </td>
    </tr>
  )
}

const DishesRows = ({ dish }) => {

  const [showModalDish, setShowModalDish] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  return (
    <tr>
      <td>{dish.name}</td>
      <td>{dish.category}</td>
      <td>{dish.description}</td>
      <td className='end'>{dish.price}</td>
      <td className='buttons'>
        <div className='buttons_div'>
          <div className='button_edit' onClick={() => {setShowModalDish(prev=>!prev)}} > <img src="../img/Edit-alt.png" alt="edit" /> </div>
          <div className='button_delete' onClick={() => setConfirmDelete(prev => !prev)}> <img src="../img/Trash.png" alt="delete" /></div>
        </div>
        {showModalDish? 
        <ModalDish dish={dish} showEdit={() => {setShowModalDish(prev=>!prev)}} />
        :null}
        {confirmDelete ? 
      <div className='confirm_delete_window'>
        <div className='confirm_delete_container'>
          <p>Voulez-vous vraiment supprimer le plat : {dish.name} ?</p>
          <div className='delete_buttons'>
            <button className='cancel_delete' onClick={()=> setConfirmDelete(prev => !prev)}>Annuler</button>
            <button className='delete' onClick={()=> {
              // Manage deletion
              confirmDelete(prev => !prev)}
              }>Supprimer</button>
          </div>
        </div>
      </div> : null}
      </td>
    </tr>
  )
}

const AdminDishes = () => {

  const categories = ['entrées', 'plats', 'desserts']

  const dishes = [
    {
      name : 'Saumon fumé',
      category : categories[0],
      description : 'Lorem Ipsum',
      price : '90€'
    },
    {
      name : 'Foie gras',
      category : categories[0],
      description : 'Lorem Ipsum',
      price : '90€'
    },
    {
      name : 'sauté de veau',
      category : categories[1],
      description : 'Lorem Ipsum',
      price : '90€'
    },
    {
      name : 'Boudin noir',
      category : categories[1],
      description : 'Lorem Ipsum',
      price : '90€'
    },
    {
      name : 'Yaourt',
      category : categories[2],
      description : 'Lorem Ipsum',
      price : '90€'
    },
    {
      name : 'Tarte aux pommes',
      category : categories[2],
      description : 'Lorem Ipsum',
      price : '90€'
    },
    
  ]

  const showCategories = categories.map((category,i) => {
    return (
      <CategoryRows name={category} key={i} />
    )
  })

  const showDishes = dishes.map((dish,i) => {
    return (
      <DishesRows dish={dish} key={i} />
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
        <ModalDish showEdit={() => setShowModalDish(prev => !prev)} />
        :null}
      </section>



    </div>
  )
}

export default AdminDishes