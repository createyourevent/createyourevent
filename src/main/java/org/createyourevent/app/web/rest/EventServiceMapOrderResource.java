package org.createyourevent.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.createyourevent.app.domain.EventServiceMapOrder;
import org.createyourevent.app.repository.EventServiceMapOrderRepository;
import org.createyourevent.app.service.EventServiceMapOrderService;
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
 * REST controller for managing {@link org.createyourevent.app.domain.EventServiceMapOrder}.
 */
@RestController
@RequestMapping("/api")
public class EventServiceMapOrderResource {

    private final Logger log = LoggerFactory.getLogger(EventServiceMapOrderResource.class);

    private static final String ENTITY_NAME = "eventServiceMapOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventServiceMapOrderService eventServiceMapOrderService;

    private final EventServiceMapOrderRepository eventServiceMapOrderRepository;

    public EventServiceMapOrderResource(
        EventServiceMapOrderService eventServiceMapOrderService,
        EventServiceMapOrderRepository eventServiceMapOrderRepository
    ) {
        this.eventServiceMapOrderService = eventServiceMapOrderService;
        this.eventServiceMapOrderRepository = eventServiceMapOrderRepository;
    }

    /**
     * {@code POST  /event-service-map-orders} : Create a new eventServiceMapOrder.
     *
     * @param eventServiceMapOrder the eventServiceMapOrder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventServiceMapOrder, or with status {@code 400 (Bad Request)} if the eventServiceMapOrder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-service-map-orders")
    public ResponseEntity<EventServiceMapOrder> createEventServiceMapOrder(@RequestBody EventServiceMapOrder eventServiceMapOrder)
        throws URISyntaxException {
        log.debug("REST request to save EventServiceMapOrder : {}", eventServiceMapOrder);
        if (eventServiceMapOrder.getId() != null) {
            throw new BadRequestAlertException("A new eventServiceMapOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventServiceMapOrder result = eventServiceMapOrderService.save(eventServiceMapOrder);
        return ResponseEntity
            .created(new URI("/api/event-service-map-orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-service-map-orders/:id} : Updates an existing eventServiceMapOrder.
     *
     * @param id the id of the eventServiceMapOrder to save.
     * @param eventServiceMapOrder the eventServiceMapOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventServiceMapOrder,
     * or with status {@code 400 (Bad Request)} if the eventServiceMapOrder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventServiceMapOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-service-map-orders/{id}")
    public ResponseEntity<EventServiceMapOrder> updateEventServiceMapOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventServiceMapOrder eventServiceMapOrder
    ) throws URISyntaxException {
        log.debug("REST request to update EventServiceMapOrder : {}, {}", id, eventServiceMapOrder);
        if (eventServiceMapOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventServiceMapOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventServiceMapOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EventServiceMapOrder result = eventServiceMapOrderService.save(eventServiceMapOrder);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventServiceMapOrder.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /event-service-map-orders/:id} : Partial updates given fields of an existing eventServiceMapOrder, field will ignore if it is null
     *
     * @param id the id of the eventServiceMapOrder to save.
     * @param eventServiceMapOrder the eventServiceMapOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventServiceMapOrder,
     * or with status {@code 400 (Bad Request)} if the eventServiceMapOrder is not valid,
     * or with status {@code 404 (Not Found)} if the eventServiceMapOrder is not found,
     * or with status {@code 500 (Internal Server Error)} if the eventServiceMapOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/event-service-map-orders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EventServiceMapOrder> partialUpdateEventServiceMapOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventServiceMapOrder eventServiceMapOrder
    ) throws URISyntaxException {
        log.debug("REST request to partial update EventServiceMapOrder partially : {}, {}", id, eventServiceMapOrder);
        if (eventServiceMapOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventServiceMapOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventServiceMapOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EventServiceMapOrder> result = eventServiceMapOrderService.partialUpdate(eventServiceMapOrder);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eventServiceMapOrder.getId().toString())
        );
    }

    /**
     * {@code GET  /event-service-map-orders} : get all the eventServiceMapOrders.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventServiceMapOrders in body.
     */
    @GetMapping("/event-service-map-orders")
    public ResponseEntity<List<EventServiceMapOrder>> getAllEventServiceMapOrders(
        Pageable pageable,
        @RequestParam(required = false) String filter
    ) {
        if ("feetransaction-is-null".equals(filter)) {
            log.debug("REST request to get all EventServiceMapOrders where feeTransaction is null");
            return new ResponseEntity<>(eventServiceMapOrderService.findAllWhereFeeTransactionIsNull(), HttpStatus.OK);
        }
        log.debug("REST request to get a page of EventServiceMapOrders");
        Page<EventServiceMapOrder> page = eventServiceMapOrderService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /event-service-map-orders/:id} : get the "id" eventServiceMapOrder.
     *
     * @param id the id of the eventServiceMapOrder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventServiceMapOrder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-service-map-orders/{id}")
    public ResponseEntity<EventServiceMapOrder> getEventServiceMapOrder(@PathVariable Long id) {
        log.debug("REST request to get EventServiceMapOrder : {}", id);
        Optional<EventServiceMapOrder> eventServiceMapOrder = eventServiceMapOrderService.findOne(id);
        return ResponseUtil.wrapOrNotFound(eventServiceMapOrder);
    }

    /**
     * {@code DELETE  /event-service-map-orders/:id} : delete the "id" eventServiceMapOrder.
     *
     * @param id the id of the eventServiceMapOrder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-service-map-orders/{id}")
    public ResponseEntity<Void> deleteEventServiceMapOrder(@PathVariable Long id) {
        log.debug("REST request to delete EventServiceMapOrder : {}", id);
        eventServiceMapOrderService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
