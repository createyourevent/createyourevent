package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.CreateYourEventService;
import org.createyourevent.app.domain.ServiceMap;
import org.createyourevent.app.service.CreateYourEventServiceExtService;
import org.createyourevent.app.service.CreateYourEventServiceService;
import org.createyourevent.app.service.ServiceMapService;
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

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.createyourevent.domain.CreateYourEventService}.
 */
@RestController
@RequestMapping("/api")
public class CreateYourEventServiceExtResource {

    private final Logger log = LoggerFactory.getLogger(CreateYourEventServiceExtResource.class);

    private static final String ENTITY_NAME = "createYourEventService";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CreateYourEventServiceExtService createYourEventServiceExtService;

    private final ServiceMapService serviceMapService;

    public CreateYourEventServiceExtResource(CreateYourEventServiceExtService createYourEventServiceExtService, ServiceMapService serviceMapService) {
        this.createYourEventServiceExtService = createYourEventServiceExtService;
        this.serviceMapService = serviceMapService;
    }


    @GetMapping("/create-your-event-services/user/active/{userId}")
    public List<CreateYourEventService> getServicesFromUserAndActive(@PathVariable String userId) {
        log.debug("REST request to get Services from user and active");
        List<CreateYourEventService> services = this.createYourEventServiceExtService.findByUserIdAndActiveTrue(userId);
        return services;
    }

    @GetMapping("/create-your-event-services/active")
    public List<CreateYourEventService> getServicesWhereActive() {
        log.debug("REST request to get Services from activev = true");
        List<CreateYourEventService> services = this.createYourEventServiceExtService.findByActiveTrue();
        return services;
    }

    @GetMapping("/create-your-event-services/active/activeOwner")
    public List<CreateYourEventService> getServicesWhereActiveAndActiveOwner() {
        log.debug("REST request to get Services from activev = true and activeOwner = true");
        List<CreateYourEventService> services = this.createYourEventServiceExtService.findByActiveTrue();
        return services;
    }

        @GetMapping("/create-your-event-services/active/serviceMap/{serviceMapId}")
        public List<CreateYourEventService> getServicesWhereActiveAndActiveOwnerAndServiceMapId(@PathVariable Long serviceMapId) {
            log.debug("REST request to get Services from activev = true and activeOwner = true");
            ServiceMap sm = this.serviceMapService.findOne(serviceMapId).get();
            List<CreateYourEventService> services = this.createYourEventServiceExtService.findByActiveTrueAndActiveOwnerTrueAndServiceMaps(sm);
            return services;
    }

}
