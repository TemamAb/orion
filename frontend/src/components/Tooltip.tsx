
import React, { useState, useRef, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const childRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  useLayoutEffect(() => {
    if (visible && childRef.current && tooltipRef.current) {
      const childRect = childRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = childRect.top - tooltipRect.height - 8; // 8px margin above
      let left = childRect.left + (childRect.width / 2) - (tooltipRect.width / 2);

      // Flip to bottom if not enough space on top
      if (top < 8) {
        top = childRect.bottom + 8;
      }

      // Adjust left if it overflows the viewport
      if (left < 8) {
        left = 8;
      } else if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
      }

      setPosition({ top, left });
    }
  }, [visible]);

  const tooltipContent = (
    <div
      ref={tooltipRef}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        visibility: visible && position.top > 0 ? 'visible' : 'hidden', // Hide until position is calculated
        transition: 'opacity 0.2s',
        opacity: visible && position.top > 0 ? 1 : 0,
      }}
      className="fixed p-2 text-xs text-white bg-gray-900 border border-cyan-500/30 rounded-md shadow-lg z-50 max-w-xs pointer-events-none"
    >
      {text}
    </div>
  );

  return (
    <>
      <div
        ref={childRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {ReactDOM.createPortal(tooltipContent, document.body)}
    </>
  );
};

export default Tooltip;
