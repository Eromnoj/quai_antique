import React from 'react'
import { useReducer, useState } from 'react'
import { submitItem } from '../../../utils/functions'
import ShowApiResponse from '../ShowApiResponse'

const ModalCategory = ({ cat, showEdit, token, getData }) => {
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
            submitItem(cat, category, setMessage, getData, showEdit, 'categories')
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
