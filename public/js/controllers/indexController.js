;(function ($) {
    const rest = window.services.restClient;
    const handlebars = window.services.handlebarService;

    $(function () {
            let noteSort;
            let noteOrder;
            let noteFilter;
            let note_id;

            loadNotes();

            $("#new_note_btn").on("click", function () {
                showEditor(this);
            });

            $(".input_importance").on("click",function () {
                $(".input_importance").removeClass("active");
                $(this).toggleClass("active");
            });

            $("#save").on("click", function () {
                saveNote();
            });

            $("#cancel").on("click", function () {
                $("#create_note_container").fadeOut();
            });

            $(".style").change(function () {
                $(".input").toggleClass("blue");
                $(".red").removeClass("blue");
                $(".logo").toggleClass("blue_logo");
            });

            $(".sort_item, .filter_item").on("click", function (e) {
                sortFilter(e);
            });

            $(document).on("click", ".edit_btn", function () {
                showEditor(this);
                editNote(note_id);
            });

            $(document).on("click", ".finished_btn",function () {
                note_id = $(this).parents(".note").attr("id");
                $("#"+note_id).animate({"height":0,"margin":0,"padding":"0 auto"},1).fadeOut(1000);
                setTimeout(function () {
                    checkNote(note_id);
                },1000)
            });

            function loadNotes(noteSort = "due", noteOrder = "desc", noteFilter) {
                const template = $("#note_template").html();
                const notes = rest.getAllNotes(noteSort, noteOrder, noteFilter);
                $("#notes_container").html("");
                notes.done((content)=>{
                   let renderedNotes =  handlebars.renderTemplate(template, content);
                    renderedNotes.forEach(x => $("#notes_container").append(x));
                    if($(".style").hasClass("blue")){$(".input").addClass("blue")}
                });
            }

            function editNote() {
                let note = rest.getNoteById(note_id);
                note.done((content)=>{
                    $(".input_title").val(content.title);
                    $(".input_desc").val(content.desc);
                    $(".i"+content.importance).addClass("active");
                    $(".input_datetime").val(content.due);
                })
            }

            function saveNote() {
                const title = $(".input_title").val() || "No Title";
                const desc = $(".input_desc").val() || "No Description";
                const importance = $.trim($(".input_importance.active").text()).length;
                const due = $(".input_datetime").val() || "whenever you want";
                if (note_id === undefined) {
                  rest.addNote(title, desc, importance, due);
                } else {
                    rest.editNote(note_id, title, desc, importance, due);
                }
                loadNotes(noteSort, noteOrder, noteFilter);
                $("#create_note_container").fadeOut();
            }

            function checkNote() {
                rest.checkNote(note_id);
            }

            function showEditor(that) {
                $("#create_note_container").fadeIn();
                $(".input").not(".style").val("");
                $(".input_importance").removeClass("active");
                note_id = $(that).parents(".note").attr("id");
                $(".input_datetime").datetimepicker({
                    minDate: 0
                });
            }

            function sortFilter(e) {
                let targ = $(e.target);
                if (targ.hasClass("sort_item")) {
                    $(".sort_item").removeClass("active");
                    noteSort = targ.attr("noteSort");
                    noteOrder = targ.attr("noteOrder");
                    loadNotes(noteSort, noteOrder, noteFilter);
                    targ.toggleClass("active");
                    targ.attr("noteOrder",noteOrder==="asc"?"desc":"asc");
                } else {
                    noteFilter = (targ.hasClass("active") ? targ.attr("noteFilter") : "");
                    loadNotes(noteSort, noteOrder, noteFilter);
                    targ.toggleClass("active");
                }
            }
        });

}(jQuery));




