package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Shop;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Shop entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    @Query("select shop from Shop shop where shop.user.login = ?#{principal.preferredUsername}")
    List<Shop> findByUserIsCurrentUser();
}
