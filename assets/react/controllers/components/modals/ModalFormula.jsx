import React, { useReducer, useState } from 'react'
import { submitItem } from '../../../utils/functions'
import ShowApiResponse from '../ShowApiResponse'

const ModalFormula = ({ menuId, formula, showEdit, token, getData }) => {
  // Display response from API
  const [message, setMessage] = useState([])

  const initialState = {
    name: formula ? formula.name : '',
    description: formula ? formula.description : '',
    price: formula ? formula.price : 0,
    menuId: menuId,
    token: token
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'name':
        return { ...state, name: action.value }
      case 'description':
        return { ...state, description: action.value }
      case 'price':
        return { ...state, price: parseFloat(action.value) }
      default:
        return
    }
  }

  const [formulaState, dispatch] = useReducer(reducer, initialState)

  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' 
        onClick={() => {
          getData()
          showEdit()
          }}>Fermer</button></div>
        <div className='modal_body'>
        <ShowApiResponse array={message} input={'message'} />

          <form onSubmit={(e) => {
            e.preventDefault()
            setMessage([])
            submitItem(formula, formulaState, setMessage, showEdit, getData, 'formulas')
          }}>
            <p>{formula ? `Modifier la formule` : 'Ajouter une Formule'}</p>
            <div className='name_div'>
              <label htmlFor="name">Nom de la Formule</label>
              <input type="text" name="name" id="name" value={formulaState.name} onChange={(e) => dispatch({ type: 'name', value: e.target.value })} />
              <ShowApiResponse array={message} input={'name'} />

            </div>
            <div className='description_div'>
              <label htmlFor="description">Description</label>
              <input type="text" name="description" id="description" value={formulaState.description} onChange={(e) => dispatch({ type: 'description', value: e.target.value })} />
              <ShowApiResponse array={message} input={'description'} />

            </div>
            <div className='price_div'>
              <label htmlFor="price">Prix</label>
              <input type="number" name="price" id="price" value={formulaState.price} onChange={(e) => dispatch({ type: 'price', value: e.target.value })} />
              <ShowApiResponse array={message} input={'price'} />

            </div>
            <input type="submit" value="Enregistrer" className='submit_button' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalFormula

