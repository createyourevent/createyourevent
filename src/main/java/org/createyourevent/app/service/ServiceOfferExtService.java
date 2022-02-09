package org.createyourevent.app.service;

import org.createyourevent.app.domain.ServiceOffer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link ServiceOffer}.
 */
public interface ServiceOfferExtService {

    List<ServiceOffer> findByServiceMapsId(Long serviceMapId);
}
