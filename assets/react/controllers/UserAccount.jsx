import React, {useState, useEffect, useReducer} from 'react'

import { getEmail, deleteClient, updateClient } from '../utils/functions'
import ShowApiResponse from './components/ShowApiResponse'

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


  useEffect(() => {
    let ignore = false
    if(!ignore){
      getEmail(userId, dispatch)
    }
    return () => {
      ignore = true
    }
  },[])

  return (
    <div className='user_container'>
      <h3>Gérer mon compte</h3>
    <form className='user_form' onSubmit={(e)=> {
      e.preventDefault()
      setMessage([])
      updateClient(userId, user, setMessage, dispatch, setDeletePassword)
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
      deleteClient(deletePassword, ProfilCSRFToken, userId, setMessage)
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
