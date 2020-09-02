import React from 'react'

export default function SelectOptions({ className, options, ...props}){
    /**
     * @param options Array of <option> having [value, label] format for each option
     */

    options = !options ? [] : options
    className = !className ? "select" : `${className} select`
    return <select className= {className} {...props}>
        {options.map(([value, label],i)=> <option className="select__option" key={i} value={value}>{label}</option>)}
    </select>
}