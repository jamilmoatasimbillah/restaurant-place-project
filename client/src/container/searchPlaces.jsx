import React from 'react';
import { apiCall } from '../services/api';
import * as QueryString from 'query-string';

import { ResturantTile} from '../components';
import {FilterContainer} from '../page-components';
import ReactPaginate from 'react-paginate';


/**
 * This component gives functionality to apply filters 
 * and search restaurants in a location...
 * It shows the results only for one mealtype...
 */

const PAGE_SIZE = 2

class SearchPlaces extends React.Component{

    state = {
        cuisineOptions: [],
        costOptions: [
            // {value: 1, label: "less than ₹500"}, 
            // {value: 2, label: "₹500 to ₹1000"}, 
            // {value: 3, label: "₹1000 to ₹1500"}, 
            // {value: 4, label: "₹1500 to ₹2000"}, 
            // {value: 5, label: "₹2000+"}, 
            {value: 1, label: "less than 500"}, 
            {value: 2, label: "500 to 1000"}, 
            {value: 3, label: "1000 to 1500"}, 
            {value: 4, label: "1500 to 2000"}, 
            {value: 5, label: "2000+"}, 
        ],
        restaurantList: [],
        sortOptions: [
            {value: 1, label: "price low to high"}, 
            {value: -1, label: "price high to low"}, 
        ],
        queryResult: [],
        prevQuery:"",
        currentLocation: {city_code:1,area_code:11,country_code:91, area: "", city: ""},
        filters: {
            page: 0,
            location: {
                city_code:1,area_code:11,country_code:91, area: "", city: ""
            },
            cuisine: [],
            cost: 1,
            sorting: 1,
            mealtype: 1
        },
        filterChanged: true,
        itemCount: 0
    }

    constructor(props){
        super(props)
        const sessionLocation = JSON.parse(window.sessionStorage.getItem('location'))
        const {filters, page} = this.getFilterValuesFromQueryString(props)
        if(!!sessionLocation) {
            filters.location = sessionLocation
            this.state.currentLocation = sessionLocation
        }
        this.state.filters = filters
        this.state.page = page
    }

    componentDidMount(){
        /**
         * This function is called after the mounting of this component is completed...
         * * INFO : In this function, I have tried to set the initial values of filters according to the initial query parameters of the URL...
         */
        
        const {apiQueryString} = this.getQueryStringForCurrentFilters()
        this.sendApiRequest(apiQueryString)
        
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if(nextProps.location.search !== this.props.location.search) {
            const {filters, page} = this.getFilterValuesFromQueryString(nextProps)
            nextState.filters = filters
            nextState.page = page
            const {apiQueryString} = this.getQueryStringForCurrentFilters(nextState)
            this.sendApiRequest(apiQueryString)
        }
        return true
    }



    applyFilters = () => {
        /**
         * This function tries to apply the filters on client-side....
         */
        const {page, filters} = this.state
        let results = [...this.state.restaurantList]

        if(filters.sorting === 1) results = results.sort((a, b) => a.costForTwo - b.costForTwo)
        else if(filters.sorting === 2)results = results.sort((a, b) => b.costForTwo - a.costForTwo)
        
        this.setState({
            searchResult: results
        })
    }

    getFilterValuesFromQueryString = (props) => {
        /**
         * This function helps to get filter values from the current location...
         * @param props : Object
         */
        let {city, area, cost, cuisine, sorting, mealtype, page} = QueryString.parse(props.location.search)
        let location = {
            _id: -1,
            city_code: !city ? 1 : Number(city), 
            area_code: !area ? 11 : Number(area), 
        }
        cost = !cost ? 1 : Number(cost)

        mealtype = !mealtype ? 1 : Number(mealtype)
        if (!!cuisine && !(cuisine instanceof Array)) cuisine = [Number(cuisine)]
        cuisine = !cuisine ? [] : cuisine.map(c => Number(c))
        page =!page? 0 : Number(page)
        sorting = !sorting ? 1 : Number(sorting)
        const filters = {location, cost, cuisine, sorting, mealtype}
        return {filters, page}
    }

    getQueryStringForCurrentFilters = (state) => {
        /**
         * This function takes all the filters values and return query string for back-end request as well as for client side url
         */
        state = !state ? this.state : state
        const {page, filters} = state
        const apiQueryObject = {page}

        // Adding location to the query parameter
        apiQueryObject.city = filters.location.city_code
        apiQueryObject.area= filters.location.area_code
        
        // Adding taste of the client to the query parameter
        apiQueryObject.cuisine = filters.cuisine
        apiQueryObject.mealtype = filters.mealtype
        
        // Adding budget of the client
        if(filters.cost === 1) {
            apiQueryObject.costlessthan = 500
        } else if(filters.cost === 2) {
            apiQueryObject.costgreaterthan = 500
            apiQueryObject.costlessthan = 1000
        } else if(filters.cost === 3){
            apiQueryObject.costgreaterthan = 1000
            apiQueryObject.costlessthan = 1500
        } else if(filters.cost === 4){
            apiQueryObject.costgreaterthan = 1500
            apiQueryObject.costlessthan = 2000
        } else if(filters.cost === 5) {
            apiQueryObject.costgreaterthan = 2000
        }

        apiQueryObject.sorting = filters.sorting
        const apiQueryString = `?${QueryString.stringify(apiQueryObject)}`

        const clientQueryObject = {
            mealtype: filters.mealtype,
            city: apiQueryObject.city,
            area: apiQueryObject.area,
            page: page,
            sorting: filters.sorting,
            cost: filters.cost,
            cuisine: apiQueryObject.cuisine
        }

        const clientQueryString = `?${QueryString.stringify(clientQueryObject)}`
        return {apiQueryString, clientQueryString}
    }

