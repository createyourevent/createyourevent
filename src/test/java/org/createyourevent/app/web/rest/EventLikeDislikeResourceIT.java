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
import org.createyourevent.app.domain.EventLikeDislike;
import org.createyourevent.app.repository.EventLikeDislikeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EventLikeDislikeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EventLikeDislikeResourceIT {

    private static final Integer DEFAULT_LIKE = 1;
    private static final Integer UPDATED_LIKE = 2;

    private static final Integer DEFAULT_DISLIKE = 1;
    private static final Integer UPDATED_DISLIKE = 2;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/event-like-dislikes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EventLikeDislikeRepository eventLikeDislikeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventLikeDislikeMockMvc;

    private EventLikeDislike eventLikeDislike;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventLikeDislike createEntity(EntityManager em) {
        EventLikeDislike eventLikeDislike = new EventLikeDislike()
            .like(DEFAULT_LIKE)
            .dislike(DEFAULT_DISLIKE)
            .date(DEFAULT_DATE)
            .comment(DEFAULT_COMMENT);
        return eventLikeDislike;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventLikeDislike createUpdatedEntity(EntityManager em) {
        EventLikeDislike eventLikeDislike = new EventLikeDislike()
            .like(UPDATED_LIKE)
            .dislike(UPDATED_DISLIKE)
            .date(UPDATED_DATE)
            .comment(UPDATED_COMMENT);
        return eventLikeDislike;
    }

    @BeforeEach
    public void initTest() {
        eventLikeDislike = createEntity(em);
    }

    @Test
    @Transactional
    void createEventLikeDislike() throws Exception {
        int databaseSizeBeforeCreate = eventLikeDislikeRepository.findAll().size();
        // Create the EventLikeDislike
        restEventLikeDislikeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventLikeDislike))
            )
            .andExpect(status().isCreated());

        // Validate the EventLikeDislike in the database
        List<EventLikeDislike> eventLikeDislikeList = eventLikeDislikeRepository.findAll();
        assertThat(eventLikeDislikeList).hasSize(databaseSizeBeforeCreate + 1);
        EventLikeDislike testEventLikeDislike = eventLikeDislikeList.get(eventLikeDislikeList.size() - 1);
        assertThat(testEventLikeDislike.getLike()).isEqualTo(DEFAULT_LIKE);
        assertThat(testEventLikeDislike.getDislike()).isEqualTo(DEFAULT_DISLIKE);
        assertThat(testEventLikeDislike.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEventLikeDislike.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createEventLikeDislikeWithExistingId() throws Exception {
        // Create the EventLikeDislike with an existing ID
        eventLikeDislike.setId(1L);

        int databaseSizeBeforeCreate = eventLikeDislikeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventLikeDislikeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventLikeDislike in the database
        List<EventLikeDislike> eventLikeDislikeList = eventLikeDislikeRepository.findAll();
        assertThat(eventLikeDislikeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEventLikeDislikes() throws Exception {
        // Initialize the database
        eventLikeDislikeRepository.saveAndFlush(eventLikeDislike);

        // Get all the eventLikeDislikeList
        restEventLikeDislikeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventLikeDislike.getId().intValue())))
            .andExpect(jsonPath("$.[*].like").value(hasItem(DEFAULT_LIKE)))
            .andExpect(jsonPath("$.[*].dislike").value(hasItem(DEFAULT_DISLIKE)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getEventLikeDislike() throws Exception {
        // Initialize the database
        eventLikeDislikeRepository.saveAndFlush(eventLikeDislike);

        // Get the eventLikeDislike
        restEventLikeDislikeMockMvc
            .perform(get(ENTITY_API_URL_ID, eventLikeDislike.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(eventLikeDislike.getId().intValue()))
            .andExpect(jsonPath("$.like").value(DEFAULT_LIKE))
            .andExpect(jsonPath("$.dislike").value(DEFAULT_DISLIKE))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingEventLikeDislike() throws Exception {
        // Get the eventLikeDislike
        restEventLikeDislikeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEventLikeDislike() throws Exception {
        // Initialize the database
        eventLikeDislikeRepository.saveAndFlush(eventLikeDislike);

        int databaseSizeBeforeUpdate = eventLikeDislikeRepository.findAll().size();

        // Update the eventLikeDislike
        EventLikeDislike updatedEventLikeDislike = eventLikeDislikeRepository.findById(eventLikeDislike.getId()).get();
        // Disconnect from session so that the updates on updatedEventLikeDislike are not directly saved in db
        em.detach(updatedEventLikeDislike);
        updatedEventLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restEventLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEventLikeDislike.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEventLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the EventLikeDislike in the database
        List<EventLikeDislike> eventLikeDislikeList = eventLikeDislikeRepository.findAll();
        assertThat(eventLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        EventLikeDislike testEventLikeDislike = eventLikeDislikeList.get(eventLikeDislikeList.size() - 1);
        assertThat(testEventLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testEventLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testEventLikeDislike.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEventLikeDislike.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingEventLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = eventLikeDislikeRepository.findAll().size();
        eventLikeDislike.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, eventLikeDislike.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventLikeDislike in the database
        List<EventLikeDislike> eventLikeDislikeList = eventLikeDislikeRepository.findAll();
        assertThat(eventLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEventLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = eventLikeDislikeRepository.findAll().size();
        eventLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventLikeDislike in the database
        List<EventLikeDislike> eventLikeDislikeList = eventLikeDislikeRepository.findAll();
        assertThat(eventLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEventLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = eventLikeDislikeRepository.findAll().size();
        eventLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventLikeDislike))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventLikeDislike in the database
        List<EventLikeDislike> eventLikeDislikeList = eventLikeDislikeRepository.findAll();
        assertThat(eventLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventLikeDislikeWithPatch() throws Exception {
        // Initialize the database
        eventLikeDislikeRepository.saveAndFlush(eventLikeDislike);

        int databaseSizeBeforeUpdate = eventLikeDislikeRepository.findAll().size();

        // Update the eventLikeDislike using partial update
        EventLikeDislike partialUpdatedEventLikeDislike = new EventLikeDislike();
        partialUpdatedEventLikeDislike.setId(eventLikeDislike.getId());

        partialUpdatedEventLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE);

        restEventLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the EventLikeDislike in the database
        List<EventLikeDislike> eventLikeDislikeList = eventLikeDislikeRepository.findAll();
        assertThat(eventLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        EventLikeDislike testEventLikeDislike = eventLikeDislikeList.get(eventLikeDislikeList.size() - 1);
        assertThat(testEventLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testEventLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testEventLikeDislike.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testEventLikeDislike.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateEventLikeDislikeWithPatch() throws Exception {
        // Initialize the database
        eventLikeDislikeRepository.saveAndFlush(eventLikeDislike);

        int databaseSizeBeforeUpdate = eventLikeDislikeRepository.findAll().size();

        // Update the eventLikeDislike using partial update
        EventLikeDislike partialUpdatedEventLikeDislike = new EventLikeDislike();
        partialUpdatedEventLikeDislike.setId(eventLikeDislike.getId());

        partialUpdatedEventLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restEventLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the EventLikeDislike in the database
        List<EventLikeDislike> eventLikeDislikeList = eventLikeDislikeRepository.findAll();
        assertThat(eventLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        EventLikeDislike testEventLikeDislike = eventLikeDislikeList.get(eventLikeDislikeList.size() - 1);
        assertThat(testEventLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testEventLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testEventLikeDislike.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testEventLikeDislike.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingEventLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = eventLikeDislikeRepository.findAll().size();
        eventLikeDislike.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, eventLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventLikeDislike in the database
        List<EventLikeDislike> eventLikeDislikeList = eventLikeDislikeRepository.findAll();
        assertThat(eventLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEventLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = eventLikeDislikeRepository.findAll().size();
        eventLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventLikeDislike in the database
        List<EventLikeDislike> eventLikeDislikeList = eventLikeDislikeRepository.findAll();
        assertThat(eventLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEventLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = eventLikeDislikeRepository.findAll().size();
        eventLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventLikeDislike))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventLikeDislike in the database
        List<EventLikeDislike> eventLikeDislikeList = eventLikeDislikeRepository.findAll();
        assertThat(eventLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEventLikeDislike() throws Exception {
        // Initialize the database
        eventLikeDislikeRepository.saveAndFlush(eventLikeDislike);

        int databaseSizeBeforeDelete = eventLikeDislikeRepository.findAll().size();

        // Delete the eventLikeDislike
        restEventLikeDislikeMockMvc
            .perform(delete(ENTITY_API_URL_ID, eventLikeDislike.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EventLikeDislike> eventLikeDislikeList = eventLikeDislikeRepository.findAll();
        assertThat(eventLikeDislikeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
