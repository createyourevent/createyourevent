package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.SlotListPlum;
import org.createyourevent.app.repository.SlotListPlumExtRepository;
import org.createyourevent.app.service.SlotListPlumExtService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.SlotListPlum}.
 */
@RestController
@RequestMapping("/api")
public class SlotListPlumExtResource {

    private final Logger log = LoggerFactory.getLogger(SlotListPlumExtResource.class);

    private static final String ENTITY_NAME = "slotListPlum";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SlotListPlumExtService slotListPlumExtService;

    private final SlotListPlumExtRepository slotListPlumExtRepository;

    public SlotListPlumExtResource(SlotListPlumExtService slotListPlumExtService, SlotListPlumExtRepository slotListPlumExtRepository) {
        this.slotListPlumExtService = slotListPlumExtService;
        this.slotListPlumExtRepository = slotListPlumExtRepository;
    }

    /**
     * {@code DELETE  /slot-list-plums/:id} : delete the "id" slotListPlum.
     *
     * @param id the id of the slotListPlum to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/slot-list-plums/deleteAll")
    public void deleteSlotListPlum() {
        log.debug("REST request to delete SlotListPlum : {}");
        slotListPlumExtService.deleteAll();
    }
}
