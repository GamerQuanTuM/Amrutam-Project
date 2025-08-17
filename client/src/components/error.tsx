import React from 'react';

interface ErrorProps {
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  showIcon?: boolean;
}

const Error: React.FC<ErrorProps> = ({ 
  title = 'Something went wrong',
  message,
  actionText = 'Try again',
  onAction,
  className = '',
  showIcon = true
}) => {
  return (
    <div className={`flex-col-center p-6 rounded-lg border border-destructive/20 bg-destructive/5 ${className}`}>
      {showIcon && (
        <div className="mb-4 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-destructive mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
        {message}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="button-class px-4 py-2 text-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default Error;
