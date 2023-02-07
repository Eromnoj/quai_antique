import React from 'react'

const ShowApiResponse = ({array, input}) => {

  let messageList = array.filter(element => element.input === input)
  return (
    <>
      {messageList.map((element, i) => {
        return (
          <div key={i} className={element.type === 'error' ? 'message_error' : 'message_info'}>
            {element.message}
          </div>
        )
      })}
    </>
  )
}

export default ShowApiResponse