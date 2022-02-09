package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.Restaurant;
import org.createyourevent.app.repository.RestaurantRepository;
import org.createyourevent.app.service.RestaurantExtService;
import org.createyourevent.app.service.RestaurantService;
import org.createyourevent.app.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.createyourevent.app.domain.Restaurant}.
 */
@RestController
@RequestMapping("/api")
public class RestaurantExtResource {

    private final Logger log = LoggerFactory.getLogger(RestaurantExtResource.class);

    private static final String ENTITY_NAME = "restaurant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RestaurantExtService restaurantExtService;

    public RestaurantExtResource(RestaurantExtService restaurantExtService) {
        this.restaurantExtService = restaurantExtService;
    }

    @GetMapping("/restaurants/byUser/active")
    public List<Restaurant> getAllRestaurantsByUserAndActive() {
        log.debug("REST request to get a page of Restaurants");
        List<Restaurant> r = this.restaurantExtService.findByUserIsCurrentUserAndActive();
        return r;
    }

    @GetMapping("/restaurants/{id}/restaurantByOrganizationId")
    public Restaurant getRestaurantByOrganizationId(@PathVariable Long id) {
        log.debug("REST request to get Restaurant by organizationid: {}", id);
        Restaurant restaurant = restaurantExtService.findByOrganizationId(id);
        return restaurant;
    }

}
