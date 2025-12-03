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
    const extraCups = items.filter(item => item.id === 'cup-extra');
    const cupReturns = items.filter(item => item.id === 'return');

    const groupedItems = [];
    const usedCupIds = new Set();

    // Group each beverage with a cup
    beverages.forEach(beverage => {
      // Find a matching cup that hasn't been used yet
      const matchingCup = cups.find(cup => !usedCupIds.has(cup.itemId));

      if (matchingCup) {
        usedCupIds.add(matchingCup.itemId);
        // Create a grouped item with both beverage and cup
        groupedItems.push({
          itemId: `${beverage.itemId}-grouped`,
          isGrouped: true,
          beverage: beverage,
          cup: matchingCup
        });
      } else {
        // No cup available, show beverage alone
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
    orderMap['return'] = productIds.length + 1;

    return groupedItems.sort((a, b) => {
      const orderA = orderMap[a.isGrouped ? a.beverage.id : a.id] ?? 999;
      const orderB = orderMap[b.isGrouped ? b.beverage.id : b.id] ?? 999;
      return orderA - orderB;
    });
  };

  const sortedAndGroupedItems = getSortedAndGroupedItems();

  return (
    <article className="box order-card has-background-grey-lighter" style={{ opacity: 0.8 }}>
      <h3 className="title is-5 mb-3 has-text-grey">
        Objednávka #{order.order_number}
      </h3>
      <header className="level is-mobile mb-3">
        <div className="level-left">
          <div className="level-item">
            <div>
              <p className="subtitle is-6 has-text-grey">{order.timestamp}</p>
            </div>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            {order.is_staff_order ? (
              <span className="tag is-info is-light">INTERNÍ</span>
            ) : (
              <p className="title is-6 has-text-grey">{order.total},-</p>
            )}
          </div>
        </div>
      </header>

      <div className="order-items mb-3">
        {sortedAndGroupedItems.map((item, idx) => (
          <div key={item.itemId || idx} className="box is-size-7 py-2 px-3 mb-1 has-background-white">
            {item.isGrouped ? (
              // Grouped beverage + cup: show on separate lines
              <>
                <div className="level is-mobile" style={{ marginBottom: '0.25rem' }}>
                  <div className="level-left">
                    <div className="level-item">
                      <span className="has-text-grey has-text-weight-bold">
                        {item.beverage.name}
                      </span>
                    </div>
                  </div>
                  <div className="level-right">
                    <div className="level-item">
                      <span className="has-text-grey has-text-weight-semibold">{item.beverage.price.toFixed(0)},-</span>
                    </div>
                  </div>
                </div>
                <div className="level is-mobile">
                  <div className="level-left">
                    <div className="level-item">
                      <span className="has-text-grey">
                        Kelímek
                      </span>
                    </div>
                  </div>
                  <div className="level-right">
                    <div className="level-item">
                      <span className="has-text-grey">{item.cup.price.toFixed(0)},-</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Non-grouped item: show normally
              <div className="level is-mobile">
                <div className="level-left">
                  <div className="level-item">
                    <span className="has-text-grey">
                      {item.name}
                    </span>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <span className="has-text-grey">{item.price.toFixed(0)},-</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {order.note && (
        <div className="field mb-4">
          <div className="control">
            <input
              type="text"
              className="input is-small"
              value={order.note}
              readOnly
              style={{ opacity: 0.7 }}
            />
          </div>
        </div>
      )}

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