    sendApiRequest = (queryString) => {
        /**
         * This function sends api request to back-end to get the results 
         */
        if(this.state.prevQuery !== queryString){

            const {filterChanged} = this.state
            if (filterChanged){
                const path = `/query/restaurant/filter/count${queryString}`
                apiCall.get(path).then(res =>  this.setState({
                    prevQuery: queryString,
                    itemCount: res.data.itemCount, filterChanged: false
                })).catch(err => {
                    console.error(err);
                })
            }
            const path = `/query/restaurant/filter${queryString}`
            apiCall.get(path).then(res =>  this.setState({
                prevQuery: queryString,
                queryResult: res.data.result, filterChanged: false
            })).catch(err => {
                console.error(err);
            })
        }
    }

    fetchQuery = () => {
        /**
         * This function helps to build-up query-string from applied filters for the api-request to get the results from the backend 
         */

        const {clientQueryString} = this.getQueryStringForCurrentFilters()
        if(clientQueryString !== this.props.history.location.search){   
            this.props.history.replace(`${this.props.location.pathname}${clientQueryString}`)
        }
    }
    filterLocations = (value) => {
        /**
         * This function helps to filter out the probable locations for the client
         * @param value : String :- The value that the client searching for
         */

        let locationOptions = [];
        let count = 0;
        for(let id in this.props.cities) {
            const v = this.props.cities[id]
            const temp = v.name.toLowerCase().indexOf(value.toLowerCase())
            if(temp !== -1) {
                locationOptions.push({...v, start: temp, charCount: value.length})
                count += 1
            }
            if(count=== 4) break
        }
        return locationOptions
    }

    handleFilterValueChange=(e)=>{
        /**
         * This function is triggered when ever any value of the filter, except Location, is changed....
         * @param e : Synthetic Event
         */

        let {name, value, type} = e.target;
        let {filters} = this.state
        
        value = Number(value)
        
        if(type==="checkbox"){
            const {checked} = e.target
            let i = filters[name].findIndex(v => v === value)
            if(checked && i === -1)filters[name] = [ ...filters[name], value]
            else if(!checked && i > -1) filters[name].splice(i, 1)
            value = filters[name]
        }
        filters[name] = value
        
        this.setState({filters: {...filters}, filterChanged: true, page:0}, this.fetchQuery)
    }

    handleLocationSelect = (location, init=false) => {
        /**
         * This function is called when a location from the dropdown list is selected
         * @param location : Object :- Selected Location
         */
        window.sessionStorage.setItem('location', JSON.stringify(location))
        this.setState({
            currentLocation: location,
            filters: {...this.state.filters, location}, 
            page: 0, 
            filterChanged: true
        }, init ? null : this.fetchQuery)
    }

    handlePageChange = ({selected}) => {
        /**
         * This function handles the pagination
         * @param selected : Number :- It is the selected page
         */

        if(selected !== this.state.page)
            this.setState({ page: selected}, this.fetchQuery)
    }

    handleRestaurantTileClick = (id) => {
        this.props.history.push('/details/'+id)
    }
    
    render(){

        const {costOptions, sortOptions, queryResult, filters, currentLocation} = this.state
        const cuisineOptions = [] 
        for(let key in this.props.cuisines){
            const v = this.props.cuisines[key]
            cuisineOptions.push({label: v.name, value: v.cuisine})
        } 
        let mealtype = ""
        for(let key in this.props.mealtypes){
            if(this.props.mealtypes[key].mealtype === filters.mealtype){
                mealtype = this.props.mealtypes[key].name
                break
            }
        }
        
        let pageCount = Number.parseInt(this.state.itemCount/PAGE_SIZE)
        if(this.state.itemCount % PAGE_SIZE) pageCount+=1 
        return <div className="search-places">
            <h1 className="search-places__heading"> {mealtype} Places in {`${currentLocation.area}, ${currentLocation.city}`}</h1>
            <div className="container-2">
            
                <FilterContainer
                    className = "search-places__left"
                    values={this.state.filters}
                    cuisineOptions={cuisineOptions} 
                    costOptions={costOptions} 
                    sortOptions={sortOptions} 
                    filterLocations={this.filterLocations}
                    queryLocation = {this.props.queryLocation}
                    onLocationSelect = {this.handleLocationSelect}
                    onChange={this.handleFilterValueChange}
                />

                <div className="search-places__right">
                    <div className="search-places__results">
                        {queryResult.length > 0 ? queryResult.map((v, i)=> <ResturantTile key={v._id} {...v} 
                            cuisineNames={this.props.cuisines}
                            mealNames={this.props.mealtypes}  
                            onClick={this.handleRestaurantTileClick} 
                        />) :
                            <h3>No Result Found</h3>
                        }
                    </div>

                    
                {!pageCount ? null : 
                    <ReactPaginate
                        pageCount={pageCount}
                        marginPagesDisplayed={PAGE_SIZE}
                        pageRangeDisplayed={3}
                        previousLabel="<"
                        nextLabel=">"
                        initialPage={this.state.page}
                        forcePage={this.state.page}
                        containerClassName="pagination"
                        previousClassName="pagination__page"
                        nextClassName="pagination__page"
                        pageClassName="pagination__page"
                        pageLinkClassName="pagination__page-link"
                        activeClassName="pagination__page--active"
                        onPageChange={this.handlePageChange}
                    />
                }
                </div>
            </div>
        </div>
    }
}

export default SearchPlaces