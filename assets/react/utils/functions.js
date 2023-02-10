import axios from 'axios'
import moment from 'moment'


/**
 * 
 * Admin functions
 * 
 */

// function to delete Items
export const deleteItem = async (token, url, id, setMessage, getData) => {
  try {
    const res = await axios.delete(url+id, {
      data: {
        token
      }
    })
    const data = await res.data
    if (data.message) {
      setMessage(array => [...array, { type: 'info', input: 'message', message: data.message }])
    }
    setTimeout(() => {
      getData()
      setMessage([])
    }, 2000)
  } catch (error) {
    if (error.response.data.violations) {
      const violation = error.response.data.violations
      violation.forEach(element => {
        setMessage(array => [...array, { type: 'error', input: element.propertyPath, message: element.title }])
      });
    } else {
      console.log(error.response.data.message);
      setMessage(array => [...array, { type: 'info', input: 'message', message: error.response.data.message }])
    }

  }
}

// function to submit Items

export const submitItem = async (item, dataToSend, setMessage, getData, showEdit, path) => {
  let url = item ? `/api/update/${path}/${item.id}` : `/api/add/${path}`
    try {
    const res = item ? await axios.put(url, dataToSend) : await axios.post(url, dataToSend)
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
      });
    } else {
      setMessage(array => [...array, { type: 'error', input: 'message', message: error.response.data.message }])
    }
  }
}

export const bookingSubmit = async (bookingState, setConfirmBooking, setMessage, setIsBookingSent) => {
  try {
    const res = await axios.post('/api/add/booking', bookingState)
    const data = await res.data
    if (data.message) {
      setConfirmBooking(true)
      setMessage(array => [...array, { type: 'info', input: 'message', message: data.message }])
    }
  } catch (error) {
    setIsBookingSent(false)
    if (error.response.data.violations) {
      const violation = error.response.data.violations
      violation.forEach(element => {
        setMessage(array => [...array, { type: 'error', input: element.propertyPath, message: element.title }])
      });
    } else {
      setMessage(array => [...array, { type: 'error', input: 'errorMessage', message: error.response.data.message }])
    }
  }
}

// function to update Restaurant infos
export const updateRestaurant = async (restaurant, setMessage, dispatch) => {
  try {
    const res = await axios.put(`/api/update/restaurant/${restaurant.id}`, restaurant)
    const data = await res.data
    if (data.message) {
      setMessage(array => [...array, { type: 'info', input: 'message', message: data.message }])
    }
    setTimeout(() => {
      setMessage([])
      getRestaurant(dispatch, setMessage)
    }, 2000)
  } catch (error) {
    if (error.response.data.violations) {
      const violation = error.response.data.violations
      violation.forEach(element => {
        setMessage(array => [...array, { type: 'error', input: element.propertyPath, message: element.title }])
      });
    } else {
      setMessage(array => [...array, { type: 'error', input: 'message', message: error.response.data.message }])
    }
  }
}

// Get data functions
export const getBookings = async (page, max, setCount, setBookings, name) => {
  try {
    const res = await axios.get(`/api/booking?page=${page}&max=${max}&name=${name}`)
    const data = await res.data
    setCount(data.count)
    setBookings(data.booking)
  } catch (error) {
    console.log(error);
  }
}

export const getCategory = async (setCategories, setMessage) => {
  try {
    const res = await axios.get('/api/categories')

    const data = await res.data

    setCategories(data);
  } catch (error) {
    setMessage(array => [...array, { type: 'error', input: 'message', message: error.response.data.message }])
  }
}

export const getDish = async (page, max, categoryId, setCount, setDishes, setMessage) => {
  try {
    const res = await axios.get(`/api/dishes?page=${page}&max=${max}&category=${categoryId}`)

    const data = await res.data
    setCount(data.count)
    setDishes(data.dish);

  } catch (error) {
    setMessage(array => [...array, { type: 'error', input: 'message', message: error.response.data.message }])
  }
}

export const getMenus = async (setMenus, setMessage) => {
  try {
    const res = await axios.get('/api/menus')
    const data = await res.data
    setMenus(data)
  } catch (error) {
    setMessage(array => [...array, { type: 'info', input: 'message', message: error.response.data.message }])
  }
}

