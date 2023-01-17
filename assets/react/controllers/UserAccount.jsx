import React from 'react'

const UserAccount = () => {
  return (
    <div className='user_container'>
    <form className='user_form'>
      <div className='email_div'>
        <label htmlFor="email">Modifier mon E-mail :</label>
        <input type="email" name="email" id="email" />
      </div>
      <div className='password_div'>
        <label htmlFor="password">Modifier mon mot de passe :</label>
        <input type="password" name="password" id="password" />
      </div>
      <div className='password_verif_div'>
        <label htmlFor="password_verif">Entrez votre mot de passe actuel pour confirmer les changements :</label>
        <input type="password" name="password_verif" id="password_verif" />
      </div>
      <input type="submit" value="Sauvergarder mes données" className='submit_button'/>
    </form>
    <form className='user_form margin_password'>
      <div className='password_verif_div'>
        <label htmlFor="password_verif">Entrez votre mot de passe pour confirmer la suppression :</label>
        <input type="password" name="password_verif" id="password_verif" />
      </div>
      <input type="submit" value="Sauvergarder mes données" className='submit_button'/>
    </form>
    </div>
  )
}

export default UserAccount