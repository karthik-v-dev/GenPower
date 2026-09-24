import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text';
  isLoading?: boolean;
}

export const Button = ({ isLoading, children, disabled, ...props }: ButtonProps): React.ReactElement => {
  return (
    <MuiButton {...props} disabled={disabled || isLoading}>
      {isLoading ? <CircularProgress size={24} color="inherit" /> : children}
    </MuiButton>
  );
};
