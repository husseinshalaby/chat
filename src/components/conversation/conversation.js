import '../../App.css';
import './conversation.css';
import React, {useState, useEffect, useContext, useRef} from 'react';
import moment from 'moment';
import ThemeContext from '../../context/themeContext';
import {onlyInFirstArray, isSameId} from '../../helpers/compareArrays';
import Loading from '../loading/loading';
import Error from '../error/error';

const Conversation = ({id, customerId, handleClick, text}) => {
  const [customer, setCustomer] =  useState({});
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState([])
  const [lastMessage, setLastMessage] = useState('')
  const notificationInterval = 300000;

  const { theme } = useContext(ThemeContext)

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const response = await fetch(`https://recruitment-api-9ocdy.ondigitalocean.app/api/customers/${customerId}`);
        const json = await response.json();
        setCustomer(json);
      } catch (error) {
        setError(error);
      } finally {
        setLoaded(true);
      }
    };
    loadCustomer();
  }, []);
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`https://recruitment-api-9ocdy.ondigitalocean.app/api/conversations/${id}/messages`);
        const json = await response.json();
        setLastMessage(json[0].content)
        setData([...json]);
      } catch (error) {
        setError(error);
      } finally {
        setLoaded(true);
      }
    };
    loadMessages();
    const interval = setInterval(() => {
      loadMessages();
    }, notificationInterval);

    return () => clearInterval(interval);
  }, []);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  const prevData = usePrevious(data );
    useEffect(() => {
        if(prevData && data && prevData !== data) {
          setUnreadMessagesCount(unreadMessages.length)
         const onlyInA = onlyInFirstArray(prevData, data, isSameId);
         setUnreadMessages(prev => [...prev, ...onlyInA])
        }
    }, [data])

  useEffect(()=>{
    setUnreadMessagesCount(unreadMessages.length)
  },[unreadMessages])

  const date = data.length && new Date(data[0].timestamp) 
  const ago = moment.utc(date).local().startOf('seconds').fromNow()
  const handleReset = () => {
    handleClick(id, customerId)
    setUnreadMessages([])
    setUnreadMessagesCount(0)
  }
  const messageToShow = lastMessage.length > 50 ? lastMessage.substring(0, 50) + "..." : lastMessage

  const renderLoading = () => {
    if (loaded) return
    return  <Loading text='Fetching conversations'/> 
  }
  const renderError = () => {
    if (!error || !loaded) return
    return <Error />
  } 
   const renderConversation = () => {
     const customerName = `${customer.first_name} ${customer.last_name}`
    if (!loaded || error) return
    if (text.length > 0 &&  customerName.toLocaleLowerCase().indexOf(text.toLowerCase()) === -1) return null
    return (
      <section className='conversation-container' onClick={handleReset}>
        <header className='conversation-header'>
          <h3 className='conversation-sender'>{customerName}
          </h3>
          <p className={`${unreadMessagesCount > 0 && 'unread-messages'} ${theme}`}>
            {data.length && unreadMessagesCount > 0 && unreadMessagesCount}
          </p>
        </header>
        <section className='conversation-body'>
          <p>{messageToShow}</p>
          <p className='time-ago'>{ago}</p>
        </section>  
      </section>
    )
  }
  
  return (
    <React.Fragment>
      { renderLoading()}
      { renderError()}
      { renderConversation()}      
    </React.Fragment>
  )
}


export default Conversation
