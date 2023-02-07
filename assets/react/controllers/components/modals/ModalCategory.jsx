import React from 'react'
import { useReducer, useState } from 'react'
import axios from 'axios'
import ShowApiResponse from '../ShowApiResponse'

const ModalCategory = ({ cat, showEdit, token }) => {
   // Display response from API
   const [message, setMessage] = useState([])

  const initialCategory = {
    id: cat ? cat.id : 0,
    name: cat ? cat.name : '',
    rank_display: cat ? cat.rank_display : 0,
    token: token
  }

  const categoryReducer = (state, action) => {
    switch (action.type) {
      case 'name':
        return { ...state, name: action.value }
      case 'rank_display':
        return { ...state, rank_display: Number(action.value) }
      default:
        return
    }
  }
  const [category, dispatch] = useReducer(categoryReducer, initialCategory)

  const submitCategory = async () => {
    let url = cat ? `/api/update/categories/${category.id}` : '/api/add/categories'
    try {
      const res = cat ? await axios.put(url, category) : await axios.post(url, category)

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
            submitCategory()
          }}>
            <p>{cat ? `Modifier la catégorie` : 'Ajouter une catégorie'}</p>
            <div className='description_div'>
              <label htmlFor="name">Changer le nom de la catégorie</label>
              <input type="text" name="name" id="name" value={category.name} onChange={(e) => dispatch({type: 'name', value:e.target.value})} />
              <ShowApiResponse array={message} input={'name'} />

            </div>
            <div className='description_div'>
              <label htmlFor="description">Changer le rang d'affichage</label>
              <input type="number" name="rank_display" id="rank_display" value={category.rank_display} onChange={(e) => dispatch({type: 'rank_display', value:e.target.value})} />
              <ShowApiResponse array={message} input={'rank_display'} />

            </div>
            <input type="submit" value="Enregistrer" className='submit_button' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalCategory