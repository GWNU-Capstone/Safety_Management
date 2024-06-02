package com.application.safety.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "SITE_ENVIRONMENT")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiteEnvironment {
    @Id
    @Column(name = "DATA_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dataId;

    @Column(name = "DATE")
    private LocalDate date;

    @Column(name = "TIME")
    private LocalTime time;

    @Column(name = "TEMPERATURE")
    private float temperature;

    @Column(name = "HUMIDITY")
    private float humidity;

    @Column(name = "FINE_DUST")
    private float fineDust;

    @Column(name = "SUNSHINE")
    private float sunshine;
}