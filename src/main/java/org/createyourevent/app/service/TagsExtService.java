package org.createyourevent.app.service;

import org.createyourevent.app.domain.Tags;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Tags}.
 */
public interface TagsExtService {

    void deleteByProductId(Long productId);
    void deleteByEventId(Long eventId);
    void deleteByShopId(Long shopId);
    void deleteByCreateYourEventServiceId(Long serviceId);
    void deleteByOrganizationId(Long organizationId);

    List<Tags> findByProductId(Long productId);
    List<Tags> findByEventId(Long eventId);
    List<Tags> findByShopId(Long shopId);
    List<Tags> findByServiceId(Long serviceId);
    List<Tags> findByOrganizationId(Long organizationId);

    List<Tags> findAll();
    List<Tags> findAllTagsWithActiveTrue();
    List<Tags> find50Item();
    List<Tags> find50EventItem();
}
