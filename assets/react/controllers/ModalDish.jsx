import React, { useReducer } from 'react'

const ModalDish = ({ dish, showEdit }) => {

  const initialState = {
    name: dish ? dish.name : '',
    category: dish ? dish.category : '',
    description: dish ? dish.description : '',
    price: dish ? dish.price : ''
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'name':
        return { ...state, name: action.value }
      case 'category':
        return { ...state, category: action.value }
      case 'description':
        return { ...state, description: action.value }
      case 'price':
        return { ...state, price: action.value }
      default:
        return
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  
  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' onClick={showEdit}>Fermer</button></div>
        <div className='modal_body'>
          <form>
          <p>{dish ? `Modifier ${dish.name}`: 'Ajouter un plat'}</p>
            <div className='name_div'>
              <label htmlFor="name">Nom du plat</label>
              <input type="text" name="name" id="name" value={state.name} onChange={(e) => dispatch({ type: 'name', value: e.target.value })} />
            </div>
            <div className='category_div'>
              <label htmlFor="category">Catégorie du plat</label>
              <input type="text" name="category" id="category" value={state.category} onChange={(e) => dispatch({ type: 'category', value: e.target.value })} />
            </div>
            <div className='description_div'>
              <label htmlFor="description">Description du plat</label>
              <input type="text" name="description" id="description" value={state.description} onChange={(e) => dispatch({ type: 'description', value: e.target.value })} />
            </div>
            <div className='price_div'>
              <label htmlFor="price">Prix du plat</label>
              <input type="text" name="price" id="price" value={state.price} onChange={(e) => dispatch({ type: 'price', value: e.target.value })} />
            </div>
            <input type="submit" value="Enregistrer" className='submit_button' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalDish