import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  text-align: center;
  height: 100vh; 
  width: 100vw;
  margin: 0; 
  padding: 0;
  
`;

const PlaceholderContainer = ({ children }) => {
  return <Container>{children}</Container>;
};

export default PlaceholderContainer;
