package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.SlotListCherry;
import org.createyourevent.app.repository.SlotListCherryExtRepository;
import org.createyourevent.app.repository.SlotListCherryRepository;
import org.createyourevent.app.service.SlotListCherryExtService;
import org.createyourevent.app.service.SlotListCherryService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.SlotListCherry}.
 */
@RestController
@RequestMapping("/api")
public class SlotListCherryExtResource {

    private final Logger log = LoggerFactory.getLogger(SlotListCherryExtResource.class);

    private static final String ENTITY_NAME = "slotListCherry";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SlotListCherryExtService slotListCherryExtService;

    private final SlotListCherryExtRepository slotListCherryExtRepository;

    public SlotListCherryExtResource(
        SlotListCherryExtService slotListCherryExtService,
        SlotListCherryExtRepository slotListCherryExtRepository
    ) {
        this.slotListCherryExtService = slotListCherryExtService;
        this.slotListCherryExtRepository = slotListCherryExtRepository;
    }

    /**
     * {@code DELETE  /slot-list-cherries/:id} : delete the "id" slotListCherry.
     *
     * @param id the id of the slotListCherry to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/slot-list-cherries/deleteAll")
    public void deleteSlotListCherry() {
        log.debug("REST request to deleteAll SlotListCherry : {}");
        slotListCherryExtService.deleteAll();
    }
}
