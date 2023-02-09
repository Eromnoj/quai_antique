import React, {useState, useReducer} from 'react'

import { submitUserInfo } from '../utils/functions'
import ShowApiResponse from './components/ShowApiResponse'

const UserProfil = ({ userId, userLastname, userFirstname, userAllergies, userPhone, userNumber, ProfilCSRFToken }) => {

  const [message, setMessage] = useState([])
  const initialUser = {
    lastName: userLastname ? userLastname : '',
    firstName: userFirstname ? userFirstname : '',
    allergies: userAllergies ? userAllergies : '',
    phone: userPhone ? userPhone : '',
    number: userNumber ? userNumber : 1,
    token: ProfilCSRFToken
  }

  const userReducer = (state, action) => {
    switch (action.type) {
      case 'lastname':
        return { ...state, lastName: action.value }
      case 'firstname':
        return { ...state, firstName: action.value }
      case 'phone':
        return { ...state, phone: action.value }
      case 'number':
        return { ...state, number: Number(action.value) }
      case 'allergies':
        return { ...state, allergies: action.value }
      default:
        return
    }
  }

  const [userProfil, dispatch] = useReducer(userReducer, initialUser)


  return (
    <div className='user_container'>
      <h3>Mon profil</h3>
      <ShowApiResponse array={message} input={'message'} />

      <form className='user_form' onSubmit={(e) => {
        e.preventDefault()
        setMessage([])
        submitUserInfo(userId, userProfil, setMessage)
      }}>
        <div className='lastName_div'>
          <label htmlFor="lastName">Votre nom :</label>
          <input type="text" name="lastName" id="lastName" value={userProfil.lastName} onChange={(e) => dispatch({ type: 'lastname', value: e.target.value })} />
          <ShowApiResponse array={message} input={'lastName'} />
        </div>
        <div className='firstName_div'>
          <label htmlFor="firstName">Votre prénom :</label>
          <input type="text" name="firstName" id="firstName" value={userProfil.firstName} onChange={(e) => dispatch({ type: 'firstname', value: e.target.value })} />
          <ShowApiResponse array={message} input={'firstName'} />
        </div>
        <div className='phone_div'>
          <label htmlFor="phone">Votre téléphone :</label>
          <input type="tel" name="phone" id="phone" value={userProfil.phone} onChange={(e) => dispatch({ type: 'phone', value: e.target.value })} />
          <ShowApiResponse array={message} input={'phone'} />
        </div>
        <div className='number_div'>
          <label htmlFor="number">Couverts :</label>
          <input type="number" name="number" id="number" value={userProfil.number} onChange={(e) => dispatch({ type: 'number', value: e.target.value })} />
          <ShowApiResponse array={message} input={'number'} />
        </div>
        <div className='allergies_div'>
          <label htmlFor="allergies">Vos allergènes</label>
          <textarea name="allergies" id="allergies" value={userProfil.allergies} onChange={(e) => dispatch({ type: 'allergies', value: e.target.value })} ></textarea>
          <ShowApiResponse array={message} input={'allergies'} />
        </div>
        <input type="submit" value="Sauvergarder mes infos" className='submit_button' />
      </form>
    </div>
  )
}

export default UserProfil