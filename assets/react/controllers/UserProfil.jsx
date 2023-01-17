import React from 'react'

const UserProfil = () => {
  return (
    <div className='user_container'>
    <form className='user_form'>
      <div className='name_div'>
        <label htmlFor="name">Votre nom :</label>
        <input type="text" name="name" id="name" />
      </div>
      <div className='phone_div'>
        <label htmlFor="phone">Votre téléphone :</label>
        <input type="tel" name="phone" id="phone" />
      </div>
      <div className='number_div'>
        <label htmlFor="number">Couverts :</label>
        <input type="number" name="number" id="number" />
      </div>
      <div className='allergen_div'>
        <label htmlFor="allergens">Vos allergènes</label>
        <textarea name="allergens" id="allergens"></textarea>
      </div>
      <input type="submit" value="Sauvergarder mes infos" className='submit_button'/>
    </form>
    </div>
  )
}

export default UserProfil