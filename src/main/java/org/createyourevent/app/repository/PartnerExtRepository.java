package org.createyourevent.app.repository;

import java.util.List;

import org.createyourevent.app.domain.Partner;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Partner entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PartnerExtRepository extends JpaRepository<Partner, Long> {

    @Query("select partner from Partner partner where partner.active = true")
    List<Partner> findByActive();
}
