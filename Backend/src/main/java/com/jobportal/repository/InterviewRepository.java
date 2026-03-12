package com.jobportal.repository;

import com.jobportal.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByHrIdAndDeletedFalse(Long hrId);
    List<Interview> findByApplicationStudentIdAndDeletedFalse(Long studentId);
    Optional<Interview> findByIdAndDeletedFalse(Long id);

    @org.springframework.data.jpa.repository.Query("SELECT i FROM Interview i WHERE i.hr.id = :hrId AND LOWER(i.application.student.name) LIKE LOWER(CONCAT('%', :candidateName, '%')) AND i.mode LIKE CONCAT('%', :mode, '%') AND i.result LIKE CONCAT('%', :status, '%') AND i.deleted = false")
    List<Interview> findByHrIdAndFilters(@org.springframework.data.repository.query.Param("hrId") Long hrId, @org.springframework.data.repository.query.Param("candidateName") String candidateName, @org.springframework.data.repository.query.Param("mode") String mode, @org.springframework.data.repository.query.Param("status") String status);
}
