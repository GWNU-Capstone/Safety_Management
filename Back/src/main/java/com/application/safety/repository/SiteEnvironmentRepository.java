package com.application.safety.repository;

import com.application.safety.entity.SiteEnvironment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteEnvironmentRepository extends JpaRepository<SiteEnvironment, Long> {
    List<SiteEnvironment> findTop10ByOrderByDataIdDesc();
}