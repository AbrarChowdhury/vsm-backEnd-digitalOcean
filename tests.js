const moment = require("moment");
const today = moment().format("MMM Do YY");
const yesturday = moment().subtract(1, "days").format("MMM Do YY");
const tomorrow = moment().add(1, "days").format("MMM Do YY");


console.log(yesturday, " - ", today, " - ", tomorrow);

if(tomorrow>today){
    console.log("$$$")
}
if(today>yesturday){
    console.log("**__*__*")
}