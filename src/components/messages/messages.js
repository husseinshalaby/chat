import {useState, useEffect, useRef, useContext} from 'react'
import ThemeContext from '../../context/themeContext';
import {onlyInFirstArray, isSameId} from '../../helpers/compareArrays';
import '../../App.css';
import './messages.css';

const Messages = ({data, customer}) => {
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState({})
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const messagesEnd = useRef()
  const { theme } = useContext(ThemeContext)

  const generateId = () => "id" + Math.random().toString(16).slice(2)
  const scrollToBottom = () => { messagesEnd.current && messagesEnd.current.scrollIntoView({ behavior: "smooth" }); }
 
  useEffect(()=>{
    if(data) {
      setMessages([...data])
    }
  },[])

  useEffect(() => {
    if( data && messages !== data) {
      const newMessages = onlyInFirstArray(data, messages, isSameId);
      setMessages(prev => prev.concat([...newMessages].reverse()))
    }
  }, [data])
 
  useEffect(()=>{
    if( JSON.stringify(response) !==  JSON.stringify({})){
      setMessages(prev => prev.concat({...response}))
    }
  },[response])

  useEffect(()=>{
    scrollToBottom()
  },[messages])

  useEffect(()=> {
    input === '' ? setButtonDisabled(true) : setButtonDisabled(false)
  },[input])
  const handleInputChange = (e) => setInput(e.target.value)
  const handleSubmit = (e) => {
    e.preventDefault()
    setResponse({
      content: input,
      _id: generateId(),
      timestamp: new Date().toLocaleString(),
      type: 'response' 
    })
    setInput('')
  }
  
  const renderCustomerName = () => {
    const customerName = `${ customer.first_name} ${customer.last_name}`
    return  (
      <h2 className={`messages-header ${theme}`}>{customerName}</h2>
    )
  }
  const renderAllMessages = () => {
    return (
      <ul>
        {
          messages.map((post, index)=> {
            const hours = new Date(post.timestamp).getUTCHours();
            const minutes = new Date(post.timestamp).getUTCMinutes();
            return(
              <li className={` ${post.type ==='response'?'response message ' : 'message '} ${theme}`} key={index}>
                {post.content}<span className='time'>{hours}:{minutes}</span>
              </li>
            )
          })
        }
        <div ref={messagesEnd}>
        </div>
      </ul>
    )
  }
  const renderSendMessageForm = () => {
    return (
      <form className='send-messaage-form' onSubmit={handleSubmit}>
        <label htmlFor='send-message-input'>
          <input 
            placeholder='Write your message ...'
            onChange={handleInputChange}
            value={input}
            id='send-message-input'
          />
        </label>
        <button 
          className={`button form-button ${theme} ${buttonDisabled ? 'disabled': ''}`} 
          disabled={buttonDisabled} 
          type='submit'>
          Send
        </button>
      </form>
    )
  }
  if ( JSON.stringify(customer) ===  JSON.stringify({})){
    return <section className='welcome-background'></section>
  }
  return(
    <div className={`messages`}>
      {renderCustomerName()}
      {renderAllMessages()}
      {renderSendMessageForm()}
    </div>
   
  )
}

export default Messages