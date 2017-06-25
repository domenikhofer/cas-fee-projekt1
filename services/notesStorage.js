const Datastore = require('nedb');
const db = new Datastore({filename: './data/notes.db', autoload: true});
const moment = require("../public/js/libs/moment-v2.18.1");



class Note {
    constructor(title, desc, importance, due) {
        this.title = title;
        this.desc = desc;
        this.importance = importance;
        this.due = due;
        this.created_on = moment.now();
        this.checked = false;
        this.checked_on = false;
    }
}

function addNote(title, desc, importance, due, callback) {
    let note = new Note(title, desc, importance, due);

    db.insert(note, function (err, dbNote) {
        if (callback) {
            callback(err, dbNote);

        }

    });

}

function checkNote(id, callback) {
    db.update({_id: id}, {$set: {"checked": true, "checked_on": moment.now()}}, {}, function (err, dbNote) {
        if (callback) {
            callback(err, dbNote);
        }
    })

}

function getNoteById(id, callback) {
    db.findOne({_id: id}, function (err, dbNote) {
        if (callback) {
            callback(err, dbNote);
        }
    })
}

function getNotes(noteSort, noteOrder, noteFilter = "checked", callback) {
    db.find({},function (err, dbNote) {
        if (callback) {


            let filt_notes = dbNote.filter(x => x[noteFilter] ? x[noteFilter] === false : true);


            filt_notes.sort((a, b) => {
                if (typeof(a[noteSort]) === "string") {
                    return a[noteSort].localeCompare(b[noteSort]);
                } else {
                    return a[noteSort] - b[noteSort]
                }
            });
            if (noteOrder === "desc") {
                filt_notes.reverse();
            }
            callback(err, filt_notes);
        }


    });
}

function editNote(id, title, desc, importance, due, callback) {

    db.update({_id: id}, {
        $set: {
            "title": title,
            "desc": desc,
            "importance": importance,
            "due": due
        }
    }, {}, function (err, dbNote) {
        if (callback) {
            callback(err, dbNote)
        }
    });
}

module.exports = {
    addNote: addNote,
    editNote: editNote,
    checkNote: checkNote,
    getNotes: getNotes,
    getNoteById: getNoteById
};

