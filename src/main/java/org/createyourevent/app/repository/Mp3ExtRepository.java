package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Mp3;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Mp3 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Mp3ExtRepository extends JpaRepository<Mp3, Long> {
    @Query("select mp3 from Mp3 mp3 where mp3.user.login = ?#{principal.preferredUsername}")
    List<Mp3> findByUserIsCurrentUser();

    @Query("select mp3 from Mp3 mp3 where mp3.user.id = :userId and mp3.service.id = :serviceId")
    List<Mp3> findByUserAndService(@Param("userId")String userId, @Param("serviceId")Long serviceId);

    @Query("select mp3 from Mp3 mp3 where mp3.service.id = :serviceId")
    List<Mp3> findByService(@Param("serviceId")Long serviceId);

    @Query("select mp3 from Mp3 mp3 where mp3.event.id = :eventId")
    List<Mp3> findByEvent(@Param("eventId")Long eventId);

    @Query("select mp3 from Mp3 mp3 where mp3.user.id = :userId and mp3.event.id = :eventId")
    List<Mp3> findByUserAndEvent(@Param("userId")String userId, @Param("eventId")Long eventId);

    @Query("select mp3 from Mp3 mp3 where mp3.shop.id = :shopId")
    List<Mp3> findByShop(@Param("shopId")Long shopId);

    @Query("select mp3 from Mp3 mp3 where mp3.user.id = :userId and mp3.shop.id = :shopId")
    List<Mp3> findByShopAndUser(@Param("userId")String userId, @Param("shopId")Long shopId);

    @Query("select mp3 from Mp3 mp3 where mp3.user.id = :userId and mp3.product.id = :productId")
    List<Mp3> findByUserAndProduct(@Param("userId")String userId, @Param("productId")Long productId);

    @Query("select mp3 from Mp3 mp3 where mp3.product.id = :productId")
    List<Mp3> findByProduct(@Param("productId")Long productId);

}
