package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.ServiceOffer;
import org.createyourevent.app.service.ServiceOfferExtService;
import org.createyourevent.app.service.ServiceOfferService;
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
 * REST controller for managing {@link org.createyourevent.domain.ServiceOffer}.
 */
@RestController
@RequestMapping("/api")
public class ServiceOfferExtResource {

    private final Logger log = LoggerFactory.getLogger(ServiceOfferResource.class);

    private static final String ENTITY_NAME = "serviceOffer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceOfferExtService serviceOfferExtService;

    public ServiceOfferExtResource(ServiceOfferExtService serviceOfferExtService) {
        this.serviceOfferExtService = serviceOfferExtService;
    }

    /**
     * {@code GET  /service-offers} : get all the serviceOffers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of serviceOffers in body.
     */
    @GetMapping("/service-offers/byServiceMapId/{serviceMapId}")
    public List<ServiceOffer> getAllServiceOffersByServiceMapId(@PathVariable Long serviceMapId) {
        log.debug("REST request to get a page of ServiceOffers by serviceMapId");
        List<ServiceOffer> offers = this.serviceOfferExtService.findByServiceMapsId(serviceMapId);
        return offers;
    }
}
