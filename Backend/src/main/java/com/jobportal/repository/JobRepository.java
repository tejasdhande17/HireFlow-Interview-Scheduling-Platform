package com.jobportal.repository;

import com.jobportal.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findAllByDeletedFalse();
    Optional<Job> findByIdAndDeletedFalse(Long id);
    List<Job> findByHrIdAndDeletedFalse(Long hrId);
    List<Job> findByTitleContainingIgnoreCaseAndDeletedFalse(String title);
}
