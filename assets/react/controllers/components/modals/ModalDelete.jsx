import React from 'react'
import ShowApiResponse from '../ShowApiResponse'
import { deleteItem } from '../../../utils/functions'

const ModalDelete = ({ message, setMessage, token, item, setConfirmDelete, getData, url }) => {

  let itemType = ''

  if (url.includes('booking')) itemType = 'la réservation de'
  if (url.includes('categories')) itemType = 'la catégorie'
  if (url.includes('dishes')) itemType = 'le plat'
  if (url.includes('formulas')) itemType = 'la formule'
  if (url.includes('menus')) itemType = 'le menu'
  if (url.includes('image')) itemType = 'l\'image'

  if (message.length > 0){
    return (
      <div className='confirm_delete_window'>
      <div className='confirm_delete_container'>
        <ShowApiResponse array={message} input={'message'} />
         <div className='delete_buttons'>
          <button className='cancel_delete' onClick={() => {
            getData()
            setConfirmDelete(prev => !prev)
            }}>Fermer</button>
        </div>
      </div>
    </div>
    )
  }
  return (

    <div className='confirm_delete_window'>
      <div className='confirm_delete_container'>
        <ShowApiResponse array={message} input={'message'} />
        <p>Voulez-vous vraiment supprimer {itemType} : {item.lastname ? item.firstname + ' ' +item.lastname : item.name ? item.name : item.description} ?</p>
        <div className='delete_buttons'>
          <button className='cancel_delete' onClick={() => setConfirmDelete(prev => !prev)}>Annuler</button>
          <button className='delete' onClick={() => {
            // Manage deletion
            deleteItem(token, url, item.id, setMessage, getData)
          }
          }>Supprimer</button>
        </div>
      </div>
    </div>
  )
}

export default ModalDelete