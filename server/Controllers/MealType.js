const {MealType} = require('../Models');

exports.getMealTypes = (req, res, next) => {
    MealType.find().then(result => {
        const mealtypes = {}
        for(let i in result) mealtypes[ result[i]._id ] = result[i]
        res.status(200).json({ message: "MealType Fetched Sucessfully", mealtypes })
    }).catch(err=>{
        res.status(500).json({msg: "Something Went wrong", err})
    })
}

exports.addMealType = async (req, res, next) => {
    const {name, content, meal_type, thumb} = req.body

    // check to remove duplicacy
    const existingMealType = await MealType.findOne({meal_type})

    if(!existingMealType){
        const newMealType = new MealType({name, content, meal_type, thumb});
        newMealType.save().then(result => {
            console.log(result);
            res.status(200).json({ message: "MealType Added Sucessfully", mealtype: result })
        }).catch(err => {
            res.status(500).json({msg: "Something Went wrong", err})
        })
    }else{
        res.status(400).json({msg: "meal_type already exists..."})
    }

}
