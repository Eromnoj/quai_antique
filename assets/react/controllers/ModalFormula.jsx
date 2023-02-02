import React, { useReducer, useState } from 'react'
import axios from 'axios'
import ShowApiResponse from './ShowApiResponse'

const ModalFormula = ({ menuId, formula, showEdit, token }) => {
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
  const formulaSubmit = async () => {
    let url = formula ? `/api/update/formulas/${formula.id}` : '/api/add/formulas'

    try {
      const res = formula ? await axios.put(url, formulaState) : await axios.post(url, formulaState)
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
    }
  }
  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' onClick={showEdit}>Fermer</button></div>
        <div className='modal_body'>
        <ShowApiResponse array={message} input={'message'} />

          <form onSubmit={(e) => {
            e.preventDefault()
            setMessage([])
            formulaSubmit()
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