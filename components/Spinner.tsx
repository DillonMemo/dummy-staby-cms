import styled from 'styled-components'

const SpinnerContainer = styled.div<{
  white?: boolean
  gray?: boolean
  width?: string
  height?: string
}>`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: #78787873;

  margin: 0 auto;
  svg {
    width: ${({ width }) => (width ? width : '24px')};
    height: ${({ height }) => (height ? height : '30px')};
    fill: #cc0000;
  }

  .spinner {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

const Spinner: React.FC = () => {
  return (
    <SpinnerContainer>
      <div className="spinner">
        <svg x="0px" y="0px" viewBox="0 0 24 30">
          <rect x="0" y="13" width="4" height="5" fill={'#cc0000'}>
            <animate
              attributeName="height"
              attributeType="XML"
              values="5;21;5"
              begin="0s"
              dur="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              attributeType="XML"
              values="13; 5; 13"
              begin="0s"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="10" y="13" width="4" height="5" fill={'#cc0000'}>
            <animate
              attributeName="height"
              attributeType="XML"
              values="5;21;5"
              begin="0.15s"
              dur="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              attributeType="XML"
              values="13; 5; 13"
              begin="0.15s"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </rect>
          <rect x="20" y="13" width="4" height="5" fill={'#cc0000'}>
            <animate
              attributeName="height"
              attributeType="XML"
              values="5;21;5"
              begin="0.3s"
              dur="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              attributeType="XML"
              values="13; 5; 13"
              begin="0.3s"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>
    </SpinnerContainer>
  )
}

export default Spinner
