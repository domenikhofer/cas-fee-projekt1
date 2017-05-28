"use strict";
$(document).ready(function () {
    let notes = JSON.parse(localStorage.getItem("notes"));
    let show_finished = false;
    let param_id = getParams("id");

    loadNotes(show_finished);

if(param_id!==0){
    editNote(param_id);
}


console.log(moment());

    $("#save").click(function () {
            saveNote(param_id);

    });

$(document).on("click",".edit",function () {
    let id = $(this).parent(".note").attr("id");
    window.location.replace("new.html?id="+id);
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
        loadNotes(show_finished = !show_finished);
    });

    $(document).on("click",".finished",function(){
        let id = $(this).parent().parent(".note").attr("id");
        checkNote(id);
    })


$(".style").change(function () {
    if($(this).val()==="Greenday"){
     $(".input").removeClass("blue");

    }else{
        $(".input").addClass("blue");

    }
});




    function loadNotes(finished) {

        if (notes !== null) {
            $("#notes_cont").html("");
            notes.forEach(note => {
                let appendage = `<div id="${note.id}"  class="note">
                    <div class="time">${moment(note.due).fromNow()}</div>
                    <div class="title">
                        <div class="title_text">${note.title}</div>
                        <div class="importance">${"!".repeat(note.importance)}</div>
                    </div>
                    <div class="edit input">Edit</div>
                    <p><input type="checkbox" ${(note.checked===true?"checked disabled":"")} class="finished"> Finished ${(note.checked===true?"("+moment(note.checked_on).fromNow()+")":"")} </p>
                    <div class="text">${note.desc}</div>
                 </div>`;
                if (note.checked === false) {
                    $("#notes_cont").append(appendage)
                } else if (finished === true && note.checked === true) {
                    $("#notes_cont").append(appendage);
                }
            })
        }

    }

    function sortNotes(id, order) {
        if (order === "asc") {
            notes.sort((a, b) => a[id] - b[id]);
        } else {
            notes.sort((a, b) => b[id] - a[id]);
        }
        loadNotes(show_finished);
    }

    function editNote(id) {
         $(".input_title").val(notes[id].title);
         $(".input_desc").val(notes[id].desc);
        $(".input_importance").val(notes[id].importance);
        $(".input_due").val(notes[id].due);
    }

    function saveNote(param_id) {
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
        if(param_id!==0){
            notes_temp[param_id].title = title;
            notes_temp[param_id].desc = desc;
            notes_temp[param_id].importance = importance;
            notes_temp[param_id].due = due;
        }else {
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

    function checkNote(id){

        notes[id].checked = true;
        notes[id].checked_on = $.now();
        localStorage.setItem("notes", JSON.stringify(notes));
        loadNotes();
    }

    function getParams(name){
        let results = (name!==null? new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href):0);
        return (results!==null?results[1]: 0);
    };

});

//Form Validation / Datetimepiker + edit note-> timevalue / moment.js / sort/filter with moment.js
