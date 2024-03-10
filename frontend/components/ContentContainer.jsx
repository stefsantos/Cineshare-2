import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: flex-start; 
  width: 65%; 
  margin-left: auto;
  margin-right: auto;
  padding: 145px; 
`;

const ContentContainer = ({ children }) => {
  return <Container>{children}</Container>;
};

export default ContentContainer;