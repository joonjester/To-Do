package com.example.todo.Backend;

import java.util.List;

public interface TaskService {
    TaskEntity createTask(TaskEntity task);

    TaskEntity updateTask(TaskEntity task);

    TaskEntity deleteTask(TaskEntity task);

    List<TaskEntity> getAllTasks();

    boolean getStatusById(long id);

    TaskEntity completeTask(long id, boolean status);

    long getParentId(String parent_task);
}
