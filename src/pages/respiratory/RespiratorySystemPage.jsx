//gabby pierce
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { isAuthenticated } from '../../services/authService';
import RespiratorySystemComponent from '../../components/assessments/respiratory/RespiratorySystemComponent';

const RespiratorySystemPage = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function checkAuth() {
      await isAuthenticated(navigate);
    }
    checkAuth();
  }, [navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1 }}>
      <Typography
        variant="h2"
        fontFamily="Roboto"
        color="white"
        marginBottom={5}
        marginTop={5}
        alignSelf="center"
      >
        Respiratory Assessment
      </Typography>
      <RespiratorySystemComponent sectionId={sectionId} token={token} />
    </Box>
  );
};

export default RespiratorySystemPage;