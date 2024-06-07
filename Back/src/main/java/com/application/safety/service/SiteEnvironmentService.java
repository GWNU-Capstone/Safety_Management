package com.application.safety.service;

import com.application.safety.dto.SiteEnvironmentDTO;
import com.application.safety.entity.SiteEnvironment;
import com.application.safety.repository.SiteEnvironmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class SiteEnvironmentService {
    private final SiteEnvironmentRepository siteEnvironmentRepository;

    // 환경 데이터 반환
    @Transactional(readOnly = true)
    public List<SiteEnvironmentDTO.Response> getEnvironmentData() {
        List<SiteEnvironment> recentData = siteEnvironmentRepository.findTop10ByOrderByDataIdDesc();

        // 데이터 순서 뒤집기
        Collections.reverse(recentData);

        return IntStream.range(0, recentData.size()).mapToObj(i -> {
            SiteEnvironment data = recentData.get(i);

            SiteEnvironmentDTO.Response response = new SiteEnvironmentDTO.Response();
            response.setDataOrder((long) (i + 1));

            SiteEnvironmentDTO.Response.Data dataNumber = new SiteEnvironmentDTO.Response.Data();
            dataNumber.setTemperature(data.getTemperature());
            dataNumber.setHumidity(data.getHumidity());
            dataNumber.setFineDust(data.getFineDust());
            dataNumber.setSunshine(data.getSunshine());

            response.setData(dataNumber);

            return response;
        }).collect(Collectors.toList());
    }

    // 환경 데이터 저장
    @Transactional
    public void addEnvironmentData(SiteEnvironmentDTO.Request dto) {
        SiteEnvironment siteEnvironment = new SiteEnvironment();

        LocalDate nowDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
        LocalTime nowTime = LocalTime.now(ZoneId.of("Asia/Seoul")).truncatedTo(ChronoUnit.SECONDS);

        siteEnvironment.setDate(nowDate);
        siteEnvironment.setTime(nowTime);
        siteEnvironment.setTemperature(dto.getTemperature());
        siteEnvironment.setHumidity(dto.getHumidity());
        siteEnvironment.setFineDust(dto.getFineDust());
        siteEnvironment.setSunshine(dto.getSunshine());

        siteEnvironmentRepository.save(siteEnvironment);
    }
}