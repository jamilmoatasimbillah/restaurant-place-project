import React from 'react';


import { SelectOptions, SearchInput, RestaurantOption, MealType, LocationOption } from '../components'
import { ImageContainer } from '../page-components'


/**
 * This component is mainly the HOME page..
 */

export default class  ResturantDetails extends React.Component  {

    state = {
        restaurant: "",
        location: "",
        changedFieldName: "",
        queryTriggerd: false,
        restaurants: [],
        locations: [],
        selected: {
            location: null,
            restaurant: null
        }
    }

    constructor(props){
        super(props)
        const location = JSON.parse(window.sessionStorage.getItem('location'))
        this.state.selected.location = location
        this.state.location = !location ? "" : location.name
    }

    showMealtypes = () => {
        const views = []
        for(let id in this.props.mealtypes) {
            const v = this.props.mealtypes[id]

            views.push(<MealType 
                key={v._id}
                heading={v.name}
                subheading={v.content}
                imgSrc={v.thumb}
                mealtype={v.mealtype}
            />)
        }
        return views
    }

    handleChange = (e) => {
        const {name, value} = e.target
        
        
        const result = this.applyFilter(name, value)

        this.setState({
            [name]: value,
            changedFieldName: !value ? "" : name,
            [name+"s"]: result
        }, () => {
            if(value.length > 2) {
                const cb = () => this.setState({queryTriggerd: false, [name+"s"]: this.applyFilter(name, value)})

                if(!this.state.queryTriggerd && this.state[name+"s"].length === 0) {
                   
                    if(name === "location"){
                        this.props.queryCity(this.state.location, cb)
                        this.setState({queryTriggerd: true })
                    }
                    else if (name === "restaurant" && !!this.state.selected.location){
                        this.props.queryRestaurant(this.state.restaurant, this.state.selected.location, cb)
                        this.setState({queryTriggerd: true })
                    }
                    
                }
            }
        })
    }

    applyFilter = (name, value) => {
        /**
         * This function filters out the result for SearchInput 
         * Returns array of objects that contains the value in name attribute of the object
         * @param name : String : Name of the field 
         * @param value : String : Sub-String that we are searching for
         */
        let result = []
        let count = 0
        if(name === "location"){
            for(let id in this.props.cities) {
                const v = this.props.cities[id]
                if(!!v){

                    const temp = v.name.toLowerCase().indexOf(value.toLowerCase())
                    if(temp !== -1) {
                        result.push({...v, start: temp, charCount: value.length})
                        count += 1
                    }
                    if(count=== 4) break
                }
            }

        }else if(name === "restaurant"){
            if(!!this.state.location){
                for(let id in this.props.restaurants) {
                    const v = this.props.restaurants[id]
                    if(!!v){
                        let temp = v.city_code === this.state.selected.location.city_code
                        if(temp === true) temp = v.area_code === this.state.selected.location.area_code
                        if(temp === true) temp = v.name.toLowerCase().indexOf(value.toLowerCase()); else temp = -1
                        if(temp !== -1) {
                            result.push({...v, start: temp, charCount: value.length})
                            count += 1
                        }
                        if(count=== 4) break
                    }
                }
            }
        }
        return result
    }

    handleSelect = (name, value) => {
        /**
         * It is the handler for seletcting Location or Restaurnt from SearchInput dropdown
         */
        this.setState({
            changedFieldName: "",
            [name]: value.name,
            selected: {...this.state.selected, [name]: value}
        }, () => {
            if(name === "location") window.sessionStorage.setItem('location', JSON.stringify(this.state.selected.location));
            else if(name === "restaurant") this.props.history.push('/details/'+this.state.selected.restaurant._id);
        })
    }


    render(){
        const {restaurant, location, restaurants, locations, changedFieldName, selected} = this.state
        return <div>
            <div className="container">
                <ImageContainer className="quick-search-header image-container--gradient" src="assets/images/foodWallpaper.png">
                    <div className="quick-search-header__logo">
                        e!
                    </div>
                    <div className="quick-search-header__heading">
                        Find the best resturants, cafes and bars
                    </div>
                    <div className=" quick-search-header__location">

                        <SearchInput className="quick-search-header__location-selector" 
                            name="location" value={location} placeholder="Location" 
                            onChange={this.handleChange}
                        >

                            { changedFieldName !== "location"? null : 
                                locations.map(v => <LocationOption key={v._id} value={v} onClick={this.handleSelect.bind(this, "location", v)}/>)
                            }
                            
                        </SearchInput>
                        <SearchInput className="quick-search-header__resturant"
                            name="restaurant" value={restaurant} placeholder="Restaurant" 
                            onChange={this.handleChange}
                        >
                            {changedFieldName !== "restaurant"? null : 
                                !selected.location? <div>Select the location first</div> :
                                restaurant.length>2 && restaurants.length === 0 ? <div>No restaurant found</div> :
                                    restaurants.map(v => <RestaurantOption key={v._id} restaurant={v} onClick={this.handleSelect.bind(this, "restaurant", v)}/> )}
                        </SearchInput>
                    </div>
                </ImageContainer>


                <div className="info-container">
                    <div className="info-container__heading">
                        Quick Searches
                    </div>
                    <div className="info-container__subheading">
                        Discover resturants by type of meals
                    </div>
                    <div className="info-container__children">
                        { this.showMealtypes()}
                    </div>
            
                </div>
            </div>
        </div> 
    }   
}