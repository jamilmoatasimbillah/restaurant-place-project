import React from 'react'

/**
 * This component gives Typeahead like feature
 */


class SearchInput extends React.Component{
    
    render(){
        let {children, className, ...props} = this.props
        className = !className ? "search-input" : `${className} search-input`
        return <div className={className}>
            <input className="search-input__field" type="text" autoComplete="off" {...props}/>
            <div className={`search-input__result` }>
                {children}
            </div>
        </div>
    }
}



export default SearchInput