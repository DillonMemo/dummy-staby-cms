import styled from 'styled-components';
import { ToggleStyle } from '../styles/styles';
/** components */
import DarkModeToggle from './DarkModeToggle';

type Props = ToggleStyle;

const Header: React.FC<Props> = ({ toggleStyle }) => {
  return (
    <HeaderWrapper>
      <h1 className="title">
        Welcome to <a href="https://nextjs.org">Next.js!</a>
      </h1>
      <p className="description">
        Get started by editing <code>pages/index.js</code>
      </p>
      {/* <div>
        {(Object.keys(themes) as TypeOfTheme[]).map((theme: TypeOfTheme) => (
          <button key={theme} onClick={toggleStyle(theme)}>
            {theme}
          </button>
        ))}
      </div> */}
      <div>
        <DarkModeToggle toggleStyle={toggleStyle} />
      </div>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.header`
  .title a {
    color: #0070f3;
    text-decoration: none;
  }

  .title a:hover,
  .title a:focus,
  .title a:active {
    text-decoration: underline;
  }

  .title {
    margin: 0;
    line-height: 1.15;
    font-size: 4rem;
  }

  .title,
  .description {
    text-align: center;
  }

  .description {
    line-height: 1.5;
    font-size: 1.5rem;
  }

  code {
    background: #fafafa;
    color: #000000;
    border-radius: 5px;
    padding: 0.75rem;
    font-size: 1.1rem;
    font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
      Bitstream Vera Sans Mono, Courier New, monospace;
  }
`;

export default Header;
