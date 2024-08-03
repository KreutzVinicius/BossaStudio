import { useNavigate } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import logo from '@assets/svg/bossa.svg';
import './styles.css';

export interface HeaderProps {
  content: string;
  subcontent?: string;
}
// { content, subcontent }: HeaderProps
const Header = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const navigate = useNavigate();

  return (
    <div className="page-header">
      {/* <a href={'/'}>
        <img src={} alt="Voltar" />
      </a> */}
      <div className="header-logo-container">
        <img src={logo} alt="" onClick={() => navigate(`/`)} className="logo" />
      </div>
      <Tabs value={value} onChange={handleChange} className="header-text-container">
        <Tab value="one" label="Projetos autorais" className="header-text" />
        <Tab value="two" label="Archviz" className="header-text" />
        <Tab value="three" label="Sobre" className="header-text" />
        <Tab value="four" label=" Contato" className="header-text" />
      </Tabs>
    </div>
  );
};
export default Header;
