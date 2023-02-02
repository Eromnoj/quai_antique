import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useReducer } from 'react'
import ShowApiResponse from './ShowApiResponse'

const UserAccount = ({userId, ProfilCSRFToken}) => {

  const [message, setMessage] = useState([])
  
  const [deletePassword, setDeletePassword] = useState('')
  const initialUser = {
    email: '',
    password: '',
    verifPwd: '',
    token: ProfilCSRFToken
  }

  const userReducer = (state, action) => {
    switch(action.type) {
      case 'email':
        return {...state, email: action.value}
      case 'password':
        return {...state, password: action.value}
      case 'verifPwd':
        return {...state, verifPwd: action.value}
      default:
        return
    }
  }

  const [user, dispatch] = useReducer(userReducer, initialUser)

  const getEmail = async () => {
    try {
      const res = await axios.get(`/api/get/client/${userId}`)
      const data = await res.data
      dispatch({type: 'email', value: data.email })
    } catch (error) {
      console.log(error)
    }
  }

  const updateClient = async () => {
    try {
      const res = await axios.put(`/api/update/client/${userId}`, user)
      const data = await res.data
      console.log(data);
      if (data.message) {
        setMessage(array => [...array, { type: 'info', input: 'message1', message: data.message }])
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
        setMessage(array => [...array, { type: 'error', input: 'message1', message: error.response.data.message }])

      }
    }
  }

  const deleteClient = async (token) => {
    const body = {
      password: deletePassword,
      token: token
    }
    console.log(body);
    try {
      const res = await axios.delete(`/api/delete/client/${userId}`, {
        
        data: body
      })

      const data = await res.data
      window.location.replace('/')
    } catch (error) {
      console.log(error);
      setMessage(array => [...array, { type: 'error', input: 'message2', message: error.response.data.message }])
    }
  }
  useEffect(() => {
    getEmail()
  },[])
  return (
    <div className='user_container'>
      <h3>Gérer mon compte</h3>
    <form className='user_form' onSubmit={(e)=> {
      e.preventDefault()
      setMessage([])
      updateClient()
    }}>
      <ShowApiResponse array={message} input={'message1'} />
      <div className='email_div'>
        <label htmlFor="email">Modifier mon E-mail :</label>
        <input type="email" name="email" id="email" value={user.email} onChange={(e) => dispatch({type: 'email', value: e.target.value})} />
      <ShowApiResponse array={message} input={'email'} />
      </div>
      <div className='password_div'>
        <label htmlFor="password">Modifier mon mot de passe :</label>
        <input type="password" name="password" id="password" value={user.password} onChange={(e) => dispatch({type: 'password', value: e.target.value})} />
      <ShowApiResponse array={message} input={'password'} />
      </div>
      <div className='password_verif_div'>
        <label htmlFor="password_verif">Entrez votre mot de passe actuel pour confirmer les changements :</label>
        <input type="password" name="password_verif" id="password_verif"  value={user.verifPwd} onChange={(e) => dispatch({type: 'verifPwd', value: e.target.value})} />
      </div>
      <input type="submit" value="Sauvergarder mes données" className='submit_button'/>
    </form>
    <form className='user_form margin_password' onSubmit={(e)=> {
      e.preventDefault()
      setMessage([])
      deleteClient(ProfilCSRFToken)
    }}>
      <ShowApiResponse array={message} input={'message2'} />

      <div className='password_verif_div'>
        <label htmlFor="deletion_verif">Entrez votre mot de passe pour confirmer la suppression :</label>
        <input type="password" name="deletion_verif" id="deletion_verif" value={deletePassword} onChange={(e)=> setDeletePassword(e.target.value)} />
      </div>
      <input type="submit" value="Confirmer la suppression" className='submit_button'/>
    </form>
    </div>
  )
}

export default UserAccount