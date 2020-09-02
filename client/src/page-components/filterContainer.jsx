import React from 'react'
import {apiCall} from '../services/api';

import { Filter } from '../components'
import {SearchInput, LocationOption} from '../components'



/**
 * This component is built according to our applicaiton...
 * It contains all available filters for <SearchPlaces/> Component
 */


export default class FilterContainer extends React.Component{

    
    state = {
        searchtext: "",
        queryTriggerd: false,
        cityOptions: [],
        showOptions: true,
        intervalId: null,
        expanded: false
    }

    constructor(props){
        super(props)
        const sessionLocation = JSON.parse(window.sessionStorage.getItem('location'))
        if(!sessionLocation){
            const {city_code, area_code} = props.values.location
            apiCall.get(`/query/city?city=${city_code}&area=${area_code}&count=1`).then(res => {
                let location = res.data.result[0]
                if(!location) {
                   this.setState({searchtext: "Unknown Location" })
                }else{
                    this.setState({searchtext: `${location.area}, ${location.city}` }, () => this.props.onLocationSelect(location, true))
                }
            }).catch(err => {
                console.error(err)
            })
        }else{
            this.state.searchtext = `${sessionLocation.area}, ${sessionLocation.city}` 
        }

        
    }

    handleExpand = (e) => {
        this.setState({
            expanded: !this.state.expanded
        })
    } 
    

    handleChange = (e) => {
        const {value} = e.target
        this.setState({
            searchtext: value, 
            showOptions: true, 
            cityOptions: this.props.filterLocations(value)
        }, () => {
            if(value.length > 2) {
                const cb = () => this.setState({
                    queryTriggerd: false, showOptions: true, 
                    intervalId: null, cityOptions: this.props.filterLocations(this.state.searchtext)
                })
                if(!this.state.queryTriggerd && this.state.cityOptions.length === 0) {
                    this.props.queryLocation(this.state.searchtext, cb)
                }
            }
        })
    }

    handleSelectLocation = (location) =>{
        this.setState({showOptions: false, searchtext: location.name}, () => this.props.onLocationSelect(location))
    }

    render(){
        const {cuisineOptions, costOptions, sortOptions, onChange, values} = this.props;
        const {expanded} = this.state
        const className = !this.props.className ? "filter-container" : `${this.props.className} filter-container ${expanded ? "filter-container--expanded" : ""}`
        return <div className={className}>
            <h3 className="filter-container__expand-btn" onClick={this.handleExpand}>
                <div>Filters / Sort</div>
                <div className={`filter-container__expand-btn--${expanded ? "expanded" : "collapsed"}`}> {">"} </div>
            </h3>
            <h2 className="filter-container__heading">Filters</h2>
            <div className="filter">
                <div className="filter__header">Select Location</div>
                <SearchInput className="quick-search-header__location-selector" 
                    name="location" value={this.state.searchtext} placeholder="Enter Location" 
                    onChange={this.handleChange}
                >
                    { 
                        !this.state.showOptions ? null : 
                            this.state.cityOptions.map(v => <LocationOption key={v._id} value={v} onClick={this.handleSelectLocation.bind(this, v)}/>)
                    }
                </SearchInput>
            </div>
            <Filter label="Cuisine" name="cuisine" onChange={onChange} options={cuisineOptions} value={values.cuisine}/>                  
            <Filter type="radio" label="cost for two" name="cost" onChange={onChange} options={costOptions} value={values.cost}/>
            <Filter type="radio" label="Sort" name="sorting" onChange={onChange} options={sortOptions} value={values.sorting}/>
        </div>
    }
}