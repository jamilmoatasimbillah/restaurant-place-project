import React from 'react';

/**
 * This component is used in SearchPlace component... 
 * It represnts restaurant filtered according to the values of the filters is set...
 */


export default function ResturantTile({_id, thumb, name, city, area, cuisines,cuisineNames, mealtypes,mealNames, costfortwo, ...props}) {
    cuisines = cuisines.map(v => {
        for(let i in cuisineNames){
            if(cuisineNames[i].cuisine === v) return cuisineNames[i].name
        }
        return "unknown"
    })

    mealtypes = mealtypes.map(v => {
        for(let i in mealNames){
            if(mealNames[i].mealtype === v) return mealNames[i].name
        }
        return "unknown"
    })
    
    return <div className="resturant-tile tile">
        <div className="resturant-tile__container container-2">
            <div className="resturant-tile__left">
                <img className="resturant-tile__image" src={thumb} alt="" onClick={props.onClick.bind(this, _id)}/>
            </div>
            <div className="resturant-tile__right">
                <div className="resturant-tile__name" onClick={props.onClick.bind(this, _id)}>{name}</div>
                <div className="resturant-tile__city">{area}</div>
                <div className="resturant-tile__address">{city}</div>
            </div>
        </div>
        <div className="resturant-tile__divider divider"></div>
        <div className="resturant-tile__container container-2">
            <div className="resturant-tile__left">
                <div className="resturant-tile__label">Cuisines:</div>
                <div className="resturant-tile__label">cost for two: </div>
            </div>
            <div className="resturant-tile__right">
                <div className="resturant-tile__value">{cuisines.join(", ")}</div>
                <div className="resturant-tile__value">{costfortwo}</div>
            </div>
        </div>
    </div>
}