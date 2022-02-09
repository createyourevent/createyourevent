package org.createyourevent.app.service.impl;

import java.util.Optional;
import org.createyourevent.app.domain.Restaurant;
import org.createyourevent.app.repository.RestaurantRepository;
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
public class RestaurantServiceImpl implements RestaurantService {

    private final Logger log = LoggerFactory.getLogger(RestaurantServiceImpl.class);

    private final RestaurantRepository restaurantRepository;

    public RestaurantServiceImpl(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    @Override
    public Restaurant save(Restaurant restaurant) {
        log.debug("Request to save Restaurant : {}", restaurant);
        return restaurantRepository.save(restaurant);
    }

    @Override
    public Optional<Restaurant> partialUpdate(Restaurant restaurant) {
        log.debug("Request to partially update Restaurant : {}", restaurant);

        return restaurantRepository
            .findById(restaurant.getId())
            .map(existingRestaurant -> {
                if (restaurant.getMenu() != null) {
                    existingRestaurant.setMenu(restaurant.getMenu());
                }

                return existingRestaurant;
            })
            .map(restaurantRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Restaurant> findAll(Pageable pageable) {
        log.debug("Request to get all Restaurants");
        return restaurantRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Restaurant> findOne(Long id) {
        log.debug("Request to get Restaurant : {}", id);
        return restaurantRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Restaurant : {}", id);
        restaurantRepository.deleteById(id);
    }
}
