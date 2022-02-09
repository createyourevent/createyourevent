package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.Chips;
import org.createyourevent.app.service.ChipsExtService;
import org.createyourevent.app.service.ChipsService;
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
 * REST controller for managing {@link org.createyourevent.domain.Chips}.
 */
@RestController
@RequestMapping("/api")
public class ChipsExtResource {

    private final Logger log = LoggerFactory.getLogger(ChipsExtResource.class);

    private static final String ENTITY_NAME = "chips";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChipsExtService chipsExtService;

    public ChipsExtResource(ChipsExtService chipsExtService) {
        this.chipsExtService = chipsExtService;
    }

    /**
     * {@code DELETE  /chips/:id} : delete the "id" chips.
     *
     * @param id the id of the chips to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chips/{id}/relation")
    public void deleteChipsRelationById(@PathVariable Long id) {
        log.debug("REST request to delete Chips : {}", id);
        chipsExtService.deleteChipsById(id);
    }
}
