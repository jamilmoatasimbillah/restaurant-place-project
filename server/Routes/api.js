const express = require('express');


const {
    CityController, 
    CuisineController,
    MealTypeController,
    RestaurantController
} = require('../Controllers');

const router = express.Router({mergeParams: true});


router.get('/cuisinelist', CuisineController.getCuisineList)


router.get('/restaurant/:restaurant_id', RestaurantController.getRestaurantById);


router.post('/city', CityController.addCity);

router.get('/mealtypelist', MealTypeController.getMealTypes);
router.post('/mealtype', MealTypeController.addMealType);

module.exports = router;
