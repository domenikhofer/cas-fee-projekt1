"use strict";
$(document).ready(function () {
    let sort;
    let order;
    let filter;
    let note_id;

    loadNotes();

    $("#new_note").on("click",function () {
        showEditor(this);
    });

    $("#save").on("click",function () {
        saveNote();
    });

    $("#cancel").on("click",function () {
        $("#create_note_cont").fadeOut();
    });

    $(".style").change(function () {
        $(".input").toggleClass("blue");

    });

    $(".sort_item, .filter_item").on("click", function (e) {
        sortFilter(e);
    });

    $(document).on("click",".text",function () {
        $(this).toggleClass("long");
        $(this).find(".showMore").text(($(this).find(".showMore").text() === "▼" ? "▲" : "▼"));
    });

    $(document).on("click",".edit", function () {
        showEditor(this);
        editNote(note_id);
    });

    $(".finished").on("click", function () {
        note_id = $(this).parents(".note").attr("id");
        checkNote(note_id);
    });

    function loadNotes(sort = "due", order = "asc", filter = "checked") {
        const template = $("#note_template").html();
        const notes = noteStorage.getNotes(sort, order, filter);
        let renderedNotes = handlebars.render(template, notes);
        $("#notes_cont").html("");
        renderedNotes.forEach(x => $("#notes_cont").append(x));

        $(".text").each(function () {
            if ($(this).prop("scrollHeight") > 60) {
                $(this).find(".showMore").show();
            }
        });
    }

    function editNote() {
        let note = noteStorage.getNoteById(note_id);
        $(".input_title").val(note.title);
        $(".input_desc").val(note.desc);
        $(".input_importance").val(note.importance);
        $(".input_datetime").val(note.due);
    }

    function saveNote() {
        $(".input_importance").val(Math.min(Math.max(parseInt($(".input_importance").val()), 1), 5));
        const title = $(".input_title").val() || "No Title";
        const desc = $(".input_desc").val() || "No Description";
        const importance = $(".input_importance").val();
        const due = $(".input_datetime").val() || "Whenever you want";
        if(note_id===undefined){
            noteStorage.addNote(title, desc, importance, due);
        }else{
            noteStorage.editNote(note_id,title, desc, importance, due);
        }
        loadNotes(sort, order, filter);
        $("#create_note_cont").fadeOut();
    }

    function checkNote() {
        noteStorage.checkNote(note_id);
loadNotes(sort,order,filter);
    }

    function showEditor(that){
        $("#create_note_cont").fadeIn();
        $(".input").not(".style").val("");
        note_id = $(that).parents(".note").attr("id");
        $(".input_datetime").datetimepicker({
            minDate: 0
        });
    }

    function sortFilter(e){
        let targ = $(e.target);
        if (targ.hasClass("sort_item")) {
            $(".sort_item").removeClass("active");
            sort = targ.attr("sort");
            order = targ.attr("order", (order === "asc" ? "desc" : "asc")).attr("order");
            targ.toggleClass("active");
        } else {
            filter = (targ.hasClass("active")?targ.attr("filter"):"");
            targ.toggleClass("active");
        }
        loadNotes(sort, order, filter);
    }
});

 //  violations /styleswitcher besser? /code,vars,selector Cleanup / Design update
