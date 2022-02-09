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
import org.createyourevent.app.domain.EventProductOrder;
import org.createyourevent.app.domain.enumeration.RentStatus;
import org.createyourevent.app.repository.EventProductOrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EventProductOrderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EventProductOrderResourceIT {

    private static final Integer DEFAULT_AMOUNT = 1;
    private static final Integer UPDATED_AMOUNT = 2;

    private static final Float DEFAULT_TOTAL = 1F;
    private static final Float UPDATED_TOTAL = 2F;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Integer DEFAULT_RENTAL_PERIOD = 1;
    private static final Integer UPDATED_RENTAL_PERIOD = 2;

    private static final ZonedDateTime DEFAULT_DATE_FROM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_FROM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_DATE_UNTIL = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_UNTIL = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final RentStatus DEFAULT_STATUS = RentStatus.BOOKED;
    private static final RentStatus UPDATED_STATUS = RentStatus.RENTED;

    private static final Boolean DEFAULT_BILLED = false;
    private static final Boolean UPDATED_BILLED = true;

    private static final Boolean DEFAULT_SEEN = false;
    private static final Boolean UPDATED_SEEN = true;

    private static final Boolean DEFAULT_APPROVED = false;
    private static final Boolean UPDATED_APPROVED = true;

    private static final Float DEFAULT_SELLING_PRICE = 1F;
    private static final Float UPDATED_SELLING_PRICE = 2F;

    private static final String ENTITY_API_URL = "/api/event-product-orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EventProductOrderRepository eventProductOrderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventProductOrderMockMvc;

    private EventProductOrder eventProductOrder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventProductOrder createEntity(EntityManager em) {
        EventProductOrder eventProductOrder = new EventProductOrder()
            .amount(DEFAULT_AMOUNT)
            .total(DEFAULT_TOTAL)
            .date(DEFAULT_DATE)
            .rentalPeriod(DEFAULT_RENTAL_PERIOD)
            .dateFrom(DEFAULT_DATE_FROM)
            .dateUntil(DEFAULT_DATE_UNTIL)
            .status(DEFAULT_STATUS)
            .billed(DEFAULT_BILLED)
            .seen(DEFAULT_SEEN)
            .approved(DEFAULT_APPROVED)
            .sellingPrice(DEFAULT_SELLING_PRICE);
        return eventProductOrder;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventProductOrder createUpdatedEntity(EntityManager em) {
        EventProductOrder eventProductOrder = new EventProductOrder()
            .amount(UPDATED_AMOUNT)
            .total(UPDATED_TOTAL)
            .date(UPDATED_DATE)
            .rentalPeriod(UPDATED_RENTAL_PERIOD)
            .dateFrom(UPDATED_DATE_FROM)
            .dateUntil(UPDATED_DATE_UNTIL)
            .status(UPDATED_STATUS)
            .billed(UPDATED_BILLED)
            .seen(UPDATED_SEEN)
            .approved(UPDATED_APPROVED)
            .sellingPrice(UPDATED_SELLING_PRICE);
        return eventProductOrder;
    }

    @BeforeEach
    public void initTest() {
        eventProductOrder = createEntity(em);
    }

    @Test
    @Transactional
    void createEventProductOrder() throws Exception {
        int databaseSizeBeforeCreate = eventProductOrderRepository.findAll().size();
        // Create the EventProductOrder
        restEventProductOrderMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductOrder))
            )
            .andExpect(status().isCreated());

        // Validate the EventProductOrder in the database
        List<EventProductOrder> eventProductOrderList = eventProductOrderRepository.findAll();
        assertThat(eventProductOrderList).hasSize(databaseSizeBeforeCreate + 1);
        EventProductOrder testEventProductOrder = eventProductOrderList.get(eventProductOrderList.size() - 1);
        assertThat(testEventProductOrder.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testEventProductOrder.getTotal()).isEqualTo(DEFAULT_TOTAL);
        assertThat(testEventProductOrder.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEventProductOrder.getRentalPeriod()).isEqualTo(DEFAULT_RENTAL_PERIOD);
        assertThat(testEventProductOrder.getDateFrom()).isEqualTo(DEFAULT_DATE_FROM);
        assertThat(testEventProductOrder.getDateUntil()).isEqualTo(DEFAULT_DATE_UNTIL);
        assertThat(testEventProductOrder.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testEventProductOrder.getBilled()).isEqualTo(DEFAULT_BILLED);
        assertThat(testEventProductOrder.getSeen()).isEqualTo(DEFAULT_SEEN);
        assertThat(testEventProductOrder.getApproved()).isEqualTo(DEFAULT_APPROVED);
        assertThat(testEventProductOrder.getSellingPrice()).isEqualTo(DEFAULT_SELLING_PRICE);
    }

    @Test
    @Transactional
    void createEventProductOrderWithExistingId() throws Exception {
        // Create the EventProductOrder with an existing ID
        eventProductOrder.setId(1L);

        int databaseSizeBeforeCreate = eventProductOrderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventProductOrderMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductOrder in the database
        List<EventProductOrder> eventProductOrderList = eventProductOrderRepository.findAll();
        assertThat(eventProductOrderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEventProductOrders() throws Exception {
        // Initialize the database
        eventProductOrderRepository.saveAndFlush(eventProductOrder);

        // Get all the eventProductOrderList
        restEventProductOrderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventProductOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.[*].total").value(hasItem(DEFAULT_TOTAL.doubleValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].rentalPeriod").value(hasItem(DEFAULT_RENTAL_PERIOD)))
            .andExpect(jsonPath("$.[*].dateFrom").value(hasItem(sameInstant(DEFAULT_DATE_FROM))))
            .andExpect(jsonPath("$.[*].dateUntil").value(hasItem(sameInstant(DEFAULT_DATE_UNTIL))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].billed").value(hasItem(DEFAULT_BILLED.booleanValue())))
            .andExpect(jsonPath("$.[*].seen").value(hasItem(DEFAULT_SEEN.booleanValue())))
            .andExpect(jsonPath("$.[*].approved").value(hasItem(DEFAULT_APPROVED.booleanValue())))
            .andExpect(jsonPath("$.[*].sellingPrice").value(hasItem(DEFAULT_SELLING_PRICE.doubleValue())));
    }

    @Test
    @Transactional
    void getEventProductOrder() throws Exception {
        // Initialize the database
        eventProductOrderRepository.saveAndFlush(eventProductOrder);

        // Get the eventProductOrder
        restEventProductOrderMockMvc
            .perform(get(ENTITY_API_URL_ID, eventProductOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(eventProductOrder.getId().intValue()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT))
            .andExpect(jsonPath("$.total").value(DEFAULT_TOTAL.doubleValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.rentalPeriod").value(DEFAULT_RENTAL_PERIOD))
            .andExpect(jsonPath("$.dateFrom").value(sameInstant(DEFAULT_DATE_FROM)))
            .andExpect(jsonPath("$.dateUntil").value(sameInstant(DEFAULT_DATE_UNTIL)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.billed").value(DEFAULT_BILLED.booleanValue()))
            .andExpect(jsonPath("$.seen").value(DEFAULT_SEEN.booleanValue()))
            .andExpect(jsonPath("$.approved").value(DEFAULT_APPROVED.booleanValue()))
            .andExpect(jsonPath("$.sellingPrice").value(DEFAULT_SELLING_PRICE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingEventProductOrder() throws Exception {
        // Get the eventProductOrder
        restEventProductOrderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEventProductOrder() throws Exception {
        // Initialize the database
        eventProductOrderRepository.saveAndFlush(eventProductOrder);

        int databaseSizeBeforeUpdate = eventProductOrderRepository.findAll().size();

        // Update the eventProductOrder
        EventProductOrder updatedEventProductOrder = eventProductOrderRepository.findById(eventProductOrder.getId()).get();
        // Disconnect from session so that the updates on updatedEventProductOrder are not directly saved in db
        em.detach(updatedEventProductOrder);
        updatedEventProductOrder
            .amount(UPDATED_AMOUNT)
            .total(UPDATED_TOTAL)
            .date(UPDATED_DATE)
            .rentalPeriod(UPDATED_RENTAL_PERIOD)
            .dateFrom(UPDATED_DATE_FROM)
            .dateUntil(UPDATED_DATE_UNTIL)
            .status(UPDATED_STATUS)
            .billed(UPDATED_BILLED)
            .seen(UPDATED_SEEN)
            .approved(UPDATED_APPROVED)
            .sellingPrice(UPDATED_SELLING_PRICE);

        restEventProductOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEventProductOrder.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEventProductOrder))
            )
            .andExpect(status().isOk());

        // Validate the EventProductOrder in the database
        List<EventProductOrder> eventProductOrderList = eventProductOrderRepository.findAll();
        assertThat(eventProductOrderList).hasSize(databaseSizeBeforeUpdate);
        EventProductOrder testEventProductOrder = eventProductOrderList.get(eventProductOrderList.size() - 1);
        assertThat(testEventProductOrder.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testEventProductOrder.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testEventProductOrder.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEventProductOrder.getRentalPeriod()).isEqualTo(UPDATED_RENTAL_PERIOD);
        assertThat(testEventProductOrder.getDateFrom()).isEqualTo(UPDATED_DATE_FROM);
        assertThat(testEventProductOrder.getDateUntil()).isEqualTo(UPDATED_DATE_UNTIL);
        assertThat(testEventProductOrder.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testEventProductOrder.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testEventProductOrder.getSeen()).isEqualTo(UPDATED_SEEN);
        assertThat(testEventProductOrder.getApproved()).isEqualTo(UPDATED_APPROVED);
        assertThat(testEventProductOrder.getSellingPrice()).isEqualTo(UPDATED_SELLING_PRICE);
    }

    @Test
    @Transactional
    void putNonExistingEventProductOrder() throws Exception {
        int databaseSizeBeforeUpdate = eventProductOrderRepository.findAll().size();
        eventProductOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventProductOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, eventProductOrder.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductOrder in the database
        List<EventProductOrder> eventProductOrderList = eventProductOrderRepository.findAll();
        assertThat(eventProductOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEventProductOrder() throws Exception {
        int databaseSizeBeforeUpdate = eventProductOrderRepository.findAll().size();
        eventProductOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventProductOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductOrder in the database
        List<EventProductOrder> eventProductOrderList = eventProductOrderRepository.findAll();
        assertThat(eventProductOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEventProductOrder() throws Exception {
        int databaseSizeBeforeUpdate = eventProductOrderRepository.findAll().size();
        eventProductOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventProductOrderMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductOrder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventProductOrder in the database
        List<EventProductOrder> eventProductOrderList = eventProductOrderRepository.findAll();
        assertThat(eventProductOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventProductOrderWithPatch() throws Exception {
        // Initialize the database
        eventProductOrderRepository.saveAndFlush(eventProductOrder);

        int databaseSizeBeforeUpdate = eventProductOrderRepository.findAll().size();

        // Update the eventProductOrder using partial update
        EventProductOrder partialUpdatedEventProductOrder = new EventProductOrder();
        partialUpdatedEventProductOrder.setId(eventProductOrder.getId());

        partialUpdatedEventProductOrder
            .total(UPDATED_TOTAL)
            .rentalPeriod(UPDATED_RENTAL_PERIOD)
            .status(UPDATED_STATUS)
            .approved(UPDATED_APPROVED);

        restEventProductOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventProductOrder.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventProductOrder))
            )
            .andExpect(status().isOk());

        // Validate the EventProductOrder in the database
        List<EventProductOrder> eventProductOrderList = eventProductOrderRepository.findAll();
        assertThat(eventProductOrderList).hasSize(databaseSizeBeforeUpdate);
        EventProductOrder testEventProductOrder = eventProductOrderList.get(eventProductOrderList.size() - 1);
        assertThat(testEventProductOrder.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testEventProductOrder.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testEventProductOrder.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEventProductOrder.getRentalPeriod()).isEqualTo(UPDATED_RENTAL_PERIOD);
        assertThat(testEventProductOrder.getDateFrom()).isEqualTo(DEFAULT_DATE_FROM);
        assertThat(testEventProductOrder.getDateUntil()).isEqualTo(DEFAULT_DATE_UNTIL);
        assertThat(testEventProductOrder.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testEventProductOrder.getBilled()).isEqualTo(DEFAULT_BILLED);
        assertThat(testEventProductOrder.getSeen()).isEqualTo(DEFAULT_SEEN);
        assertThat(testEventProductOrder.getApproved()).isEqualTo(UPDATED_APPROVED);
        assertThat(testEventProductOrder.getSellingPrice()).isEqualTo(DEFAULT_SELLING_PRICE);
    }

    @Test
    @Transactional
    void fullUpdateEventProductOrderWithPatch() throws Exception {
        // Initialize the database
        eventProductOrderRepository.saveAndFlush(eventProductOrder);

        int databaseSizeBeforeUpdate = eventProductOrderRepository.findAll().size();

        // Update the eventProductOrder using partial update
        EventProductOrder partialUpdatedEventProductOrder = new EventProductOrder();
        partialUpdatedEventProductOrder.setId(eventProductOrder.getId());

        partialUpdatedEventProductOrder
            .amount(UPDATED_AMOUNT)
            .total(UPDATED_TOTAL)
            .date(UPDATED_DATE)
            .rentalPeriod(UPDATED_RENTAL_PERIOD)
            .dateFrom(UPDATED_DATE_FROM)
            .dateUntil(UPDATED_DATE_UNTIL)
            .status(UPDATED_STATUS)
            .billed(UPDATED_BILLED)
            .seen(UPDATED_SEEN)
            .approved(UPDATED_APPROVED)
            .sellingPrice(UPDATED_SELLING_PRICE);

        restEventProductOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventProductOrder.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventProductOrder))
            )
            .andExpect(status().isOk());

        // Validate the EventProductOrder in the database
        List<EventProductOrder> eventProductOrderList = eventProductOrderRepository.findAll();
        assertThat(eventProductOrderList).hasSize(databaseSizeBeforeUpdate);
        EventProductOrder testEventProductOrder = eventProductOrderList.get(eventProductOrderList.size() - 1);
        assertThat(testEventProductOrder.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testEventProductOrder.getTotal()).isEqualTo(UPDATED_TOTAL);
        assertThat(testEventProductOrder.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEventProductOrder.getRentalPeriod()).isEqualTo(UPDATED_RENTAL_PERIOD);
        assertThat(testEventProductOrder.getDateFrom()).isEqualTo(UPDATED_DATE_FROM);
        assertThat(testEventProductOrder.getDateUntil()).isEqualTo(UPDATED_DATE_UNTIL);
        assertThat(testEventProductOrder.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testEventProductOrder.getBilled()).isEqualTo(UPDATED_BILLED);
        assertThat(testEventProductOrder.getSeen()).isEqualTo(UPDATED_SEEN);
        assertThat(testEventProductOrder.getApproved()).isEqualTo(UPDATED_APPROVED);
        assertThat(testEventProductOrder.getSellingPrice()).isEqualTo(UPDATED_SELLING_PRICE);
    }

    @Test
    @Transactional
    void patchNonExistingEventProductOrder() throws Exception {
        int databaseSizeBeforeUpdate = eventProductOrderRepository.findAll().size();
        eventProductOrder.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventProductOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, eventProductOrder.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventProductOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductOrder in the database
        List<EventProductOrder> eventProductOrderList = eventProductOrderRepository.findAll();
        assertThat(eventProductOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEventProductOrder() throws Exception {
        int databaseSizeBeforeUpdate = eventProductOrderRepository.findAll().size();
        eventProductOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventProductOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventProductOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductOrder in the database
        List<EventProductOrder> eventProductOrderList = eventProductOrderRepository.findAll();
        assertThat(eventProductOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEventProductOrder() throws Exception {
        int databaseSizeBeforeUpdate = eventProductOrderRepository.findAll().size();
        eventProductOrder.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventProductOrderMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventProductOrder))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventProductOrder in the database
        List<EventProductOrder> eventProductOrderList = eventProductOrderRepository.findAll();
        assertThat(eventProductOrderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEventProductOrder() throws Exception {
        // Initialize the database
        eventProductOrderRepository.saveAndFlush(eventProductOrder);

        int databaseSizeBeforeDelete = eventProductOrderRepository.findAll().size();

        // Delete the eventProductOrder
        restEventProductOrderMockMvc
            .perform(delete(ENTITY_API_URL_ID, eventProductOrder.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EventProductOrder> eventProductOrderList = eventProductOrderRepository.findAll();
        assertThat(eventProductOrderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
