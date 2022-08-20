import './App.css';
import React, {useEffect, useState,useMemo, useRef} from 'react';
import UserInfo from './components/userInfo/userInfo';
import Conversations from './components/conversations/conversations';
import Messages from './components/messages/messages'
import ThemeContext from './context/themeContext'
import Header from './components/header/header';
import NotificationSound from "./audio/notification.mp3";
import Loading from './components/loading/loading';
import Error from './components/error/error';

const App = () =>  {
  const [theme, setTheme] = useState('light')
  const toggleTheme = () => setTheme((theme) =>  theme === 'light' ? 'dark' : 'light')

  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme])
  
  const [conversationId, setConversationId] = useState('');
  const [customerId, setCustomerId] = useState(null);
  const [customer, setCustomer] =  useState({});
  const [conversations, setConversations] = useState([])
  const [allMessages, setAllMessages] = useState([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [notificationSound, setNotificationSound] = useState(false)

  const audioPlayer = useRef(new Audio(NotificationSound));
  const play = () => audioPlayer.current.play()
  const handleAudio = () => notificationSound && play()
  const notificationInterval = 300000;

    useEffect(() => {
      const loadConversations = async () => {
        try {
          const response = await fetch(`https://recruitment-api-9ocdy.ondigitalocean.app/api/conversations/`);
          const json = await response.json();
          setConversations(json);
        } catch (error) {
          setError(error);
        }
         finally {
          setTimeout(()=>{
            setLoaded(true);
          },1000)
        }
      };
      loadConversations();
      const interval = setInterval(() => {
        loadConversations();
      }, notificationInterval);
  
      return () => clearInterval(interval);
    }, [])

    useEffect(() => {
      const loadUserData = async () => {
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
      if (customerId){
        loadUserData();
      }
    }, [customerId]);

    const toggleNotificationSound = () => setNotificationSound(prev => prev = !prev)

  useEffect(()=> {
    handleAudio()
  }, [conversations])

  useEffect(() => {
    const loadAllMessages = async () => {
      try {
        const response = await fetch(`https://recruitment-api-9ocdy.ondigitalocean.app/api/conversations/${conversationId}/messages`);
        const json = await response.json();
        setAllMessages(json);
      } catch (error) {
        setError(error);
      } finally {
        setLoaded(true);
      }
    };
    if (conversationId !== '') {
      loadAllMessages();
    }
  }, [conversations, conversationId]);

  const handleClick = (conversationId, customerId) => {
    setConversationId(conversationId)
    setCustomerId(customerId)
  }
  const renderLoading = () => {
    if (loaded) return
    return  <Loading text='Loading'/> 
  }
  const renderError = () => {
    if (!error || !loaded) return
    return <Error />
  }
  const renderHomePage = () => {
    if (!loaded || error) return
    return (
      <ThemeContext.Provider value={value}>
        <Header notificationSound={notificationSound} toggleNotificationSound={toggleNotificationSound}/>
        <div className={`container ${theme}`}>
          <Conversations conversations={conversations} handleClick={handleClick}/> 
          <Messages data={allMessages} customer={customer}/>
          <UserInfo customer={customer}/>
        </div>
      </ThemeContext.Provider>
    )
  }
  
  return (
    <React.Fragment>
      { renderLoading()}
      { renderError()}
      { renderHomePage()}      
    </React.Fragment>
  )
}

export default App