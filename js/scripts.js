"use strict";
$(document).ready(function () {
    //Model
    let notes = JSON.parse(localStorage.getItem("notes"));
    let param_id = getParams("id");


    if (window.location.pathname.indexOf("index") > -1 && notes !== null) {
        loadNotes()
    }
    ;

    if (param_id !== 0) {
        editNote(param_id);
    }

    $("#save").click(function () {
        $(".input").removeClass("wrong");

        $(".input_title").val().length < 3 ? $(".input_title").addClass("wrong") : "";
        !/^[1-5]$/.test($(".input_importance").val()) ? $(".input_importance").addClass("wrong") : "";

        !/^0*([1-9]|[12][0-9]|3[01])$/.test($(".input_due_D").val()) ? $(".input_due_D").addClass("wrong") : "";
        !/^0*([1-9]|1[0-2])$/.test($(".input_due_M").val()) ? $(".input_due_M").addClass("wrong") : "";
        $(".input_due_Y").val() < (new Date).getFullYear() ? $(".input_due_Y").addClass("wrong") : "";
        !/^0*([0-9]|1[0-9]|2[0-4])$/.test($(".input_due_h").val()) ? $(".input_due_h").addClass("wrong") : "";
        !/^0*([0-9]|[1-4][0-9]|5[0-9])$/.test($(".input_due_m").val()) ? $(".input_due_m").addClass("wrong") : "";

        if ($(".wrong").length === 0) {
            saveNote(param_id);
        }


    });


    $(".text").click(function () {
        $(this).toggleClass("long");
       $(this).find(".showMore").text(($(this).find(".showMore").text()==="▼"?"▲":"▼"));

    })

    /*
     $(document).on("click", function (e) {
     console.log(e.target);

     })

     */

    $(".input").on("click focus",function () {
        $(this).removeClass("wrong");
    })

    $(document).on("click", ".edit", function () {
        let id = $(this).parent(".note").attr("id");
        window.location.replace("new.html?id=" + id);
    })


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
    })


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
                note_due: moment(note.due).fromNow(),
                note_title: note.title,
                note_importance: "!".repeat(note.importance),
                note_checked: (note.checked === true ? "checked disabled" : ""),
                note_checked_on: (note.checked === true ? "(" + moment(note.checked_on).fromNow() + ")" : ""),
                note_desc: note.desc
            });
            $("#notes_cont").append(note_content);
        })

        $(".text").each(function () {
           if( $(this).prop("scrollHeight")>60){
$(this).find(".showMore").show();
           };
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
        const due = notes[id].due.split(/[-:T]+/);
        $(".input_due_Y").val(due[0]);
        $(".input_due_M").val(due[1]);
        $(".input_due_D").val(due[2]);
        $(".input_due_h").val(due[3]);
        $(".input_due_m").val(due[4]);
    }

    function saveNote(param_id) {
        const notes_temp = [];
        const title = $(".input_title").val();
        const desc = $(".input_desc").val();
        const importance = $(".input_importance").val();
        const due = $(".input_due_Y").val() + "-" + pad($(".input_due_M").val()) + "-" + pad($(".input_due_D").val()) + "T" + pad($(".input_due_h").val()) + ":" + pad($(".input_due_m").val());
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

    function pad(n) {
        const n2 = n.split("");
        return (n < 10 && n2.length === 1) ? ("0" + n) : n;
    }

});

// single page? / irgendwann /buuble click evnet? / header& Footer / better date input - array? datepicker?
