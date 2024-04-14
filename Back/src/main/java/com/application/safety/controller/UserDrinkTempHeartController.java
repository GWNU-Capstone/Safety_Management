package com.application.safety.controller;

import com.application.safety.dto.UserDataDTO;
import com.application.safety.entity.UserData;
import com.application.safety.repository.UserDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserDrinkTempHeartController {

    private final UserDataRepository userDataRepository;
    private final WebClient webClient;


    // 알코올 데이터 요청
    @GetMapping("/user/drink")
    public UserDataDTO getUserDrink() {

        return webClient.get()
                        .uri("/drink")
                        .retrieve()
                        .bodyToMono(UserDataDTO.class)
                        .timeout(Duration.ofSeconds(5))
                        .block();

//        int user_no = DTO != null ? DTO.getUserNo() : 0;
//
//        UserData userData = userDataRepository.findById(user_no).orElseThrow();
//
//        Float userDrink = userData.getUserDrink();
//
//        return ResponseEntity.ok().body(userDrink);

    }


    // 체온, 심박수 요청
    @GetMapping("/user/tempheart")
    public UserDataDTO getUserTempHeart() {

        return webClient.get()
                        .uri("/tempheart")
                        .retrieve()
                        .bodyToMono(UserDataDTO.class)
                        .timeout(Duration.ofSeconds(5))
                        .block();

//        int user_no = DTO != null ? DTO.getUserNo() : 0;
//
//        UserData userData = userDataRepository.findById(user_no).orElseThrow();
//
//        UserDataDTO userDataDTO = new UserDataDTO();
//        userDataDTO.setUserTemp((float)userData.getUserTemp());
//        userDataDTO.setUserHeartRate((int) userData.getUserHeartRate());
//
//        Map<String, Object> responseData = new HashMap<>();
//
//        responseData.put("userData", userDataDTO);
//
//        return ResponseEntity.ok().body(responseData);
    }
}
