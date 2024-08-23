import { useNavigate } from 'react-router-dom'
import { useContext} from 'react'
import { Context } from '../../contexts/context'
import './styles.css'
import logo from "../../assets/svg/bossa_logo.svg"

export interface HeaderProps {
    content: string
    subcontent?: string
}

const Header = ( ) => {

    const navigate = useNavigate()

    const {page, setPage} = useContext(Context)
    
    return (
        <div className="page-header">
            <div className="top-bar-container">
                <div className="top-right-header">
                    <img
                        src={logo}
                        alt=""
                        className='logo'
                        onClick={() => navigate('/')}
                    />
                </div>
                <div className="tabs-container">
                    <div
                        className={`tab ${page === 0 ? 'active' : ''}`}
                        onClick={() => setPage(0)}
                    >
                        Projetos autorais
                    </div>
                    <div
                        className={`tab ${page === 1 ? 'active' : ''}`}
                        onClick={() => setPage(1)}
                    >
                        Archviz
                    </div>
                    <div
                        className={`tab ${page === 2 ? 'active' : ''}`}
                        onClick={() => setPage(2)}
                    >
                        Sobre
                    </div>
                    <div
                        className={`tab ${page === 3 ? 'active' : ''}`}
                        onClick={() => setPage(3)}
                    >
                        Contato
                    </div>
                </div>
            </div>
        </div>
    )
    
}
export default Header
