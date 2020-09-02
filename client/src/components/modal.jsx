import React from 'react';

/**
 * this component gives functionality to present 
 * something on the top of every component
 * 
 */

function Modal({className, onClose, ...props}){
    return <div className="modal">
        <div className="modal__close" onClick={onClose}>X</div>
        <div className={`${!className? "" : className} modal__container`}>
            {props.children}
        </div>
    </div>
}

export default Modal