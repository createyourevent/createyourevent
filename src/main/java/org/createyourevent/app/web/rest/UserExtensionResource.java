package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.UserExtension;
import org.createyourevent.app.repository.UserExtensionRepository;
import org.createyourevent.app.service.UserExtensionService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.UserExtension}.
 */
@RestController
@RequestMapping("/api")
public class UserExtensionResource {

    private final Logger log = LoggerFactory.getLogger(UserExtensionResource.class);

    private static final String ENTITY_NAME = "userExtension";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserExtensionService userExtensionService;

    private final UserExtensionRepository userExtensionRepository;

    public UserExtensionResource(UserExtensionService userExtensionService, UserExtensionRepository userExtensionRepository) {
        this.userExtensionService = userExtensionService;
        this.userExtensionRepository = userExtensionRepository;
    }

    /**
     * {@code POST  /user-extensions} : Create a new userExtension.
     *
     * @param userExtension the userExtension to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userExtension, or with status {@code 400 (Bad Request)} if the userExtension has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-extensions")
    public ResponseEntity<UserExtension> createUserExtension(@RequestBody UserExtension userExtension) throws URISyntaxException {
        log.debug("REST request to save UserExtension : {}", userExtension);
        if (userExtension.getId() != null) {
            throw new BadRequestAlertException("A new userExtension cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserExtension result = userExtensionService.save(userExtension);
        return ResponseEntity
            .created(new URI("/api/user-extensions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-extensions/:id} : Updates an existing userExtension.
     *
     * @param id the id of the userExtension to save.
     * @param userExtension the userExtension to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userExtension,
     * or with status {@code 400 (Bad Request)} if the userExtension is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userExtension couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-extensions/{id}")
    public ResponseEntity<UserExtension> updateUserExtension(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserExtension userExtension
    ) throws URISyntaxException {
        log.debug("REST request to update UserExtension : {}, {}", id, userExtension);
        if (userExtension.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userExtension.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userExtensionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserExtension result = userExtensionService.save(userExtension);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userExtension.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-extensions/:id} : Partial updates given fields of an existing userExtension, field will ignore if it is null
     *
     * @param id the id of the userExtension to save.
     * @param userExtension the userExtension to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userExtension,
     * or with status {@code 400 (Bad Request)} if the userExtension is not valid,
     * or with status {@code 404 (Not Found)} if the userExtension is not found,
     * or with status {@code 500 (Internal Server Error)} if the userExtension couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-extensions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserExtension> partialUpdateUserExtension(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserExtension userExtension
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserExtension partially : {}, {}", id, userExtension);
        if (userExtension.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userExtension.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userExtensionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserExtension> result = userExtensionService.partialUpdate(userExtension);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userExtension.getId().toString())
        );
    }

    /**
     * {@code GET  /user-extensions} : get all the userExtensions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userExtensions in body.
     */
    @GetMapping("/user-extensions")
    public ResponseEntity<List<UserExtension>> getAllUserExtensions(Pageable pageable) {
        log.debug("REST request to get a page of UserExtensions");
        Page<UserExtension> page = userExtensionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-extensions/:id} : get the "id" userExtension.
     *
     * @param id the id of the userExtension to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userExtension, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-extensions/{id}")
    public ResponseEntity<UserExtension> getUserExtension(@PathVariable Long id) {
        log.debug("REST request to get UserExtension : {}", id);
        Optional<UserExtension> userExtension = userExtensionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userExtension);
    }

    /**
     * {@code DELETE  /user-extensions/:id} : delete the "id" userExtension.
     *
     * @param id the id of the userExtension to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-extensions/{id}")
    public ResponseEntity<Void> deleteUserExtension(@PathVariable Long id) {
        log.debug("REST request to delete UserExtension : {}", id);
        userExtensionService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
