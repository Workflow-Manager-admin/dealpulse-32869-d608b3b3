// Deep-dive code analysis for DealPulse main view components and styling
import React, { useEffect, useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  // State for page navigation
  const [page, setPage] = useState('home'); // 'home', 'map', 'mydeals', 'profile'
  const [user, setUser] = useState(null); // Simulated auth user
  const [deals, setDeals] = useState([]);
  const [location, setLocation] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showDealSubmit, setShowDealSubmit] = useState(false);

  // Simulated Firebase Auth (replace with actual Firebase in production)
  function handleSignIn() {
    setUser({ displayName: "Jane Doe", email: "janedoe@example.com" });
  }
  function handleSignOut() {
    setUser(null);
  }

  // Simulate location detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 37.7749, lng: -122.4194 }) // Fallback: San Francisco
      );
    } else {
      setLocation({ lat: 37.7749, lng: -122.4194 });
    }
  }, []);

  // Simulate fetching deals (would use API in production)
  useEffect(() => {
    // Using location in a real app to filter by user location…
    setDeals([
      {
        id: 1,
        business: "Joe's Coffeehouse",
        details: "50% off Espresso drinks",
        end: Date.now() + 1000 * 60 * 35,
        lat: 37.7751,
        lng: -122.4198,
        affiliateUrl: "#",
      },
      {
        id: 2,
        business: "Bagel Bros",
        details: "Buy 1 Get 1 Bagel Free",
        end: Date.now() + 1000 * 70 * 10,
        lat: 37.7730,
        lng: -122.4220,
        affiliateUrl: "#",
      },
      {
        id: 3,
        business: "Gizmos & Gadgets",
        details: "$15 off purchases $60+",
        end: Date.now() + 1000 * 23 * 30,
        lat: 37.7777,
        lng: -122.4150,
        affiliateUrl: "#",
      },
    ]);
  }, [location]);

  // Simulated push notification logic
  useEffect(() => {
    if (!user) return;
    const soonest = deals.reduce(
      (acc, d) => (d.end < acc.end ? d : acc),
      deals[0] || { end: Infinity }
    );
    if (soonest && soonest.end - Date.now() < 1000 * 60 * 40) {
      setTimeout(() => {
        setNotification({
          message: `Deal ending soon at ${soonest.business}!`,
        });
        setTimeout(() => setNotification(null), 4000);
      }, 2000);
    }
  }, [deals, user]);

  // Handle Deal Submission
  function handleDealSubmit(dealData) {
    setDeals([
      ...deals,
      {
        ...dealData,
        id: deals.length + 1,
        end: Date.now() + 1000 * 60 * 30, // 30 min duration
        affiliateUrl: "#",
      },
    ]);
    setShowDealSubmit(false);
    setNotification({ message: "Deal submitted! Pending community verification." });
    setTimeout(() => setNotification(null), 4000);
  }

  // Render navigation bar (top)
  function Navbar() {
    return (
      <nav className="navbar" style={{ background: "#000" }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo" style={{ color: "#fff" }}>
              <span className="logo-symbol" style={{ color: "#fa0000", fontWeight: 900 }}>*</span>
              DealPulse
            </div>
            <div>
              {user ? (
                <button className="btn" onClick={handleSignOut}>Sign Out</button>
              ) : (
                <button className="btn" onClick={handleSignIn}>Sign In</button>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Render Navigation Tabs (bottom nav style)
  function NavTabs() {
    return (
      <nav style={{
        background: "#181818",
        borderTop: "1px solid #333",
        position: "fixed",
        bottom: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        zIndex: 100,
      }}>
        <TabButton label="Home" icon="🏠" onClick={() => setPage('home')} active={page === 'home'} />
        <TabButton label="Map" icon="🗺️" onClick={() => setPage('map')} active={page === 'map'} />
        <TabButton label="My Deals" icon="⭐" onClick={() => setPage('mydeals')} active={page === 'mydeals'} />
        <TabButton label="Profile" icon="👤" onClick={() => setPage('profile')} active={page === 'profile'} />
      </nav>
    );
  }

  // Render Tab Button (with highlight)
  function TabButton({ label, icon, onClick, active }) {
    return (
      <button
        className="btn"
        style={{
          background: "none",
          color: active ? "#fa0000" : "#fff5f5",
          border: "none",
          borderRadius: 0,
          fontSize: 16,
          flexGrow: 1,
          padding: "10px 0",
        }}
        onClick={onClick}>
        <div>{icon}</div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
      </button>
    );
  }

  // Deal Card Component
  function DealCard({ deal }) {
    const [timer, setTimer] = useState(deal.end - Date.now());
    useEffect(() => {
      const interval = setInterval(() => setTimer(deal.end - Date.now()), 1000);
      return () => clearInterval(interval);
    }, [deal.end]);
    if (timer < 0) return null;
    // Format timer as MM:SS
    function formatTimer(ms) {
      const min = Math.floor(ms / 60000);
      const sec = Math.floor((ms % 60000) / 1000);
      return `${min}:${sec.toString().padStart(2, "0")}`;
    }
    return (
      <div
        style={{
          border: "1px solid #222",
          borderRadius: 10,
          background: "#0a0a0a",
          color: "#fff",
          marginBottom: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          padding: 20,
          position: "relative",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 5 }}>{deal.business}</div>
        <div style={{ color: "#fff5f5", marginBottom: 6 }}>{deal.details}</div>
        <div>
          <span style={{
            background: "#fa0000",
            color: "#fff",
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 600,
            padding: "2px 8px",
            marginRight: 8,
          }}>
            {formatTimer(timer)}
          </span>
          <small style={{ color: "#fa0000", marginLeft: 6 }}>left</small>
        </div>
        <div style={{ marginTop: 14 }}>
          <a
            href={deal.affiliateUrl}
            rel="noopener noreferrer"
            target="_blank"
            className="btn btn-large"
            style={{ background: "#fa0000", color: "#fff", fontWeight: 600, minWidth: 110 }}>
            View / Redeem
          </a>
        </div>
      </div>
    );
  }

  // Deal Submission Form
  function DealSubmitForm({ onSubmit, onCancel }) {
    const [business, setBusiness] = useState('');
    const [details, setDetails] = useState('');
    return (
      <div style={{
        background: "#121212d9",
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
      }}>
        <form
          style={{
            background: "#222",
            padding: 32,
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            minWidth: 320,
            maxWidth: 420,
            color: "#fff",
            gap: 16,
            boxShadow: "0 4px 28px #0008",
          }}
          onSubmit={e => {
            e.preventDefault();
            onSubmit({ business, details, lat: location.lat, lng: location.lng });
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
            Submit a Deal
          </div>
          <input
            value={business}
            onChange={e => setBusiness(e.target.value)}
            placeholder="Business name"
            required
            style={{
              fontSize: 15,
              border: "1px solid #444",
              borderRadius: 6,
              padding: 10,
              marginBottom: 3,
              background: "#181818",
              color: "#fff",
            }}
          />
          <input
            value={details}
            onChange={e => setDetails(e.target.value)}
            placeholder="Deal details"
            required
            style={{
              fontSize: 15,
              border: "1px solid #444",
              borderRadius: 6,
              padding: 10,
              background: "#181818",
              color: "#fff",
            }}
          />
          <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" className="btn" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-large" style={{ background: "#fa0000" }}>Submit</button>
          </div>
        </form>
      </div>
    );
  }

  // Deal List View (Home)
  function HomePage() {
    return (
      <div className="container" style={{ paddingTop: 100, paddingBottom: 90, minHeight: "100vh" }}>
        <div style={{ fontWeight: 700, fontSize: 23, color: "#fff", marginBottom: 6 }}>
          Nearby Deals
        </div>
        <div style={{ color: "#fff5f5", fontSize: 15, marginBottom: 10 }}>
          {location ? (
            <>Showing deals near your location ({Math.round(location.lat * 100) / 100},{' '}
              {Math.round(location.lng * 100) / 100}) </>
          ) : (
            <>Detecting location…</>
          )}
        </div>
        {user && (
          <button
            className="btn btn-large"
            style={{ background: "#111", color: "#fa0000", fontWeight: 700, marginBottom: 26 }}
            onClick={() => setShowDealSubmit(true)}
          >
            Submit a Deal
          </button>
        )}
        <div>
          {deals.length === 0 &&
            <div style={{ color: "#fff5f5", fontSize: 17, marginTop: 40 }}>No deals nearby right now.</div>}
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
        {/* Monetization Placeholder */}
        <div style={{
          marginTop: 30,
          background: "#161616",
          borderRadius: 10,
          padding: 20,
          color: "#fff",
          textAlign: "center",
          fontWeight: 500,
          fontSize: 16,
          boxShadow: "0 1px 8px #0004"
        }}>
          <span style={{color: "#fa0000", fontWeight: 800}}>Ad: </span>
          Flash Savings on Gift Cards! <a href="#" style={{color: "#fa0000"}}>Shop Now</a>
        </div>
      </div>
    );
  }

  // Map View (static placeholder with pins)
  function MapPage() {
    return (
      <div className="container" style={{ paddingTop: 100, paddingBottom: 90, minHeight: "100vh" }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 10 }}>
          Map View <span style={{fontSize: 18, color: "#fa0000"}}>🗺️</span>
        </div>
        <div
          style={{
            width: "100%",
            height: 310,
            background: "#222",
            borderRadius: 14,
            marginBottom: 16,
            position: "relative",
          }}>
          {/* If integrated with Google Maps, we'd show deals as markers */}
          {location && deals.map((deal, idx) => (
            // Fake deal pins
            <div key={deal.id}
              style={{
                position: "absolute",
                top: `${130 + 70 * ((idx % 2) ? 1 : 0)}px`,
                left: `${45 + 140 * (idx % 3)}px`,
                width: 24,
                height: 24,
                background: "#fa0000",
                borderRadius: "50%",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 800,
                boxShadow: "0 2px 8px #222",
              }}>
              <span role="img" aria-label="Deal">⚡</span>
            </div>
          ))}
          <div style={{position:'absolute',right:14,top:8,color:'#fff',fontSize:13,background:'#181818a2',padding:'2px 12px',borderRadius:8}}>
            Deal locations are approximate (demo)
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, color: "#fff", marginBottom: 8 }}>
            Find the hottest local offers on the map – tap a pin for deal details in the full app version.
          </div>
          <div style={{ color: "#fff5f5" }}>
            More map features and navigation tools coming soon.  
          </div>
        </div>
      </div>
    );
  }

  // Saved/My Deals Page
  function MyDealsPage() {
    const userDeals = deals.filter(
      d => user && d.business && d.details && d.lat === location?.lat && d.lng === location?.lng
    ); // In real app, would filter deals saved/submitted by the user
    return (
      <div className="container" style={{ paddingTop: 100, paddingBottom: 90, minHeight: "100vh" }}>
        <div style={{ fontWeight: 700, fontSize: 21, color: "#fff", marginBottom: 11 }}>
          {user ? "Your Deals" : "Sign in to save or submit deals"}
        </div>
        {user ?
          (<>
            <div style={{ color: "#fff5f5", fontSize: 15, marginBottom: 12 }}>Deals you have submitted or favorited:</div>
            {userDeals.length === 0 &&
              <div style={{ color: "#fff5f5", marginTop: 38, fontSize: 17 }}>No deals submitted yet.</div>}
            {userDeals.map(deal => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </>) :
          (<button className="btn btn-large" onClick={handleSignIn} style={{ background: "#111", color: "#fa0000", fontWeight: 700 }}>
            Sign in to Add Your Deals
          </button>)
        }
      </div>
    );
  }

  // Profile Page
  function ProfilePage() {
    return (
      <div className="container" style={{ paddingTop: 100, paddingBottom: 90, minHeight: "100vh"}}>
        <div style={{ fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 16 }}>
          Profile
        </div>
        {!user && (
          <div style={{ color: "#fff5f5", fontSize: 16 }}>
            Please sign in to personalize your experience and save favorite deals.
            <br /><br />
            <button className="btn btn-large" onClick={handleSignIn} style={{ background: "#fa0000", color: "#fff", fontWeight: 700 }}>
              Sign In with Google
            </button>
          </div>
        )}
        {user && (
          <div style={{
            background: "#181818",
            borderRadius: 9,
            padding: 20,
            color: "#fff",
            minWidth: 200,
            marginBottom: 25,
            boxShadow: "0 2px 8px #0006",
            fontSize: 16,
            fontWeight: 500
          }}>
            <div style={{ fontWeight: 700, fontSize: 20 }}>
              {user.displayName || user.email}
            </div>
            <div style={{ color: "#fff5f5", fontSize: 14, marginBottom: 16 }}>{user.email}</div>
            <button className="btn" onClick={handleSignOut} style={{ background: "#222", color: "#fa0000", fontWeight: 600 }}>
              Sign Out
            </button>
            <div style={{marginTop:18, fontSize:14, color:"#999"}}>
              <a style={{color:"#fa0000"}} href="#">Account Settings</a> | <a style={{color:"#fa0000"}} href="#">Contact Support</a>
            </div>
            {/* Monetization Placeholder */}
            <div style={{
              marginTop: 26,
              background: "#161616",
              borderRadius: 10,
              padding: 13,
              color: "#fff",
              fontWeight: 500,
              fontSize: 15,
              textAlign: "center"
            }}>
              <span style={{color: "#fa0000", fontWeight: 800}}>Ad: </span>
              Extra 5% off at <b>Bagel Bros</b> with SnagLocal!
              <br/>
              <a href="#" style={{color: "#fa0000", fontWeight: 700}}>Tap to Unlock</a>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Simulated Push Notification Banner
  function PushNotification() {
    if (!notification) return null;
    return (
      <div style={{
        position: "fixed",
        top: 70,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fa0000",
        color: "#fff",
        fontWeight: 600,
        borderRadius: 10,
        boxShadow: "0 4px 24px #000a",
        padding: "12px 34px",
        zIndex: 1221,
        fontSize: 17,
      }}>
        {notification.message}
      </div>
    );
  }

  // Main render section
  return (
    <div className="app" style={{ backgroundColor: "#000" }}>
      <Navbar />
      <PushNotification />
      {showDealSubmit &&
        <DealSubmitForm onSubmit={handleDealSubmit} onCancel={() => setShowDealSubmit(false)} />
      }
      <main>
        {page === 'home' && <HomePage />}
        {page === 'map' && <MapPage />}
        {page === 'mydeals' && <MyDealsPage />}
        {page === 'profile' && <ProfilePage />}
      </main>
      <NavTabs />
    </div>
  );
}

export default App;