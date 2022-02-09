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
import org.createyourevent.app.domain.EventProductRating;
import org.createyourevent.app.repository.EventProductRatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EventProductRatingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EventProductRatingResourceIT {

    private static final Integer DEFAULT_LIKE = 1;
    private static final Integer UPDATED_LIKE = 2;

    private static final Integer DEFAULT_DISLIKE = 1;
    private static final Integer UPDATED_DISLIKE = 2;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/event-product-ratings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EventProductRatingRepository eventProductRatingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventProductRatingMockMvc;

    private EventProductRating eventProductRating;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventProductRating createEntity(EntityManager em) {
        EventProductRating eventProductRating = new EventProductRating()
            .like(DEFAULT_LIKE)
            .dislike(DEFAULT_DISLIKE)
            .date(DEFAULT_DATE)
            .comment(DEFAULT_COMMENT);
        return eventProductRating;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventProductRating createUpdatedEntity(EntityManager em) {
        EventProductRating eventProductRating = new EventProductRating()
            .like(UPDATED_LIKE)
            .dislike(UPDATED_DISLIKE)
            .date(UPDATED_DATE)
            .comment(UPDATED_COMMENT);
        return eventProductRating;
    }

    @BeforeEach
    public void initTest() {
        eventProductRating = createEntity(em);
    }

    @Test
    @Transactional
    void createEventProductRating() throws Exception {
        int databaseSizeBeforeCreate = eventProductRatingRepository.findAll().size();
        // Create the EventProductRating
        restEventProductRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRating))
            )
            .andExpect(status().isCreated());

        // Validate the EventProductRating in the database
        List<EventProductRating> eventProductRatingList = eventProductRatingRepository.findAll();
        assertThat(eventProductRatingList).hasSize(databaseSizeBeforeCreate + 1);
        EventProductRating testEventProductRating = eventProductRatingList.get(eventProductRatingList.size() - 1);
        assertThat(testEventProductRating.getLike()).isEqualTo(DEFAULT_LIKE);
        assertThat(testEventProductRating.getDislike()).isEqualTo(DEFAULT_DISLIKE);
        assertThat(testEventProductRating.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEventProductRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createEventProductRatingWithExistingId() throws Exception {
        // Create the EventProductRating with an existing ID
        eventProductRating.setId(1L);

        int databaseSizeBeforeCreate = eventProductRatingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventProductRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductRating in the database
        List<EventProductRating> eventProductRatingList = eventProductRatingRepository.findAll();
        assertThat(eventProductRatingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEventProductRatings() throws Exception {
        // Initialize the database
        eventProductRatingRepository.saveAndFlush(eventProductRating);

        // Get all the eventProductRatingList
        restEventProductRatingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventProductRating.getId().intValue())))
            .andExpect(jsonPath("$.[*].like").value(hasItem(DEFAULT_LIKE)))
            .andExpect(jsonPath("$.[*].dislike").value(hasItem(DEFAULT_DISLIKE)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getEventProductRating() throws Exception {
        // Initialize the database
        eventProductRatingRepository.saveAndFlush(eventProductRating);

        // Get the eventProductRating
        restEventProductRatingMockMvc
            .perform(get(ENTITY_API_URL_ID, eventProductRating.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(eventProductRating.getId().intValue()))
            .andExpect(jsonPath("$.like").value(DEFAULT_LIKE))
            .andExpect(jsonPath("$.dislike").value(DEFAULT_DISLIKE))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingEventProductRating() throws Exception {
        // Get the eventProductRating
        restEventProductRatingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEventProductRating() throws Exception {
        // Initialize the database
        eventProductRatingRepository.saveAndFlush(eventProductRating);

        int databaseSizeBeforeUpdate = eventProductRatingRepository.findAll().size();

        // Update the eventProductRating
        EventProductRating updatedEventProductRating = eventProductRatingRepository.findById(eventProductRating.getId()).get();
        // Disconnect from session so that the updates on updatedEventProductRating are not directly saved in db
        em.detach(updatedEventProductRating);
        updatedEventProductRating.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restEventProductRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEventProductRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEventProductRating))
            )
            .andExpect(status().isOk());

        // Validate the EventProductRating in the database
        List<EventProductRating> eventProductRatingList = eventProductRatingRepository.findAll();
        assertThat(eventProductRatingList).hasSize(databaseSizeBeforeUpdate);
        EventProductRating testEventProductRating = eventProductRatingList.get(eventProductRatingList.size() - 1);
        assertThat(testEventProductRating.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testEventProductRating.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testEventProductRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEventProductRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingEventProductRating() throws Exception {
        int databaseSizeBeforeUpdate = eventProductRatingRepository.findAll().size();
        eventProductRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventProductRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, eventProductRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductRating in the database
        List<EventProductRating> eventProductRatingList = eventProductRatingRepository.findAll();
        assertThat(eventProductRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEventProductRating() throws Exception {
        int databaseSizeBeforeUpdate = eventProductRatingRepository.findAll().size();
        eventProductRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventProductRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductRating in the database
        List<EventProductRating> eventProductRatingList = eventProductRatingRepository.findAll();
        assertThat(eventProductRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEventProductRating() throws Exception {
        int databaseSizeBeforeUpdate = eventProductRatingRepository.findAll().size();
        eventProductRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventProductRatingMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventProductRating in the database
        List<EventProductRating> eventProductRatingList = eventProductRatingRepository.findAll();
        assertThat(eventProductRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventProductRatingWithPatch() throws Exception {
        // Initialize the database
        eventProductRatingRepository.saveAndFlush(eventProductRating);

        int databaseSizeBeforeUpdate = eventProductRatingRepository.findAll().size();

        // Update the eventProductRating using partial update
        EventProductRating partialUpdatedEventProductRating = new EventProductRating();
        partialUpdatedEventProductRating.setId(eventProductRating.getId());

        partialUpdatedEventProductRating.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE);

        restEventProductRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventProductRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventProductRating))
            )
            .andExpect(status().isOk());

        // Validate the EventProductRating in the database
        List<EventProductRating> eventProductRatingList = eventProductRatingRepository.findAll();
        assertThat(eventProductRatingList).hasSize(databaseSizeBeforeUpdate);
        EventProductRating testEventProductRating = eventProductRatingList.get(eventProductRatingList.size() - 1);
        assertThat(testEventProductRating.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testEventProductRating.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testEventProductRating.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEventProductRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateEventProductRatingWithPatch() throws Exception {
        // Initialize the database
        eventProductRatingRepository.saveAndFlush(eventProductRating);

        int databaseSizeBeforeUpdate = eventProductRatingRepository.findAll().size();

        // Update the eventProductRating using partial update
        EventProductRating partialUpdatedEventProductRating = new EventProductRating();
        partialUpdatedEventProductRating.setId(eventProductRating.getId());

        partialUpdatedEventProductRating.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restEventProductRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventProductRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventProductRating))
            )
            .andExpect(status().isOk());

        // Validate the EventProductRating in the database
        List<EventProductRating> eventProductRatingList = eventProductRatingRepository.findAll();
        assertThat(eventProductRatingList).hasSize(databaseSizeBeforeUpdate);
        EventProductRating testEventProductRating = eventProductRatingList.get(eventProductRatingList.size() - 1);
        assertThat(testEventProductRating.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testEventProductRating.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testEventProductRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEventProductRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingEventProductRating() throws Exception {
        int databaseSizeBeforeUpdate = eventProductRatingRepository.findAll().size();
        eventProductRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventProductRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, eventProductRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductRating in the database
        List<EventProductRating> eventProductRatingList = eventProductRatingRepository.findAll();
        assertThat(eventProductRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEventProductRating() throws Exception {
        int databaseSizeBeforeUpdate = eventProductRatingRepository.findAll().size();
        eventProductRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventProductRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductRating in the database
        List<EventProductRating> eventProductRatingList = eventProductRatingRepository.findAll();
        assertThat(eventProductRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEventProductRating() throws Exception {
        int databaseSizeBeforeUpdate = eventProductRatingRepository.findAll().size();
        eventProductRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventProductRatingMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventProductRating in the database
        List<EventProductRating> eventProductRatingList = eventProductRatingRepository.findAll();
        assertThat(eventProductRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEventProductRating() throws Exception {
        // Initialize the database
        eventProductRatingRepository.saveAndFlush(eventProductRating);

        int databaseSizeBeforeDelete = eventProductRatingRepository.findAll().size();

        // Delete the eventProductRating
        restEventProductRatingMockMvc
            .perform(delete(ENTITY_API_URL_ID, eventProductRating.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EventProductRating> eventProductRatingList = eventProductRatingRepository.findAll();
        assertThat(eventProductRatingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
