package com.application.safety.repository;

import com.application.safety.entity.SiteEnvironment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SiteEnvironmentRepository extends JpaRepository<SiteEnvironment, Long> {
    @Query("SELECT AVG(se.temperature) FROM SiteEnvironment se WHERE se.date = :date")
    Optional<Double> findAverageTemperatureByDate(@Param("date") LocalDate date);

    @Query("SELECT AVG(se.humidity) FROM SiteEnvironment se WHERE se.date = :date")
    Optional<Double> findAverageHumidityByDate(@Param("date") LocalDate date);

    @Query("SELECT AVG(se.fineDust) FROM SiteEnvironment se WHERE se.date = :date")
    Optional<Double> findAverageFineDustByDate(@Param("date") LocalDate date);

    @Query("SELECT AVG(se.sunshine) FROM SiteEnvironment se WHERE se.date = :date")
    Optional<Double> findAverageSunshineByDate(@Param("date") LocalDate date);
    List<SiteEnvironment> findTop10ByOrderByDataIdDesc();
}