package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.Partner;
import org.createyourevent.app.service.PartnerExtService;
import org.createyourevent.app.service.PartnerService;
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
 * REST controller for managing {@link org.createyourevent.domain.Partner}.
 */
@RestController
@RequestMapping("/api")
public class PartnerExtResource {

    private final Logger log = LoggerFactory.getLogger(PartnerExtResource.class);

    private static final String ENTITY_NAME = "partner";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PartnerExtService partnerExtService;

    public PartnerExtResource(PartnerExtService partnerExtService) {
        this.partnerExtService = partnerExtService;
    }


    /**
     * {@code GET  /partners} : get all the partners.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of partners in body.
     */
    @GetMapping("/partners/active")
    public List<Partner> getAllPartnersWhereActive() {
        log.debug("REST request to get a page of Partners");
        List<Partner> page = partnerExtService.findByPartnerActive();
        return page;
    }
}
