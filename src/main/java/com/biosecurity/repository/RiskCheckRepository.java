package com.biosecurity.repository;

import com.biosecurity.entity.RiskCheck;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiskCheckRepository extends JpaRepository<RiskCheck, Long> {
}
