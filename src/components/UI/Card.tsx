import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(MuiCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

export interface CardProps extends MuiCardProps {
  children: React.ReactNode;
}

export const Card = ({ children, ...props }: CardProps): React.ReactElement => {
  return <StyledCard {...props}>{children}</StyledCard>;
};
