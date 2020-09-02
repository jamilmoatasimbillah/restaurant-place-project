import React from 'react';

/**
 * This is used to show a SearchInput search result option... 
 * It basically represents a restaurant
 */

export default function RestaurantOption({restaurant, onClick}) {
    return <div className="restaurant-option"  onClick={onClick}>
        <img className="restaurant-option__img" src={restaurant.thumb}/>
        <div className="restaurant-option__info">
            <div className="restaurant-option__name">
                {restaurant.name}
            </div>
            <div className="restaurant-option__location">
                {restaurant.area}, {restaurant.city}
            </div>
        </div>
    </div>
} 