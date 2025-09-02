// UWH Portal - Clubs Mockup v4
import React, { useState } from 'react';
import { Menu, Home, Calendar, Users, User, MapPin, Clock, Check, HelpCircle, X, ChevronDown, ChevronRight, Star, Globe, Bell } from 'lucide-react';

// Component to inject scrollbar hiding CSS
const ScrollbarHider: React.FC = () => (
  <style>{`
    * {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    *::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
  `}</style>
);

type UserRole = 'Club Admin' | 'Practice Admin' | 'Regular Club Member' | 'Known Non-Club Member' | 'Unknown User';

// Types
type Club = {
  id: string;
  name: string;
  longName?: string;
  city: string;
  links: { web?: string };
  locations: { nickname: string; address: string; cityShort: string }[];
  schedule: { dow: "Sun"|"Mon"|"Tue"|"Wed"|"Thu"|"Fri"|"Sat"; time: string; pool: string; info?: { text?: string } }[];
  bannerDataUri?: string;
};

type RSVPChoice = "yes" | "maybe" | "no";

// Sample data
const sampleClubs: Club[] = [
  {
    id: "denver-uwh",
    name: "Denver UWH",
    longName: "Denver Underwater Hockey",
    city: "Denver",
    links: { web: "https://www.meetup.com/denver-underwater-hockey/" },
    locations: [
      { nickname: "VMAC", address: "5310 E 136th Ave", cityShort: "Thornton, CO" },
      { nickname: "Carmody", address: "2200 S Kipling St", cityShort: "Lakewood, CO" }
    ],
    schedule: [
      { dow: "Mon", time: "8:15–9:30 pm", pool: "VMAC", info: { text: "Beginner-friendly; arrive 10 min early." } },
      { dow: "Wed", time: "7:00–8:30 pm", pool: "Carmody", info: { text: "Shallow end reserved. High-level participants only." } },
      { dow: "Thu", time: "8:15–9:30 pm", pool: "VMAC", info: { text: "Scrimmage heavy. High-level participants only." } },
      { dow: "Sun", time: "10:00–11:30 am", pool: "VMAC", info: { text: "Drills + conditioning." } },
      { dow: "Sun", time: "3:00–4:30 pm", pool: "Carmody", info: { text: "Afternoon session." } }
    ],
    bannerDataUri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzMzOTQ4Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRlbnZlciBVbmRlcndhdGVyIEhvY2tleTwvdGV4dD4KPHN2Zz4="
  },
  {
    id: "sydney-uwh",
    name: "Sydney Kings",
    longName: "Sydney Kings Underwater Hockey Club",
    city: "Sydney",
    links: { web: "https://nswunderwaterhockey.com/clubs/sydney" },
    locations: [
      { nickname: "Ryde", address: "504 Victoria Rd", cityShort: "Ryde, NSW" }
    ],
    schedule: [
      { dow: "Fri", time: "7:00–9:00 pm", pool: "Ryde", info: { text: "All levels; bring fins & mouthguard." } }
    ],
    bannerDataUri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMDc5MmJhIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlN5ZG5leSBLaW5ncyBVbmRlcndhdGVyIEhvY2tleTwvdGV4dD4KPHN2Zz4="
  }
];

// Utility functions
function parseStartMinutes(timeStr: string): number {
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
}

function getNextPractice(club: Club): { date: string; time: string; location: string; dow: string } | null {
  const now = new Date();
  const today = now.getDay(); // 0 = Sunday
  const todayMinutes = now.getHours() * 60 + now.getMinutes();
  
  let minScore = Infinity;
  let nextPractice: any = null;
  
  for (const sched of club.schedule) {
    const schedDow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(sched.dow);
    const schedMinutes = parseStartMinutes(sched.time);
    
    let daysAhead = schedDow - today;
    if (daysAhead < 0 || (daysAhead === 0 && schedMinutes <= todayMinutes)) {
      daysAhead += 7;
    }
    
    const score = daysAhead * 1440 + schedMinutes;
    if (score < minScore) {
      minScore = score;
      const nextDate = new Date(now);
      nextDate.setDate(nextDate.getDate() + daysAhead);
      
      const location = club.locations.find(loc => loc.nickname === sched.pool);
      nextPractice = {
        date: nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        time: sched.time,
        location: location ? `${location.nickname} (${location.cityShort})` : sched.pool,
        dow: sched.dow
      };
    }
  }
  
  return nextPractice;
}

