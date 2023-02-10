import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import ShowApiResponse from '../ShowApiResponse'

const ModalImage = ({ image, showEdit, token, getData }) => {

  const {register, handleSubmit} = useForm()

    // Display response from API
    const [message, setMessage] = useState([])

  const submitForm = async (data) => {
    setMessage([])
    const formData = new FormData()
    formData.append('token', token)
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
      if (data.message) {
        setMessage(array => [...array, { type: 'info', input: 'message', message: data.message }])
      }
      setTimeout(() => {
        getData()
        showEdit()
      }, 2000)
    } catch (error) {
      console.log(error);
      if (error.response.data.violations) {
        const violation = error.response.data.violations
        violation.forEach(element => {
          setMessage(array => [...array, { type: 'error', input: element.propertyPath, message: element.title }])
          console.log(element.propertyPath);
          console.log(element.title);
        });
      } else {
        console.log(error.response.data.message);
        setMessage(array => [...array, { type: 'error', input: 'message', message: error.response.data.message }])
      }
    }
  }


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

          <form encType='multipart/form-data' onSubmit={handleSubmit(submitForm)}>
          <p>{image ? `Modifier ${image.description}` : 'Ajouter une image'}</p>
            <div className='img_div'>
              <label htmlFor="image">Changer l'image</label>
              <input type="file" name="image" id="image" {...register('image')} />
              <ShowApiResponse array={message} input={'url'} />
              <ShowApiResponse array={message} input={''} />

            </div>
            <div className='description_div'>
              <label htmlFor="description">Changer la description</label>
              <input type="text" name="description" id="description" {...register('description', {value: image ? image.description: ''})} />
              
              <ShowApiResponse array={message} input={'description'} />

            </div>
            <input type="submit" value="Enregistrer" className='submit_button' />
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalImage