
document.getElementById('submit_task').onclick = async function () {
    let input_value = document.getElementById('task_input').value;
    let parent_id = null;

    if (check_for_parent(input_value)) {
        let end_symbol = input_value.search("<");
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
            let li = document.createElement('li');
            let button = document.createElement('button');
            let edit_button = document.createElement('button');

            //Create List Element
            li.innerText = data.task;
            li.class = 'task';
            li.onclick = function() {
                toggleTask(data.id);
            };
            //Potentionally redundant
            li.addEventListener('click', function() {
                this.classList.toggle('task')
            });

            //Create Button for Delete
            button.innerText = 'del';
            button.onclick = function() {
                delete_task(data.id);
                li.remove();
            }

            //Create Button for Edit
            edit_button.innerText = 'edit';
            edit_button.onclick = function() {
                edit_task(data.id, input_value, parent_id);
            }

            li.appendChild(button);
            li.appendChild(edit_button);
            document.getElementById('tasks_list').appendChild(li);
        })
        .catch(error => {
            console.log('There was a problem with the fetch operation:', error);
        });
}


function toggleTask(id) {
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

function play_audio() {
    const audio = new Audio('pencil_fast_line.mp3');
    audio.play()
}

function check_for_parent(text){
    let first_char = Array.from(text)[0];
    return first_char === ">";
}
function task_for_parent(text, end_symbol) {
    return text.substring(end_symbol + 2);
}

function link_parent(text, end_symbol){
    let parent_task = text.substring(1, end_symbol);
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
        methode: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            id: id,
            task: task,
            parent: parent
        }
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
    fetch("http://localhost:8080/task/update", {
        methode: 'DEL',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            id: id
        }
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

