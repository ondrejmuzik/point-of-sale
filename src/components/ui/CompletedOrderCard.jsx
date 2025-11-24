import React from 'react';
import { products } from '../../constants/products';

const CompletedOrderCard = ({ order, onReopen, onDelete }) => {
  // Group beverages with cups and sort items
  const getSortedAndGroupedItems = () => {
    const items = [...order.items];
    const productIds = products.map(p => p.id);

    // Separate items by type
    const beverages = items.filter(item => productIds.includes(item.id));
    const cups = items.filter(item => item.id === 'cup');
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
          isGrouped: true
        });
      } else {
        // No cup available, show beverage alone
        groupedItems.push(beverage);
      }
    });

    // Add remaining cups that weren't paired with beverages
    const extraCups = cups.filter(cup => !usedCupIds.has(cup.itemId));
    groupedItems.push(...extraCups);

    // Add cup returns
    groupedItems.push(...cupReturns);

    // Sort by product order
    const orderMap = {};
    productIds.forEach((id, index) => {
      orderMap[id] = index;
    });
    orderMap['cup'] = productIds.length;
    orderMap['cup-return'] = productIds.length + 1;

    return groupedItems.sort((a, b) => {
      const orderA = orderMap[a.id] ?? 999;
      const orderB = orderMap[b.id] ?? 999;
      return orderA - orderB;
    });
  };

  const sortedAndGroupedItems = getSortedAndGroupedItems();

  return (
    <article className="box order-card has-background-grey-lighter" style={{ opacity: 0.8 }}>
      <header className="level is-mobile mb-3">
        <div className="level-left">
          <div className="level-item">
            <div>
              <h3 className="title is-5 has-text-grey">Objednávka #{order.order_number}</h3>
              <p className="subtitle is-6 has-text-grey-light">{order.timestamp}</p>
            </div>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <p className="title is-4 has-text-grey">{order.total},-</p>
          </div>
        </div>
      </header>

      <div className="order-items mb-3">
        {sortedAndGroupedItems.map((item, idx) => (
          <div key={item.itemId || idx} className="box is-size-7 py-2 px-3 mb-1 has-background-white">
            <div className="level is-mobile">
              <div className="level-left">
                <div className="level-item">
                  <span className="has-text-grey">
                    {item.name}
                    {item.isGrouped && <span style={{ opacity: 0.6, marginLeft: '0.5rem' }}>+ Kelímek</span>}
                  </span>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <span className="has-text-grey has-text-weight-semibold">{item.price.toFixed(0)},-</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <button
              onClick={() => onReopen(order.id)}
              className="button is-light"
            >
              Znovu otevřít
            </button>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <button
              onClick={() => onDelete(order)}
              className="button is-danger has-text-white"
            >
              &times;
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CompletedOrderCard;
