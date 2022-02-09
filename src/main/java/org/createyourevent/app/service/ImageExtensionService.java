package org.createyourevent.app.service;

import org.createyourevent.app.domain.Image;

import java.util.List;

/**
 * Service Interface for managing {@link Image}.
 */
public interface ImageExtensionService {

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
