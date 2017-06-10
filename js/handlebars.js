let handlebars = (function () {

function render(template, notes) {
    let note_content = [];
    const comp_template = Handlebars.compile(template);

    notes.forEach(note => {
        note_content.push(comp_template({
            note_id: note.id,
            note_due: moment(note.due).isValid() ? moment(note.due, "YYYY/MM/DD HH:mm").fromNow() : note.due,
            note_title: note.title,
            note_importance: "!".repeat(note.importance),
            note_checked: (note.checked === true ? "checked disabled" : ""),
            note_checked_on: (note.checked === true ? "(" + moment(note.checked_on).fromNow() + ")" : ""),
            note_desc: note.desc
        }));
    });

  return note_content;
}
return{
    render : render
}
}());
