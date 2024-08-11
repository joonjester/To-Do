package com.example.todo.Backend;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Todo implements TaskService {
    private  final  TaskRepo taskRepo;

    public Todo(TaskRepo taskRepo) {
        this.taskRepo = taskRepo;
    }

    @Override
    public TaskEntity createTask(TaskEntity task) {
        return taskRepo.save(task);
    }

    @Override
    public TaskEntity updateTask(TaskEntity task) {
        return taskRepo.save(task);
    }

    @Override
    public TaskEntity deleteTask(TaskEntity task) {
        taskRepo.delete(task);
        return task;
    }

    @Override
    public List<TaskEntity> getAllTasks() {
        return taskRepo.findAll();
    }

    @Override
    public TaskEntity completeTask(long id, boolean status) {
        TaskEntity task = taskRepo.findById(id);
        task.setStatus(status);
        return taskRepo.save(task);
    }

    @Override
    public boolean getStatusById(long id) {
        TaskEntity task = taskRepo.findById(id);
        return task.getStatus();
    }

    @Override
    public long getParentId(String parent_task) {
        return taskRepo.findIdByTask(parent_task);
    }
}
