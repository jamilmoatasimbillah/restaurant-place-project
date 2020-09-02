import React from 'react'
import {apiCall} from '../services/api';

import {Modal} from '../components'
import { ImageContainer } from '../page-components'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';



/**
 * This container responsible for showing details of the selected restaurant
 */


export default class ResturantDetails extends React.Component{
    state = {selected: 0, showGallary: false, 
        restaurant: {mealtypes: [], cuisines: [], mealNames: [], cuisineNames: [], gallery:[]},
        galleryIndex: 0 
    }

    componentDidMount(){
        apiCall.get("/api/restaurant/"+this.props.match.params.id).then(res => {
            this.setState({restaurant: res.data.restaurant})
        }).catch(err => {
            console.error(err)
        })
    }

    shouldComponentUpdate(nextProps, nextState){
        const restaurant = nextState.restaurant
        const {mealtypes, cuisines} = nextProps

        restaurant.mealNames = restaurant.mealtypes.map(v => {
            for(let i in mealtypes){

                if(mealtypes[i].mealtype === v) return mealtypes[i].name
            }
            return {_id: 0, name: "unknown", mealtype: 0}
        })
        restaurant.cuisineNames = restaurant.cuisines.map(v => {
            for(let i in cuisines){
                if(cuisines[i].cuisine === v) return cuisines[i].name
            }
            return {_id: 0, name: "unknown", cuisine: 0}
        })

        return true
    }
    

    handleNextImage = (e) => this.setState({galleryIndex: Math.abs(this.state.galleryIndex + 1)})
    handlePrevImage = (e) => this.setState({galleryIndex: Math.abs(this.state.galleryIndex - 1)})


    handleTabClick = (e) => {
        const {id} = e.target
        const selected = Number(id.charAt(id.length-1))
        this.setState({selected})
    }

    handleShowGallary = (e) => {
        this.setState({showGallary: !this.state.showGallary})
    }

    

    render () {
        const {restaurant, galleryIndex} = this.state
        const imgIndex = galleryIndex % restaurant.gallery.length
        console.log(imgIndex, galleryIndex, restaurant.gallery.length)
        return <div className="restaurant">
            <ImageContainer className="restaurant-heading" src={restaurant.thumb}>
                <div className="restaurant-heading__button" onClick={this.handleShowGallary}>
                    Click to see Image Gallery
                </div>
            </ImageContainer>
            {
                !this.state.showGallary ? null : 
                    <Modal className="restaurant-gallary" onClose={this.handleShowGallary}> 
                        <div className="restaurant-gallary__arrow" onClick={this.handlePrevImage}> {"<"} </div>
                        {restaurant.gallery.length === 0 ? 
                            <div className="restaurant-gallary__image">No Images Found</div>
                            :
                            <img className="restaurant-gallary__image" src={ restaurant.gallery[imgIndex]} alt="image"/>}
                        
                        <div className="restaurant-gallary__arrow" onClick={this.handleNextImage}> {">"} </div>
                    </Modal>
            }
            <div className="restaurant-details">
                <div style={{display: "flex", marginBottom: 50}}>
                    <ImageContainer className="restaurant-details__img restaurant-details__img--mobile-only" src={restaurant.thumb}/>
                    <h1 className="restaurant-details__heading">{restaurant.name}</h1>
                </div>
                <Tabs>
                    <TabList>
                        <Tab>Overview</Tab>
                        <Tab>Contact</Tab>
                    </TabList>
                
                    <TabPanel>
                        <div className="restaurant-overview">
                            <h2 className="restaurant-overview__heading">About this Place</h2>
                            <div>
                                <h3 className="restaurant-overview__label">Cuisine</h3>
                                <div className="restaurant-overview__value">{restaurant.mealNames.join(", ")} | {restaurant.cuisineNames.join(", ")}</div>
                            </div>
                            <div>
                                <h3 className="restaurant-overview__label">Average Cost</h3>
                                <div className="restaurant-overview__value">{restaurant.costfortwo} for two people (Approx.)</div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="restaurant-contact">
                            <div className="restaurant-contact__phone-number">
                                <div className="restaurant-contact__phone-label">Phone Number</div>
                                <div className="restaurant-contact__number">+{restaurant.country_code} {restaurant.contact}</div>
                            </div>
                            <div className="restaurant-contact__addr">
                                <div className="restaurant-contact__addr1">{restaurant.name}</div>
                                <div className="restaurant-contact__addr2">{restaurant.address}</div>
                                {/* <div className="restaurant-contact__addr3">{restaurant.area}, {restaurant.city} </div> */}
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
                
            </div>
        </div>
    }
}
