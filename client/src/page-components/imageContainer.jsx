import React from 'react';

/**
 * This is very cool component...
 * It contains an image without affecting the aspect ration of the 
 * image and shows the image with all the area of that the component
 * occupies....
 */

export default function ImageContainer({className, src, children, ...props}){
    className = !className ? "image-container" : `${className} image-container`;
    src = !src ? "" : src;
    return <div className={className} {...props}>
        <img src={src} alt="" className="image-container__img"/>
        {children}
    </div>
}