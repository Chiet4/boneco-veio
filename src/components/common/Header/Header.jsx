import React from 'react'
import HeaderSearch from './HeaderSearch'
import HeaderBot from './HeaderBot'
import Menu from '../Menu/Menu'

const Header = () => {
  return (
    <div>
        <HeaderSearch/>
        {/* <HeaderBot /> */}
        <Menu/>
    </div>
  )
}

export default Header