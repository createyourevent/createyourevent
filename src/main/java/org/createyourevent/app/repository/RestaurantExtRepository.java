package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Restaurant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Restaurant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RestaurantExtRepository extends JpaRepository<Restaurant, Long> {
    @Query("select restaurant from Restaurant restaurant where restaurant.user.login = ?#{principal.preferredUsername} and restaurant.organization.active = true")
    List<Restaurant> findByUserIsCurrentUserAndActive();

    Restaurant findByOrganizationId(Long id);
}
