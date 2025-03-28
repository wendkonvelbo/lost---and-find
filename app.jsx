import { useState, useEffect } from 'react';
import { lost_found_platform_backend } from '../../declarations/lost-found-platform-backend';
import './index.css'
function App() {
  const [items, setItems] = useState([]);
  const [view, setView] = useState('list'); // list, reportLost, reportFound
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const result = await lost_found_platform_backend.getAllItems();
    setItems(result);
    setLoading(false);
  };

  const handleReportItem = async (e, type) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemData = {
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      location: formData.get('location'),
      contact: formData.get('contact'),
    };

    try {
      if (type === 'lost') {
        await lost_found_platform_backend.reportLostItem(
          itemData.name,
          itemData.description,
          itemData.category,
          itemData.location,
          itemData.contact
        );
      } else {
        await lost_found_platform_backend.reportFoundItem(
          itemData.name,
          itemData.description,
          itemData.category,
          itemData.location,
          itemData.contact
        );
      }
      loadItems();
      setView('list');
    } catch (error) {
      console.error('Error reporting item:', error);
    }
  };

  const handleClaim = async (id) => {
    try {
      await lost_found_platform_backend.claimItem(id);
      loadItems();
    } catch (error) {
      console.error('Error claiming item:', error);
    }
  };

  const renderItemList = () => (
    <div className="item-grid">
      {items.map(([id, item]) => (
        <div key={id} className="item-card">
          <div className="item-header">
            <h3 className="item-title">{item.name}</h3>
            <span className={`status-badge ${
              item.status.lost ? 'status-lost' :
              item.status.found ? 'status-found' :
              'status-claimed'
            }`}>
              {item.status.lost ? 'Lost' : item.status.found ? 'Found' : 'Claimed'}
            </span>
          </div>
          <p className="item-description">{item.description}</p>
          <div className="item-details">
            <p className="detail-item">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {item.category}
            </p>
            <p className="detail-item">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {item.location}
            </p>
            <p className="detail-item">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {item.contact}
            </p>
          </div>
          {!item.status.claimed && (
            <button
              onClick={() => handleClaim(id)}
              className="claim-button"
            >
              Claim Item
            </button>
          )}
        </div>
      ))}
    </div>
  );

  const renderForm = (type) => (
    <form onSubmit={(e) => handleReportItem(e, type)} 
          className={form-container ${type === 'lost' ? 'lost-form' : 'found-form'}}>
      <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {type === 'lost' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        )}
      </svg>
      <h2 className={form-title ${type === 'lost' ? 'lost-title' : 'found-title'}}>
        Report {type === 'lost' ? 'Lost' : 'Found'} Item
      </h2>
      <div className="form-group">
        <div>
          <label className="form-label">Item Name</label>
          <input
            type="text"
            name="name"
            required
            className={form-input ${type === 'lost' ? 'lost-input' : 'found-input'}}
            placeholder="Enter item name"
          />
        </div>
        <div>
          <label className="form-label">Description</label>
          <textarea
            name="description"
            required
            className={form-input ${type === 'lost' ? 'lost-input' : 'found-input'}}
            rows="3"
            placeholder="Enter item description"
          ></textarea>
        </div>
        <div>
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            required
            className={form-input ${type === 'lost' ? 'lost-input' : 'found-input'}}
            placeholder="Enter item category"
          />
        </div>
        <div>
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            required
            className={form-input ${type === 'lost' ? 'lost-input' : 'found-input'}}
            placeholder="Enter item location"
          />
        </div>
        <div>
          <label className="form-label">Contact Information</label>
          <input
            type="text"
            name="contact"
            required
            className={form-input ${type === 'lost' ? 'lost-input' : 'found-input'}}
            placeholder="Enter contact information"
          />
        </div>
        <button
          type="submit"
          className={submit-button ${type === 'lost' ? 'lost-submit' : 'found-submit'}}
        >
          Submit Report
        </button>
      </div>
    </form>
  );

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">Lost & Found Platform</h1>
          <div className="nav-buttons">
            <button
              onClick={() => setView('list')}
              className={nav-button ${view === 'list' ? 'active' : ''}}
            >
              View Items
            </button>
            <button
              onClick={() => setView('reportLost')}
              className="report-lost-button"
            >
              Report Lost
            </button>
            <button
              onClick={() => setView('reportFound')}
              className="report-found-button"
            >
              Report Found
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : view === 'list' ? (
          renderItemList()
        ) : view === 'reportLost' ? (
          renderForm('lost')
        ) : (
          renderForm('found')
        )}
      </main>
    </div>
  );
}

export default App;
