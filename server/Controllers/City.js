const {City} = require('../Models')

exports.getCityList = (req, res, next) => {
    City.find().then(cities => {
        res.status(200).json({ message: "City Fetched Sucessfully", cities })
    }).catch(err=>{
        res.status(500).json({msg: "Something Went wrong", err})
    })
}

exports.addCity = (req, res, next) => {
    const {name, city_id, location_id, country_name} = req.body

    const newCity = new City({name, city_id, location_id, country_name});
    newCity.save().then(result => {
        res.status(200).json({ msg: "Cities Added Sucessfully", city: result })
    }).catch(err => {
        res.status(500).json({msg: "Error Occured while adding city to the database", err})
    })
}

exports.queryCity = async (req, res) => {
    const value = !req.query.value? "" : req.query.value.toLowerCase()
    const area_code = Number(req.query.area)
    const city_code = Number(req.query.city)
    
    if(Number.isNaN(area_code) || Number.isNaN(city_code)) 
        return res.status(400).json({msg: "Invalid Input"}); 

    const query = {
        $expr: {
            $gte: [
                {$indexOfBytes: [{$toLower: {$concat: ["$area", "$city"]}}, value]}, 
                0
            ]
        }
    }

    if(area_code > 0 )query.area_code = area_code
    if(city_code > 0) query.city_code = city_code
    const count = !req.query.count ? 50 : Number(req.query.count)

    const result = await City.find(query).limit(count)
    
    res.status(200).json({value, result})
}