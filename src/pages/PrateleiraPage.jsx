import React from 'react'
import Header from '../components/common/Header/Header.jsx';
import Footer from '../components/common/Footer/Footer.jsx';
import Prateleira from '../features/produto/components/Prateleira/Prateleira.jsx'; 
const Home = () => {
  return (
    <>   
      <Header />
        <Prateleira></Prateleira>  
      <Footer />
    </>
  )
}

export default Home