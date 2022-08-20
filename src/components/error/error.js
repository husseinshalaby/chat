import React from 'react';
import '../../App.css';
import './error.css'

const Error = () => {
  const handleReload = () => window.location.reload()
  return (
    <div className = 'error'>
      <p>Sorry something went wrong!</p>
      <button onClick={handleReload} className='button'>Try Again</button>
    </div>
  )
}

export default Error