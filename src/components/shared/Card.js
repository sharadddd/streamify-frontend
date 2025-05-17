import React from 'react';
import './Card.css';

const Card = ({
    children,
    variant = 'default',
    hover = true,
    className = '',
    onClick,
}) => {
    const classes = [
        'card',
        `card-${variant}`,
        hover ? 'card-hover' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div
            className={classes}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {children}
        </div>
    );
};

export const CardMedia = ({ children, className = '' }) => (
    <div className={`card-media ${className}`}>
        {children}
    </div>
);

export const CardContent = ({ children, className = '' }) => (
    <div className={`card-content ${className}`}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = '' }) => (
    <h3 className={`card-title ${className}`}>
        {children}
    </h3>
);

export const CardText = ({ children, className = '' }) => (
    <p className={`card-text ${className}`}>
        {children}
    </p>
);

export const CardActions = ({ children, className = '' }) => (
    <div className={`card-actions ${className}`}>
        {children}
    </div>
);

Card.Media = CardMedia;
Card.Content = CardContent;
Card.Title = CardTitle;
Card.Text = CardText;
Card.Actions = CardActions;

export default Card; 