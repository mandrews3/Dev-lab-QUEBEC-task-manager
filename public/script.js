const apiUrl = '/api/notes';


function fetchNotes() {
    $.get(apiUrl, function (notes) {
        $('#notesList').empty();
        notes.forEach(note => appendNoteToDOM(note));
    });
}


function appendNoteToDOM(note) {
    const formattedDate = new Date(note.date).toLocaleString();
    $('#notesList').append(`
        <div class="col-md-4 mb-3" id="note-${note._id}">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${note.title}</h5>
                    <p class="card-text">${note.content}</p>
                    <p class="text-muted note-date" style="font-size:0.8em;">${formattedDate}</p>
                    <button class="btn btn-sm btn-warning" onclick="editNote('${note._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteNote('${note._id}')">Delete</button>
                </div>
            </div>
        </div>
    `);
}


$('#addNote').click(() => {
    const note = {
        title: $('#title').val(),
        content: $('#content').val(),
        date: $('#noteDate').val() || undefined
    };

    if (!note.title || !note.content) {
        alert('Please enter a title and content!');
        return;
    }

    $.post(apiUrl, note, function (savedNote) {
        $('#title').val('');
        $('#content').val('');
        $('#noteDate').val('');
        appendNoteToDOM(savedNote);
    });
});


function editNote(id) {
    const noteCard = $(`#note-${id}`);
    const currentTitle = noteCard.find('.card-title').text();
    const currentContent = noteCard.find('.card-text').text();
    const currentDateText = noteCard.find('.note-date').text();
    const currentDate = new Date(currentDateText).toISOString().split('T')[0]; // format YYYY-MM-DD

    const newTitle = prompt('New title:', currentTitle);
    const newContent = prompt('New content:', currentContent);
    const newDate = prompt('New date (YYYY-MM-DD):', currentDate);

    if (newTitle && newContent) {
        $.ajax({
            url: `${apiUrl}/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ title: newTitle, content: newContent, date: newDate }),
            success: function (updatedNote) {
                appendUpdatedNoteToDOM(updatedNote);
            }
        });
    }
}


function appendUpdatedNoteToDOM(updatedNote) {
    const formattedDate = new Date(updatedNote.date).toLocaleString();
    $(`#note-${updatedNote._id}`).replaceWith(`
        <div class="col-md-4 mb-3" id="note-${updatedNote._id}">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${updatedNote.title}</h5>
                    <p class="card-text">${updatedNote.content}</p>
                    <p class="text-muted note-date" style="font-size:0.8em;">${formattedDate}</p>
                    <button class="btn btn-sm btn-warning" onclick="editNote('${updatedNote._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteNote('${updatedNote._id}')">Delete</button>
                </div>
            </div>
        </div>
    `);
}


function deleteNote(id) {
    $.ajax({
        url: `${apiUrl}/${id}`,
        type: 'DELETE',
        success: function () {
            $(`#note-${id}`).remove();
        }
    });
}


fetchNotes();

