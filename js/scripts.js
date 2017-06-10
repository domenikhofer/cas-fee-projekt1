"use strict";
$(document).ready(function () {
    //Model
    let notes = JSON.parse(localStorage.getItem("notes"));
    let param_id = getParams("id");

    $(".input_datetime").datetimepicker({
        minDate:0
    });

    if (window.location.pathname.indexOf("index") > -1 && notes !== null) {
        loadNotes()
    }


    if (param_id !== 0) {
        editNote(param_id);
    }

    $("#save").click(function () {
        $(".input_importance").val(Math.min(Math.max(parseInt($(".input_importance").val()), 1), 5));
        saveNote(param_id);
 });


    $(".text").click(function () {
        $(this).toggleClass("long");
       $(this).find(".showMore").text(($(this).find(".showMore").text()==="▼"?"▲":"▼"));

    });

    /*
     $(document).on("click", function (e) {
     console.log(e.target);

     })

     */

    $("#new_note").click(function () {
        noteStorage.addNote("test","test",5,"2017/06/11 15:30");
        console.log(noteStorage.getNotes());
    })

    $(".input").on("click focus",function () {
        $(this).removeClass("wrong");
    });

    $(document).on("click", ".edit", function () {
        let id = $(this).parent(".note").attr("id");
        window.location.replace("new.html?id=" + id);
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
                note_title: note.title,
                note_importance: "!".repeat(note.importance),
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

    function editNote(id) {
        $(".input_title").val(notes[id].title);
        $(".input_desc").val(notes[id].desc);
        $(".input_importance").val(notes[id].importance);
        $(".input_datetime").val(notes[id].due);

    }

    function saveNote(param_id) {
        const notes_temp = [];
        const title = $(".input_title").val()||"No Title";
        const desc = $(".input_desc").val()|| "No Description";
        const importance = $(".input_importance").val();
        const due = $(".input_datetime").val() || "Whenever you want";
        const checked = false;
        const checked_on = false;
        const created = moment();

        (notes !== null ? notes.forEach(function (x) {
            notes_temp.push(x)
        }) : "");
        const id = notes_temp.length;
        if (param_id !== 0) {
            notes_temp[param_id].title = title;
            notes_temp[param_id].desc = desc;
            notes_temp[param_id].importance = importance;
            notes_temp[param_id].due = due;
        } else {
            notes_temp.push({
                id: id,
                title: title,
                desc: desc,
                importance: importance,
                due: due,
                checked: checked,
                checked_on: checked_on,
                created: created
            })
        }
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

    });

// single page?  /buuble click evnet? / header& Footer
