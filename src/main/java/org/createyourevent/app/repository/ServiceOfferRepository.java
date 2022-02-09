package org.createyourevent.app.repository;

import org.createyourevent.app.domain.ServiceOffer;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ServiceOffer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceOfferRepository extends JpaRepository<ServiceOffer, Long> {}
