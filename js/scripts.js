"use strict";
$(document).ready(function () {

    const notes = JSON.parse(localStorage.getItem("notes"));

    loadNotes();

    $("#save").click(function () {
        saveNote();
    })
    
    $(".sort_item").click(function () {
        $(".sort_item").removeClass("active");
        $(this).addClass("active");
        sortNotes($(this).attr("id"));
    })




function loadNotes() {
    if (notes !== null) {
        $("#notes_cont").html("");
        notes.forEach(note => {
            $("#notes_cont").append(
                `<div class="note">
                    <div class="time">${note[4]}</div>
                    <div class="title">
                        <div class="title_text">${note[1]}</div>
                        <div class="importance">${note[3]}</div>
                    </div>
                    <div class="edit input">Edit</div>
                    <input type="checkbox" class="finished">
                    <div class="text">${note[2]}</div>
                 </div>`);
        })
    }

}

function sortNotes(id){


console.log(notes);
notes.sort((a,b)=>{a[2]-b[2]});
    console.log(notes);



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
    notes_temp.push([id, title, desc, importance, due, checked, checked_on, created]);
    localStorage.setItem("notes", JSON.stringify(notes_temp));


    window.location.replace("index.html");
}

});