import React from 'react';

const TabNavigation = ({ activeTab, onTabChange, pendingCount }) => {
  return (
    <nav className="tabs is-boxed is-large is-fullwidth">
      <ul>
        <li className={activeTab === 'pos' ? 'is-active' : ''}>
          <a onClick={() => onTabChange('pos')}>
            <strong>Prodej</strong>
          </a>
        </li>
        <li className={activeTab === 'orders' ? 'is-active' : ''}>
          <a onClick={() => onTabChange('orders')}>
            <strong>Objednávky</strong>
            {pendingCount > 0 && (
              <span className="tag is-danger is-rounded ml-2">
                {pendingCount}
              </span>
            )}
          </a>
        </li>
        <li className={activeTab === 'stats' ? 'is-active' : ''}>
          <a onClick={() => onTabChange('stats')}>
            <strong>Statistika</strong>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default TabNavigation;
