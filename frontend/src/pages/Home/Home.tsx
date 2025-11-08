import { useContext } from 'react'
import Header from '@components/Header/Header'
import { Context } from '@contexts/context'
import ShowProjects from '@pages/ShowProjects/ShowProjects'
import './styles.css'


const Home = () => {
    const {page} = useContext(Context)
    
    const handlePage = () => {
        switch (page) {
        case 0:
            return <ShowProjects />
        case 1:
            return <>sobre</>
        case 2:
            return <>contato</>
        default:
            break;
        }
    }
    
    return (
        <div className='home-wrapper'>
            <Header />
            {handlePage()}
        </div>
    )
}

export default Home
