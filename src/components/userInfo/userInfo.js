import '../../App.css';
import './userInfo.css';
import {useContext} from 'react';
import ThemeContext from '../../context/themeContext';

const UserInfo = ({customer}) => {
  const { theme } = useContext(ThemeContext)
  if ( JSON.stringify(customer) ===  JSON.stringify({})){
    return null
  }
  return (
    <div className={`user-info ${theme}`}>
      <h2>User Informations</h2>
      <p>Name: <span>{ customer.first_name} {customer.last_name}</span></p>
      <p>Email: <span>{ customer.email}</span></p>
      <p>Phone: <span>{ customer.phone}</span></p>
    </div>
  )
}

export default UserInfo




