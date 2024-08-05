import Header from '@components/Header/Header';
import './styles.css';
import { Context } from 'context/context';
import { useContext } from 'react';
import ShowProjects from './components/ShowProjects/ShowProjects';
import { ProjectsType } from 'types/user';

const Home = () => {
  const { step, setStep } = useContext(Context);

  const handleSwitch = (step: string) => {
    switch (step) {
      case `one`:
        return <ShowProjects type={ProjectsType.Personal} />;
      case `two`:
        return <ShowProjects type={ProjectsType.Outsourced} />;
      case `three`:
        return <div>2</div>;
      case `four`:
        return <div>3</div>;
      default:
        return <ShowProjects type={ProjectsType.Personal} />;
    }
  };

  return (
    <div className="home-wrapper">
      <Header step={step} setStep={setStep} />
      {handleSwitch(step)}
    </div>
  );
};

export default Home;
