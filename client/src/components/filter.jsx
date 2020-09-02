import React from 'react'

/**
 * This component gives input field according to the design
 * pattern of this application
 */


export default function Filter({ label, options, name, type, value, ...props}) {
    type = !type ? "checkbox" : type
    return <div className="filter">
        <div className="filter__header">{label}</div>
        {options.map((option, i)=> {
            if(type === "checkbox") props.checked = value.findIndex(v=> v == option.value) !== -1
            else if(type === "radio") props.checked =  (value == option.value)
            return <div key={i} className="filter__choice">
                <input type={type} name={name} id={"" + name + i} value={option.value} {...props} />
                <label htmlFor={""+ name + i}>{option.label}</label>
            </div>
        }
        )}
        
    </div>
}