
const validate = (schema, req)=>{

    const { error } = schema.validate(req.body);
    if(error)
        return { hasError:true, errorMessage: decodeURI(error.details[0].message) }
    else
        return { hasError:false, errorMessage: "" }

}


export default validate