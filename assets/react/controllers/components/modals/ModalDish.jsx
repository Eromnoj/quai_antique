import axios from 'axios'
import React, { useReducer, useState } from 'react'
import ShowApiResponse from '../ShowApiResponse'

const ModalDish = ({ dish, categories, showEdit, token }) => {

     // Display response from API
     const [message, setMessage] = useState([])

  const initialState = {
    name: dish ? dish.name : '',
    category: dish ? dish.category.id : 0,
    description: dish ? dish.description : '',
    price: dish ? dish.price : 0,
    token: token
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

          <form onSubmit={(e)=> {
            e.preventDefault()
            setMessage([])
            submitDish()
          }}>
          <p>{dish ? `Modifier ${dish.name}`: 'Ajouter un plat'}</p>
            <div className='name_div'>
              <label htmlFor="name">Nom du plat</label>
              <input type="text" name="name" id="name" value={dishState.name} onChange={(e) => dispatch({ type: 'name', value: e.target.value })} />
         
      <ShowApiResponse array={message} input={'name'} />

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
              <ShowApiResponse array={message} input={'category'} />

             </div>
            <div className='description_div'>
              <label htmlFor="description">Description du plat</label>
              <input type="text" name="description" id="description" value={dishState.description} onChange={(e) => dispatch({ type: 'description', value: e.target.value })} />
              <ShowApiResponse array={message} input={'description'} />

            </div>
            <div className='price_div'>
              <label htmlFor="price">Prix du plat</label>
              <input type="number" name="price" id="price" value={dishState.price} onChange={(e) => dispatch({ type: 'price', value: e.target.value })} />
              <ShowApiResponse array={message} input={'price'} />

            </div>
            <input type="submit" value="Enregistrer" className='submit_button' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalDish