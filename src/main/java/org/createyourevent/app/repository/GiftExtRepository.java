package org.createyourevent.app.repository;

import org.createyourevent.app.domain.Gift;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Gift entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GiftExtRepository extends JpaRepository<Gift, Long> {


    List<Gift> findByActiveTrue();
}
