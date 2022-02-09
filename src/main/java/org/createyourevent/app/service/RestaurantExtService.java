package org.createyourevent.app.service;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Restaurant}.
 */
public interface RestaurantExtService {
    List<Restaurant> findByUserIsCurrentUserAndActive();
    Restaurant findByOrganizationId(Long id);
}
