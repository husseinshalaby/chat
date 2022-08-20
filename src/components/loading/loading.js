import React, {useState} from 'react';
import './loading.css';

const Loading = ({ text = 'Loading', speed = 300 }) => {
  const [content, setContent] = useState(text)

  React.useEffect(()=>{
    const id = window.setInterval(()=>{
      setContent((content)=>{
        return content === `${text}...`
        ? text
        : `${content}.`
      })
    },speed)
    return ()=> window.clearInterval(id)
  },[text,speed])
  return (
    <p className = 'loading'>{content}</p>
  )
}

export default Loading