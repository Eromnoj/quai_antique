import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment/moment'

const ScheduleBase = () => {
  const [schedule, setSchedule] = useState([])

  const getSchedule = async () => {
    try {
      const res = await axios.get('/api/schedule')

      const data = await res.data
      setSchedule(data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSchedule()
  }, [])
  
  const showSchedule = schedule.map(day => {
    return (
      <tr key={day.id}>
        <td>{day.day}</td>
        {day.noonClosed ? <td>Fermé</td> : <td>{moment(day.noonStart).utcOffset(1).format('HH:mm')} {moment(day.noonEnd).utcOffset(1).format('HH:mm')}</td>}
        {day.eveningClosed ? <td>Fermé</td> : <td>{moment(day.eveningStart).utcOffset(1).format('HH:mm')} {moment(day.eveningEnd).utcOffset(1).format('HH:mm')}</td>}
      </tr>
    )
  })
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Midi</th>
          <th>Soir</th>
        </tr>
      </thead>
      <tbody>
        {showSchedule}
      </tbody>
    </table>
  )
}

export default ScheduleBase