import { Box, CircularProgress, CircularProgressProps } from '@mui/material';

export interface LoadingSpinnerProps extends CircularProgressProps {
  fullPage?: boolean;
}

export const LoadingSpinner = ({ fullPage, ...props }: LoadingSpinnerProps): React.ReactElement => {
  if (fullPage) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress {...props} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <CircularProgress {...props} />
    </Box>
  );
};
