import React from 'react';
import hornLeft from '../assets/horn-left.svg';
import hornRight from '../assets/horn-right.svg';


const Header = () => {
  return (
    <header className="hero header">
      <div className="hero-body">
        <div className="container has-text-centered">
          <span className="icon is-large mr-3">
            <img src={hornLeft} />
          </span>
          <h1 className="title is-1 is-inline-block has-text-white">Čertovský svařáček 2025</h1>
          <span className="icon is-large mr-3">
            <img src={hornRight} />
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
