package com.jobportal.repository;

import com.jobportal.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentIdAndDeletedFalse(Long studentId);

    Optional<Application> findByIdAndDeletedFalse(Long id);

    boolean existsByStudentIdAndJobIdAndDeletedFalse(Long studentId, Long jobId);

    List<Application> findByJobHrIdAndDeletedFalse(Long hrId);

    @Query("SELECT a FROM Application a WHERE a.job.hr.id = :hrId AND LOWER(a.student.name) LIKE LOWER(CONCAT('%', :studentName, '%')) AND LOWER(a.job.title) LIKE LOWER(CONCAT('%', :jobTitle, '%')) AND a.status LIKE CONCAT('%', :status, '%') AND a.deleted = false")
    List<Application> findByHrIdAndFilters(@Param("hrId") Long hrId, @Param("studentName") String studentName, @Param("jobTitle") String jobTitle, @Param("status") String status);

}