package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.CreateYourEventService;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the CreateYourEventService entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CreateYourEventServiceRepository extends JpaRepository<CreateYourEventService, Long> {
    @Query(
        "select createYourEventService from CreateYourEventService createYourEventService where createYourEventService.user.login = ?#{principal.preferredUsername}"
    )
    List<CreateYourEventService> findByUserIsCurrentUser();
}
