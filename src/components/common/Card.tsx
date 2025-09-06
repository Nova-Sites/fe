import React from 'react';
import MuiCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevation?:
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24;
}

const paddingMap = {
  none: 0,
  sm: 1.5,
  md: 3,
  lg: 4,
} as const;

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  elevation = 1,
}) => {
  return (
    <MuiCard elevation={elevation} className={className}>
      <CardContent sx={{ p: paddingMap[padding] }}>{children}</CardContent>
    </MuiCard>
  );
};

export default Card;
