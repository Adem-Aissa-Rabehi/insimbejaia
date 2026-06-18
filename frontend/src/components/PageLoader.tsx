import React, { useEffect, useState } from 'react';

const PageLoader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Minimum loading time of 2.2 seconds for a premium entry experience
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for fadeout animation to complete
      const removeTimer = setTimeout(() => {
        setVisible(false);
      }, 600);
      return () => clearTimeout(removeTimer);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0c2340', // Deep Premium Navy matching INSIM
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'auto',
        transform: fadeOut ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <style>{`
        @keyframes drawPath {
          0% {
            stroke-dashoffset: 1000;
            fill-opacity: 0;
          }
          50% {
            stroke-dashoffset: 0;
            fill-opacity: 0.2;
          }
          100% {
            stroke-dashoffset: 0;
            fill-opacity: 1;
          }
        }
        
        @keyframes logoPulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 15px rgba(58, 165, 221, 0.3));
          }
          50% {
            transform: scale(1.03);
            filter: drop-shadow(0 0 35px rgba(231, 79, 34, 0.6));
          }
        }

        @keyframes barProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes textFade {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawPath 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          stroke: rgba(255, 255, 255, 0.3);
          stroke-width: 1.5px;
        }

        .logo-container {
          animation: logoPulse 3s ease-in-out infinite;
          width: 220px;
          height: auto;
          margin-bottom: 2rem;
        }

        .loading-text {
          font-family: 'Inter', system-ui, sans-serif;
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 1rem;
          animation: textFade 0.8s ease-out forwards;
          opacity: 0;
        }

        .loading-subtext {
          font-family: 'Inter', system-ui, sans-serif;
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          margin-top: 0.5rem;
          animation: textFade 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }

        .progress-track {
          width: 180px;
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 99px;
          margin-top: 1.5rem;
          overflow: hidden;
          position: relative;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #3aa5dd 0%, #e74f22 100%);
          border-radius: 99px;
          animation: barProgress 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      {/* Inline animated SVG using paths from user logo */}
      <div className="logo-container">
        <svg
          id="Calque_2"
          data-name="Calque 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 223.14 173.01"
          style={{ width: '100%', height: '100%' }}
        >
          <g id="Calque_1-2" data-name="Calque 1">
            <g id="LOGO">
              {/* cls-1 paths (Light blue) */}
              <path
                className="animate-path"
                style={{ fill: '#3aa5dd', animationDelay: '0.1s' }}
                d="M56,50.37s27.04,12.86,77.04-1.1c0,0-44.05,21.22-80.79,12.91l3.75-11.81Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#3aa5dd', animationDelay: '0.2s' }}
                d="M120.48,7.22c-5.05-2.17-10.26-3.86-15.65-5-.23-.05-.55-.12-.78-.17-.1-.03-.27-.06-.38-.08-2.11-.48-4.1-.75-6.14-1.09-.2-.03-.4-.07-.6-.1-.15-.02-.31-.05-.46-.07-2.04-.31-4.22-.42-6.29-.59.03.02.05.04.08.06-1.82-.11-3.65-.17-5.49-.18-.09,0-.19,0-.28,0C28.35,2.37,8.34,49.39,8.34,49.39c16.81,8.75,31.4,11.39,31.4,11.39l8.13,1.39C57.28,25.84,81.94,7.11,81.94,7.11c-20.16,6.13-39.47,40.95-39.47,40.95l-14.65-3.39C50.87,5.86,82.11,4.53,96.54,4.21c-.01,0-.02-.02-.03-.02,7.65.28,13.51,1.45,19.47,3.25,16.73,5.54,34.16,17.1,45.77,38.92l.98-.17c-8.93-17.04-23.59-30.94-42.25-38.97Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#3aa5dd', animationDelay: '0.3s' }}
                d="M83.11,102.12c-9.61-7.61-19.21-15.22-28.82-22.83v25.98h4.06v-17.8c7.49,5.93,14.98,11.87,22.47,17.8.77-1.05,1.53-2.1,2.3-3.15Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#3aa5dd', animationDelay: '0.4s' }}
                d="M179.66,69.66c-.69,1.21-1.39,2.42-2.08,3.64,7.4,3.65,14.8,7.31,22.2,10.96,7.21-3.68,14.42-7.37,21.63-11.05l-1.42-3.47c-6.75,3.34-13.51,6.68-20.26,10.02-6.69-3.37-13.38-6.73-20.07-10.1Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#3aa5dd', animationDelay: '0.5s' }}
                d="M164.22,53.88c1.74-.03,3.24,1.4,3.31,3.22-.06,1.77-1.47,3.19-3.18,3.23-1.73.04-3.27-1.35-3.31-3.15-.04-1.8,1.45-3.26,3.18-3.3Z"
              />

              {/* cls-4 paths (Orange) */}
              <path
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '0.25s' }}
                d="M126.11,163.09s-.03,0-.04.01c-1.75.89-3.53,1.72-5.34,2.49,3.44-1.43,5.38-2.5,5.38-2.5"
              />
              <path
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '0.35s' }}
                d="M41.39,111.04h3.41c1.87,0,2.88,1.02,2.88,2.48,0,1.2-.7,1.97-1.51,2.2.7.2,1.86.91,1.86,2.49,0,2.02-1.46,2.91-3.17,2.91h-3.46v-10.08ZM44.54,115.37c1.69,0,2.34-.65,2.34-1.82,0-.99-.67-1.8-2.04-1.8h-2.71v3.62h2.42ZM42.13,120.39h2.75c1.28,0,2.36-.66,2.36-2.15,0-1.28-.8-2.16-2.77-2.16h-2.35v4.31Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '0.4s' }}
                d="M61.37,119.01c0,.71.01,1.83.01,2.1h-.67c-.03-.19-.04-.66-.04-1.25-.29.85-1.01,1.43-2.25,1.43-1.01,0-2.29-.4-2.29-2.61v-4.77h.69v4.59c0,1.05.32,2.07,1.7,2.07,1.56,0,2.15-.91,2.15-2.97v-3.7h.7v5.1Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '0.45s' }}
                d="M69.88,119.12c.24.94.88,1.5,1.99,1.5,1.25,0,1.74-.59,1.74-1.4s-.33-1.22-1.9-1.61c-1.8-.45-2.25-1.01-2.25-1.96s.73-1.92,2.31-1.92,2.33.99,2.44,2.02h-.7c-.12-.6-.59-1.35-1.77-1.35s-1.57.62-1.57,1.2c0,.66.34.99,1.72,1.34,1.97.49,2.46,1.15,2.46,2.23,0,1.31-1.04,2.12-2.5,2.12-1.59,0-2.49-.86-2.68-2.16h.71Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '0.5s' }}
                d="M82.39,110.5h.7v1.4h-.7v-1.4ZM82.39,113.91h.7v7.2h-.7v-7.2Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '0.55s' }}
                d="M91.68,115.73c0-.63,0-1.24-.01-1.81h.69c.03.23.04,1.17.03,1.37.31-.73.88-1.54,2.32-1.54,1.24,0,2.35.72,2.35,2.71v4.67h-.7v-4.55c0-1.28-.51-2.12-1.73-2.12-1.66,0-2.24,1.43-2.24,2.99v3.67h-.7v-5.39Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '0.6s' }}
                d="M105.79,117.6c.01,1.86.92,3.01,2.26,3.01s1.76-.76,2.01-1.35h.72c-.3.95-1.04,2.03-2.76,2.03-2.12,0-2.95-1.89-2.95-3.72,0-2.06.99-3.83,3.03-3.83,2.15,0,2.84,1.92,2.84,3.27,0,.2,0,.4-.01.59h-5.14ZM110.22,116.97c-.01-1.43-.77-2.55-2.14-2.55-1.44,0-2.09,1.04-2.25,2.55h4.39Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '0.65s' }}
                d="M119.12,119.12c.23.94.88,1.5,1.99,1.5,1.24,0,1.74-.59,1.74-1.4s-.33-1.22-1.9-1.61c-1.8-.45-2.25-1.01-2.25-1.96s.73-1.92,2.31-1.92,2.33.99,2.45,2.02h-.7c-.12-.6-.59-1.35-1.77-1.35s-1.57.62-1.57,1.2c0,.66.34.99,1.72,1.34,1.97.49,2.46,1.15,2.46,2.23,0,1.31-1.04,2.12-2.5,2.12-1.59,0-2.49-.86-2.68-2.16h.71Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '0.7s' }}
                d="M131.79,119.12c.24.94.88,1.5,1.99,1.5,1.24,0,1.74-.59,1.74-1.4s-.33-1.22-1.9-1.61c-1.8-.45-2.25-1.01-2.25-1.96s.72-1.92,2.31-1.92,2.33.99,2.44,2.02h-.7c-.13-.6-.59-1.35-1.77-1.35s-1.57.62-1.57,1.2c0,.66.34.99,1.72,1.34,1.97.49,2.46,1.15,2.46,2.23,0,1.31-1.04,2.12-2.5,2.12-1.59,0-2.49-.86-2.68-2.16h.71Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '0.75s' }}
                d="M154.23,119.12c.24.94.88,1.5,1.99,1.5,1.24,0,1.74-.59,1.74-1.4s-.33-1.22-1.9-1.61c-1.8-.45-2.25-1.01-2.25-1.96s.73-1.92,2.31-1.92,2.33.99,2.44,2.02h-.7c-.12-.6-.59-1.35-1.77-1.35s-1.57.62-1.57,1.2c0,.66.34.99,1.72,1.34,1.97.49,2.46,1.15,2.46,2.23,0,1.31-1.04,2.12-2.5,2.12-1.59,0-2.49-.86-2.68-2.16h.71Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '0.8s' }}
                d="M171.88,118.99c-.34,1.27-1.15,2.29-2.71,2.29-1.75,0-2.99-1.34-2.99-3.74,0-1.97,1.02-3.8,3.07-3.8,1.78,0,2.5,1.3,2.63,2.3h-.71c-.21-.84-.74-1.63-1.93-1.63-1.48,0-2.32,1.3-2.32,3.1s.78,3.1,2.25,3.1c1.02,0,1.64-.53,2-1.61h.71Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '0.85s' }}
                d="M180.5,110.5v4.62c.39-.75,1.08-1.38,2.31-1.38.99,0,2.36.52,2.36,2.79v4.58h-.7v-4.44c0-1.43-.63-2.23-1.79-2.23-1.38,0-2.18.88-2.18,2.65v4.02h-.7v-10.61h.7Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '0.9s' }}
                d="M199.42,117.5c0,2-1.08,3.79-3.16,3.79-1.89,0-3.06-1.6-3.06-3.77,0-2.06,1.11-3.77,3.13-3.77,1.86,0,3.09,1.5,3.09,3.76M193.94,117.51c0,1.71.89,3.1,2.37,3.1s2.37-1.28,2.37-3.1c0-1.7-.84-3.1-2.39-3.1s-2.35,1.37-2.35,3.1"
              />
              <path
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '0.95s' }}
                d="M213.2,117.5c0,2-1.08,3.79-3.16,3.79-1.89,0-3.06-1.6-3.06-3.77,0-2.06,1.11-3.77,3.13-3.77,1.86,0,3.09,1.5,3.09,3.76M207.72,117.51c0,1.71.89,3.1,2.38,3.1s2.37-1.28,2.37-3.1c0-1.7-.84-3.1-2.39-3.1s-2.35,1.37-2.35,3.1"
              />
              <rect
                className="animate-path"
                style={{ fill: '#e74f22', animationDelay: '1.0s' }}
                x="221.24"
                y="110.5"
                width=".7"
                height="10.61"
              />

              {/* cls-3 paths (Dark blue) */}
              <path
                className="animate-path"
                style={{ fill: '#124b7d', animationDelay: '0.3s' }}
                d="M0,90.07s13.9,7.66,17.89,7.74c0,0,.81,11.56,7.64,25.92,0,0,32.8,12.39,79.47,6.62,0,0-60.75,16.88-97.13-7.53C7.88,122.83,0,107.96,0,90.07"
              />
              <path
                className="animate-path"
                style={{ fill: '#124b7d', animationDelay: '0.4s' }}
                d="M155.9,136.04s-27.67,36.19-68.57,32.33c-34.34-3.72-52.75-29.89-52.75-29.89-14.77-1.7-23.82-9-23.82-9l3.57,4.84c19.83,28.71,45.95,37.69,67.48,38.5h0s45.42,4.84,75.4-36.79h-1.31Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#124b7d', animationDelay: '0.5s' }}
                d="M17.16,84.88c0-12.87,3.72-23.79,3.72-23.79-6.71-1.57-14.92-6.22-14.92-6.22C-.07,70.21,0,83.12,0,83.12c12.6,8.23,26.95,11.78,35.57,13.27-.2-2.33-.34-4.69-.38-7.08-8.53-1.54-18.03-4.43-18.03-4.43"
              />
              <path
                className="animate-path"
                style={{ fill: '#124b7d', animationDelay: '0.55s' }}
                d="M41.53,69.23c1.72,0,3.45,0,5.17,0,0,12.01,0,24.02,0,36.03-1.72,0-3.44,0-5.17,0v-36.04Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#124b7d', animationDelay: '0.6s' }}
                d="M54.29,69.23h8.58c9.96,8.13,19.93,16.26,29.89,24.39v-24.39h5.12v36.04c-14.53-12.01-29.06-24.03-43.59-36.04Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#124b7d', animationDelay: '0.65s' }}
                d="M147.69,79.87h5.12v-4.63c-.1-.67-.45-2.5-1.99-4.1-1.18-1.23-2.49-1.71-3.14-1.91h-38.48c-.73.26-2.17.89-3.43,2.33-.94,1.08-1.41,2.18-1.64,2.88v5.43c0,1.13.37,1.99.96,2.93,1.22,1.93,3.29,2.57,4.11,2.77,11.96,2.71,23.93,5.43,35.89,8.14.44.12,1.15.37,1.83.95.34.29.59.59.77.84,0,1.07,0,2.13-.01,3.2-.07.19-.23.57-.6.9-.31.28-.63.4-.81.46-11.88,0-23.75,0-35.63,0-.09,0-.65,0-1.07-.48-.38-.43-.37-.95-.36-1.05,0-1.48,0-2.96-.01-4.44h-5.12v5.96c.13.61.51,1.99,1.69,3.26,1.32,1.4,2.84,1.82,3.43,1.95h38.46c.49-.06,2.08-.31,3.45-1.68,1.38-1.39,1.65-3.02,1.71-3.51,0-1.14,0-2.28-.01-3.42v-1.56c-.07-.67-.25-1.58-.75-2.53-.47-.91-2.48-2.8-4.38-3.58-2.92-1.21-17.46-4.74-37.51-8.74-.09-.02-.44-.09-.7-.42-.3-.37-.27-.78-.26-.87,0-.8,0-1.6,0-2.4.06-.27.24-.85.73-1.38.4-.43.84-.64,1.09-.74,18.83-.05,32.57-.04,33.95,0,.36,0,1.08.05,1.76.52.54.37.83.83.96,1.09v3.83Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#124b7d', animationDelay: '0.7s' }}
                d="M161.64,69.23h5.12v36.04h-5.13c0-12.01,0-24.03,0-36.04Z"
              />
              <path
                className="animate-path"
                style={{ fill: '#124b7d', animationDelay: '0.75s' }}
                d="M223.14,79.82c0,8.48,0,16.97-.01,25.45-1.71,0-3.41,0-5.12,0,0-5.55,0-11.11,0-16.66-6.13,3.09-12.25,6.18-18.38,9.26-6.08-3.09-12.15-6.18-18.23-9.26,0,5.55,0,11.11-.01,16.66h-5.08v-25.46c7.77,3.95,15.55,7.91,23.32,11.86,7.84-3.95,15.68-7.9,23.51-11.85Z"
              />

              {/* cls-2 path (White) */}
              <path
                className="animate-path"
                style={{ fill: '#ffffff', animationDelay: '0.8s' }}
                d="M44.05,53.01c1.74-.03,3.24,1.4,3.31,3.22-.06,1.77-1.47,3.19-3.18,3.23-1.73.04-3.27-1.35-3.31-3.15-.04-1.8,1.45-3.26,3.18-3.3Z"
              />
            </g>
          </g>
        </svg>
      </div>

      <div className="loading-text">INSIM Bejaia</div>
      <div className="loading-subtext">Chargement de votre portail...</div>
      
      <div className="progress-track">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
};

export default PageLoader;
