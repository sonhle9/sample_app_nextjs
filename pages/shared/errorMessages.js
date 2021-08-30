import React from 'react'
import Pluralize from 'react-pluralize'

const errorMessage = (errorMessage) => {
  return (
    <div id="error_explanation">
      <div className="alert alert-danger">
        The form contains <Pluralize singular={'error'} count={ errorMessage.length } />.
      </div>
      <ul>
        { errorMessage.map((error, i) => {
           return (<li key={i}>{error}</li>)
        })}
      </ul>
    </div>
  )
}

export default errorMessage
