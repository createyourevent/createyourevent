package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.ServiceMap;
import org.createyourevent.app.service.ServiceMapExtService;
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
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.createyourevent.domain.ServiceMap}.
 */
@RestController
@RequestMapping("/api")
public class ServiceMapExtResource {

    private final Logger log = LoggerFactory.getLogger(ServiceMapResource.class);

    private static final String ENTITY_NAME = "serviceMap";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceMapExtService serviceMapExtService;

    public ServiceMapExtResource(ServiceMapExtService serviceMapExtService) {
        this.serviceMapExtService = serviceMapExtService;
    }

    /**
     * {@code GET  /service-maps} : get all the serviceMaps.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of serviceMaps in body.
     */
    @GetMapping("/service-maps/byServiceId/{serviceId}")
    public List<ServiceMap> findByCreateYourEventServiceId(@PathVariable Long serviceId) {
        log.debug("List<ServiceMap> findByCreateYourEventServiceId(@PathVariable Long serviceId)");
        List<ServiceMap> maps = serviceMapExtService.findByCreateYourEventServiceId(serviceId);
        return maps;
    }

}
