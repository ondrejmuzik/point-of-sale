import { products } from '../../constants/products';

const StatisticsView = ({ orders }) => {
  const calculateStats = () => {
    // Separate staff orders from regular orders
    const regularOrders = orders.filter(order => !order.is_staff_order);
    const staffOrders = orders.filter(order => order.is_staff_order);

    // Count revenue only from regular orders
    const totalRevenue = regularOrders.reduce((sum, order) => {
      const orderRevenue = order.items
        .filter(item => item.id !== 'cup')
        .reduce((itemSum, item) => itemSum + item.price, 0);
      return sum + orderRevenue;
    }, 0);

    // Calculate staff order statistics
    const staffOrderCount = staffOrders.length;
    let staffItemsCount = 0;
    staffOrders.forEach(order => {
      staffItemsCount += order.items.filter(item => item.id !== 'cup').length;
    });

    const itemsSold = {};
    const freeItemsSold = {};
    products.forEach(product => {
      itemsSold[product.name] = 0;
      freeItemsSold[product.name] = 0;
    });

    // Track extra cups separately
    let extraCupsCount = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        if (itemsSold.hasOwnProperty(item.name)) {
          if (order.is_staff_order) {
            freeItemsSold[item.name] += 1;
          } else {
            itemsSold[item.name] += 1;
          }
        }
        // Track extra cups (sold separately, not auto-added with beverages)
        if (item.id === 'cup-extra' && !order.is_staff_order) {
          extraCupsCount += 1;
        }
      });
    });

    const revenuePerItem = {};
    products.forEach(product => {
      revenuePerItem[product.name] = 0;
    });

    // Only count revenue from regular orders (exclude staff orders)
    regularOrders.forEach(order => {
      order.items.forEach(item => {
        if (revenuePerItem.hasOwnProperty(item.name)) {
          revenuePerItem[item.name] += item.price;
        }
      });
    });

    return {
      totalRevenue,
      totalOrders: regularOrders.length,
      itemsSold,
      freeItemsSold,
      revenuePerItem,
      totalItemsSold: Object.values(itemsSold).reduce((sum, count) => sum + count, 0),
      extraCupsCount,
      staffOrderCount,
      staffItemsCount,
    };
  };

  const stats = calculateStats();

  return (
    <section className="section statistics-view">
      <div className="container">
        <div className="columns mb-5">
          <div className="column">
            <div className="box has-text-centered">
              <p className="heading">Objednávky</p>
              <p className="title is-1 has-text-danger">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="column">
            <div className="box has-text-centered">
              <p className="heading">Prodané položky</p>
              <p className="title is-1 has-text-info">{stats.totalItemsSold}</p>
            </div>
          </div>

          <div className="column">
            <div className="box has-text-centered">
              <p className="heading">Celkový obrat</p>
              <p className="title is-1 has-text-success">{stats.totalRevenue.toFixed(0)},-</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="columns mb-5">
          <div className="column">
            <div className="box has-text-centered">
              <p className="heading">Interní objednávky</p>
              <p className="title is-1 has-text-warning">{stats.staffOrderCount}</p>
            </div>
          </div>

          <div className="column">
            <div className="box has-text-centered">
              <p className="heading">Bezplatně vydané položky</p>
              <p className="title is-1 has-text-warning">{stats.staffItemsCount}</p>
            </div>
          </div>
        </div>

        <div className="box mb-5">
          <h2 className="title is-3 mb-4">Prodeje podle položek</h2>
          <div className="product-stats">
            {products.map(product => {
              const count = stats.itemsSold[product.name];
              const revenue = stats.revenuePerItem[product.name];
              const freeCount = stats.freeItemsSold[product.name];
              const totalCount = count + freeCount;
              const allItemsTotal = stats.totalItemsSold + stats.staffItemsCount;
              const percentage = allItemsTotal > 0
                ? (totalCount / allItemsTotal * 100).toFixed(1)
                : 0;

              return (
                <article key={product.id} className="mb-5 pb-4" style={{ borderBottom: '1px solid #dbdbdb' }}>
                  <div className="level is-mobile mb-2">
                    <div className="level-left">
                      <div className="level-item">
                        <h3 className="title is-5">{product.name}</h3>
                      </div>
                    </div>
                    <div className="level-right">
                      <div className="level-item">
                        <span className="tag is-light">{percentage}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="columns">
                    <div className="column">
                      <p className="has-text-grey">Celkem:</p>
                      <p className="title is-4 has-text-danger">{totalCount}</p>
                    </div>

                    <div className="column">
                      <p className="has-text-grey">Prodané kusy:</p>
                      <p className="title is-4 has-text-info">{count}</p>
                    </div>

                    <div className="column">
                      <p className="has-text-grey">Bezplatně:</p>
                      <p className="title is-4 has-text-warning">{freeCount}</p>
                    </div>

                    <div className="column">
                      <p className="has-text-grey">Obrat:</p>
                      <p className="title is-4 has-text-success">{revenue.toFixed(0)},-</p>
                    </div>
                  </div>

                  <progress
                    className="progress is-primary"
                    value={percentage}
                    max="100"
                  >
                    {percentage}%
                  </progress>
                </article>
              );
            })}
          </div>
        </div>

        <div className="box">
          <h2 className="title is-3 mb-4">Další statistiky</h2>
          <div className="columns">
            <div className="column is-4">
              <p className="has-text-grey mb-2">Průměrná hodnota objednávky</p>
              <p className="title is-2">
                {stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(0) : '0'},-
              </p>
            </div>
            <div className="column is-4">
              <p className="has-text-grey mb-2">Průměr položek na objednávku</p>
              <p className="title is-2">
                {stats.totalOrders > 0 ? (stats.totalItemsSold / stats.totalOrders).toFixed(1) : '0'}
              </p>
            </div>
            {stats.extraCupsCount > 0 && (
              <div className="column is-3">
                <p className="has-text-grey mb-2">Vydáno prázdných kelímků</p>
                <p className="title is-2">
                  {stats.extraCupsCount}
                </p>
              </div>
            )}
          </div>
        </div>

        {stats.totalOrders === 0 && (
          <div className="notification is-warning mt-5">
            <p className="has-text-weight-semibold">Zatím žádné objednávky</p>
            <p>Statistiky se zobrazí po vytvoření objednávek.</p>
          </div>
        )}

        <div className="notification is-info is-light mt-5">
          <p className="has-text-centered">
            <strong>Poznámka:</strong> Vratné kelímky nejsou započítány do tržeb.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatisticsView;