// CSS Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  phoneFrame: {
    maxWidth: '390px',
    backgroundColor: '#000',
    borderRadius: '2.5rem',
    padding: '8px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  phoneScreen: {
    backgroundColor: '#fff',
    borderRadius: '2rem',
    height: '844px',
    width: '390px',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 24px',
    fontSize: '14px',
    fontWeight: '500'
  },
  appHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb'
  },
  content: {
    flex: 1,
    overflowY: 'auto' as const,
    backgroundColor: '#f9fafb',
    padding: '16px',
    // Force scrollbar hiding with inline styles
    scrollbarWidth: 'none' as any,
    msOverflowStyle: 'none' as any,
    WebkitOverflowScrolling: 'touch' as any
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  clubTile: {
    backgroundColor: '#fff',
    borderRadius: '1rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    marginBottom: '16px'
  },
  clubContent: {
    display: 'flex',
    width: '100%',
    maxWidth: '100%'
  },
  clubInfo: {
    flex: 1,
    padding: '16px',
    minWidth: 0,
    overflow: 'hidden'
  },
  clubBanner: {
    width: '170px',
    height: '89px',
    margin: '16px 12px 16px 4px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#0792ba',
    flexShrink: 0,
    alignSelf: 'flex-start'
  },
  nextPractice: {
    marginTop: '16px',
    paddingTop: '16px',
    minHeight: '70px'
  },
  fullWidthDivider: {
    borderTop: '1px solid #f3f4f6',
    width: '100%',
    marginTop: '16px'
  },
  rsvpButtons: {
    display: 'flex',
    gap: '8px',
    marginLeft: '16px'
  },
  rsvpButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: '2px solid #e5e7eb',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  rsvpButtonSelected: {
    borderWidth: '3px'
  },
  bottomTabs: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '8px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#fff'
  },
  tab: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '8px'
  },
  toast: {
    position: 'absolute' as const,
    top: '80px',
    left: '16px',
    right: '16px',
    zIndex: 50,
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    wordWrap: 'break-word' as const,
    maxWidth: 'calc(100% - 32px)',
    whiteSpace: 'normal' as const
  }
};

// Components
const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={styles.phoneFrame}>
    <div style={styles.phoneScreen} className="phone-screen">
      {children}
    </div>
  </div>
);

const StatusBar: React.FC = () => (
  <div style={styles.statusBar}>
    <span>12:14 AM</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        <div style={{ width: '4px', height: '12px', backgroundColor: '#000', borderRadius: '2px' }}></div>
        <div style={{ width: '4px', height: '12px', backgroundColor: '#000', borderRadius: '2px' }}></div>
        <div style={{ width: '4px', height: '12px', backgroundColor: '#000', borderRadius: '2px' }}></div>
        <div style={{ width: '4px', height: '12px', backgroundColor: '#d1d5db', borderRadius: '2px' }}></div>
      </div>
      <div style={{ width: '24px', height: '12px', border: '1px solid #000', borderRadius: '2px', padding: '1px' }}>
        <div style={{ width: '16px', height: '8px', backgroundColor: '#000', borderRadius: '1px' }}></div>
      </div>
    </div>
  </div>
);

