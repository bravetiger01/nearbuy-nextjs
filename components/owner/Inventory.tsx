'use client';

import { useApp } from '../../lib/store-context';

function stockCls(stock: number) {
  return stock > 15 ? 'ok' : stock > 5 ? 'low' : 'crit';
}

export default function Inventory() {
  const { ownerInventory, toggleListing, deleteProduct, openModal, setEditProduct } = useApp();

  return (
    <div className="o-section active">
      <div className="o-header-row">
        <h2 className="o-title">Stock Manager</h2>
        <button
          className="btn-owner-solid"
          onClick={() => {
            setEditProduct(null);
            openModal('addProduct');
          }}
        >
          + ADD PRODUCT
        </button>
      </div>
      <div className="table-scroll">
        <table className="o-table-boxy">
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>CATEGORY</th>
              <th>STOCK</th>
              <th>PRICE (₹)</th>
              <th>STATUS</th>
              <th>LISTED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {ownerInventory.map((p, i) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.name}</strong>
                </td>
                <td>{p.category}</td>
                <td>
                  <span className={`stock-tag ${stockCls(p.stock)}`}>{p.stock} UNITS</span>
                </td>
                <td>₹{p.price.toLocaleString('en-IN')}</td>
                <td>
                  <span className={p.listed ? 'listed-txt' : 'unlisted-txt'}>{p.listed ? '● LISTED' : '○ NOT LISTED'}</span>
                </td>
                <td>
                  <label className="tgl" style={{ width: 38, height: 20 }}>
                    <input type="checkbox" checked={p.listed} onChange={() => toggleListing(i)} />
                    <span className="tgl-slider" />
                  </label>
                </td>
                <td>
                  <button
                    className="tbl-btn-boxy"
                    onClick={() => {
                      setEditProduct(p);
                      openModal('addProduct');
                    }}
                  >
                    EDIT
                  </button>
                  <button className="tbl-btn-boxy del" onClick={() => deleteProduct(i)}>
                    REMOVE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}