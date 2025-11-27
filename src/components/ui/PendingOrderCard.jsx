import React from 'react';
import { products } from '../../constants/products';

const PendingOrderCard = ({
  order,
  onEdit,
  onComplete,
  onDelete
}) => {
  // Group beverages with cups and sort items
  const getSortedAndGroupedItems = () => {
    const items = [...order.items];
    const productIds = products.map(p => p.id);

    // Separate items by type
    const beverages = items.filter(item => productIds.includes(item.id));
    const cups = items.filter(item => item.id === 'cup');
    const extraCups = items.filter(item => item.id === 'cup-extra');
    const cupReturns = items.filter(item => item.id === 'cup-return');

    const groupedItems = [];
    const usedCupIds = new Set();

    // Group each beverage with a cup
    beverages.forEach(beverage => {
      // Find a matching cup that hasn't been used yet
      const matchingCup = cups.find(cup => !usedCupIds.has(cup.itemId));

      if (matchingCup) {
        usedCupIds.add(matchingCup.itemId);
        // Create a grouped item
        groupedItems.push({
          itemId: `${beverage.itemId}-grouped`,
          id: beverage.id,
          name: beverage.name,
          price: beverage.price + matchingCup.price,
          ready: beverage.ready && matchingCup.ready,
          isGrouped: true,
          beverageItemId: beverage.itemId,
          cupItemId: matchingCup.itemId
        });
      } else {
        // No cup available, show beverage alone (shouldn't happen in normal use)
        groupedItems.push(beverage);
      }
    });

    // Add extra cups (sold separately)
    groupedItems.push(...extraCups);

    // Add cup returns
    groupedItems.push(...cupReturns);

    // Sort by product order
    const orderMap = {};
    productIds.forEach((id, index) => {
      orderMap[id] = index;
    });
    orderMap['cup'] = productIds.length;
    orderMap['cup-extra'] = productIds.length;
    orderMap['cup-return'] = productIds.length + 1;

    return groupedItems.sort((a, b) => {
      const orderA = orderMap[a.id] ?? 999;
      const orderB = orderMap[b.id] ?? 999;
      return orderA - orderB;
    });
  };

  const sortedAndGroupedItems = getSortedAndGroupedItems();

  return (
    <article className="box order-card has-background-warning-light">
      <h3 className="title is-4 mb-4" style={{ color: '#b53839' }}>
        Objednávka #{order.order_number}
      </h3>
      <header className="level is-mobile mb-4">
        <div className="level-left">
          <div className="level-item">
            <div>
              <p className="subtitle is-5 has-text-grey">{order.timestamp}</p>
            </div>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            {order.is_staff_order ? (
              <span className="tag is-info is-light">INTERNÍ</span>
            ) : (
              <p className="title is-5">{order.total},-</p>
            )}
          </div>
        </div>
      </header>

      <div className="order-items mb-4">
        {sortedAndGroupedItems.map((item) => (
          <div
            key={item.itemId}
            className="order-list-item"
          >
            <span style={{ fontSize: '1.1rem' }}>
              {item.name}
              {item.isGrouped && <span style={{ opacity: 0.6, marginLeft: '0.5rem' }}>+ Kelímek</span>}
            </span>
          </div>
        ))}
      </div>

      <div className="buttons mb-4">
        <button
          onClick={() => onComplete(order)}
          className="button is-large is-success"
          style={{ flex: 1 }}
        >
          <span>Uzavřít<span className="is-hidden-mobile"> objednávku</span></span>
        </button>
      </div>

      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <button
              onClick={() => onEdit(order)}
              className="button is-warning"
            >
              Upravit objednávku
            </button>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <button
              onClick={() => onDelete(order)}
              className="button is-danger has-text-white"
            >
              &times;️
            </button>
          </div>
        </div>
      </div>

    </article>
  );
};

export default PendingOrderCard;
