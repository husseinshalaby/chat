import ThemeContext from '../../context/themeContext'
import { BsBell, BsBellSlash, BsLightbulb } from 'react-icons/bs';
import { IoFlashlightOutline } from 'react-icons/io5';
import { useContext } from 'react';
import './header.css';
import '../../App.css';

const Header = ({ notificationSound ,toggleNotificationSound }) => {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <header className={`app-header ${theme}`}>
      <h1 className={`icon ${theme}`}>
        OneCommerce
      </h1>
      <nav className='icons-container'>
        <ul className='nav-list'>
          <li className='nav-list-item' onClick={toggleNotificationSound}>
              {
                notificationSound
                ?  <BsBell className={`icon ${theme}`}/>
                :  <BsBellSlash  className={`icon ${theme}`}/>
              }
          </li>
          <li className='nav-list-item' onClick={toggleTheme}>
              {
                theme === 'light' 
                ? <IoFlashlightOutline className={`icon ${theme}`}/>
                : <BsLightbulb className={`icon ${theme}`}/>
              }
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header