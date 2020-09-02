import React from 'react'

/**
 * This is tabbar for details page...
 * But in this application, it is not used...
 * Instead react-tabs is used and its styles are given to 
 * react-tabs
 */

export default function Tabbar ({tabnames, onTabClick, selected, ...props}) {
    tabnames = !tabnames ? [] : tabnames
    const tabs = tabnames.map((v, i)=> 
        <div 
            className={`tabbar__tab ${selected === i ? "tabbar__tab--selected" : ""}`} 
            id={`tab${i}`} 
            onClick={onTabClick}>{v}</div>
    )
    return <nav className="tabbar">{tabs}</nav>;
} 