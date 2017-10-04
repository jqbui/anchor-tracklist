import styled from 'styled-components';

const MediaInterface = styled.div`
  width: 100%;
  ${props => props.center ? `
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  ` : `
  position: absolute;
  bottom: 0;
  `}
`;

export default MediaInterface;
