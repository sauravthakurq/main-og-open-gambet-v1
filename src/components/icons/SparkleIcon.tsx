import React from 'react';

export const SparkleIcon = ({ 
  size = 24, 
  color = "currentColor", 
  className = "" 
}) => {
  return (
    <>
      <style>
        {`
          .sparkle-animate-twice {
            /* 
              Duration is 5s. 
              Iteration count is 2 (Total 10 seconds).
              'forwards' ensures it stays static after the 2nd iteration.
            */
            animation: burst-twice 5s ease-in-out 2 forwards;
            transform-origin: center;
          }

          @keyframes burst-twice {
            /* 0s to 4s (0% to 80%): Stay completely still */
            0%, 80% { 
              transform: scale(1) rotate(0deg); 
              filter: drop-shadow(0 0 2px currentColor); 
            }
            
            /* 4s to 5s (80% to 100%): Perform the rich glow and spin burst */
            85% {
              transform: scale(1.5) rotate(45deg);
              filter: drop-shadow(0 0 15px currentColor) drop-shadow(0 0 30px currentColor);
            }
            92% {
              transform: scale(0.8) rotate(-15deg);
              filter: drop-shadow(0 0 5px currentColor);
            }
            100% {
              transform: scale(1) rotate(0deg);
              filter: drop-shadow(0 0 2px currentColor); 
            }
          }
        `}
      </style>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        style={{ color: color }}
        className={`sparkle-animate-twice ${className}`}
      >
        {/* Exact 4-point concave star path */}
        <path d="M 12 2 Q 12 12 22 12 Q 12 12 12 22 Q 12 12 2 12 Q 12 12 12 2 Z" />
      </svg>
    </>
  );
};
