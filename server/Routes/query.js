const router = require('express').Router();

const {RestaurantController, CityController} = require("../Controllers")

router.get('/restaurant', RestaurantController.queryRestaurant);
router.get('/restaurant/filter', RestaurantController.filter);
router.get('/restaurant/filter/count', RestaurantController.filterCount);


router.get('/city', CityController.queryCity);

module.exports = router