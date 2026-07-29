'use client';

import { useState } from 'react';

export default function ProductGallery({ images = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [imgErrors, setImgErrors] = useState({});

  const handleImgError = (idx) => {
    setImgErrors(prev => ({ ...prev, [idx]: true }));
  };

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center text-gray-300">
        <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      </div>
    );
  }

  return (
    <div>
      <div
        className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4 cursor-zoom-in relative"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        {images[selectedIndex] && !imgErrors[selectedIndex] ? (
          <img
            src={`/images/products/${images[selectedIndex]}`}
            alt="Product"
            className={`w-full h-full object-contain p-4 transition-transform ${zoomed ? 'scale-150' : ''}`}
            onError={() => handleImgError(selectedIndex)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`w-16 h-16 border-2 rounded overflow-hidden flex-shrink-0 ${idx === selectedIndex ? 'border-primary-500' : 'border-gray-200'}`}
            >
              {img && !imgErrors[idx] ? (
                <img src={`/images/products/${img}`} alt="" className="w-full h-full object-contain p-1" onError={() => handleImgError(idx)} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
