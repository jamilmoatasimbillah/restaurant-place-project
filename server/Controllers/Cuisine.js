const {Cuisine} = require('../Models')

exports.getCuisineList = (req, res) => {
    Cuisine.find().then(result => {
        const cuisines = {}
        for(let i in result) cuisines[ result[i]._id ] = result[i]
        res.status(200).json({ message: "Cuisines Fetched Sucessfully", cuisines })
    }).catch(err=>{
        res.status(500).json({msg: "Something Went wrong", err})
    })
}

