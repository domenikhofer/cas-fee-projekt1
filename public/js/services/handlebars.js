;(function (services, $) {

    function renderTemplate(template, notes) {
        let note_content = [];
        const comp_template = Handlebars.compile(template);

        notes.forEach(note => {
            note_content.push(comp_template({
                note_id: note._id,
                note_due: moment(note.due, "YYYY/MM/DD HH:mm").isValid() ? moment(note.due, "YYYY/MM/DD HH:mm").fromNow() : note.due,
                note_title: note.title,
                note_importance: "!".repeat(note.importance),
                note_importance_val: note.importance,
                note_checked: (note.checked ? "active disabled" : ""),
                note_checked_on: (note.checked ? "Finished: " + moment(note.checked_on).fromNow() : ""),
                note_desc: note.desc,
                hide_edit: (note.checked ? "hidden" : ""),
                created_on: moment(note.created_on).fromNow()
            }));
        });
        return note_content;
    }

    services.handlebarService = {
        renderTemplate: renderTemplate
    };

}(window.services = window.services || {}, jQuery));
