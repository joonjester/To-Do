let domContentLoadedHandled = false;

document.addEventListener('DOMContentLoaded', async function() {
    if (domContentLoadedHandled) {
        return;
    }
    domContentLoadedHandled = true;

    fetch('http://localhost:8080/task/allTask', {
            method: 'GET',
        })
        .then (response => {
            if (!response.ok) {
               throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then (data => {
            data.forEach(dataset => {
                if (dataset.parent === 0) {
                    create_task(dataset, null);
                } else {
                    create_task(dataset, dataset.parent);
                }
            });
        })
        .catch (error => {
            console.error('There was a problem with the fetch operation:', error);
        })
});

document.getElementById('task_input').addEventListener('keydown', async function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let input_value = document.getElementById('task_input').value;
        let parent_id = null;

        if (check_for_parent(input_value)) {
            const end_symbol = input_value.search(":");
            parent_id = await link_parent(input_value, end_symbol);
            input_value = task_for_parent(input_value, end_symbol);
        }

        fetch('http://localhost:8080/task/create', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: false,
                parent: parent_id,
                task: input_value
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                create_task(data, parent_id)
            })
            .catch(error => {
                console.log('There was a problem with the fetch operation:', error);
            });
    }
})

function create_task(data, parent_id) {
    const li = document.createElement('li');
    let task_text = document.createElement('div');
    const button_layout = document.createElement('div');
    const create_sub_task = document.createElement('i');
    const del_icon = document.createElement('i');
    const edit_icon = document.createElement('i');
    const ul = document.createElement('ul');

    //ID for Sub-List of a Task
    ul.id = 'sub_task_id' + data.id;

    //Create List Element
    task_text.innerText = data.task;
    task_text.className = 'task_text';
    task_text.class = 'task';
    task_text.onclick = function () {
        toggle_task(data.id);
        this.classList.toggle('task')
    };

    create_sub_task.className = 'fa-regular fa-copy';
    create_sub_task.onclick = function () {
        document.getElementById('task_input').value = task_text.innerText + ': ';
        document.getElementById('task_input').focus();
    }

    //Create Button for Edit
    edit_icon.className = 'fa-regular fa-pen-to-square';
    edit_icon.onclick = function () {
        task_text.contentEditable = 'true';
        task_text.focus();

        task_text.addEventListener('keydown', async function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                let edit_input_value = task_text.innerText;
                edit_task(data.id, edit_input_value);
                task_text.contentEditable = 'false';
            }
        })
    }

    //Create Button for Delete
    del_icon.className = 'fa-regular fa-trash-can'
    del_icon.onclick = function () {
        delete_task(data.id);
        li.remove();
    }

    // Adding the element to the task
    button_layout.id = 'button_layout';
    button_layout.appendChild(create_sub_task);
    button_layout.appendChild(edit_icon);
    button_layout.appendChild(del_icon);
    li.appendChild(task_text);
    li.appendChild(button_layout);

    // Deciding which UL it goes to
    if (parent_id !== null) {
        document.getElementById('sub_task_id' + parent_id).appendChild(li);
    } else {
        document.getElementById('tasks_list').appendChild(li);
        document.getElementById('tasks_list').appendChild(ul);
    }
}

function toggle_task(id) {
    fetch('http://localhost:8080/task/curr_status?id='+id, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                update_status(id, false);
            } else {
                update_status(id, true);
                play_audio();
            }
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error);
        })
}

function update_status(id, status) {
    fetch('http://localhost:8080/task/status', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id : id,
            status: status
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error);
        })
}

function link_parent(text, end_symbol){
    let parent_task = text.substring(0, end_symbol);
    return fetch('http://localhost:8080/task/parent_id?parent_task='+ parent_task, {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data.number;
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error);
        })
}

function edit_task(id, task, parent) {
    fetch("http://localhost:8080/task/update", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            task: task,
            parent: parent
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error);
        })
}

function delete_task(id) {
    fetch("http://localhost:8080/task/delete", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error);
        })
}

function play_audio() {
    const audio = new Audio('pencil_fast_line.mp3');
    audio.play()
        .then(() => {
            // Audio playback started successfully
            console.log("Audio playback started successfully.");
        })
        .catch(error => {
            // Audio playback failed
            console.error("Error occurred during audio playback:", error);
        });
}

function check_for_parent(text){
    for (let char of text) {
        if (char === ":") {
            return true;
        }
    }
    return false;
}p

function task_for_parent(text, end_symbol) {
    return text.substring(end_symbol + 2);
}
