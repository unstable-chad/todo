exports.date = function get_date() {
    const options = {
        weekday :"long",
        day : "numeric",
        month : "long",
        year : "numeric"   
    }
    let d  = new Date(); 

    return d.toLocaleDateString("en-US", options);
}
exports.day = function get_day() {
    const options = {
        weekday :"long"   
    }
    let d  = new Date();

    return d.toLocaleDateString("en-US", options);;
}




