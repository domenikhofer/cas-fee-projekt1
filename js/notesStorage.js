let noteStorage = (function () {
    "use strict";
    let notes = [];


    class Note {
        constructor(title, desc, importance, due) {
            this.id = notes.length;
            this.title = title;
            this.desc = desc;
            this.importance = importance;
            this.due = due;
            this.created_on = moment();
            this.checked = false;
            this.checked_on = false;
        }
    }

    function addNote(title, desc, importance, due) {
        let note = new Note(title, desc, importance, due);
        fromStorage();
        notes.push(note);
        toStorage();
        return note;
    }

    function checkNote(id) {
        let note = getNoteById(id);
            note.checked = true;
            note.checked_on = moment();
            toStorage();


    }

    function getNoteById(id) {
        fromStorage();
        return notes.find(i => i.id === parseInt(id));
    }

    function getNotes(orderBy, order, filterBy) {
        fromStorage();
        let filt_notes = notes.filter(x => x[filterBy] ? x[filterBy] === false : true);

        filt_notes.sort((a, b) => {
            if (typeof(a[orderBy]) === "string") {
                return a[orderBy].localeCompare(b[orderBy]);
            } else {
                return a[orderBy] - b[orderBy]
            }
        });
        if (order === "desc") {
            filt_notes.reverse();
        }
        return filt_notes;


    }

    function editNote(id, title, desc, importance, due) {
        let note = getNoteById(id);
        note.title = title;
        note.desc = desc;
        note.importance = importance;
        note.due = due;
        toStorage();
    }

    function fromStorage() {
        const storageNotes = JSON.parse(localStorage.getItem("notes"));
        if (storageNotes !== null) {
            notes = storageNotes;
        }
    }

    function toStorage() {
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    return {
        addNote: addNote,
        editNote: editNote,
        checkNote: checkNote,
        getNotes: getNotes,
        getNoteById: getNoteById


    }


}());