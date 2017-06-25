const noteStorage = require("../services/notesStorage.js");


module.exports.addNote = function(req, res){
    const pre = req.body;
    noteStorage.addNote(pre.title,pre.desc,pre.importance,pre.due,(err,dbNote)=>{})
};

module.exports.editNote = function(req, res){
    const pre = req.body;
    noteStorage.editNote(req.params.id, pre.title,pre.desc,pre.importance,pre.due,(err,dbNote)=>{})
};

module.exports.checkNote = function(req, res){
    noteStorage.checkNote(req.params.id,(err,dbNote)=>{})
};

module.exports.getNotes = function(req, res){
    const pre = req.query;
    noteStorage.getNotes(pre.noteSort, pre.noteOrder, pre.noteFilter,(err,dbNote)=>{
        res.json(dbNote);
    })
};

module.exports.getNoteById = function(req, res){
    noteStorage.getNoteById(req.params.id,(err,dbNote)=>{
        res.json(dbNote);
    })
};