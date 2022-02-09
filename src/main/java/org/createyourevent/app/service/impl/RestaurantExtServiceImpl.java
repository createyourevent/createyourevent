package org.createyourevent.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.createyourevent.app.domain.Restaurant;
import org.createyourevent.app.repository.RestaurantExtRepository;
import org.createyourevent.app.repository.RestaurantRepository;
import org.createyourevent.app.service.RestaurantExtService;
import org.createyourevent.app.service.RestaurantService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Restaurant}.
 */
@Service
@Transactional
public class RestaurantExtServiceImpl implements RestaurantExtService {

    private final Logger log = LoggerFactory.getLogger(RestaurantExtServiceImpl.class);

    private final RestaurantExtRepository restaurantExtRepository;

    public RestaurantExtServiceImpl(RestaurantExtRepository restaurantExtRepository) {
        this.restaurantExtRepository = restaurantExtRepository;
    }

    @Override
    public List<Restaurant> findByUserIsCurrentUserAndActive() {
        return this.restaurantExtRepository.findByUserIsCurrentUserAndActive();
    }

    @Override
    public Restaurant findByOrganizationId(Long id) {
        return this.restaurantExtRepository.findByOrganizationId(id);
    }

}
