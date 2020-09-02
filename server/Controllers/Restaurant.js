const {Restaurant} = require('../Models');

const PAGE_SIZE = 2


function getFilterQuery(req){
    const query = {}
    query.city_code = !req.query.city ? 1 : Number(req.query.city);
    query.area_code = !req.query.area ? 11 : Number(req.query.area);
    
    const costgreaterthan = !req.query.costgreaterthan? 0 : Number(req.query.costgreaterthan);
    const costlessthan = !req.query.costlessthan ? 9999999 : Number(req.query.costlessthan);
    query.costfortwo = {$gte: costgreaterthan, $lt: costlessthan}

    let cuisine = req.query.cuisine
    let mealtype = req.query.mealtype
    if(!!cuisine){
        if(cuisine instanceof Array) cuisine = cuisine.map(c => Number(c))
        else cuisine = [Number(cuisine)]
        query.cuisines = {$in: cuisine}
    }
    if(!!mealtype){
        if(mealtype instanceof Array) mealtype = mealtype.map(c => Number(c))
        else mealtype = [Number(mealtype)]
        query.mealtypes = {$in: mealtype}

    }

    return query;
}


exports.filter = async (req, res, next) => {
    const query = getFilterQuery(req)

    const page = !req.query.page ? 0 : Number(req.query.page);
    const sortingOrder = !req.query.sorting ? 1 : Number(req.query.sorting)

    const result = await Restaurant.find(query).skip(page*PAGE_SIZE).limit(PAGE_SIZE).sort({costfortwo: sortingOrder})
    return res.status(200).json({query, result})
}

exports.filterCount = async (req, res, next) => {
    const query = getFilterQuery(req)
    const itemCount = await Restaurant.find(query).count()
    
    return res.status(200).json({query, itemCount})
}

exports.getRestaurantById = async (req,res) => {
    const {restaurant_id} = req.params
    const restaurant = await Restaurant.findById(restaurant_id)
    if(!restaurant.gallery) restaurant.gallery = []
    return res.status(200).json({ msg: "Restaurant Found", restaurant})
}


exports.queryRestaurant = async (req, res, next) => {
    
    const query = {}
    const name = !req.query.value? "" : req.query.value.toLowerCase()
    if(!name) {
        return res.start(400).json({msg: "Invalid Query String"})
    }
    query.city_code = !req.query.city? 1 : Number(req.query.city)
    query.area_code = !req.query.area? 11 : Number(req.query.area)
    if(!!req.query.value){
        query.$expr = {
            $gte: [
                {$indexOfBytes: [{$toLower: "$name"}, name]}, 
                0 
            ]
        }
    }
    

    const projection = {address: 0, contact: 0, gallery: 0, aggregate_rating: 0}
    const count = !req.query.count ? 10 : Number(req.query.count)

    const result = await Restaurant.find(query, projection).limit(count)
    
    res.status(200).json({result})
}