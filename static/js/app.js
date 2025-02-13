class AppUI {
    static showTasks() {
        const authSection = document.getElementById('auth-section');
        const taskSection = document.getElementById('task-section');
        const taskFormCard = document.getElementById('task-form-card');

        if (!taskSection) {
            console.error("Error: 'task-section' no encontrado en el DOM.");
            return;
        }

        authSection.style.display = 'none';
        taskSection.style.display = 'block';

        console.log("Sección de tareas mostrada");

        if (taskFormCard.innerHTML.trim() === '') {
            taskFormCard.innerHTML = TaskUI.taskForm();
        }

        TaskUI.loadTasks();
    }
}


