package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.Property;
import org.createyourevent.app.service.PropertyExtService;
import org.createyourevent.app.service.PropertyService;
import org.createyourevent.app.web.rest.errors.BadRequestAlertException;

import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.createyourevent.domain.Property}.
 */
@RestController
@RequestMapping("/api")
public class PropertyExtResource {

    private final Logger log = LoggerFactory.getLogger(PropertyExtResource.class);

    private static final String ENTITY_NAME = "property";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PropertyExtService propertyExtService;
    private final PropertyService propertyService;

    public PropertyExtResource(PropertyExtService propertyExtService, PropertyService propertyService) {
        this.propertyExtService = propertyExtService;
        this.propertyService = propertyService;
    }


    @GetMapping("/properties/key/{key}")
    public Property getProperty(@PathVariable String key) {
        log.debug("REST request to get Property by key : {}", key);
        Property property = propertyExtService.findByKey(key);
        if(property == null) {
            property = new Property();
            property.key(key);
            property = this.propertyService.save(property);
        }
        return property;
    }

}
