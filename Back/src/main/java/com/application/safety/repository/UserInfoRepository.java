package com.application.safety.repository;

import com.application.safety.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Integer> {

}
