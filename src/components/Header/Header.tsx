import { useNavigate } from 'react-router-dom'
import './styles.css'

export interface HeaderProps {
    content: string
    subcontent?: string
}
// { content, subcontent }: HeaderProps
const Header = () => {

    const navigate = useNavigate()

    return (
        <div className="page-header">
            <div className="top-bar-container">
                {/* <a href={'/'}>
                    <img src="images/icons/back.svg" alt="Voltar" />
                </a> */}
                <div className="top-right-header">
                    <img
                        src="images/logo.svg"
                        alt=""
                        onClick={() => navigate('/')}
                    />
                </div>
                Projetos autorais

                Archviz
                
                Sobre

                Contato
            </div>
        </div>
    )
}
export default Header
