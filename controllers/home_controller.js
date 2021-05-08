const { v4: uuidv4 } = require('uuid');

module.exports.home = function(req, res){
    return res.redirect(`/${uuidv4()}`);
}

module.exports.room = function(req, res){
    let room_id = req.params.room_id;
    console.log(room_id);
    return res.render('room', {
        roomId: room_id,
    });
}