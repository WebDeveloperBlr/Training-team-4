var Events=require("../models/events");

exports.getNextInterviews=function(req,res){
  Events.getNextInterviews(function(results){
    res.end(JSON.stringify(results));
  })
};
