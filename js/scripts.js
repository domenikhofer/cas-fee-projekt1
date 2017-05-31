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
        const template = $("#note_template").html();
        const comp_template = Handlebars.compile(template);

        if (notes !== null) {
            $("#notes_cont").html("");
            notes.forEach(note => {

                const note_content = comp_template({
                    note_id:note.id,
                    note_due:moment(note.due).fromNow(),
                    note_title:note.title,
                    note_importance:"!".repeat(note.importance),
                    note_checked: (note.checked===true?"checked disabled":""),
                    note_checked_on: (note.checked===true?"("+moment(note.checked_on).fromNow()+")":""),
                    note_desc:note.desc
                });

                if (note.checked === false) {
                    $("#notes_cont").append(note_content)
                } else if (finished === true && note.checked === true) {
                    $("#notes_cont").append(note_content);
                }
            })
        }

    }

    function sortNotes(id, order) {

        if (order === "asc") {
            notes.sort((a, b) => {
            if(typeof(a[id])==="string"){
              return a[id].localeCompare(b[id]);
            }else {
             return   a[id] - b[id]
            }
            });
        } else {
            notes.sort((a, b) => {
                if(typeof(a[id])==="string"){
                    return b[id].localeCompare(a[id]);
                }else {
                    return   b[id] - a[id]
                }
            });
        }
        loadNotes(show_finished);
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
        const due = $(".input_due_Y").val()+"-"+pad($(".input_due_M").val())+"-"+pad($(".input_due_D").val())+"T"+pad($(".input_due_h").val())+":"+pad($(".input_due_m").val());
        const checked = false;
        const checked_on = false;
        const created = moment();

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

    function pad(n) {
        var n2 = n.split("");
        return (n < 10&&n2.length===1) ? ("0" + n) : n;
    }

});

//Form Validation  / irgendwann / slide down rest of note if too long
