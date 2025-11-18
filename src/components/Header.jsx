import React from 'react';

const Header = () => {
  return (
    <header className="hero is-danger">
      <div className="hero-body">
        <div className="container has-text-centered">
          <span className="icon is-large mr-3">
            <span style={{ fontSize: '2.5rem' }}>☕</span>
          </span>
          <h1 className="title is-1 is-inline-block">Beverage Stall POS</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
