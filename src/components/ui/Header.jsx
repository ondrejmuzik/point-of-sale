import React from 'react';
import { Settings } from 'lucide-react';
import hornLeft from '../../assets/horn-left.svg';
import hornRight from '../../assets/horn-right.svg';


const Header = ({ onSettingsClick }) => {
  return (
    <header className="hero header">
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title is-inline has-text-white">Čertovský svařák&nbsp;2025</h1>
        </div>
      </div>
      <button
        onClick={onSettingsClick}
        className="button is-small header-settings-button"
        title="Nastavení"
      >
        <Settings size={20} color="white" />
      </button>
    </header>
  );
};

export default Header;
