import { Link } from 'react-router-dom';
import './Header.css';
import { useContext } from 'react';
import { AppContext } from '../../context/appContext';
import HeaderSlider from './HeaderSlider/HeaderSlider';

export default function Header() {
    const { user } = useContext(AppContext);

  return (
    <>
    <div id="header-container">
        <h2>
            Welcome to the TP-Trivia App!
        </h2>
        <HeaderSlider />
        
        <Link to={user ? '/create-trivia' : '/login'} className='header-container-buttons'>
          <p>➕</p>Create trivia</Link>

        <Link to={user ? '/': ''} className='header-container-buttons'><p>🎮</p>
        Join room</Link>
    </div>
    </>
  )
}