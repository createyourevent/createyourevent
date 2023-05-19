package org.createyourevent.app.repository;

import java.util.List;
import org.createyourevent.app.domain.Tags;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Tags entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TagsExtRepository extends JpaRepository<Tags, Long> {
    void deleteByProductId(Long productId);
    void deleteByEventId(Long eventId);
    void deleteByShopId(Long shopId);
    void deleteByServiceId(Long serviceId);
    void deleteByOrganizationId(Long organizationId);

    List<Tags> findByProductId(Long productId);
    List<Tags> findByEventId(Long eventId);
    List<Tags> findByShopId(Long shopId);
    List<Tags> findByServiceId(Long serviceId);
    List<Tags> findByOrganizationId(Long organizationId);

    @Query(
        "select t from Tags t where t.product.active = true or t.event.active = true or t.shop.active = true or t.service.active = true or t.organization.active = true"
    )
    List<Tags> findAllWithActiveTrue();

    @Query(nativeQuery = true, value = "SELECT * FROM createyourevent.tags ORDER BY RAND() LIMIT 50")
    List<Tags> find50Item();

    @Query(nativeQuery = true, value = "SELECT * FROM createyourevent.tags t WHERE t.event_id > '' ORDER BY RAND()")
    List<Tags> find50EventItem();
}
