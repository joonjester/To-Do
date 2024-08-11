package com.example.todo.Backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepo extends JpaRepository<TaskEntity, Integer> {
    TaskEntity findById(long id);

    @Query("SELECT i.id from TaskEntity i WHERE i.task LIKE %:task%")
    long findIdByTask(String task);
}
