class TaskUI {
    static taskForm() {
        return `
            <div class="card">
                <div class="card-header">
                    <h5 class="text-center">Add Task</h5>
                </div>
                <div class="card-body">
                    <form id="task-form">
                        <div class="form-group">
                            <input type="text" name="title" placeholder="Title" class="form-control" required>
                            <input type="text" name="description" placeholder="Description" class="form-control" required>
                            <select name="status" class="form-control" required>
                                <option value="" disabled selected>Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="in progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Save Task</button>
                    </form>
                </div>
            </div>
        `;
    }

    static async loadTasks() {
        const tasks = await TaskService.fetchTasks();
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'list-group-item';
            taskItem.innerHTML = `
                <p>Title: ${task.title}</p>
                <p>Description: ${task.description}</p>
                <span>Status: ${task.status}</span>
                <button class="btn btn-success btn-sm" onclick="TaskService.updateTask(${task.id}, 'completed')">Done</button>
                <button class="btn btn-danger btn-sm" onclick="TaskService.deleteTask(${task.id})">Delete</button>
            `;
            taskList.appendChild(taskItem);
        });
    }
}


class TaskService {
    static fetchTasks() {
        return fetch('/api/tasks', {
            headers: { 'Authorization': 'Bearer ' + AuthService.getToken() }
        }).then(response => response.json());
    }

    static deleteTask(taskId) {
        const token = localStorage.getItem('token');

        if (!token) {
            alert("You must be logged in to delete tasks.");
            return;
        }

        fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(response => {
            if (response.ok) {
                console.log("Task deleted successfully!");
                TaskUI.loadTasks();
            } else {
                alert("Error deleting task");
            }
        })
        .catch(error => console.error('Error deleting task:', error));
    }


    static updateTask(taskId) {
        const token = localStorage.getItem('token');

        if (!token) {
            alert("You must be logged in to update tasks.");
            return;
        }

        fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ status: "completed" })
        })
        .then(response => response.json())
        .then(updatedTask => {
            console.log("Task updated successfully:", updatedTask);
            TaskUI.loadTasks();
        })
        .catch(error => console.error('Error updating task:', error));
    }

}

function attachTaskFormListener() {
    const taskForm = document.getElementById('task-form');

    if (taskForm) {
        console.log("✅ Task form detected! Attaching submit event.");
        taskForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            console.log("Submit event detected! Form is being submitted.");

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You must be logged in to create tasks.');
                return;
            }

            try {
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                });

                const responseData = await response.json();
                console.log("API Response:", responseData);

                if (response.ok) {
                    alert('Task created successfully!');
                    TaskUI.loadTasks();
                } else {
                    console.error("Error creating task:", responseData);
                    alert("Error creating task. Check console for details.");
                }
            } catch (error) {
                console.error("Request failed:", error);
                alert("Request failed. Please check your connection.");
            }
        });
    }
}


const observer = new MutationObserver((mutations, obs) => {
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
        attachTaskFormListener();
        obs.disconnect();
    }
});


const taskSection = document.getElementById('task-section');
if (taskSection) {
    observer.observe(taskSection, { childList: true, subtree: true });
}


