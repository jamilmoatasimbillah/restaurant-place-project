import React from 'react';
import {Link} from 'react-router-dom'


export default function MealType ({ heading, imgSrc, subheading, mealtype, ...props}) {
    return <div className="meal-type">
        <img className="meal-type__img" src={imgSrc} alt={heading}/>
        <div className="meal-type__info">
            <span>
                <Link to={`/search?mealtype=${mealtype}`}  className="meal-type__heading">
                    {heading}
                </Link>
                <Link to={`/search?mealtype=${mealtype}`}  className="meal-type__subheading">
                    {subheading}
                </Link>
            </span>
        </div>
    </div>
}