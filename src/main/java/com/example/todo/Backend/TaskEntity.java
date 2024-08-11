package com.example.todo.Backend;

import jakarta.persistence.*;

@Entity
@Table(name="task")
public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "status")
    private boolean status;

    @Column(name = "task")
    private String task;

    @Column(name = "parent")
    private long parent;

    public long getId() {
        return id;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public boolean getStatus() {
        return status;
    }

    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
    }

    public void setParent(long parent) {
        this.parent = parent;
    }

    public long getParent() {
        return parent;
    }
}
