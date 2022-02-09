package org.createyourevent.app.web.rest;

import org.createyourevent.app.domain.ChipsCollectionChips;
import org.createyourevent.app.security.AuthoritiesConstants;
import org.createyourevent.app.service.ChipsCollectionChipsExtService;
import org.createyourevent.app.service.ChipsCollectionChipsService;
import org.createyourevent.app.web.rest.errors.BadRequestAlertException;

import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.createyourevent.domain.ChipsCollectionChips}.
 */
@RestController
@RequestMapping("/api")
public class ChipsCollectionChipsExtResource {

    private final Logger log = LoggerFactory.getLogger(ChipsCollectionChipsExtResource.class);

    private static final String ENTITY_NAME = "chipsCollectionChips";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChipsCollectionChipsExtService chipsCollectionChipsExtService;

    public ChipsCollectionChipsExtResource(ChipsCollectionChipsExtService chipsCollectionChipsExtService) {
        this.chipsCollectionChipsExtService = chipsCollectionChipsExtService;
    }


    @GetMapping("/chips-collection-chips/{id}/findAllChipsCollectionChipsByChipsCollectionId")
    public List<ChipsCollectionChips> findAllChipsCollectionChipsByChipsCollectionId(@PathVariable Long id) {
        log.debug("REST findAllChipsCollectionChipsByChipsCollectionId");
        List<ChipsCollectionChips> chipsCollectionChips = chipsCollectionChipsExtService.findAllByChipsCollectionId(id);
        return chipsCollectionChips;
    }

    @GetMapping("/chips-collection-chips/{collectionId}/{chipsId}/findOneChipsCollectionChipsByChipsCollectionIdAndChipsId")
    public ChipsCollectionChips findOneChipsCollectionChipsByChipsCollectionIdAndChipsId(@PathVariable Long collectionId, @PathVariable Long chipsId) {
        log.debug("REST findOneChipsCollectionChipsByChipsCollectionIdAndChipsId");
        ChipsCollectionChips chipsCollectionChip = chipsCollectionChipsExtService.findOneByChipsCollectionIdAndChipsId(collectionId, chipsId);
        return chipsCollectionChip;
    }


    @Modifying
    @DeleteMapping("/chips-collection-chips/deleteAllChipsCollectionChips")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public void deleteAllChipsCollectionChips() {
        log.debug("REST deleteAllChipsCollectionChips()");
        chipsCollectionChipsExtService.deleteAllChipsCollectionChips();
    }
}
