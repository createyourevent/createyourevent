package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.ServiceStarRating;
import org.createyourevent.app.service.ServiceStarRatingExtService;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing {@link org.createyourevent.domain.ServiceStarRating}.
 */
@RestController
@RequestMapping("/api")
public class ServiceStarRatingExtResource {

    private final Logger log = LoggerFactory.getLogger(ServiceStarRatingExtResource.class);

    private static final String ENTITY_NAME = "serviceStarRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceStarRatingExtService serviceStarRatingExtService;

    public ServiceStarRatingExtResource(ServiceStarRatingExtService serviceStarRatingExtService) {
        this.serviceStarRatingExtService = serviceStarRatingExtService;
    }
    /**
     * {@code GET  /service-star-ratings} : get all the serviceStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of serviceStarRatings in body.
     */
    @GetMapping("/service-star-ratings/{serviceId}/findServiceStarRatingsByServiceId")
    public List<ServiceStarRating> findServiceStarRatingsByServiceId(@PathVariable Long serviceId) {
        log.debug("REST request to get a all of ServiceStarRatings by serviceid");
        List<ServiceStarRating> all = serviceStarRatingExtService.findByServiceId(serviceId);
        return all;
    }

        /**
     * {@code GET  /service-star-ratings} : get all the serviceStarRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of serviceStarRatings in body.
     */
    @GetMapping("/service-star-ratings/{serviceId}/{userId}/findServiceStarRatingsByServiceIdAndUserId")
    public ServiceStarRating findServiceStarRatingsByServiceIdAndUserId(@PathVariable Long serviceId, @PathVariable String userId) {
        log.debug("REST request to get a all of ServiceStarRatings by serviceid and userid");
        ServiceStarRating one = serviceStarRatingExtService.findByServiceIdAndUserId(serviceId, userId);
        return one;
    }
}
