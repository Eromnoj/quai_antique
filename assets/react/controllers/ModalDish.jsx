import axios from 'axios'
import React, { useReducer } from 'react'

const ModalDish = ({ dish, categories, showEdit }) => {

  const initialState = {
    name: dish ? dish.name : '',
    category: dish ? dish.category.id : 0,
    description: dish ? dish.description : '',
    price: dish ? dish.price : ''
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'name':
        return { ...state, name: action.value }
      case 'category':
        return { ...state, category: Number(action.value) }
      case 'description':
        return { ...state, description: action.value }
      case 'price':
        return { ...state, price: parseFloat(action.value) }
      default:
        return
    }
  }

  const [dishState, dispatch] = useReducer(reducer, initialState)

  const submitDish = async ()=> {
    const url = dish ? `/api/update/dishes/${dish.id}` : '/api/add/dishes'
    try {
      const res = dish ? await axios.put(url, dishState) : await axios.post(url, dishState)

      const data = await res.data
      console.log(data.message);

      setTimeout(()=> {
        window.location.reload(true)
      })
    } catch (error) {
      console.log(error);
    }
  }
  
  console.log(dishState);
  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' onClick={showEdit}>Fermer</button></div>
        <div className='modal_body'>
          <form onSubmit={(e)=> {
            e.preventDefault()
            submitDish()
          }}>
          <p>{dish ? `Modifier ${dish.name}`: 'Ajouter un plat'}</p>
            <div className='name_div'>
              <label htmlFor="name">Nom du plat</label>
              <input type="text" name="name" id="name" value={dishState.name} onChange={(e) => dispatch({ type: 'name', value: e.target.value })} />
            </div>
            <div className='category_div'>
              <label htmlFor="category">Catégorie du plat</label>
              <select name="category" id="category" onChange={(e) => dispatch({ type: 'category', value: e.target.value })}>
              <option  value={null}>Choisissez une Catégorie</option>
                {categories.map(category => {
                  return(
                    <option key={category.id} value={category.id}>{category.name}</option>
                  )
                })}
              </select>
             </div>
            <div className='description_div'>
              <label htmlFor="description">Description du plat</label>
              <input type="text" name="description" id="description" value={dishState.description} onChange={(e) => dispatch({ type: 'description', value: e.target.value })} />
            </div>
            <div className='price_div'>
              <label htmlFor="price">Prix du plat</label>
              <input type="text" name="price" id="price" value={dishState.price} onChange={(e) => dispatch({ type: 'price', value: e.target.value })} />
            </div>
            <input type="submit" value="Enregistrer" className='submit_button' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalDish