package com.example.todo.Backend;

import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/task")
public class TodoController {
    private final TaskService taskService;

    public TodoController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/allTask")
    public List<TaskEntity> getAllTask() {
        return taskService.getAllTasks();
    }

    @PostMapping("/create")
    public TaskEntity createTask(@RequestBody TaskEntity task) {
        return taskService.createTask(task);
    }

    @PutMapping("/update")
    public TaskEntity updateTask(@RequestBody TaskEntity task) {
        return taskService.updateTask(task);
    }

    @PutMapping("/status")
    public TaskEntity updateTaskStatus(@RequestBody TaskEntity task) {
        return taskService.completeTask(task.getId(), task.getStatus());
    }

    @GetMapping("/curr_status")
    public boolean getTaskStatus(@RequestParam int id) {
        return taskService.getStatusById(id);
    }

    @DeleteMapping("/delete")
    public TaskEntity deleteTask(@RequestBody TaskEntity task) {
        return taskService.deleteTask(task);
    }

    @GetMapping("/parent_id")
    public Map<String, Long> getParentId(@RequestParam String parent_task) {
        long parentId = taskService.getParentId(parent_task);
        return Collections.singletonMap("number", parentId);
    }
}
