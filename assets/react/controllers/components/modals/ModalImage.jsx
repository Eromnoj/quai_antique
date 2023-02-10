import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import ShowApiResponse from '../ShowApiResponse'

const ModalImage = ({ image, showEdit, token, getData }) => {

  const {register, handleSubmit} = useForm()

    // Display response from API
    const [message, setMessage] = useState([])

    // form to submit the image, using react-hook-form library
  const submitForm = async (data) => {
    // unset previous error messages
    setMessage([])
    // sending files using a form data, as sending using JSON will encode the file to base64 and increase the body size
    const formData = new FormData()
    formData.append('token', token)
    formData.append('image', data.image[0])
    formData.append('description', data.description)
    // choose url depending if it's an update or a new image
    const url = image ? `/api/update/image/${image.id}` : `/api/add/image`
    try {
      // In php, $_FILES is not populated when handling PUT requests. It is only populated by PHP when handling POST requests, do to
      // RFC2616 protocol, sec9.6, of the HTTPFoundation, since even we update the db entries, we still post a new file to the server, 
      // then doing a manipulation serverside (changing data into the db, removing the old file, etc). So Even it's an update
      // I'm using the post method here, since symfony doesn't propose a native workaround
      const res = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
      const data = await res.data
      if (data.message) {
        // setting messages, to show response from the server
        setMessage(array => [...array, { type: 'info', input: 'message', message: data.message }])
      }
      // a timeout before refreshing the data and closing the modal
      setTimeout(() => {
        getData()
        showEdit()
      }, 2000)
    } catch (error) {
      if (error.response.data.violations) {

        const violation = error.response.data.violations
        violation.forEach(element => {
          // set error message if it's a validation error
            setMessage(array => [...array, { type: 'error', input: element.propertyPath, message: element.title }])
        });
      } else if(error.response.data.message) {
        // set error message if it's an error due the file processing, or error due to the db
        setMessage(array => [...array, { type: 'error', input: 'message', message: error.response.data.message }])
      } else {
        // set error message if it's an error due the server configuration (exceed file size set in the php.ini or nginx conf for example)
        setMessage(array => [...array, { type: 'error', input: 'message', message: "Une erreur serveur est survenue: le fichier ne peut être traité" }])
      }
    }
  }


  return (
    <div className='modal_window'>
      <div className='modal_container'>
        <div className='modal_header'><button className='close_button' 
        onClick={() => {
          // refetch data if user close the modal, it prevents to keep outdated data if the user close the modal before the end of the timeout
          getData()
          showEdit()
          }}>Fermer</button></div>
        <div className='modal_body'>
          {/* show response from server using the ShowApiResponse component. See component for infos */}
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