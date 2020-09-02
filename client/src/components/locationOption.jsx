import React from 'react';


/**
 * This is used to show a SearchInput search result option... 
 * It basically represents a location
 */
export default function LocationOption({value, onClick}){
    return <div className="location-option"  onClick={onClick}>
        <pre>
            {value.name.substr(0, value.start)}
            <b>{value.name.substr(value.start, value.charCount)}</b>
            {value.name.substr(value.start+value.charCount)}
        </pre>
    </div>
}