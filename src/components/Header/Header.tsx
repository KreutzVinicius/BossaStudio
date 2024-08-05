import { useNavigate } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';
import logo from '@assets/svg/bossa.svg';
import './styles.css';

export interface HeaderProps {
  step: string;
  setStep: (step: string) => void;
}
// { content, subcontent }: HeaderProps
const Header = ({ step, setStep }: HeaderProps) => {
  const navigate = useNavigate();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setStep(newValue);
  };

  return (
    <div className="page-header">
      {/* <a href={'/'}>
        <img src={} alt="Voltar" />
      </a> */}
      <div className="header-logo-container">
        <img src={logo} alt="" onClick={() => navigate(`/`)} className="logo" />
      </div>
      <Tabs value={step} className="header-text-container" onChange={handleChange}>
        <Tab value="one" label="Projetos autorais" className="header-text" />
        <Tab value="two" label="Archviz" className="header-text" />
        <Tab value="three" label="Sobre" className="header-text" />
        <Tab value="four" label=" Contato" className="header-text" />
      </Tabs>
    </div>
  );
};
export default Header;