const RoleModal: React.FC<{ 
  isOpen: boolean; 
  currentRole: UserRole; 
  onRoleSelect: (role: UserRole) => void; 
  onClose: () => void 
}> = ({ isOpen, currentRole, onRoleSelect, onClose }) => {
  if (!isOpen) return null;
  
  const roles: UserRole[] = [
    'Club Admin',
    'Practice Admin', 
    'Regular Club Member',
    'Known Non-Club Member',
    'Unknown User'
  ];
  
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        margin: '16px',
        maxWidth: '300px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            margin: 0,
            color: '#111827'
          }}>Select Role</h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X style={{ width: '20px', height: '20px', color: '#6b7280' }} />
          </button>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            margin: 0,
            lineHeight: '1.4'
          }}>
            Preview roles to toggle admin controls in the UI. This doesn't change real account data.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => onRoleSelect(role)}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                border: currentRole === role ? '2px solid #0284c7' : '1px solid #e5e7eb',
                backgroundColor: currentRole === role ? '#eff6ff' : '#ffffff',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: currentRole === role ? '500' : '400',
                color: currentRole === role ? '#0284c7' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const MenuOverlay: React.FC<{ isOpen: boolean; onItemClick: (item: string) => void }> = ({ isOpen, onItemClick }) => {
  if (!isOpen) return null;
  
  const menuItems = ['ABOUT', 'FAQ', 'LEARN', 'CLUBS', 'EVENTS', 'PROGRAMS', 'NOTIFICATIONS', 'PROFILE'];
  
  return (
    <div style={{
      position: 'absolute',
      top: '60px',
      left: '0',
      right: '0',
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: 40
    }}>
      {menuItems.map((item, index) => (
        <button
          key={item}
          onClick={() => onItemClick(item)}
          style={{
            width: '100%',
            padding: '16px',
            textAlign: 'left',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '16px',
            fontWeight: '500',
            color: '#374151',
            cursor: 'pointer',
            borderBottom: index < menuItems.length - 1 ? '1px solid #f3f4f6' : 'none'
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

const AppHeader: React.FC<{ 
  menuOpen: boolean; 
  onToggleMenu: () => void; 
  title: string;
  onNotificationClick: () => void;
}> = ({ menuOpen, onToggleMenu, title, onNotificationClick }) => (
  <div style={styles.appHeader}>
    <h1 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>{title}</h1>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <button 
        onClick={onNotificationClick}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Bell style={{ width: '24px', height: '24px', color: '#6b7280' }} />
      </button>
      <button 
        onClick={onToggleMenu}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {menuOpen ? 
          <X style={{ width: '24px', height: '24px', color: '#6b7280' }} /> :
          <Menu style={{ width: '24px', height: '24px', color: '#6b7280' }} />
        }
      </button>
    </div>
  </div>
);

const ProgramsIcon: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left person */}
      <circle cx="6" cy="7" r="2.5" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M1 20v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1" stroke={color} strokeWidth="2" fill="none"/>
      
      {/* Center person (slightly forward) */}
      <circle cx="12" cy="6" r="2.5" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M7 20v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1" stroke={color} strokeWidth="2" fill="none"/>
      
      {/* Right person */}
      <circle cx="18" cy="7" r="2.5" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M13 20v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  </div>
);

const BottomTabs: React.FC<{ 
  activeTab: string; 
  onTabChange: (tab: string) => void; 
  onProfileClick: () => void 
}> = ({ activeTab, onTabChange, onProfileClick }) => (
  <div style={styles.bottomTabs}>
    <button 
      onClick={() => onTabChange('Home')}
      style={{
        ...styles.tab,
        background: 'none',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      <Home style={{ 
        width: '24px', 
        height: '24px', 
        color: activeTab === 'Home' ? '#0284c7' : '#9ca3af' 
      }} />
      <span style={{ 
        fontSize: '12px', 
        color: activeTab === 'Home' ? '#0284c7' : '#9ca3af', 
        marginTop: '4px',
        fontWeight: activeTab === 'Home' ? '500' : '400'
      }}>Home</span>
    </button>
    <button 
      onClick={() => onTabChange('Events')}
      style={{
        ...styles.tab,
        background: 'none',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      <Calendar style={{ 
        width: '24px', 
        height: '24px', 
        color: activeTab === 'Events' ? '#0284c7' : '#9ca3af' 
      }} />
      <span style={{ 
        fontSize: '12px', 
        color: activeTab === 'Events' ? '#0284c7' : '#9ca3af', 
        marginTop: '4px',
        fontWeight: activeTab === 'Events' ? '500' : '400'
      }}>Events</span>
    </button>
    <button 
      onClick={() => onTabChange('Programs')}
      style={{
        ...styles.tab,
        background: 'none',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      <ProgramsIcon color={activeTab === 'Programs' ? '#0284c7' : '#9ca3af'} />
      <span style={{ 
        fontSize: '12px', 
        color: activeTab === 'Programs' ? '#0284c7' : '#9ca3af', 
        marginTop: '4px',
        fontWeight: activeTab === 'Programs' ? '500' : '400'
      }}>Programs</span>
    </button>
    <button 
      onClick={() => onTabChange('Clubs')}
      style={{
        ...styles.tab,
        background: 'none',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      <Users style={{ 
        width: '24px', 
        height: '24px', 
        color: activeTab === 'Clubs' ? '#0284c7' : '#9ca3af' 
      }} />
      <span style={{ 
        fontSize: '12px', 
        color: activeTab === 'Clubs' ? '#0284c7' : '#9ca3af', 
        marginTop: '4px',
        fontWeight: activeTab === 'Clubs' ? '500' : '400'
      }}>Clubs</span>
    </button>
    <button 
      onClick={() => {
        onTabChange('Profile');
        onProfileClick();
      }}
      style={{
        ...styles.tab,
        background: 'none',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      <User style={{ 
        width: '24px', 
        height: '24px', 
        color: activeTab === 'Profile' ? '#0284c7' : '#9ca3af' 
      }} />
      <span style={{ 
        fontSize: '12px', 
        color: activeTab === 'Profile' ? '#0284c7' : '#9ca3af', 
        marginTop: '4px',
        fontWeight: activeTab === 'Profile' ? '500' : '400'
      }}>Profile</span>
    </button>
  </div>
);

const RSVPIconButton: React.FC<{ 
  type: RSVPChoice; 
  selected: boolean; 
  onClick: () => void;
}> = ({ type, selected, onClick }) => {
  const config = {
    yes: { icon: Check, color: '#10b981', fadedBg: '#ecfdf5' },
    maybe: { icon: HelpCircle, color: '#f59e0b', fadedBg: '#fffbeb' },
    no: { icon: X, color: '#ef4444', fadedBg: '#fef2f2' }
  };
  
  const { icon: Icon, color, fadedBg } = config[type];
  
  const buttonStyle = {
    width: '59px',
    height: '59px',
    borderRadius: '8px',
    border: selected ? `3px solid ${color}` : '1px solid #e5e7eb',
    backgroundColor: selected ? fadedBg : '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative' as const
  };
  
  return (
    <button 
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }} 
      style={buttonStyle}
    >
      <Star 
        style={{ 
          width: '70px', 
          height: '70px', 
          color: color,
          fill: 'none',
          strokeWidth: 1.5
        }} 
      />
      {type === 'maybe' ? (
        // Use a simple question mark without the circle for maybe
        <div
          style={{
            position: 'absolute',
            fontSize: '24px',
            fontWeight: 'bold',
            color: color,
            lineHeight: 1
          }}
        >
          ?
        </div>
      ) : (
        <Icon 
          style={{ 
            width: '26px', 
            height: '26px', 
            color: color,
            position: 'absolute',
            strokeWidth: 2
          }} 
        />
      )}
    </button>
  );
};

const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'success' }> = ({ children, variant = 'default' }) => {
  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: variant === 'success' ? '#ecfdf5' : '#f3f4f6',
    color: variant === 'success' ? '#065f46' : '#374151'
  };
  
  return <span style={badgeStyle}>{children}</span>;
};

const ClubTile: React.FC<{ 
  club: Club; 
  onRSVP: (clubId: string, choice: RSVPChoice) => void;
  currentRSVP?: RSVPChoice;
  onSelectClub: (club: Club) => void;
}> = ({ club, onRSVP, currentRSVP, onSelectClub }) => {
  const [showTypical, setShowTypical] = useState(false);
  const [expandedPractices, setExpandedPractices] = useState<Record<string, boolean>>({});
  const nextPractice = getNextPractice(club);
  
  return (
    <div style={styles.clubTile}>
      <div style={styles.clubContent}>
        <div style={styles.clubInfo}>
          <div 
            style={{ 
              marginBottom: '16px',
              cursor: 'pointer' 
            }}
            onClick={() => {
              onSelectClub(club);
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, marginBottom: '4px' }}>
              {club.name}
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{club.longName}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div 
            style={{
              ...styles.clubBanner,
              cursor: 'pointer'
            }}
            onClick={() => {
              onSelectClub(club);
            }}
          >
            {club.bannerDataUri && (
              <img 
                src={club.bannerDataUri} 
                alt={`${club.name} banner`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
        </div>
      </div>
      
      {nextPractice && (
        <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '500', margin: 0, marginBottom: '6px', color: '#374151' }}>Next Practice</h4>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#374151', marginBottom: '2px' }}>
                <Calendar size={16} style={{ marginRight: '6px', color: '#6b7280' }} />
                <span>{nextPractice.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280', marginBottom: '2px' }}>
                <Clock size={16} style={{ marginRight: '6px' }} />
                <span>{nextPractice.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
                <MapPin size={16} style={{ marginRight: '6px' }} />
                <button
                  onClick={() => {
                    // Open map to the location
                    const address = nextPractice.location.split(' (')[0]; // Remove city portion
                    console.log(`Opening map for: ${address}`);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '14px',
                    color: '#0284c7',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  {nextPractice.location.split(' (')[0]}
                </button>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                Will you attend?
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <RSVPIconButton 
                  type="yes" 
                  selected={currentRSVP === "yes"}
                  onClick={() => onRSVP(club.id, "yes")}
                />
                <RSVPIconButton 
                  type="maybe" 
                  selected={currentRSVP === "maybe"}
                  onClick={() => onRSVP(club.id, "maybe")}
                />
                <RSVPIconButton 
                  type="no" 
                  selected={currentRSVP === "no"}
                  onClick={() => onRSVP(club.id, "no")}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div style={{ padding: '0 16px 16px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              fontSize: '14px',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '4px 0'
            }}
            onClick={(event) => {
              event.stopPropagation();
              setShowTypical(!showTypical);
            }}
          >
            {showTypical ? <ChevronDown style={{ width: '16px', height: '16px', marginRight: '6px' }} /> : <ChevronRight style={{ width: '16px', height: '16px', marginRight: '6px' }} />}
            Typical practices
          </button>
        </div>

        {showTypical && (
          <div style={{ marginTop: '8px' }}>
            {club.schedule.map((sched, idx) => {
              const practiceKey = `${club.id}-${idx}`;
              const isExpanded = expandedPractices[practiceKey];
              
              return (
                <div key={idx} style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span>
                      <span style={{ fontWeight: '500' }}>{sched.dow}</span> • {sched.time} • 
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          // Find the location and open map
                          const location = club.locations.find(loc => loc.nickname === sched.pool);
                          if (location) {
                            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address + ', ' + location.cityShort)}`;
                            window.open(mapUrl, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontSize: '14px',
                          color: '#0284c7',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontWeight: 'normal'
                        }}
                      >
                        {sched.pool}
                      </button>
                    </span>
                    <div style={{ 
                      display: 'inline-block', 
                      backgroundColor: '#dcfce7', 
                      color: '#166534', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Open
                    </div>
                  </div>
                  {sched.info?.text && (
                    <div style={{ marginTop: '4px' }}>
                      {sched.info.text.length > 50 ? (
                        // Long text - use dropdown
                        <>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              setExpandedPractices(prev => ({
                                ...prev,
                                [practiceKey]: !prev[practiceKey]
                              }));
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              fontSize: '12px',
                              color: '#6b7280',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              fontWeight: '500'
                            }}
                          >
                            {isExpanded ? <ChevronDown style={{ width: '14px', height: '14px', marginRight: '4px' }} /> : <ChevronRight style={{ width: '14px', height: '14px', marginRight: '4px' }} />}
                            Practice details
                          </button>
                          {isExpanded && (
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#9ca3af', 
                              paddingLeft: '18px', 
                              fontStyle: 'italic',
                              marginTop: '4px'
                            }}>
                              {sched.info.text}
                            </div>
                          )}
                        </>
                      ) : (
                        // Short text - display inline
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#9ca3af', 
                          paddingLeft: '4px', 
                          fontStyle: 'italic'
                        }}>
                          {sched.info.text}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const Toast: React.FC<{ message: string; color: string; onClose: () => void }> = ({ message, color, onClose }) => {
  const getColorConfig = (color: string) => {
    switch (color) {
      case '#10b981': // green
        return { bgColor: '#ecfdf5', borderColor: '#a7f3d0', textColor: '#065f46', icon: Check };
      case '#f59e0b': // amber
        return { bgColor: '#fffbeb', borderColor: '#fcd34d', textColor: '#92400e', icon: HelpCircle };
      case '#ef4444': // red
        return { bgColor: '#fef2f2', borderColor: '#fca5a5', textColor: '#991b1b', icon: X };
      default:
        return { bgColor: '#ecfdf5', borderColor: '#a7f3d0', textColor: '#065f46', icon: Check };
    }
  };
  
  const { bgColor, borderColor, textColor, icon: Icon } = getColorConfig(color);
  
  const toastStyle = {
    ...styles.toast,
    backgroundColor: bgColor,
    border: `1px solid ${borderColor}`
  };
  
  return (
    <div style={toastStyle}>
      <Icon style={{ width: '20px', height: '20px', color: textColor, marginRight: '8px', flexShrink: 0 }} />
      <p style={{ 
        color: textColor, 
        fontSize: '14px', 
        flex: 1, 
        margin: 0,
        wordWrap: 'break-word',
        whiteSpace: 'normal',
        lineHeight: '1.4'
      }}>{message}</p>
      <button 
        onClick={onClose} 
        style={{ 
          color: textColor, 
          marginLeft: '8px', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer' 
        }}
      >
        <X style={{ width: '16px', height: '16px' }} />
      </button>
    </div>
  );
};

function App() {
  const [rsvpChoices, setRsvpChoices] = useState<Record<string, RSVPChoice>>({});
  const [toast, setToast] = useState<{ message: string; color: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Clubs');
  const [roleOpen, setRoleOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('Regular Club Member');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubTab, setClubTab] = useState('rsvp'); // Start with RSVP tab as specified
  const [expandedPractices, setExpandedPractices] = useState<Record<string, boolean>>({});
  
  const handleRSVP = (clubId: string, choice: RSVPChoice) => {
    setRsvpChoices(prev => ({ ...prev, [clubId]: choice }));
    
    const club = sampleClubs.find(c => c.id === clubId);
    const nextPractice = club ? getNextPractice(club) : null;
    const choiceText = choice === "yes" ? "Yes" : choice === "maybe" ? "Maybe" : "No";
    
    let message = `RSVP for ${club?.name} set to "${choiceText}"`;
    if (nextPractice) {
      message += ` for ${nextPractice.date} at ${nextPractice.time}`;
    }
    
    const color = choice === "yes" ? "#10b981" : choice === "maybe" ? "#f59e0b" : "#ef4444";
    
    setToast({
      message,
      color
    });
    
    setTimeout(() => setToast(null), 3000);
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleNotificationClick = () => {
    setActiveTab('Notifications');
    setSelectedClub(null);
  };
  
  const handleMenuItemClick = (item: string) => {
    setMenuOpen(false);
    
    switch (item) {
      case 'CLUBS':
        setActiveTab('Clubs');
        setSelectedClub(null); // Clear any selected club to show "My Clubs"
        break;
      case 'EVENTS':
        setActiveTab('Events');
        break;
      case 'PROGRAMS':
        setActiveTab('Programs');
        break;
      case 'PROFILE':
        setActiveTab('Profile');
        setRoleOpen(true);
        break;
      case 'ABOUT':
        setActiveTab('About');
        break;
      case 'FAQ':
        setActiveTab('FAQ');
        break;
      case 'LEARN':
        setActiveTab('Learn');
        break;
      case 'NOTIFICATIONS':
        setActiveTab('Notifications');
        setSelectedClub(null);
        break;
      default:
        console.log(`Navigation to ${item} - placeholder`);
        break;
    }
  };
  
  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setRoleOpen(false);
  };
  
  const handleRoleModalClose = () => {
    setRoleOpen(false);
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'Clubs') {
      setSelectedClub(null); // Clear any selected club to show "My Clubs"
    }
  };
  
  const getPageTitle = () => {
    switch (activeTab) {
      case 'Home': return 'Home';
      case 'Events': return 'Events';
      case 'Programs': return 'Programs';
      case 'Clubs': 
        return selectedClub ? `Clubs - ${selectedClub.name}` : 'Clubs';
      case 'Profile': return 'Profile';
      case 'About': return 'About';
      case 'FAQ': return 'FAQ';
      case 'Learn': return 'Learn';
      case 'Notifications': return 'Notifications';
      default: return 'Clubs';
    }
  };
  
  return (
    <div style={styles.container}>
      <ScrollbarHider />
      <PhoneFrame>
        <StatusBar />
        <AppHeader 
          menuOpen={menuOpen} 
          onToggleMenu={toggleMenu} 
          title={getPageTitle()} 
          onNotificationClick={handleNotificationClick}
        />
        <MenuOverlay isOpen={menuOpen} onItemClick={handleMenuItemClick} />
        
        <div style={styles.content} className="phone-content">
          {activeTab === 'Clubs' ? (
            selectedClub ? (
              // Individual Club Page
              <div>
                {/* Club Header */}
                <div style={{ 
                  backgroundColor: '#fff', 
                  borderBottom: '1px solid #e5e7eb',
                  marginBottom: '16px',
                  marginLeft: '-16px',
                  marginRight: '-16px',
                  padding: '16px'
                }}>
                  {/* Club Banner Image */}
                  <div style={{ 
                    width: '100%', 
                    aspectRatio: '1.91',
                    backgroundColor: '#0792ba',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    backgroundImage: 'linear-gradient(135deg, #0792ba 0%, #0a5a7a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {/* Placeholder for club banner - would use actual image in real implementation */}
                    {selectedClub.name} Banner
                  </div>
                  
                  {/* Club Name - Centered */}
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
                      {selectedClub.longName || selectedClub.name}
                    </h1>
                  </div>
                  
                  {/* Action Buttons Row */}
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        // Open club website in new tab
                        window.open('https://example-club-website.com', '_blank', 'noopener,noreferrer');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        color: '#374151',
                        cursor: 'pointer'
                      }}
                    >
                      <Globe size={20} />
                    </button>
                    
                    <button
                      onClick={() => {
                        // Route to RSVP sub-tab
                        setClubTab('rsvp');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#374151',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      <User size={16} />
                      See my club profile
                    </button>
                    
                    <button
                      onClick={() => {
                        // Open role/profile modal
                        setRoleOpen(true);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#374151',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      <Users size={16} />
                      {currentRole === 'Club Admin' ? 'Manage Club' : 'Edit Club'}
                    </button>
                  </div>
                  
                  {/* Club Tabs */}
                  <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                    {['rsvp', 'typical-practices', 'gallery', 'forum'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setClubTab(tab)}
                        style={{
                          padding: '12px 16px',
                          border: 'none',
                          background: 'none',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: clubTab === tab ? '#0284c7' : '#6b7280',
                          borderBottom: clubTab === tab ? '2px solid #0284c7' : 'none',
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                        role="tab"
                        aria-selected={clubTab === tab}
                        data-testid={`club-tab-${tab}`}
                      >
                        {tab === 'rsvp' ? 'RSVP' :
                         tab === 'typical-practices' ? 'Typical practices' : 
                         tab === 'gallery' ? 'Gallery' : 
                         'Forum'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Next Practice Overlay */}
                {(() => {
                  const nextPractice = getNextPractice(selectedClub);
                  const hasRSVP = rsvpChoices[selectedClub.id];
                  
                  return nextPractice && !hasRSVP ? (
                    <div style={{
                      position: 'fixed',
                      top: '80px',
                      left: '12px',
                      right: '12px',
                      maxWidth: '366px',
                      margin: '0 auto',
                      zIndex: 1000,
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ fontSize: '14px', fontWeight: '500', margin: 0, marginBottom: '6px', color: '#374151' }}>Next Practice</h4>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#374151', marginBottom: '2px' }}>
                              <Calendar size={16} style={{ marginRight: '6px', color: '#6b7280' }} />
                              <span>{nextPractice.date}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280', marginBottom: '2px' }}>
                              <Clock size={16} style={{ marginRight: '6px' }} />
                              <span>{nextPractice.time}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#6b7280' }}>
                              <MapPin size={16} style={{ marginRight: '6px' }} />
                              <button
                                onClick={() => {
                                  // Open map to the location
                                  const address = nextPractice.location.split(' (')[0];
                                  console.log(`Opening map for: ${address}`);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  fontSize: '14px',
                                  color: '#0284c7',
                                  textDecoration: 'underline',
                                  cursor: 'pointer'
                                }}
                              >
                                {nextPractice.location.split(' (')[0]}
                              </button>
                            </div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                              Will you attend?
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <RSVPIconButton 
                                type="yes" 
                                selected={false}
                                onClick={() => {
                                  handleRSVP(selectedClub.id, "yes");
                                }}
                              />
                              <RSVPIconButton 
                                type="maybe" 
                                selected={false}
                                onClick={() => {
                                  handleRSVP(selectedClub.id, "maybe");
                                }}
                              />
                              <RSVPIconButton 
                                type="no" 
                                selected={false}
                                onClick={() => {
                                  handleRSVP(selectedClub.id, "no");
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Club Tab Content */}
                <div role="tabpanel">
                  {clubTab === 'typical-practices' && (
                    <div style={{ paddingLeft: '16px', paddingRight: '16px' }}>
                      {/* Practice Sessions List - no grouping, just like My Clubs */}
                      {selectedClub.schedule.map((practice, index) => {
                        const practiceKey = `club-${selectedClub.id}-${index}`;
                        const isExpanded = expandedPractices[practiceKey];
                        
                        return (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            paddingTop: '12px',
                            paddingBottom: '12px',
                            borderBottom: index < selectedClub.schedule.length - 1 ? '1px solid #f3f4f6' : 'none',
                            flexDirection: 'column'
                          }}>
                            <div style={{ 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%'
                            }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ 
                                  fontSize: '14px', 
                                  fontWeight: '500', 
                                  color: '#374151',
                                  marginBottom: '4px'
                                }}>
                                  {practice.dow} • {practice.time} • 
                                  <button
                                    onClick={() => {
                                      // Find the location and open map
                                      const location = selectedClub.locations.find(loc => loc.nickname === practice.pool);
                                      if (location) {
                                        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address + ', ' + location.cityShort)}`;
                                        window.open(mapUrl, '_blank', 'noopener,noreferrer');
                                      }
                                    }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      padding: 0,
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      color: '#0284c7',
                                      textDecoration: 'underline',
                                      cursor: 'pointer',
                                      marginLeft: '4px'
                                    }}
                                  >
                                    {practice.pool}
                                  </button>
                                </div>
                              </div>
                              <div style={{ 
                                display: 'inline-block', 
                                backgroundColor: '#10b981', 
                                color: 'white', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                fontSize: '12px',
                                fontWeight: '500',
                                marginLeft: '12px',
                                whiteSpace: 'nowrap'
                              }}>
                                Open
                              </div>
                            </div>
                            {practice.info?.text && (
                              <div style={{ marginTop: '8px', width: '100%' }}>
                                {practice.info.text.length > 50 ? (
                                  // Long text - use dropdown
                                  <>
                                    <button
                                      onClick={() => {
                                        setExpandedPractices(prev => ({
                                          ...prev,
                                          [practiceKey]: !prev[practiceKey]
                                        }));
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        fontSize: '12px',
                                        color: '#6b7280',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontWeight: '500'
                                      }}
                                    >
                                      {isExpanded ? <ChevronDown style={{ width: '14px', height: '14px', marginRight: '4px' }} /> : <ChevronRight style={{ width: '14px', height: '14px', marginRight: '4px' }} />}
                                      Practice details
                                    </button>
                                    {isExpanded && (
                                      <div style={{ 
                                        fontSize: '12px', 
                                        color: '#9ca3af',
                                        fontStyle: 'italic',
                                        marginTop: '4px',
                                        paddingLeft: '18px'
                                      }}>
                                        {practice.info.text}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  // Short text - display inline
                                  <div style={{ 
                                    fontSize: '12px', 
                                    color: '#9ca3af',
                                    fontStyle: 'italic'
                                  }}>
                                    {practice.info.text}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {/* No practices message if none exist */}
                      {selectedClub.schedule.length === 0 && (
                        <div style={{ 
                          padding: '16px',
                          textAlign: 'center'
                        }}>
                          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                            No typical practices scheduled.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {clubTab === 'rsvp' && (
                    <div>
                      {/* Bulk RSVPs Button - Sticky */}
                      <div style={{ 
                        position: 'sticky', 
                        top: 0, 
                        zIndex: 100, 
                        backgroundColor: '#f9fafb', 
                        padding: '16px', 
                        marginBottom: '16px',
                        marginLeft: '-16px',
                        marginRight: '-16px'
                      }}>
                        <button style={{
                          width: '100%',
                          padding: '12px',
                          backgroundColor: '#0284c7',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>
                          Bulk RSVPs
                        </button>
                      </div>

                      {/* Calendar View */}
                      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px' }}>
                        {/* Month Header */}
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                          Sep 2025
                        </h3>
                        
                        {/* Day Headers - Sticky */}
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(7, 1fr)', 
                          gap: '1px',
                          marginBottom: '8px',
                          position: 'sticky',
                          top: '80px',
                          backgroundColor: '#fff',
                          zIndex: 50
                        }}>
                          {['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'].map(day => (
                            <div key={day} style={{
                              padding: '8px',
                              textAlign: 'center',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#6b7280'
                            }}>
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Calendar Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px' }}>
                          {/* Example calendar days - you'd generate these dynamically */}
                          {Array.from({ length: 35 }, (_, i) => {
                            const day = i - 6; // Adjust for month start
                            const isCurrentMonth = day > 0 && day <= 30;
                            const isPast = day < new Date().getDate();
                            
                            return (
                              <div key={i} style={{
                                minHeight: '40px',
                                padding: '4px',
                                textAlign: 'center',
                                fontSize: '14px',
                                color: isCurrentMonth ? (isPast ? '#9ca3af' : '#374151') : '#d1d5db',
                                backgroundColor: isCurrentMonth && !isPast ? '#fff' : '#f9fafb',
                                cursor: isCurrentMonth && !isPast ? 'pointer' : 'default',
                                border: '1px solid #f3f4f6',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {isCurrentMonth && (
                                  <>
                                    <span>{day}</span>
                                    {/* Example: show practice dots or RSVP symbols */}
                                    {day === 7 && <span style={{ color: '#10b981' }}>✓</span>}
                                    {day === 14 && <span style={{ color: '#f59e0b' }}>?</span>}
                                    {day === 21 && <div style={{ width: '4px', height: '4px', backgroundColor: '#0284c7', borderRadius: '50%' }}></div>}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {clubTab === 'gallery' && (
                    <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                        Club gallery goes here.
                      </p>
                    </div>
                  )}

                  {clubTab === 'forum' && (
                    <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                        Club Forum
                      </h3>
                      
                      {/* Pinned Post */}
                      <div style={{ 
                        backgroundColor: '#fef3c7', 
                        border: '1px solid #fbbf24',
                        borderRadius: '8px', 
                        padding: '12px', 
                        marginBottom: '16px' 
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ 
                            backgroundColor: '#f59e0b', 
                            color: 'white', 
                            fontSize: '10px', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            fontWeight: '500',
                            marginRight: '8px'
                          }}>
                            PINNED
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#92400e' }}>
                            Welcome to {selectedClub.name}!
                          </span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#92400e', lineHeight: '1.4' }}>
                          New to our club? Read our getting started guide and don't hesitate to ask questions.
                        </p>
                      </div>

                      {/* Forum Posts */}
                      <div>
                        <div style={{ 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px', 
                          padding: '12px',
                          marginBottom: '12px'
                        }}>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                            Practice cancelled this Thursday
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                            Posted by Sarah M. • 2 hours ago
                          </div>
                          <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.4' }}>
                            Due to pool maintenance, Thursday's practice is cancelled. See you Monday!
                          </p>
                        </div>

                        <div style={{ 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px', 
                          padding: '12px' 
                        }}>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                            Equipment for sale
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                            Posted by Mike T. • 1 day ago
                          </div>
                          <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.4' }}>
                            I have some extra fins and masks available. Message me if interested!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {clubTab === 'schedule' && (
                    <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
                        Practice Schedule
                      </h3>
                      
                      {/* Calendar placeholder */}
                      <div style={{ 
                        backgroundColor: '#f9fafb', 
                        border: '1px dashed #d1d5db', 
                        borderRadius: '8px', 
                        padding: '24px', 
                        textAlign: 'center',
                        marginBottom: '16px'
                      }}>
                        <Calendar size={32} style={{ color: '#9ca3af', margin: '0 auto 8px' }} />
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          Monthly calendar view coming soon
                        </div>
                      </div>

                      {/* Weekly Schedule */}
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                          Weekly Schedule
                        </h4>
                        {selectedClub.schedule.map((sched, idx) => (
                          <div key={idx} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '12px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            marginBottom: '8px'
                          }}>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                                {sched.dow}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                {sched.time} • {sched.pool}
                              </div>
                              {sched.info?.text && (
                                <div style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic', marginTop: '2px' }}>
                                  {sched.info.text}
                                </div>
                              )}
                            </div>
                            <span style={{
                              backgroundColor: '#10b981',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '500'
                            }}>
                              Open
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Clubs List
              <div>
                {sampleClubs.map(club => (
                  <ClubTile
                    key={club.id}
                    club={club}
                    onRSVP={handleRSVP}
                    currentRSVP={rsvpChoices[club.id]}
                    onSelectClub={(club) => {
                      setSelectedClub(club);
                      setClubTab('rsvp');
                    }}
                  />
                ))}
              </div>
            )
          ) : activeTab === 'About' ? (
            <div style={{ padding: '16px', lineHeight: '1.6', color: '#374151' }}>
              <p style={{ marginBottom: '16px' }}>
                The UWH Portal connects underwater hockey players, clubs, and enthusiasts worldwide. 
                Our platform helps you discover local clubs, participate in events, and grow the sport.
              </p>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', marginTop: '24px' }}>Features</h3>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                <li style={{ marginBottom: '8px' }}>Find and join local clubs</li>
                <li style={{ marginBottom: '8px' }}>RSVP to practices and events</li>
                <li style={{ marginBottom: '8px' }}>Connect with other players</li>
                <li style={{ marginBottom: '8px' }}>Learn about the sport</li>
              </ul>
              <p style={{ marginTop: '24px', fontSize: '14px', color: '#6b7280' }}>
                Built by underwater hockey players, for underwater hockey players.
              </p>
            </div>
          ) : activeTab === 'Notifications' ? (
            <div style={{ padding: '16px' }}>
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Bell style={{ width: '48px', height: '48px', color: '#9ca3af', margin: '0 auto 16px' }} />
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                  Notifications
                </h2>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                  You'll receive notifications about practice updates, club announcements, and more.
                </p>
                <div style={{
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px dashed #d1d5db'
                }}>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                    No notifications yet. This feature is coming soon!
                  </p>
                </div>
              </div>
            </div>
          ) : activeTab === 'FAQ' ? (
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                  What is underwater hockey?
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                  Underwater hockey (UWH) is a sport played underwater in a swimming pool. 
                  Players use short sticks to maneuver a puck along the bottom of the pool into goals.
                </p>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                  How do I join a club?
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                  Visit the Clubs section to find local teams. Most clubs welcome beginners 
                  and provide equipment for new players to try the sport.
                </p>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                  What equipment do I need?
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                  Basic equipment includes a mask, snorkel, fins, glove, and stick. 
                  Most clubs can lend equipment to newcomers.
                </p>
              </div>
            </div>
          ) : activeTab === 'Learn' ? (
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                  Getting Started
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', marginBottom: '16px' }}>
                  Underwater hockey is an exciting team sport that combines swimming, strategy, and skill.
                </p>
                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                    Basic Rules
                  </h4>
                  <ul style={{ fontSize: '14px', color: '#6b7280', paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '4px' }}>6 players per team in the water</li>
                    <li style={{ marginBottom: '4px' }}>Play underwater with breath-holding</li>
                    <li style={{ marginBottom: '4px' }}>Use stick to move puck into goal</li>
                    <li style={{ marginBottom: '4px' }}>No body contact allowed</li>
                  </ul>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                  Skills You'll Develop
                </h4>
                <ul style={{ fontSize: '14px', color: '#6b7280', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '4px' }}>Swimming endurance and breath control</li>
                  <li style={{ marginBottom: '4px' }}>Underwater maneuvering</li>
                  <li style={{ marginBottom: '4px' }}>Team strategy and communication</li>
                  <li style={{ marginBottom: '4px' }}>Hand-eye coordination</li>
                </ul>
              </div>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '400px',
              color: '#6b7280',
              fontSize: '16px'
            }}>
              {activeTab} content coming soon...
            </div>
          )}
        </div>
        
        <BottomTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onProfileClick={() => setRoleOpen(true)} 
        />
        
        {toast && (
          <Toast
            message={toast.message}
            color={toast.color}
            onClose={() => setToast(null)}
          />
        )}
        
        <RoleModal
          isOpen={roleOpen}
          currentRole={currentRole}
          onRoleSelect={handleRoleSelect}
          onClose={handleRoleModalClose}
        />
      </PhoneFrame>
    </div>
  );
}

export default App;
