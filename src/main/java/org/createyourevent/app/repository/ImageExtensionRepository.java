package org.createyourevent.app.repository;

import org.createyourevent.app.domain.Image;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Image entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ImageExtensionRepository extends JpaRepository<Image, Long> {

    List<Image> findAllByProductId(Long productId);
    List<Image> findAllByProductIdAndUserId(Long productId, String userId);

    List<Image> findAllByShopId(Long shopId);
    List<Image> findAllByShopIdAndUserId(Long shopId, String userId);

    List<Image> findAllByEventId(Long eventId);
    List<Image> findAllByEventIdAndUserId(Long eventId, String userId);

    List<Image> findAllByServiceId(Long serviceId);
    List<Image> findAllByServiceIdAndUserId(Long serviceId, String userId);

    List<Image> findAllByOrganizationId(Long organizationId);
    List<Image> findAllByOrganizationIdAndUserId(Long organizationId, String userId);
}
