"use strict";
$(document).ready(function () {

    let notes = JSON.parse(localStorage.getItem("notes"));
    let show_finished = false;
    loadNotes(show_finished);

    $("#save").click(function () {
        saveNote();
    })

    $(".sort_item").click(function () {
        $(".sort_item").removeClass("active");
        $(this).addClass("active");
        let sort = $(this).attr("sort");
        let order = $(this).attr("order");
        sortNotes(sort, order);
        $(this).attr("order",(order==="asc"?"desc":"asc"))
    })
    
    $(".filter_item").click(function () {
        $(this).toggleClass("active");
        loadNotes(show_finished = !show_finished);
    })


    function loadNotes(finished) {
        if (notes !== null) {
            $("#notes_cont").html("");
            notes.forEach(note => {
                if(note.checked===false){$("#notes_cont").append(
                    `<div class="note">
                    <div class="time">${note.created}</div>
                    <div class="title">
                        <div class="title_text">${note.title}</div>
                        <div class="importance">${note.importance}</div>
                    </div>
                    <div class="edit input">Edit</div>
                    <input type="checkbox" class="finished">
                    <div class="text">${note.desc}</div>
                 </div>`)}else if (finished===true && note.checked===true){
                    $("#notes_cont").prepend(
                        `<div class="note">
                    <div class="time">${note.created}</div>
                    <div class="title">
                        <div class="title_text">${note.title}</div>
                        <div class="importance">${note.importance}</div>
                    </div>
                    <div class="edit input">Edit</div>
                    <input type="checkbox" class="finished">
                    <div class="text">${note.desc}</div>
                 </div>`)

                };
            })
        }

    }

    function sortNotes(id, order) {
        if (order === "asc") {
            notes.sort((a, b) => a[id] - b[id]);
        } else {
            notes.sort((a, b) => b[id] - a[id]);
        }
        loadNotes();
    }

    function saveNote() {
        const notes_temp = [];
        const title = $(".input_title").val();
        const desc = $(".input_desc").val();
        const importance = $(".input_importance").val();
        const due = new Date($(".input_due").val()).getTime();
        const checked = false;
        const checked_on = false;
        const created = $.now();

        (notes !== null ? notes.forEach(function (x) {
            notes_temp.push(x)
        }) : "");
        const id = notes_temp.length;
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
        localStorage.setItem("notes", JSON.stringify(notes_temp));
        window.location.replace("index.html");
    }

});