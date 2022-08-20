import Conversation from '../conversation/conversation';
import ThemeContext from '../../context/themeContext';
import React, {useState, useContext} from 'react';
import './conversations.css';

const Conversations = ({conversations, handleClick}) => {
  const { theme } = useContext(ThemeContext)
  const [text, setText] = useState('')

  const handleTextChange = (e) => setText(e.target.value)
  
  return (
    <aside className='conversations'> 
      <input 
      onChange={handleTextChange}
      value={text}
      className='conversations-search'
      placeholder=' Search customers... '
      />
      <ul>
        {
          conversations.map((conversation)=> {
            const {_id, participants} = conversation
            return (
              <li className={theme} key={_id}>
                <Conversation text={text} id={_id} customerId={participants[0]} handleClick={handleClick} />
              </li>
            )
          })
        }
      </ul>
    </aside>
   
  )
}

export default Conversations