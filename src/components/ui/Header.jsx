import React from 'react';
import hornLeft from '../../assets/horn-left.svg';
import hornRight from '../../assets/horn-right.svg';
import exitIcon from '../../assets/exit.svg';


const Header = ({ onLogout }) => {
  return (
    <header className="hero header">
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title is-inline has-text-white">Čertovský svařák&nbsp;2025</h1>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="button is-small header-logout-button"
        title="Odhlásit se"
      >
        <img src={exitIcon} alt="Odhlásit" width="16" />
      </button>
    </header>
  );
};

export default Header;
