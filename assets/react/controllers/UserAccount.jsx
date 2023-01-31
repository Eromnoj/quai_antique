import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useReducer } from 'react'

const UserAccount = ({userId, ProfilCSRFToken}) => {

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
    } catch (error) {
      console.log(error);
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
    }
  }
  useEffect(() => {
    getEmail()
  },[])
  return (
    <div className='user_container'>
    <form className='user_form' onSubmit={(e)=> {
      e.preventDefault()
      updateClient()
    }}>
      <div className='email_div'>
        <label htmlFor="email">Modifier mon E-mail :</label>
        <input type="email" name="email" id="email" value={user.email} onChange={(e) => dispatch({type: 'email', value: e.target.value})} />
      </div>
      <div className='password_div'>
        <label htmlFor="password">Modifier mon mot de passe :</label>
        <input type="password" name="password" id="password" value={user.password} onChange={(e) => dispatch({type: 'password', value: e.target.value})} />
      </div>
      <div className='password_verif_div'>
        <label htmlFor="password_verif">Entrez votre mot de passe actuel pour confirmer les changements :</label>
        <input type="password" name="password_verif" id="password_verif"  value={user.verifPwd} onChange={(e) => dispatch({type: 'verifPwd', value: e.target.value})} />
      </div>
      <input type="submit" value="Sauvergarder mes données" className='submit_button'/>
    </form>
    <form className='user_form margin_password' onSubmit={(e)=> {
      e.preventDefault()
      deleteClient(ProfilCSRFToken)
    }}>
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