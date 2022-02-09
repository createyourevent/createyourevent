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
import org.createyourevent.app.domain.EventStarRating;
import org.createyourevent.app.repository.EventStarRatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EventStarRatingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EventStarRatingResourceIT {

    private static final Integer DEFAULT_STARS = 1;
    private static final Integer UPDATED_STARS = 2;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/event-star-ratings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EventStarRatingRepository eventStarRatingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventStarRatingMockMvc;

    private EventStarRating eventStarRating;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventStarRating createEntity(EntityManager em) {
        EventStarRating eventStarRating = new EventStarRating().stars(DEFAULT_STARS).date(DEFAULT_DATE).comment(DEFAULT_COMMENT);
        return eventStarRating;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventStarRating createUpdatedEntity(EntityManager em) {
        EventStarRating eventStarRating = new EventStarRating().stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);
        return eventStarRating;
    }

    @BeforeEach
    public void initTest() {
        eventStarRating = createEntity(em);
    }

    @Test
    @Transactional
    void createEventStarRating() throws Exception {
        int databaseSizeBeforeCreate = eventStarRatingRepository.findAll().size();
        // Create the EventStarRating
        restEventStarRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventStarRating))
            )
            .andExpect(status().isCreated());

        // Validate the EventStarRating in the database
        List<EventStarRating> eventStarRatingList = eventStarRatingRepository.findAll();
        assertThat(eventStarRatingList).hasSize(databaseSizeBeforeCreate + 1);
        EventStarRating testEventStarRating = eventStarRatingList.get(eventStarRatingList.size() - 1);
        assertThat(testEventStarRating.getStars()).isEqualTo(DEFAULT_STARS);
        assertThat(testEventStarRating.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEventStarRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createEventStarRatingWithExistingId() throws Exception {
        // Create the EventStarRating with an existing ID
        eventStarRating.setId(1L);

        int databaseSizeBeforeCreate = eventStarRatingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventStarRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventStarRating in the database
        List<EventStarRating> eventStarRatingList = eventStarRatingRepository.findAll();
        assertThat(eventStarRatingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEventStarRatings() throws Exception {
        // Initialize the database
        eventStarRatingRepository.saveAndFlush(eventStarRating);

        // Get all the eventStarRatingList
        restEventStarRatingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventStarRating.getId().intValue())))
            .andExpect(jsonPath("$.[*].stars").value(hasItem(DEFAULT_STARS)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getEventStarRating() throws Exception {
        // Initialize the database
        eventStarRatingRepository.saveAndFlush(eventStarRating);

        // Get the eventStarRating
        restEventStarRatingMockMvc
            .perform(get(ENTITY_API_URL_ID, eventStarRating.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(eventStarRating.getId().intValue()))
            .andExpect(jsonPath("$.stars").value(DEFAULT_STARS))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingEventStarRating() throws Exception {
        // Get the eventStarRating
        restEventStarRatingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEventStarRating() throws Exception {
        // Initialize the database
        eventStarRatingRepository.saveAndFlush(eventStarRating);

        int databaseSizeBeforeUpdate = eventStarRatingRepository.findAll().size();

        // Update the eventStarRating
        EventStarRating updatedEventStarRating = eventStarRatingRepository.findById(eventStarRating.getId()).get();
        // Disconnect from session so that the updates on updatedEventStarRating are not directly saved in db
        em.detach(updatedEventStarRating);
        updatedEventStarRating.stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restEventStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEventStarRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEventStarRating))
            )
            .andExpect(status().isOk());

        // Validate the EventStarRating in the database
        List<EventStarRating> eventStarRatingList = eventStarRatingRepository.findAll();
        assertThat(eventStarRatingList).hasSize(databaseSizeBeforeUpdate);
        EventStarRating testEventStarRating = eventStarRatingList.get(eventStarRatingList.size() - 1);
        assertThat(testEventStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testEventStarRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEventStarRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingEventStarRating() throws Exception {
        int databaseSizeBeforeUpdate = eventStarRatingRepository.findAll().size();
        eventStarRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, eventStarRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventStarRating in the database
        List<EventStarRating> eventStarRatingList = eventStarRatingRepository.findAll();
        assertThat(eventStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEventStarRating() throws Exception {
        int databaseSizeBeforeUpdate = eventStarRatingRepository.findAll().size();
        eventStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventStarRating in the database
        List<EventStarRating> eventStarRatingList = eventStarRatingRepository.findAll();
        assertThat(eventStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEventStarRating() throws Exception {
        int databaseSizeBeforeUpdate = eventStarRatingRepository.findAll().size();
        eventStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventStarRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventStarRating in the database
        List<EventStarRating> eventStarRatingList = eventStarRatingRepository.findAll();
        assertThat(eventStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventStarRatingWithPatch() throws Exception {
        // Initialize the database
        eventStarRatingRepository.saveAndFlush(eventStarRating);

        int databaseSizeBeforeUpdate = eventStarRatingRepository.findAll().size();

        // Update the eventStarRating using partial update
        EventStarRating partialUpdatedEventStarRating = new EventStarRating();
        partialUpdatedEventStarRating.setId(eventStarRating.getId());

        partialUpdatedEventStarRating.stars(UPDATED_STARS).comment(UPDATED_COMMENT);

        restEventStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventStarRating))
            )
            .andExpect(status().isOk());

        // Validate the EventStarRating in the database
        List<EventStarRating> eventStarRatingList = eventStarRatingRepository.findAll();
        assertThat(eventStarRatingList).hasSize(databaseSizeBeforeUpdate);
        EventStarRating testEventStarRating = eventStarRatingList.get(eventStarRatingList.size() - 1);
        assertThat(testEventStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testEventStarRating.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEventStarRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateEventStarRatingWithPatch() throws Exception {
        // Initialize the database
        eventStarRatingRepository.saveAndFlush(eventStarRating);

        int databaseSizeBeforeUpdate = eventStarRatingRepository.findAll().size();

        // Update the eventStarRating using partial update
        EventStarRating partialUpdatedEventStarRating = new EventStarRating();
        partialUpdatedEventStarRating.setId(eventStarRating.getId());

        partialUpdatedEventStarRating.stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restEventStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventStarRating))
            )
            .andExpect(status().isOk());

        // Validate the EventStarRating in the database
        List<EventStarRating> eventStarRatingList = eventStarRatingRepository.findAll();
        assertThat(eventStarRatingList).hasSize(databaseSizeBeforeUpdate);
        EventStarRating testEventStarRating = eventStarRatingList.get(eventStarRatingList.size() - 1);
        assertThat(testEventStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testEventStarRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEventStarRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingEventStarRating() throws Exception {
        int databaseSizeBeforeUpdate = eventStarRatingRepository.findAll().size();
        eventStarRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, eventStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventStarRating in the database
        List<EventStarRating> eventStarRatingList = eventStarRatingRepository.findAll();
        assertThat(eventStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEventStarRating() throws Exception {
        int databaseSizeBeforeUpdate = eventStarRatingRepository.findAll().size();
        eventStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventStarRating in the database
        List<EventStarRating> eventStarRatingList = eventStarRatingRepository.findAll();
        assertThat(eventStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEventStarRating() throws Exception {
        int databaseSizeBeforeUpdate = eventStarRatingRepository.findAll().size();
        eventStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventStarRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventStarRating in the database
        List<EventStarRating> eventStarRatingList = eventStarRatingRepository.findAll();
        assertThat(eventStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEventStarRating() throws Exception {
        // Initialize the database
        eventStarRatingRepository.saveAndFlush(eventStarRating);

        int databaseSizeBeforeDelete = eventStarRatingRepository.findAll().size();

        // Delete the eventStarRating
        restEventStarRatingMockMvc
            .perform(delete(ENTITY_API_URL_ID, eventStarRating.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EventStarRating> eventStarRatingList = eventStarRatingRepository.findAll();
        assertThat(eventStarRatingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
