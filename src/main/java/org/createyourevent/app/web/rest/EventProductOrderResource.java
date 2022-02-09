package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.EventProductOrder;
import org.createyourevent.app.repository.EventProductOrderRepository;
import org.createyourevent.app.service.EventProductOrderService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.EventProductOrder}.
 */
@RestController
@RequestMapping("/api")
public class EventProductOrderResource {

    private final Logger log = LoggerFactory.getLogger(EventProductOrderResource.class);

    private static final String ENTITY_NAME = "eventProductOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventProductOrderService eventProductOrderService;

    private final EventProductOrderRepository eventProductOrderRepository;

    public EventProductOrderResource(
        EventProductOrderService eventProductOrderService,
        EventProductOrderRepository eventProductOrderRepository
    ) {
        this.eventProductOrderService = eventProductOrderService;
        this.eventProductOrderRepository = eventProductOrderRepository;
    }

    /**
     * {@code POST  /event-product-orders} : Create a new eventProductOrder.
     *
     * @param eventProductOrder the eventProductOrder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventProductOrder, or with status {@code 400 (Bad Request)} if the eventProductOrder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-product-orders")
    public ResponseEntity<EventProductOrder> createEventProductOrder(@RequestBody EventProductOrder eventProductOrder)
        throws URISyntaxException {
        log.debug("REST request to save EventProductOrder : {}", eventProductOrder);
        if (eventProductOrder.getId() != null) {
            throw new BadRequestAlertException("A new eventProductOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventProductOrder result = eventProductOrderService.save(eventProductOrder);
        return ResponseEntity
            .created(new URI("/api/event-product-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-product-orders/:id} : Updates an existing eventProductOrder.
     *
     * @param id the id of the eventProductOrder to save.
     * @param eventProductOrder the eventProductOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventProductOrder,
     * or with status {@code 400 (Bad Request)} if the eventProductOrder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventProductOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-product-orders/{id}")
    public ResponseEntity<EventProductOrder> updateEventProductOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventProductOrder eventProductOrder
    ) throws URISyntaxException {
        log.debug("REST request to update EventProductOrder : {}, {}", id, eventProductOrder);
        if (eventProductOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventProductOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventProductOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EventProductOrder result = eventProductOrderService.save(eventProductOrder);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventProductOrder.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /event-product-orders/:id} : Partial updates given fields of an existing eventProductOrder, field will ignore if it is null
     *
     * @param id the id of the eventProductOrder to save.
     * @param eventProductOrder the eventProductOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventProductOrder,
     * or with status {@code 400 (Bad Request)} if the eventProductOrder is not valid,
     * or with status {@code 404 (Not Found)} if the eventProductOrder is not found,
     * or with status {@code 500 (Internal Server Error)} if the eventProductOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/event-product-orders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EventProductOrder> partialUpdateEventProductOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventProductOrder eventProductOrder
    ) throws URISyntaxException {
        log.debug("REST request to partial update EventProductOrder partially : {}, {}", id, eventProductOrder);
        if (eventProductOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventProductOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventProductOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EventProductOrder> result = eventProductOrderService.partialUpdate(eventProductOrder);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventProductOrder.getId().toString())
        );
    }

    /**
     * {@code GET  /event-product-orders} : get all the eventProductOrders.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventProductOrders in body.
     */
    @GetMapping("/event-product-orders")
    public ResponseEntity<List<EventProductOrder>> getAllEventProductOrders(
        Pageable pageable,
        @RequestParam(required = false) String filter
    ) {
        if ("feetransaction-is-null".equals(filter)) {
            log.debug("REST request to get all EventProductOrders where feeTransaction is null");
            return new ResponseEntity<>(eventProductOrderService.findAllWhereFeeTransactionIsNull(), HttpStatus.OK);
        }
        log.debug("REST request to get a page of EventProductOrders");
        Page<EventProductOrder> page = eventProductOrderService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /event-product-orders/:id} : get the "id" eventProductOrder.
     *
     * @param id the id of the eventProductOrder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventProductOrder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-product-orders/{id}")
    public ResponseEntity<EventProductOrder> getEventProductOrder(@PathVariable Long id) {
        log.debug("REST request to get EventProductOrder : {}", id);
        Optional<EventProductOrder> eventProductOrder = eventProductOrderService.findOne(id);
        return ResponseUtil.wrapOrNotFound(eventProductOrder);
    }

    /**
     * {@code DELETE  /event-product-orders/:id} : delete the "id" eventProductOrder.
     *
     * @param id the id of the eventProductOrder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-product-orders/{id}")
    public ResponseEntity<Void> deleteEventProductOrder(@PathVariable Long id) {
        log.debug("REST request to delete EventProductOrder : {}", id);
        eventProductOrderService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
