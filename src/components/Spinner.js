import styled, {keyframes} from 'styled-components';

const spin = keyframes`
  0%,
  100% {
    box-shadow: 0 -3em 0 .2em, 2em -2em 0 0, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 .2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -.5em, 2em -2em 0 0, 3em 0 0 .2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 0, 2em 2em 0 .2em, 0 3em 0 0, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0, 0 3em 0 .2em, -2em 2em 0 0, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 .2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0 0 .2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0 0 0, -2em -2em 0 .2em;
  }
`;

const Spinner = styled.div`
  position: relative;
  &::before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1em;
  height: 1em;
  transform: translate3d(-50%, -50%, 0);
  border-radius: 50%;
  color: white;
  content: '';
  will-change: box-shadow;
  animation: ${spin} 1.3s infinite linear;
`

export default Spinner;