export const getRestaurant = async (dispatch, setMessage) => {
  try {
    const res = await axios.get('/api/restaurant')
    const data = await res.data
    dispatch({ type: 'id', value: data[0].id })
    dispatch({ type: 'address', value: data[0].address })
    dispatch({ type: 'city', value: data[0].city })
    dispatch({ type: 'phone', value: data[0].phone })
    dispatch({ type: 'post_code', value: data[0].post_code })
    dispatch({ type: 'max_capacity', value: data[0].max_capacity })
  } catch (error) {
    setMessage(array => [...array, { type: 'info', input: 'message', message: error.response.data.message }])
  }
}


export const getGallery = async (setGallery, setMessage) => {
  try {
    const res = await axios.get('/api/gallery')

    const data = await res.data
    setGallery(data)
  } catch (error) {
    if (error.response.data.violations) {
      const violation = error.response.data.violations
      violation.forEach(element => {
        console.log(element.propertyPath);
        console.log(element.title);
      });
    } else {
      console.log(error.response.data.message);
      setMessage(array => [...array, { type: 'error', input: 'message', message: error.response.data.message }])
    }
  }
}

export const getSchedule = async (setSchedule, setMessage) => {
  try {
    const res = await axios.get('/api/schedule')

    const data = await res.data
    setSchedule(data)
  } catch (error) {
    setMessage(array => [...array, { type: 'error', input: 'message', message: error.response.data.message }])
  }
}

/**
 * 
 * User account function
 * 
 */

export const getEmail = async (userId, dispatch) => {
  try {
    const res = await axios.get(`/api/get/client/${userId}`)
    const data = await res.data
    dispatch({type: 'email', value: data.email })
  } catch (error) {
    console.log(error)
  }
}

export const deleteClient = async (deletePassword, token, userId, setMessage) => {
  const body = {
    password: deletePassword,
    token: token
  }
  try {
    await axios.delete(`/api/delete/client/${userId}`, {
      data: body
    })
    window.location.replace('/')
  } catch (error) {
    setMessage(array => [...array, { type: 'error', input: 'message2', message: error.response.data.message }])
  }
}

export const updateClient = async (userId, user, setMessage, dispatch) => {
  try {
    const res = await axios.put(`/api/update/client/${userId}`, user)
    const data = await res.data

    if (data.message) {
      setMessage(array => [...array, { type: 'info', input: 'message1', message: data.message }])
    }
    setTimeout(() => {
      setMessage([])
      dispatch({type: 'verifPwd', value: ''})
      getEmail(userId, dispatch)
    }, 2000)
  } catch (error) {
    if (error.response.data.violations) {
      const violation = error.response.data.violations
      violation.forEach(element => {
        setMessage(array => [...array, { type: 'error', input: element.propertyPath, message: element.title }])
      });
    } else {
      setMessage(array => [...array, { type: 'error', input: 'message1', message: error.response.data.message }])
    }
  }
}

export const submitUserInfo = async (userId, userProfil, setMessage) => {
  try {
    const res = await axios.put(`/api/update/profil/${userId}`, userProfil)
    const data = await res.data
    if (data.message) {
      setMessage(array => [...array, { type: 'info', input: 'message', message: data.message }])
    }
    setTimeout(() => {
      setMessage([])
    }, 2000)
  } catch (error) {
    if (error.response.data.violations) {
      const violation = error.response.data.violations
      violation.forEach(element => {
        setMessage(array => [...array, { type: 'error', input: element.propertyPath, message: element.title }])
      });
    } else {
      setMessage(array => [...array, { type: 'error', input: element.propertyPath, message: error.response.data.message }])
    }
  }
}

/**
 * 
 * function to get available seats and booking hours by shift
 * 
 *  */ 

export const getAvailableSeatsAndSchedule = async (date, shift, setSeatsLeft, setIsShiftClosed, setHourArray, setMessage, dispatch) => {
  try {
    const res = await axios.get(`/api/booking/getavailable?date=${date}&shift=${shift}`)
    const data = await res.data
    setSeatsLeft(data.seatsLeft)
    setIsShiftClosed(data.shiftClosed)

    /**
     * Filling the array to map through, to create the options for the arrival hour
     */
    let tempArray = []
    for (let i = moment(data.shiftStart).utcOffset(0); i <= moment(data.shiftEnd).utcOffset(0).subtract(1, 'h'); i = moment(i).add(15, 'm')) {
      tempArray.push(moment(i).utcOffset(1).format('HH:mm'));
    }
    setHourArray(tempArray)

    dispatch({ type: 'time', value: moment(data.shiftStart).utcOffset(1).format('HH:mm') })
  } catch (error) {
    console.log(error);
    setMessage(array => [...array, { type: 'error', input: 'errorMessage', message: error.response.data.message }])
  }
}