import React, {useState} from 'react'
import moment from 'moment/moment'

import ModalSchedule from './modals/ModalSchedule'

const ScheduleRow = ({ day, token }) => {

  const [showEdit, setShowEdit] = useState(false)
  return (
    <>
      <tr>
        <td className="day" onClick={() => {setShowEdit(prev => !prev)}}>{day.day}</td>
        {day.noonClosed ?
          <>
            <td></td>
            <td></td>
          </>
          :
          <>
            <td>{moment(day.noonStart).utcOffset(1).format('HH:mm')}</td>
            <td>{moment(day.noonEnd).utcOffset(1).format('HH:mm')}</td>
          </>
        }
        <td className='closed'>{day.noonClosed ? 'x' : null}</td>
        {day.eveningClosed ?
          <>
            <td></td>
            <td></td>
          </>
          :
          <>
            <td>{moment(day.eveningStart).utcOffset(1).format('HH:mm')}</td>
            <td>{moment(day.eveningEnd).utcOffset(1).format('HH:mm')}</td>
          </>
        }
        <td className='closed'>{day.eveningClosed ? 'x' : null}</td>
        <td>
          <div className='button_edit' onClick={() => {setShowEdit(prev => !prev)}} >
          <img src="../img/Edit-alt.png" alt="edit" /></div>
          {showEdit ? <ModalSchedule day={day} token={token} setEdit={() => setShowEdit(prev => !prev)} /> : null}

        </td>
      </tr>
    </>
  )
}

export default ScheduleRow