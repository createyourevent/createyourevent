package org.createyourevent.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.createyourevent.app.IntegrationTest;
import org.createyourevent.app.domain.EventDetails;
import org.createyourevent.app.repository.EventDetailsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EventDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EventDetailsResourceIT {

    private static final Float DEFAULT_TOTAL_ENTRANCE_FEE = 1F;
    private static final Float UPDATED_TOTAL_ENTRANCE_FEE = 2F;

    private static final String ENTITY_API_URL = "/api/event-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EventDetailsRepository eventDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventDetailsMockMvc;

    private EventDetails eventDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventDetails createEntity(EntityManager em) {
        EventDetails eventDetails = new EventDetails().totalEntranceFee(DEFAULT_TOTAL_ENTRANCE_FEE);
        return eventDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventDetails createUpdatedEntity(EntityManager em) {
        EventDetails eventDetails = new EventDetails().totalEntranceFee(UPDATED_TOTAL_ENTRANCE_FEE);
        return eventDetails;
    }

    @BeforeEach
    public void initTest() {
        eventDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createEventDetails() throws Exception {
        int databaseSizeBeforeCreate = eventDetailsRepository.findAll().size();
        // Create the EventDetails
        restEventDetailsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventDetails))
            )
            .andExpect(status().isCreated());

        // Validate the EventDetails in the database
        List<EventDetails> eventDetailsList = eventDetailsRepository.findAll();
        assertThat(eventDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        EventDetails testEventDetails = eventDetailsList.get(eventDetailsList.size() - 1);
        assertThat(testEventDetails.getTotalEntranceFee()).isEqualTo(DEFAULT_TOTAL_ENTRANCE_FEE);
    }

    @Test
    @Transactional
    void createEventDetailsWithExistingId() throws Exception {
        // Create the EventDetails with an existing ID
        eventDetails.setId(1L);

        int databaseSizeBeforeCreate = eventDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventDetailsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventDetails in the database
        List<EventDetails> eventDetailsList = eventDetailsRepository.findAll();
        assertThat(eventDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEventDetails() throws Exception {
        // Initialize the database
        eventDetailsRepository.saveAndFlush(eventDetails);

        // Get all the eventDetailsList
        restEventDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].totalEntranceFee").value(hasItem(DEFAULT_TOTAL_ENTRANCE_FEE.doubleValue())));
    }

    @Test
    @Transactional
    void getEventDetails() throws Exception {
        // Initialize the database
        eventDetailsRepository.saveAndFlush(eventDetails);

        // Get the eventDetails
        restEventDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, eventDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(eventDetails.getId().intValue()))
            .andExpect(jsonPath("$.totalEntranceFee").value(DEFAULT_TOTAL_ENTRANCE_FEE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingEventDetails() throws Exception {
        // Get the eventDetails
        restEventDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEventDetails() throws Exception {
        // Initialize the database
        eventDetailsRepository.saveAndFlush(eventDetails);

        int databaseSizeBeforeUpdate = eventDetailsRepository.findAll().size();

        // Update the eventDetails
        EventDetails updatedEventDetails = eventDetailsRepository.findById(eventDetails.getId()).get();
        // Disconnect from session so that the updates on updatedEventDetails are not directly saved in db
        em.detach(updatedEventDetails);
        updatedEventDetails.totalEntranceFee(UPDATED_TOTAL_ENTRANCE_FEE);

        restEventDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEventDetails.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEventDetails))
            )
            .andExpect(status().isOk());

        // Validate the EventDetails in the database
        List<EventDetails> eventDetailsList = eventDetailsRepository.findAll();
        assertThat(eventDetailsList).hasSize(databaseSizeBeforeUpdate);
        EventDetails testEventDetails = eventDetailsList.get(eventDetailsList.size() - 1);
        assertThat(testEventDetails.getTotalEntranceFee()).isEqualTo(UPDATED_TOTAL_ENTRANCE_FEE);
    }

    @Test
    @Transactional
    void putNonExistingEventDetails() throws Exception {
        int databaseSizeBeforeUpdate = eventDetailsRepository.findAll().size();
        eventDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, eventDetails.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventDetails in the database
        List<EventDetails> eventDetailsList = eventDetailsRepository.findAll();
        assertThat(eventDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEventDetails() throws Exception {
        int databaseSizeBeforeUpdate = eventDetailsRepository.findAll().size();
        eventDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventDetails in the database
        List<EventDetails> eventDetailsList = eventDetailsRepository.findAll();
        assertThat(eventDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEventDetails() throws Exception {
        int databaseSizeBeforeUpdate = eventDetailsRepository.findAll().size();
        eventDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventDetailsMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventDetails in the database
        List<EventDetails> eventDetailsList = eventDetailsRepository.findAll();
        assertThat(eventDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventDetailsWithPatch() throws Exception {
        // Initialize the database
        eventDetailsRepository.saveAndFlush(eventDetails);

        int databaseSizeBeforeUpdate = eventDetailsRepository.findAll().size();

        // Update the eventDetails using partial update
        EventDetails partialUpdatedEventDetails = new EventDetails();
        partialUpdatedEventDetails.setId(eventDetails.getId());

        restEventDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventDetails.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventDetails))
            )
            .andExpect(status().isOk());

        // Validate the EventDetails in the database
        List<EventDetails> eventDetailsList = eventDetailsRepository.findAll();
        assertThat(eventDetailsList).hasSize(databaseSizeBeforeUpdate);
        EventDetails testEventDetails = eventDetailsList.get(eventDetailsList.size() - 1);
        assertThat(testEventDetails.getTotalEntranceFee()).isEqualTo(DEFAULT_TOTAL_ENTRANCE_FEE);
    }

    @Test
    @Transactional
    void fullUpdateEventDetailsWithPatch() throws Exception {
        // Initialize the database
        eventDetailsRepository.saveAndFlush(eventDetails);

        int databaseSizeBeforeUpdate = eventDetailsRepository.findAll().size();

        // Update the eventDetails using partial update
        EventDetails partialUpdatedEventDetails = new EventDetails();
        partialUpdatedEventDetails.setId(eventDetails.getId());

        partialUpdatedEventDetails.totalEntranceFee(UPDATED_TOTAL_ENTRANCE_FEE);

        restEventDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventDetails.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventDetails))
            )
            .andExpect(status().isOk());

        // Validate the EventDetails in the database
        List<EventDetails> eventDetailsList = eventDetailsRepository.findAll();
        assertThat(eventDetailsList).hasSize(databaseSizeBeforeUpdate);
        EventDetails testEventDetails = eventDetailsList.get(eventDetailsList.size() - 1);
        assertThat(testEventDetails.getTotalEntranceFee()).isEqualTo(UPDATED_TOTAL_ENTRANCE_FEE);
    }

    @Test
    @Transactional
    void patchNonExistingEventDetails() throws Exception {
        int databaseSizeBeforeUpdate = eventDetailsRepository.findAll().size();
        eventDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, eventDetails.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventDetails in the database
        List<EventDetails> eventDetailsList = eventDetailsRepository.findAll();
        assertThat(eventDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEventDetails() throws Exception {
        int databaseSizeBeforeUpdate = eventDetailsRepository.findAll().size();
        eventDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventDetails in the database
        List<EventDetails> eventDetailsList = eventDetailsRepository.findAll();
        assertThat(eventDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEventDetails() throws Exception {
        int databaseSizeBeforeUpdate = eventDetailsRepository.findAll().size();
        eventDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventDetails in the database
        List<EventDetails> eventDetailsList = eventDetailsRepository.findAll();
        assertThat(eventDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEventDetails() throws Exception {
        // Initialize the database
        eventDetailsRepository.saveAndFlush(eventDetails);

        int databaseSizeBeforeDelete = eventDetailsRepository.findAll().size();

        // Delete the eventDetails
        restEventDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, eventDetails.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EventDetails> eventDetailsList = eventDetailsRepository.findAll();
        assertThat(eventDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
