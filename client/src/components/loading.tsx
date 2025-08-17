import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-amber-200 border-t-amber-600`} 
          role="status"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
        <div 
          className={`absolute inset-0 ${sizeClasses[size]} animate-ping rounded-full border-2 border-amber-400 opacity-20`} 
          aria-hidden="true"
        />
      </div>
      {text && (
        <p className="mt-3 text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;
