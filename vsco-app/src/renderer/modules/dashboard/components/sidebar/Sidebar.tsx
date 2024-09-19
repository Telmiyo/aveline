import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CiHome,
  CiSettings,
  CiUser,
  CiPen,
  CiMaximize1,
  CiMaximize2,
} from 'react-icons/ci';

import VSCO_ICON from '../../../../../../assets/icon.svg';

function Sidebar() {
  // Initialize state with value from localStorage or default to true
  const [isFullscreen, setFullscreen] = useState<boolean>(() => {
    const savedState = localStorage.getItem('fullscreen');
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  const navigate = useNavigate();
  const fadeIn =
    'animate-fade-right animate-once animate-duration-[600ms] animate-ease-in-out';
  // Save the state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fullscreen', JSON.stringify(isFullscreen));
  }, [isFullscreen]);

  const toggleSidebar = () => {
    setFullscreen((prevState) => !prevState);
  };

  return (
    <>
      <aside
        className={`${fadeIn} ${isFullscreen ? 'w-0 hidden' : 'w-20'} flex flex-col border-r-2 border-gray-500  ${isFullscreen ? '-translate-x-full' : 'translate-x-0'} `}
      >
        {/* Navigation Icons */}
        <ul className="flex flex-col items-center justify-center flex-grow space-y-8">
          <li>
            <button
              type="button"
              aria-label="books"
              className="flex items-center justify-center"
              onClick={() => navigate('/dashboard/home')}
            >
              <CiHome size={24} />
            </button>
          </li>
          <li>
            <button
              type="button"
              aria-label="notes"
              className="flex items-center justify-center"
              onClick={() => navigate('/dashboard/notes')}
            >
              <CiPen size={24} />
            </button>
          </li>
          <li>
            <button
              type="button"
              aria-label="profile"
              className="flex items-center justify-center"
              onClick={() => navigate('/dashboard/profile')}
            >
              <CiUser size={24} />
            </button>
          </li>
          <li>
            <button
              type="button"
              aria-label="settings"
              className="flex items-center justify-center"
              onClick={() => navigate('/dashboard/settings')}
            >
              <CiSettings size={24} />
            </button>
          </li>
        </ul>
      </aside>
      {/* VSCO Icon */}
      <img
        src={VSCO_ICON}
        alt="vsco-icon"
        className={`${fadeIn} w-14 fixed left-4 top-4 ${isFullscreen ? 'hidden' : ''}  animate-fade-right animate-once animate-duration-[600ms] animate-ease-in-out`}
      />
      {/* Fullscreen Button */}
      <div
        className="fixed bottom-4 left-4 z-50 flex items-center justify-center"
        style={{ transition: 'transform 0.3s ease-in-out' }}
      >
        <button
          type="button"
          aria-label="toggle-sidebar"
          className={`${fadeIn} flex items-center justify-center p-2 shadow-none`}
          onClick={toggleSidebar}
        >
          {isFullscreen ? <CiMaximize2 size={24} /> : <CiMaximize1 size={24} />}
        </button>
      </div>
    </>
  );
}

export default Sidebar;
