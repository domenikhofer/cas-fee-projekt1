const noteStorage = require("../services/notesStorage.js");

module.exports.addNote = function(req, res){
    noteStorage.addNote(
        req.body.title,
        req.body.desc,
        req.body.importance,
        req.body.due,
        (err,dbNote)=>{}
        )
};

module.exports.editNote = function(req, res){
    noteStorage.editNote(
        req.params.id,
        req.body.title,
        req.body.desc,
        req.body.importance,
        req.body.due,
        (err,dbNote)=>{}
        )
};

module.exports.checkNote = function(req, res){
    noteStorage.checkNote(
        req.params.id,
        (err,dbNote)=>{}
        )
};

module.exports.getNotes = function(req, res){
    noteStorage.getNotes(
        req.query.noteSort,
        req.query.noteOrder,
        req.query.noteFilter,
        (err,dbNote)=>{
        res.json(dbNote);
    }
    )
};

module.exports.getNoteById = function(req, res){
    noteStorage.getNoteById(
        req.params.id,
        (err,dbNote)=>{
        res.json(dbNote);
    }
    )
};