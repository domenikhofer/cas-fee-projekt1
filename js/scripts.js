"use strict";
$(document).ready(function () {
    //Model
    let notes = JSON.parse(localStorage.getItem("notes"));
    let param_id = getParams("id");



    if (window.location.pathname.indexOf("index") > -1 && notes !== null) {
        loadNotes()
    }


    $(document).on("click",".save",function () {
        let id = $(this).parent().parent().parent(".note").attr("id");
        $("#"+id+" .input_importance").val(Math.min(Math.max(parseInt($("#"+id+" .input_importance").val()), 1), 5));

        console.log(id);

         saveNote(id);
 });

    $("#new_note").click(function () {
        $("#notes_cont").append(note_content);
    })


    $(".text").click(function () {
        $(this).toggleClass("long");
       $(this).find(".showMore").text(($(this).find(".showMore").text()==="▼"?"▲":"▼"));

    });

$(".cancel").click(function () {
location.reload();
})



    $(".input").on("click focus",function () {
        $(this).removeClass("wrong");
    });

    $(document).on("click", ".edit_btn", function () {
        let id = $(this).parent().parent(".note").attr("id");
        $("#"+id+" *").attr("disabled",false).removeClass("hidden");
        $("#"+id+" .edit_btn").hide();
        $("#"+id+" .finished_wrapper").hide();

    });


    $(".sort_item").click(function () {
        $(".sort_item").removeClass("active");
        $(this).addClass("active");
        let sort = $(this).attr("sort");
        let order = $(this).attr("order");
        sortNotes(sort, order);
        $(this).attr("order", (order === "asc" ? "desc" : "asc"))
    });

    $(".filter_item").click(function () {
        $(this).toggleClass("active");
        loadNotes();
    });

    $(document).on("click", ".finished", function () {
        let id = $(this).parent().parent(".note").attr("id");
        checkNote(id);
    });

    $(".style").change(function () {
        if ($(this).val() === "Greenday") {
            $(".input").removeClass("blue");

        } else {
            $(".input").addClass("blue");

        }
    });


    function loadNotes() {
        const filt_notes = notes.filter(x => $(".filter_item").hasClass("active") || x.checked === false);

        $("#notes_cont").html("");

        const template = $("#note_template").html();
        const comp_template = Handlebars.compile(template);

        filt_notes.forEach(note => {
            const note_content = comp_template({
                note_id: note.id,
                note_due: moment(note.due).isValid() ? moment(note.due, "YYYY/MM/DD HH:mm").fromNow() : note.due,
                note_due_edit: note.due,
                note_title: note.title,
                note_importance: "!".repeat(note.importance),
                note_importance_edit: note.importance,
                note_checked: (note.checked === true ? "checked disabled" : ""),
                note_checked_on: (note.checked === true ? "(" + moment(note.checked_on).fromNow() + ")" : ""),
                note_desc: note.desc
            });
            $("#notes_cont").append(note_content);
        });

        $(".text").each(function () {
           if( $(this).prop("scrollHeight")>60){
$(this).find(".showMore").show();
           }
        });

    }

    function sortNotes(id, order) {
        notes.sort((a, b) => {
            if (typeof(a[id]) === "string") {
                return a[id].localeCompare(b[id]);
            } else {
                return a[id] - b[id]
            }
        });
        if (order === "desc") {
            notes.reverse();
        }
        loadNotes();
    }



    function saveNote(param_id) {
        const notes_temp = [];
        const title = $("#"+param_id+" .input_title").val()||"No Title";
        const desc = $("#"+param_id+" .input_desc").val()|| "No Description";
        const importance = $("#"+param_id+" .input_importance").val();
        const due = $("#"+param_id+" .input_datetime").val() || "Whenever you want";
        const checked = false;
        const checked_on = false;
        const created = moment();

        (notes !== null ? notes.forEach(function (x) {
            notes_temp.push(x)
        }) : "");
        const id = notes_temp.length;

        //param_id index of array?

        notes_temp[param_id].title = title;
        notes_temp[param_id].desc = desc;
        notes_temp[param_id].importance = importance;
        notes_temp[param_id].due = due;

        /*
            notes_temp.push({
                id: id,
                title: title,
                desc: desc,
                importance: importance,
                due: due,
                checked: checked,
                checked_on: checked_on,
                created: created
            });
*/
        localStorage.setItem("notes", JSON.stringify(notes_temp));
        window.location.replace("index.html");
    }

    function checkNote(id) {

        notes[id].checked = true;
        notes[id].checked_on = $.now();
        localStorage.setItem("notes", JSON.stringify(notes));
        loadNotes();
    }

    function getParams(name) {
        let results = (name !== null ? new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href) : 0);
        return (results !== null ? results[1] : 0);
    }

    $(".input_datetime").datetimepicker({
        minDate:0
    });

    });

//buuble click evnet? /finisehed button when editing?  new note?/modules+classes /checknote wrong!
