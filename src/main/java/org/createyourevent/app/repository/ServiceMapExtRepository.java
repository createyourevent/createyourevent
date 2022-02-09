package org.createyourevent.app.repository;

import java.util.List;

import org.createyourevent.app.domain.ServiceMap;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ServiceMap entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceMapExtRepository extends JpaRepository<ServiceMap, Long> {

    @Query("select distinct sm from ServiceMap sm left join fetch sm.rideCost left join fetch sm.createYourEventService left join fetch sm.serviceOffers where sm.createYourEventService.id = :id")
    List<ServiceMap> findByCreateYourEventServiceId(@Param("id") Long serviceId);

}
