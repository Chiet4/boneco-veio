import React from 'react'
import notFoundImg from '../../assets/image/not_foundpage.png';
import styles from './NotFound.module.css'
import { Link } from 'react-router-dom'

const NotFoundComponent = () => {
  return (
    <div className={styles.container}>
        <div>
            <img src={notFoundImg} alt="404 - not found" />
            <Link to="/"><button>Voltar</button></Link>
        </div>
    </div>
  )
}

export default NotFoundComponent