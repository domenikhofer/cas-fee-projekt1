"use strict";
$(document).ready(function () {
    let sort;
    let order;
    let filter;
    let note_id = undefined;

    loadNotes();


    $("#save").click(function () {
        saveNote();
    });

    $("#new_note").click(function () {
        $("#create_note_cont").fadeIn();
        $(".input").val("");
        note_id=undefined;

        $(".input_datetime").datetimepicker({
            minDate: 0
        });


    })


    $(".text").click(function () {
        $(this).toggleClass("long");
        $(this).find(".showMore").text(($(this).find(".showMore").text() === "▼" ? "▲" : "▼"));

    });




    $("#cancel").click(function () {
        $("#create_note_cont").fadeOut();

    })


    $(document).on("click", ".edit", function () {
        note_id = $(this).parents(".note").attr("id");
        console.log(note_id);
        editNote(note_id);
        $(".input_datetime").datetimepicker({
            minDate: 0
        });

    });


    $(".filter_item, .sort_item").on("click", function (e) {
        let targ = $(e.target);

        if (targ.hasClass("sort_item")) {
            $(".sort_item").removeClass("active");
            sort = targ.attr("sort");
            order = targ.attr("order");
            targ.attr("order", (order === "asc" ? "desc" : "asc"));
            order = targ.attr("order");
        } else {
            filter = (targ.hasClass("active")?targ.attr("filter"):"");
        }
        targ.toggleClass("active");
        filter = (targ.hasClass("active")?targ.attr("filter"):"");
        loadNotes(sort, order, filter)
    });


    $(document).on("click", ".finished", function () {
        note_id = $(this).parents(".note").attr("id");
        checkNote(note_id);
    });

    $(".style").change(function () {
        if ($(this).val() === "Greenday") {
            $(".input").removeClass("blue");

        } else {
            $(".input").addClass("blue");

        }
    });


    function loadNotes(orderBy = "due", order = "asc", filterBy = null) {
        const template = $("#note_template").html();
        const notes = noteStorage.getNotes(orderBy, order, filterBy);
        let test = handlebars.render(template, notes);
        $("#notes_cont").html("");
        test.forEach(x => $("#notes_cont").append(x));

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
$("#create_note_cont").fadeIn();
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

    function getParams(name) {
        let results = (name !== null ? new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href) : 0);
        return (results !== null ? results[1] : 0);
    }

});

//  header& Footer //  .input.val() deletes stylepicker / test again! / invertt filter
