import React from 'react';
import {apiCall} from '../services/api';

import {Switch, Route, withRouter} from 'react-router-dom';

import {QuickSearch, ResturantDetails, SearchPlaces} from '.'
import { Navbar } from '../components';




function mapArrayToMapObject(arr, keyname="_id"){
  const result = {}
  if(!!keyname) 
    for(let i in arr) result[arr[i][keyname]] = arr[i]
  return result
}


/**
 * This is the main application...
 * It contains all the possible routes of this application...
 * It is responsible for showing every possible container of the application...
 */

class App extends React.Component {
  state = {
    cities: {},
    mealtypes: {},
    restaurants: {},
    is_city_query_busy: false,
    is_restaurant_query_busy: false,
    cuisines: {}
  }
  componentDidMount(){

    // Loading mealtypes and cuisines from the back-end

    apiCall.get("/api/mealtypelist").then(res => this.setState({mealtypes: res.data.mealtypes}))
    apiCall.get("/api/cuisinelist").then(res => this.setState({cuisines: res.data.cuisines}))
  }



  handleQueryCity = (value, cb) => {
    /**
     * @param value : String :- Substring of the location that the client searching for
     * @param cb : function :- It is callback function called after the request is resolved
     */
    if(!this.state.is_city_query_busy){
      this.setState({is_city_query_busy: true}, () => {
          apiCall.get("/query/city?value="+value)
          .then(res => {
            res.data.result = res.data.result.map(v => {
              v.name = `${v.area}, ${v.city}`
              return v
            })
            this.setState({
              cities: {...this.state.cities, ...mapArrayToMapObject(res.data.result)}, 
              is_city_query_busy: false
            }, cb)
        }).catch(err => {
          console.error(err)
          this.setState({is_city_query_busy: false}, cb)
        })
      })
    }
  }

  handleQueryRestaurant = (value, location,cb) => {
    /**
     * @param value : String :- Substring of the Restaurant name that the client searching for
     * @param cb : function :- It is callback function called after the request is resolved
     */
    if(!this.state.is_restaurant_query_busy){
      this.setState({is_restaurant_query_busy: true}, () => {
        apiCall.get(`/query/restaurant?value=${value}&area=${location.area_code}&city=${location.city_code}`)
          .then(res => this.setState({
            restaurants: {...this.state.restaurants, ...mapArrayToMapObject(res.data.result)}, 
            is_restaurant_query_busy: false
          }, cb)).catch(err => {
            console.error(err)
            this.setState({is_restaurant_query_busy: false}, cb)
          })
      })
    }
  }

  render(){
    const {cities, mealtypes, restaurants, cuisines} = this.state
    const hideNavbar = this.props.location.pathname === '/' || this.props.location.pathname === '/home'

    return (
      <div className="App">
        {hideNavbar? null : <Navbar/>} 
        <Switch>
          <Route exact path="/"  render={ (props) => 
            <QuickSearch {...props} 
              {...{cities, mealtypes, restaurants}} 
              queryCity={this.handleQueryCity} 
              queryRestaurant={this.handleQueryRestaurant}/>
            }/>
          <Route exact path="/search"  render={ (props) => 
            <SearchPlaces {...props} 
              {...{cities, mealtypes, restaurants, cuisines}}
              queryLocation={this.handleQueryCity
            }/>}
          />
          <Route exact path="/details/:id" render={ (props) => <ResturantDetails {...props} {...{cuisines, mealtypes}}/>}/>
        </Switch>
      </div>
    );

  }
}

export default withRouter(App);
