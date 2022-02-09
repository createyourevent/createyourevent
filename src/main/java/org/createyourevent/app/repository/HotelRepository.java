package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Hotel;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Hotel entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    @Query("select hotel from Hotel hotel where hotel.user.login = ?#{principal.preferredUsername}")
    List<Hotel> findByUserIsCurrentUser();
}
