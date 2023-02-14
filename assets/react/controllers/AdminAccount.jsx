import React, { useState, useReducer, useEffect } from 'react'

import { getEmail, updateClient } from '../utils/functions'
import ShowApiResponse from './components/ShowApiResponse'

const AdminAccount = ({ userId, ProfilCSRFToken }) => {
  //const to store response from API
  console.log(userId);
  const [message, setMessage] = useState([])

  // update login info
  const [deletePassword, setDeletePassword] = useState('')
  const initialUser = {
    email: '',
    password: '',
    verifPwd: '',
    token: ProfilCSRFToken
  }

  const userReducer = (state, action) => {
    switch (action.type) {
      case 'email':
        return { ...state, email: action.value }
      case 'password':
        return { ...state, password: action.value }
      case 'verifPwd':
        return { ...state, verifPwd: action.value }
      default:
        return
    }
  }

  const [user, dispatchUser] = useReducer(userReducer, initialUser)


  useEffect(() => {
    let ignore = false
    if (!ignore) {
      getEmail(userId, dispatchUser)
    }
    return () => {
      ignore = true
    }
  }, [])
  return (
    <div className='admin_container'>
      <section>
        <h3>Gérer mon compte</h3>
        <form className='admin_form' onSubmit={(e) => {
          e.preventDefault()
          setMessage([])
          updateClient(userId, user, setMessage, dispatchUser, setDeletePassword)
        }}>
          <ShowApiResponse array={message} input={'message1'} />

            <div className='email_div'>
              <label htmlFor="email">Modifier mon E-mail :</label>
              <input type="email" name="email" id="email" value={user.email} onChange={(e) => dispatchUser({ type: 'email', value: e.target.value })} />
              <ShowApiResponse array={message} input={'email'} />
            </div>

            <div className='password_div'>
              <label htmlFor="password">Modifier mon mot de passe :</label>
              <input type="password" name="password" id="password" value={user.password} onChange={(e) => dispatchUser({ type: 'password', value: e.target.value })} />
              <ShowApiResponse array={message} input={'password'} />
            </div>

            <div className='password_verif_div'>
              <label htmlFor="password_verif">Entrez votre mot de passe actuel pour confirmer les changements :</label>
              <input type="password" name="password_verif" id="password_verif" value={user.verifPwd} onChange={(e) => dispatchUser({ type: 'verifPwd', value: e.target.value })} />
            </div>
  
          <input type="submit" value="Sauvergarder mes données" className='submit_button' />
        </form>
      </section></div>
  )
}

export default AdminAccount