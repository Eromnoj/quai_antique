import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

const ModalImage = ({ image, showEdit }) => {

  const {register, handleSubmit} = useForm()

  const [showMessage, setShowMessage] = useState('false')
  const [message, setMessage] = useState('')

  const submitForm = async (data) => {
    const formData = new FormData()
    formData.append('image', data.image[0])
    formData.append('description', data.description)
    const url = image ? `/api/update/image/${image.id}` : `/api/add/image`
    try {
      const res = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
      const data = await res.data

      setMessage(data.message);
      setShowMessage(true)
      setTimeout(()=> {
        window.location.reload(true)
      },
      3000)
    } catch (error) {
      setShowMessage(true)
      setMessage(error.response.data.message);
    }
  }
  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' onClick={showEdit}>Fermer</button></div>
        <div className='modal_body'>
          {showMessage ?
          <div className='modal_message'>{message}</div>
        :null}
          <form encType='multipart/form-data' onSubmit={handleSubmit(submitForm)}>
          <p>{image ? `Modifier ${image.description}` : 'Ajouter une image'}</p>
            <div className='img_div'>
              <label htmlFor="image">Changer l'image</label>
              <input type="file" name="image" id="image" {...register('image')} />
            </div>
            <div className='description_div'>
              <label htmlFor="description">Changer la description</label>
              <input type="text" name="description" id="description" {...register('description', {value: image ? image.description: ''})} />
            </div>
            <input type="submit" value="Enregistrer" className='submit_button' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalImage