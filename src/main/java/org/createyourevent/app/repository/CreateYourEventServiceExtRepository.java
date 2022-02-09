package org.createyourevent.app.repository;

import java.util.List;

import org.createyourevent.app.domain.CreateYourEventService;
import org.createyourevent.app.domain.ServiceMap;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the CreateYourEventService entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CreateYourEventServiceExtRepository extends JpaRepository<CreateYourEventService, Long> {
    List<CreateYourEventService> findByUserIdAndActiveTrue(String userId);
    List<CreateYourEventService> findByActiveTrue();
    List<CreateYourEventService> findByActiveTrueAndActiveOwnerTrue();
    List<CreateYourEventService> findByActiveTrueAndActiveOwnerTrueAndServiceMaps(ServiceMap serviceMap);
}
