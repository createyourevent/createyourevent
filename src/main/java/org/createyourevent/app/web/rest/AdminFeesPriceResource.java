package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.createyourevent.app.domain.AdminFeesPrice;
import org.createyourevent.app.repository.AdminFeesPriceRepository;
import org.createyourevent.app.service.AdminFeesPriceService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.AdminFeesPrice}.
 */
@RestController
@RequestMapping("/api")
public class AdminFeesPriceResource {

    private final Logger log = LoggerFactory.getLogger(AdminFeesPriceResource.class);

    private static final String ENTITY_NAME = "adminFeesPrice";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdminFeesPriceService adminFeesPriceService;

    private final AdminFeesPriceRepository adminFeesPriceRepository;

    public AdminFeesPriceResource(AdminFeesPriceService adminFeesPriceService, AdminFeesPriceRepository adminFeesPriceRepository) {
        this.adminFeesPriceService = adminFeesPriceService;
        this.adminFeesPriceRepository = adminFeesPriceRepository;
    }

    /**
     * {@code POST  /admin-fees-prices} : Create a new adminFeesPrice.
     *
     * @param adminFeesPrice the adminFeesPrice to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new adminFeesPrice, or with status {@code 400 (Bad Request)} if the adminFeesPrice has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/admin-fees-prices")
    public ResponseEntity<AdminFeesPrice> createAdminFeesPrice(@RequestBody AdminFeesPrice adminFeesPrice) throws URISyntaxException {
        log.debug("REST request to save AdminFeesPrice : {}", adminFeesPrice);
        if (adminFeesPrice.getId() != null) {
            throw new BadRequestAlertException("A new adminFeesPrice cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AdminFeesPrice result = adminFeesPriceService.save(adminFeesPrice);
        return ResponseEntity
            .created(new URI("/api/admin-fees-prices/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /admin-fees-prices/:id} : Updates an existing adminFeesPrice.
     *
     * @param id the id of the adminFeesPrice to save.
     * @param adminFeesPrice the adminFeesPrice to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adminFeesPrice,
     * or with status {@code 400 (Bad Request)} if the adminFeesPrice is not valid,
     * or with status {@code 500 (Internal Server Error)} if the adminFeesPrice couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/admin-fees-prices/{id}")
    public ResponseEntity<AdminFeesPrice> updateAdminFeesPrice(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AdminFeesPrice adminFeesPrice
    ) throws URISyntaxException {
        log.debug("REST request to update AdminFeesPrice : {}, {}", id, adminFeesPrice);
        if (adminFeesPrice.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, adminFeesPrice.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!adminFeesPriceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AdminFeesPrice result = adminFeesPriceService.save(adminFeesPrice);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, adminFeesPrice.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /admin-fees-prices/:id} : Partial updates given fields of an existing adminFeesPrice, field will ignore if it is null
     *
     * @param id the id of the adminFeesPrice to save.
     * @param adminFeesPrice the adminFeesPrice to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adminFeesPrice,
     * or with status {@code 400 (Bad Request)} if the adminFeesPrice is not valid,
     * or with status {@code 404 (Not Found)} if the adminFeesPrice is not found,
     * or with status {@code 500 (Internal Server Error)} if the adminFeesPrice couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/admin-fees-prices/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AdminFeesPrice> partialUpdateAdminFeesPrice(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AdminFeesPrice adminFeesPrice
    ) throws URISyntaxException {
        log.debug("REST request to partial update AdminFeesPrice partially : {}, {}", id, adminFeesPrice);
        if (adminFeesPrice.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, adminFeesPrice.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!adminFeesPriceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AdminFeesPrice> result = adminFeesPriceService.partialUpdate(adminFeesPrice);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, adminFeesPrice.getId().toString())
        );
    }

    /**
     * {@code GET  /admin-fees-prices} : get all the adminFeesPrices.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of adminFeesPrices in body.
     */
    @GetMapping("/admin-fees-prices")
    public ResponseEntity<List<AdminFeesPrice>> getAllAdminFeesPrices(Pageable pageable) {
        log.debug("REST request to get a page of AdminFeesPrices");
        Page<AdminFeesPrice> page = adminFeesPriceService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /admin-fees-prices/:id} : get the "id" adminFeesPrice.
     *
     * @param id the id of the adminFeesPrice to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the adminFeesPrice, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/admin-fees-prices/{id}")
    public ResponseEntity<AdminFeesPrice> getAdminFeesPrice(@PathVariable Long id) {
        log.debug("REST request to get AdminFeesPrice : {}", id);
        Optional<AdminFeesPrice> adminFeesPrice = adminFeesPriceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(adminFeesPrice);
    }

    /**
     * {@code DELETE  /admin-fees-prices/:id} : delete the "id" adminFeesPrice.
     *
     * @param id the id of the adminFeesPrice to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/admin-fees-prices/{id}")
    public ResponseEntity<Void> deleteAdminFeesPrice(@PathVariable Long id) {
        log.debug("REST request to delete AdminFeesPrice : {}", id);
        adminFeesPriceService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
