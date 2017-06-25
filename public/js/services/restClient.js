;(function (services,$) {
    const dataContent = 'dataType: "json",contentType: "application/json",';

    function addNote(title,desc,importance,due){
       $.ajax({
            dataContent,
            method: "POST",
            url: "/notes/add/",
            data: {title,desc,importance,due}
        });
    }

    function editNote(id,title,desc,importance,due){
        $.ajax({
            dataContent,
            method: "PUT",
            url: "/notes/edit/"+id,
            data: {title,desc,importance,due}
        });
    }

    function checkNote(id){
        $.ajax({
            dataContent,
            method: "PUT",
            url: "/notes/check/"+id
        });
    }

    function getNotes(noteSort, noteOrder, noteFilter){
      return $.ajax({
            dataContent,
            method: "GET",
            url: "/notes/",
            data: {noteSort,noteOrder,noteFilter}
        });
    }

    function getNoteById(id){
       return $.ajax({
            dataContent,
            method: "GET",
            url: "/notes/"+id
        });
    }

    services.restClient = {
        addNote : addNote,
        editNote : editNote,
        checkNote : checkNote,
        getAllNotes : getNotes,
        getNoteById : getNoteById
    };

}(window.services = window.services || { }, jQuery));


