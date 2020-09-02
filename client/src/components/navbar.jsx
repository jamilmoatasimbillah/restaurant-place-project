import React from 'react';
import {Link} from 'react-router-dom';
/**
 * This is the navbar of the application
 */
export default function Navbar(props) {
    return <nav className="navbar">
        <Link to="/"><div className="navbar__logo">e!</div></Link> 
        <div className="navbar__items">
            <div className="navbar__item"
                    style={{border: "1px solid white"}}
                >Create New Account</div>
            </div>
            <div className="navbar__item">Login</div>
    </nav>
}