import React from 'react'
import { useEffect, useReducer } from 'react'
import axios from 'axios'

const AddressBase = () => {

  const initialState = {
    id: '',
    address: '',
    city: '',
    phone: '',
    post_code: '',
    max_capacity: ''
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'id':
        return {...state, id: action.value}
      case 'address':
        return { ...state, address: action.value }
      case 'city':
        return { ...state, city: action.value }
      case 'phone':
        return { ...state, phone: action.value }
      case 'post_code':
        return { ...state, post_code: action.value }
      case 'max_capacity':
        return { ...state, max_capacity: action.value }
      default:
        return
    }
  }
  const [restaurant, dispatch] = useReducer(reducer, initialState)

  const getRestaurant = async () => {
    try {
      const res = await axios.get('/api/restaurant')
      const data = await res.data
      dispatch({type: 'id', value: data[0].id})
      dispatch({type: 'address', value: data[0].address})
      dispatch({type: 'city', value: data[0].city})
      dispatch({type: 'phone', value: data[0].phone})
      dispatch({type: 'post_code', value: data[0].post_code})
      dispatch({type: 'max_capacity', value: data[0].max_capacity})
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(()=> {
    getRestaurant()
  },[])
  return (
    <>
    <p>Le Quai Antique</p>
    <p>{restaurant.address}</p>
    <p>{restaurant.post_code} {restaurant.city}</p>
    <p>tél : {restaurant.phone}</p>
    </>
  )
}

export default AddressBase