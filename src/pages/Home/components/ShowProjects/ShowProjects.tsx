import { ProjectsType } from 'types/user';
import './styles.css';

import photo1 from 'assets/fixtures/01.jpg';
import photo2 from 'assets/fixtures/02.jpg';
import photo3 from 'assets/fixtures/03.jpg';
import photo4 from 'assets/fixtures/04.jpg';
import photo5 from 'assets/fixtures/05.jpg';
import photo6 from 'assets/fixtures/06.jpg';
import photo7 from 'assets/fixtures/07.jpg';

interface ShowProjectsProps {
  type: ProjectsType;
}

const ShowProjects = ({ type }: ShowProjectsProps) => {
  const getProjects = async () => {
    if (type === ProjectsType.Outsourced) {
      // get outsourced projects
    } else {
      // get personal projects
    }
  };
  const itemData = [
    {
      img: photo1,
      title: `Image 1`,
    },
    {
      img: photo2,
      title: `Image 2`,
    },
    {
      img: photo3,
      title: `Image 3`,
    },
    {
      img: photo4,
      title: `Image 4`,
    },
    {
      img: photo5,
      title: `Image 5`,
    },
    {
      img: photo6,
      title: `Image 6`,
    },
    {
      img: photo7,
      title: `Image 7`,
    },
  ];

  return (
    <div className="show-projects-wrapper">
      {itemData.map((item) => (
        <img src={item.img} className="project-img"></img>
      ))}
    </div>
  );
};

export default ShowProjects;
