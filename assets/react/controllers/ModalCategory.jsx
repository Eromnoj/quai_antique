import React from 'react'
import { useReducer } from 'react'
import axios from 'axios'

const ModalCategory = ({ cat, showEdit }) => {

  const initialCategory = {
    id: cat ? cat.id : 0,
    name: cat ? cat.name : '',
    rank_display: cat ? cat.rank_display : '',
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

      console.log(data.message);

      setTimeout(() => {
        window.location.reload(true)
      },3000)
    } catch (error) {
      console.log(error);
    }
  }
  console.log(category);
  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' onClick={showEdit}>Fermer</button></div>
        <div className='modal_body'>
          <form onSubmit={(e) => {
            e.preventDefault()
            submitCategory()
          }}>
            <p>{cat ? `Modifier la catégorie` : 'Ajouter une catégorie'}</p>
            <div className='description_div'>
              <label htmlFor="description">Changer le nom de la catégorie</label>
              <input type="text" name="description" id="description" value={category.name} onChange={(e) => dispatch({type: 'name', value:e.target.value})} />
            </div>
            <div className='description_div'>
              <label htmlFor="description">Changer le rang d'affichage</label>
              <input type="number" name="rank_display" id="rank_display" value={category.rank_display} onChange={(e) => dispatch({type: 'rank_display', value:e.target.value})} />
            </div>
            <input type="submit" value="Enregistrer" className='submit_button' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalCategory