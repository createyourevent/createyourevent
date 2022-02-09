package org.createyourevent.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.createyourevent.app.web.rest.TestUtil.sameInstant;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.createyourevent.app.IntegrationTest;
import org.createyourevent.app.domain.EventServiceMapOrder;
import org.createyourevent.app.repository.EventServiceMapOrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EventServiceMapOrderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EventServiceMapOrderResourceIT {

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_DATE_FROM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_FROM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_DATE_UNTIL = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_UNTIL = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Float DEFAULT_COST_HOUR = 1F;
    private static final Float UPDATED_COST_HOUR = 2F;

    private static final Float DEFAULT_RIDE_COSTS = 1F;
    private static final Float UPDATED_RIDE_COSTS = 2F;

    private static final Float DEFAULT_TOTAL = 1F;
    private static final Float UPDATED_TOTAL = 2F;

    private static final String DEFAULT_TOTAL_HOURS = "AAAAAAAAAA";
    private static final String UPDATED_TOTAL_HOURS = "BBBBBBBBBB";

    private static final Float DEFAULT_KILOMETRE = 1F;
    private static final Float UPDATED_KILOMETRE = 2F;

    private static final Boolean DEFAULT_BILLED = false;
    private static final Boolean UPDATED_BILLED = true;

    private static final Boolean DEFAULT_SEEN = false;
    private static final Boolean UPDATED_SEEN = true;

    private static final Boolean DEFAULT_APPROVED = false;
    private static final Boolean UPDATED_APPROVED = true;

    private static final String ENTITY_API_URL = "/api/event-service-map-orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EventServiceMapOrderRepository eventServiceMapOrderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventServiceMapOrderMockMvc;

    private EventServiceMapOrder eventServiceMapOrder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventServiceMapOrder createEntity(EntityManager em) {
        EventServiceMapOrder eventServiceMapOrder = new EventServiceMapOrder()
            .date(DEFAULT_DATE)
            .dateFrom(DEFAULT_DATE_FROM)
            .dateUntil(DEFAULT_DATE_UNTIL)
            .costHour(DEFAULT_COST_HOUR)
            .rideCosts(DEFAULT_RIDE_COSTS)
            .total(DEFAULT_TOTAL)
            .totalHours(DEFAULT_TOTAL_HOURS)
            .kilometre(DEFAULT_KILOMETRE)
            .billed(DEFAULT_BILLED)
            .seen(DEFAULT_SEEN)
            .approved(DEFAULT_APPROVED);
        return eventServiceMapOrder;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventServiceMapOrder createUpdatedEntity(EntityManager em) {
        EventServiceMapOrder eventServiceMapOrder = new EventServiceMapOrder()
            .date(UPDATED_DATE)
            .dateFrom(UPDATED_DATE_FROM)
            .dateUntil(UPDATED_DATE_UNTIL)
            .costHour(UPDATED_COST_HOUR)
            .rideCosts(UPDATED_RIDE_COSTS)
            .total(UPDATED_TOTAL)
            .totalHours(UPDATED_TOTAL_HOURS)
            .kilometre(UPDATED_KILOMETRE)
            .billed(UPDATED_BILLED)
            .seen(UPDATED_SEEN)
            .approved(UPDATED_APPROVED);
        return eventServiceMapOrder;
    }

    @BeforeEach
    public void initTest() {
        eventServiceMapOrder = createEntity(em);
    }

    @Test
    @Transactional
    void createEventServiceMapOrder() throws Exception {
        int databaseSizeBeforeCreate = eventServiceMapOrderRepository.findAll().size();
        // Create the EventServiceMapOrder
        restEventServiceMapOrderMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventServiceMapOrder))
            )
            .andExpect(status().isCreated());

        // Validate the EventServiceMapOrder in the database
        List<EventServiceMapOrder> eventServiceMapOrderList = eventServiceMapOrderRepository.findAll();
        assertThat(eventServiceMapOrderList).hasSize(databaseSizeBeforeCreate + 1);
        EventServiceMapOrder testEventServiceMapOrder = eventServiceMapOrderList.get(eventServiceMapOrderList.size() - 1);
        assertThat(testEventServiceMapOrder.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEventServiceMapOrder.getDateFrom()).isEqualTo(DEFAULT_DATE_FROM);
        assertThat(testEventServiceMapOrder.getDateUntil()).isEqualTo(DEFAULT_DATE_UNTIL);
        assertThat(testEventServiceMapOrder.getCostHour()).isEqualTo(DEFAULT_COST_HOUR);
        assertThat(testEventServiceMapOrder.getRideCosts()).isEqualTo(DEFAULT_RIDE_COSTS);
        assertThat(testEventServiceMapOrder.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testEventServiceMapOrder.getTotalHours()).isEqualTo(DEFAULT_TOTAL_HOURS);
        assertThat(testEventServiceMapOrder.getKilometre()).isEqualTo(DEFAULT_KILOMETRE);
        assertThat(testEventServiceMapOrder.getBilled()).isEqualTo(DEFAULT_BILLED);
        assertThat(testEventServiceMapOrder.getSeen()).isEqualTo(DEFAULT_SEEN);
        assertThat(testEventServiceMapOrder.getApproved()).isEqualTo(DEFAULT_APPROVED);
    }

    @Test
    @Transactional
    void createEventServiceMapOrderWithExistingId() throws Exception {
        // Create the EventServiceMapOrder with an existing ID
        eventServiceMapOrder.setId(1L);

        int databaseSizeBeforeCreate = eventServiceMapOrderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventServiceMapOrderMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventServiceMapOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventServiceMapOrder in the database
        List<EventServiceMapOrder> eventServiceMapOrderList = eventServiceMapOrderRepository.findAll();
        assertThat(eventServiceMapOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEventServiceMapOrders() throws Exception {
        // Initialize the database
        eventServiceMapOrderRepository.saveAndFlush(eventServiceMapOrder);

        // Get all the eventServiceMapOrderList
        restEventServiceMapOrderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventServiceMapOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].dateFrom").value(hasItem(sameInstant(DEFAULT_DATE_FROM))))
            .andExpect(jsonPath("$.[*].dateUntil").value(hasItem(sameInstant(DEFAULT_DATE_UNTIL))))
            .andExpect(jsonPath("$.[*].costHour").value(hasItem(DEFAULT_COST_HOUR.doubleValue())))
            .andExpect(jsonPath("$.[*].rideCosts").value(hasItem(DEFAULT_RIDE_COSTS.doubleValue())))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.doubleValue())))
            .andExpect(jsonPath("$.[*].totalHours").value(hasItem(DEFAULT_TOTAL_HOURS)))
            .andExpect(jsonPath("$.[*].kilometre").value(hasItem(DEFAULT_KILOMETRE.doubleValue())))
            .andExpect(jsonPath("$.[*].billed").value(hasItem(DEFAULT_BILLED.booleanValue())))
            .andExpect(jsonPath("$.[*].seen").value(hasItem(DEFAULT_SEEN.booleanValue())))
            .andExpect(jsonPath("$.[*].approved").value(hasItem(DEFAULT_APPROVED.booleanValue())));
    }

    @Test
    @Transactional
    void getEventServiceMapOrder() throws Exception {
        // Initialize the database
        eventServiceMapOrderRepository.saveAndFlush(eventServiceMapOrder);

        // Get the eventServiceMapOrder
        restEventServiceMapOrderMockMvc
            .perform(get(ENTITY_API_URL_ID, eventServiceMapOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(eventServiceMapOrder.getId().intValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.dateFrom").value(sameInstant(DEFAULT_DATE_FROM)))
            .andExpect(jsonPath("$.dateUntil").value(sameInstant(DEFAULT_DATE_UNTIL)))
            .andExpect(jsonPath("$.costHour").value(DEFAULT_COST_HOUR.doubleValue()))
            .andExpect(jsonPath("$.rideCosts").value(DEFAULT_RIDE_COSTS.doubleValue()))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.doubleValue()))
            .andExpect(jsonPath("$.totalHours").value(DEFAULT_TOTAL_HOURS))
            .andExpect(jsonPath("$.kilometre").value(DEFAULT_KILOMETRE.doubleValue()))
            .andExpect(jsonPath("$.billed").value(DEFAULT_BILLED.booleanValue()))
            .andExpect(jsonPath("$.seen").value(DEFAULT_SEEN.booleanValue()))
            .andExpect(jsonPath("$.approved").value(DEFAULT_APPROVED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingEventServiceMapOrder() throws Exception {
        // Get the eventServiceMapOrder
        restEventServiceMapOrderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEventServiceMapOrder() throws Exception {
        // Initialize the database
        eventServiceMapOrderRepository.saveAndFlush(eventServiceMapOrder);

        int databaseSizeBeforeUpdate = eventServiceMapOrderRepository.findAll().size();

        // Update the eventServiceMapOrder
        EventServiceMapOrder updatedEventServiceMapOrder = eventServiceMapOrderRepository.findById(eventServiceMapOrder.getId()).get();
        // Disconnect from session so that the updates on updatedEventServiceMapOrder are not directly saved in db
        em.detach(updatedEventServiceMapOrder);
        updatedEventServiceMapOrder
            .date(UPDATED_DATE)
            .dateFrom(UPDATED_DATE_FROM)
            .dateUntil(UPDATED_DATE_UNTIL)
            .costHour(UPDATED_COST_HOUR)
            .rideCosts(UPDATED_RIDE_COSTS)
            .total(UPDATED_TOTAL)
            .totalHours(UPDATED_TOTAL_HOURS)
            .kilometre(UPDATED_KILOMETRE)
            .billed(UPDATED_BILLED)
            .seen(UPDATED_SEEN)
            .approved(UPDATED_APPROVED);

        restEventServiceMapOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEventServiceMapOrder.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEventServiceMapOrder))
            )
            .andExpect(status().isOk());

        // Validate the EventServiceMapOrder in the database
        List<EventServiceMapOrder> eventServiceMapOrderList = eventServiceMapOrderRepository.findAll();
        assertThat(eventServiceMapOrderList).hasSize(databaseSizeBeforeUpdate);
        EventServiceMapOrder testEventServiceMapOrder = eventServiceMapOrderList.get(eventServiceMapOrderList.size() - 1);
        assertThat(testEventServiceMapOrder.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEventServiceMapOrder.getDateFrom()).isEqualTo(UPDATED_DATE_FROM);
        assertThat(testEventServiceMapOrder.getDateUntil()).isEqualTo(UPDATED_DATE_UNTIL);
        assertThat(testEventServiceMapOrder.getCostHour()).isEqualTo(UPDATED_COST_HOUR);
        assertThat(testEventServiceMapOrder.getRideCosts()).isEqualTo(UPDATED_RIDE_COSTS);
        assertThat(testEventServiceMapOrder.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testEventServiceMapOrder.getTotalHours()).isEqualTo(UPDATED_TOTAL_HOURS);
        assertThat(testEventServiceMapOrder.getKilometre()).isEqualTo(UPDATED_KILOMETRE);
        assertThat(testEventServiceMapOrder.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testEventServiceMapOrder.getSeen()).isEqualTo(UPDATED_SEEN);
        assertThat(testEventServiceMapOrder.getApproved()).isEqualTo(UPDATED_APPROVED);
    }

    @Test
    @Transactional
    void putNonExistingEventServiceMapOrder() throws Exception {
        int databaseSizeBeforeUpdate = eventServiceMapOrderRepository.findAll().size();
        eventServiceMapOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventServiceMapOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, eventServiceMapOrder.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventServiceMapOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventServiceMapOrder in the database
        List<EventServiceMapOrder> eventServiceMapOrderList = eventServiceMapOrderRepository.findAll();
        assertThat(eventServiceMapOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEventServiceMapOrder() throws Exception {
        int databaseSizeBeforeUpdate = eventServiceMapOrderRepository.findAll().size();
        eventServiceMapOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventServiceMapOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventServiceMapOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventServiceMapOrder in the database
        List<EventServiceMapOrder> eventServiceMapOrderList = eventServiceMapOrderRepository.findAll();
        assertThat(eventServiceMapOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEventServiceMapOrder() throws Exception {
        int databaseSizeBeforeUpdate = eventServiceMapOrderRepository.findAll().size();
        eventServiceMapOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventServiceMapOrderMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventServiceMapOrder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventServiceMapOrder in the database
        List<EventServiceMapOrder> eventServiceMapOrderList = eventServiceMapOrderRepository.findAll();
        assertThat(eventServiceMapOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventServiceMapOrderWithPatch() throws Exception {
        // Initialize the database
        eventServiceMapOrderRepository.saveAndFlush(eventServiceMapOrder);

        int databaseSizeBeforeUpdate = eventServiceMapOrderRepository.findAll().size();

        // Update the eventServiceMapOrder using partial update
        EventServiceMapOrder partialUpdatedEventServiceMapOrder = new EventServiceMapOrder();
        partialUpdatedEventServiceMapOrder.setId(eventServiceMapOrder.getId());

        partialUpdatedEventServiceMapOrder
            .date(UPDATED_DATE)
            .dateFrom(UPDATED_DATE_FROM)
            .dateUntil(UPDATED_DATE_UNTIL)
            .rideCosts(UPDATED_RIDE_COSTS)
            .total(UPDATED_TOTAL)
            .totalHours(UPDATED_TOTAL_HOURS)
            .billed(UPDATED_BILLED);

        restEventServiceMapOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventServiceMapOrder.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventServiceMapOrder))
            )
            .andExpect(status().isOk());

        // Validate the EventServiceMapOrder in the database
        List<EventServiceMapOrder> eventServiceMapOrderList = eventServiceMapOrderRepository.findAll();
        assertThat(eventServiceMapOrderList).hasSize(databaseSizeBeforeUpdate);
        EventServiceMapOrder testEventServiceMapOrder = eventServiceMapOrderList.get(eventServiceMapOrderList.size() - 1);
        assertThat(testEventServiceMapOrder.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEventServiceMapOrder.getDateFrom()).isEqualTo(UPDATED_DATE_FROM);
        assertThat(testEventServiceMapOrder.getDateUntil()).isEqualTo(UPDATED_DATE_UNTIL);
        assertThat(testEventServiceMapOrder.getCostHour()).isEqualTo(DEFAULT_COST_HOUR);
        assertThat(testEventServiceMapOrder.getRideCosts()).isEqualTo(UPDATED_RIDE_COSTS);
        assertThat(testEventServiceMapOrder.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testEventServiceMapOrder.getTotalHours()).isEqualTo(UPDATED_TOTAL_HOURS);
        assertThat(testEventServiceMapOrder.getKilometre()).isEqualTo(DEFAULT_KILOMETRE);
        assertThat(testEventServiceMapOrder.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testEventServiceMapOrder.getSeen()).isEqualTo(DEFAULT_SEEN);
        assertThat(testEventServiceMapOrder.getApproved()).isEqualTo(DEFAULT_APPROVED);
    }

    @Test
    @Transactional
    void fullUpdateEventServiceMapOrderWithPatch() throws Exception {
        // Initialize the database
        eventServiceMapOrderRepository.saveAndFlush(eventServiceMapOrder);

        int databaseSizeBeforeUpdate = eventServiceMapOrderRepository.findAll().size();

        // Update the eventServiceMapOrder using partial update
        EventServiceMapOrder partialUpdatedEventServiceMapOrder = new EventServiceMapOrder();
        partialUpdatedEventServiceMapOrder.setId(eventServiceMapOrder.getId());

        partialUpdatedEventServiceMapOrder
            .date(UPDATED_DATE)
            .dateFrom(UPDATED_DATE_FROM)
            .dateUntil(UPDATED_DATE_UNTIL)
            .costHour(UPDATED_COST_HOUR)
            .rideCosts(UPDATED_RIDE_COSTS)
            .total(UPDATED_TOTAL)
            .totalHours(UPDATED_TOTAL_HOURS)
            .kilometre(UPDATED_KILOMETRE)
            .billed(UPDATED_BILLED)
            .seen(UPDATED_SEEN)
            .approved(UPDATED_APPROVED);

        restEventServiceMapOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventServiceMapOrder.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventServiceMapOrder))
            )
            .andExpect(status().isOk());

        // Validate the EventServiceMapOrder in the database
        List<EventServiceMapOrder> eventServiceMapOrderList = eventServiceMapOrderRepository.findAll();
        assertThat(eventServiceMapOrderList).hasSize(databaseSizeBeforeUpdate);
        EventServiceMapOrder testEventServiceMapOrder = eventServiceMapOrderList.get(eventServiceMapOrderList.size() - 1);
        assertThat(testEventServiceMapOrder.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEventServiceMapOrder.getDateFrom()).isEqualTo(UPDATED_DATE_FROM);
        assertThat(testEventServiceMapOrder.getDateUntil()).isEqualTo(UPDATED_DATE_UNTIL);
        assertThat(testEventServiceMapOrder.getCostHour()).isEqualTo(UPDATED_COST_HOUR);
        assertThat(testEventServiceMapOrder.getRideCosts()).isEqualTo(UPDATED_RIDE_COSTS);
        assertThat(testEventServiceMapOrder.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testEventServiceMapOrder.getTotalHours()).isEqualTo(UPDATED_TOTAL_HOURS);
        assertThat(testEventServiceMapOrder.getKilometre()).isEqualTo(UPDATED_KILOMETRE);
        assertThat(testEventServiceMapOrder.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testEventServiceMapOrder.getSeen()).isEqualTo(UPDATED_SEEN);
        assertThat(testEventServiceMapOrder.getApproved()).isEqualTo(UPDATED_APPROVED);
    }

    @Test
    @Transactional
    void patchNonExistingEventServiceMapOrder() throws Exception {
        int databaseSizeBeforeUpdate = eventServiceMapOrderRepository.findAll().size();
        eventServiceMapOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventServiceMapOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, eventServiceMapOrder.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventServiceMapOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventServiceMapOrder in the database
        List<EventServiceMapOrder> eventServiceMapOrderList = eventServiceMapOrderRepository.findAll();
        assertThat(eventServiceMapOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEventServiceMapOrder() throws Exception {
        int databaseSizeBeforeUpdate = eventServiceMapOrderRepository.findAll().size();
        eventServiceMapOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventServiceMapOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventServiceMapOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventServiceMapOrder in the database
        List<EventServiceMapOrder> eventServiceMapOrderList = eventServiceMapOrderRepository.findAll();
        assertThat(eventServiceMapOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEventServiceMapOrder() throws Exception {
        int databaseSizeBeforeUpdate = eventServiceMapOrderRepository.findAll().size();
        eventServiceMapOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventServiceMapOrderMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventServiceMapOrder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventServiceMapOrder in the database
        List<EventServiceMapOrder> eventServiceMapOrderList = eventServiceMapOrderRepository.findAll();
        assertThat(eventServiceMapOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEventServiceMapOrder() throws Exception {
        // Initialize the database
        eventServiceMapOrderRepository.saveAndFlush(eventServiceMapOrder);

        int databaseSizeBeforeDelete = eventServiceMapOrderRepository.findAll().size();

        // Delete the eventServiceMapOrder
        restEventServiceMapOrderMockMvc
            .perform(delete(ENTITY_API_URL_ID, eventServiceMapOrder.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EventServiceMapOrder> eventServiceMapOrderList = eventServiceMapOrderRepository.findAll();
        assertThat(eventServiceMapOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
