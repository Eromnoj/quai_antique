import React, { useReducer} from 'react'

const ModalFormula = ({formula, showEdit}) => {

  const initialState = {
    name: formula ? formula.name : '',
    description: formula ? formula.description : '',
    price: formula ? formula.price : ''
  }

  const reducer = (state, action) => {
    switch(action.type) {
      case 'name':
        return {...state, name: action.value}
      case 'description':
        return {...state, description: action.value}
      case 'price':
        return {...state, price: action.value}
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
        <p>{formula ? `Modifier la formule ${state.name}` : 'Ajouter une Formule'}</p>
          <div className='name_div'>
            <label htmlFor="name">Nom de la Formule</label>
            <input type="text" name="name" id="name" value={state.name} onChange={(e) => dispatch({type: 'name', value: e.target.value})} />
          </div>
          <div className='description_div'>
            <label htmlFor="description">Description</label>
            <input type="text" name="description" id="description" value={state.description} onChange={(e) => dispatch({type: 'description', value: e.target.value})} />
          </div>
          <div className='price_div'>
            <label htmlFor="price">Prix</label>
            <input type="number" name="price" id="price" value={state.price} onChange={(e) => dispatch({type: 'price', value: e.target.value})} />
          </div>
          <input type="submit" value="Enregistrer" className='submit_button' />
        </form>
      </div>
    </div>
  </div>
  )
}

export default ModalFormula