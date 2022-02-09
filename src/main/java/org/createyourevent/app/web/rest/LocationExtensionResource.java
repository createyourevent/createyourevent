package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.Location;
import org.createyourevent.app.service.LocationExtensionService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;


/**
 * REST controller for managing {@link org.createyourevent.domain.Location}.
 */
@RestController
@RequestMapping("/api")
public class LocationExtensionResource {

    private final Logger log = LoggerFactory.getLogger(LocationResource.class);


    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LocationExtensionService locationExtensionService;

    public LocationExtensionResource(LocationExtensionService locationExtensionService) {
        this.locationExtensionService = locationExtensionService;
    }

    @GetMapping("/locations/{id}/findByEventId")
    public Location getLocation(@PathVariable Long id) {
        log.debug("REST request to get Location : {}", id);
        Location location = locationExtensionService.findByEventId(id);
        return location;
    }
}
