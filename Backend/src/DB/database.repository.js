export const findOne = async ({model, filter = {}, select="",options = {}}) => {  
     const doc = model.findOne(filter)
     if(select.length){
         doc.select(select)
     }
     if(options.populate){
         doc.populate(options.populate)
     }
     if(options.lean){
         doc.lean()
     }
     return doc.exec()
}
export const findById = async ({model, id, select = "", options = {}}) => {  
     const doc = model.findById(id)
     if(select.length){
         doc.select(select)
     }
     if(options.populate){
         doc.populate(options.populate)
     }
     if(options.lean){
         doc.lean()
     }
     return doc.exec()
}
export const findAll = async ({model, filter = {}, select = "", options = {}}) => {  
     const doc = model.find(filter)
     if(select.length){
         doc.select(select)
     }
     if(options.populate){
         doc.populate(options.populate)
     }
     if(options.lean){
         doc.lean()
     }
     if(options?.limit){
         doc.limit(options.limit)
     }
     if(options?.skip){
         doc.skip(options.skip)
     }
     return doc.exec()
};
export const create = async ({model, data, options = {ValidateBeforeSave:true}}) => {
    return await model.create(data) || [];
};
export const findOneAndDelete = async ({model, filter={}}) => {
    return await model.findOneAndDelete(filter)
};
export const findOneAndUpdate = async ({model, filter={}, update, options = {}}) => {
    return await model.findOneAndUpdate(
        filter,
         {...update, $inc:{__v:1}},
        {
            returnDocument: "after",
            runValidators:true,
            ...options
        }
    )
};


