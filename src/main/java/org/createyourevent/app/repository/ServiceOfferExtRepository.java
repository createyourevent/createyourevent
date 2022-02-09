package org.createyourevent.app.repository;

import java.util.List;

import org.createyourevent.app.domain.ServiceOffer;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ServiceOffer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceOfferExtRepository extends JpaRepository<ServiceOffer, Long> {

    List<ServiceOffer> findByServiceMapsId(Long serviceMapId);
}
