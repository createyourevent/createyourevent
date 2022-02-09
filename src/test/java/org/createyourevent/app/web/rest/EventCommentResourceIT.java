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
import org.createyourevent.app.domain.EventComment;
import org.createyourevent.app.repository.EventCommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EventCommentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EventCommentResourceIT {

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/event-comments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EventCommentRepository eventCommentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventCommentMockMvc;

    private EventComment eventComment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventComment createEntity(EntityManager em) {
        EventComment eventComment = new EventComment().comment(DEFAULT_COMMENT).date(DEFAULT_DATE);
        return eventComment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventComment createUpdatedEntity(EntityManager em) {
        EventComment eventComment = new EventComment().comment(UPDATED_COMMENT).date(UPDATED_DATE);
        return eventComment;
    }

    @BeforeEach
    public void initTest() {
        eventComment = createEntity(em);
    }

    @Test
    @Transactional
    void createEventComment() throws Exception {
        int databaseSizeBeforeCreate = eventCommentRepository.findAll().size();
        // Create the EventComment
        restEventCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventComment))
            )
            .andExpect(status().isCreated());

        // Validate the EventComment in the database
        List<EventComment> eventCommentList = eventCommentRepository.findAll();
        assertThat(eventCommentList).hasSize(databaseSizeBeforeCreate + 1);
        EventComment testEventComment = eventCommentList.get(eventCommentList.size() - 1);
        assertThat(testEventComment.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testEventComment.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createEventCommentWithExistingId() throws Exception {
        // Create the EventComment with an existing ID
        eventComment.setId(1L);

        int databaseSizeBeforeCreate = eventCommentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventComment in the database
        List<EventComment> eventCommentList = eventCommentRepository.findAll();
        assertThat(eventCommentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEventComments() throws Exception {
        // Initialize the database
        eventCommentRepository.saveAndFlush(eventComment);

        // Get all the eventCommentList
        restEventCommentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    @Transactional
    void getEventComment() throws Exception {
        // Initialize the database
        eventCommentRepository.saveAndFlush(eventComment);

        // Get the eventComment
        restEventCommentMockMvc
            .perform(get(ENTITY_API_URL_ID, eventComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(eventComment.getId().intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingEventComment() throws Exception {
        // Get the eventComment
        restEventCommentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEventComment() throws Exception {
        // Initialize the database
        eventCommentRepository.saveAndFlush(eventComment);

        int databaseSizeBeforeUpdate = eventCommentRepository.findAll().size();

        // Update the eventComment
        EventComment updatedEventComment = eventCommentRepository.findById(eventComment.getId()).get();
        // Disconnect from session so that the updates on updatedEventComment are not directly saved in db
        em.detach(updatedEventComment);
        updatedEventComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restEventCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEventComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEventComment))
            )
            .andExpect(status().isOk());

        // Validate the EventComment in the database
        List<EventComment> eventCommentList = eventCommentRepository.findAll();
        assertThat(eventCommentList).hasSize(databaseSizeBeforeUpdate);
        EventComment testEventComment = eventCommentList.get(eventCommentList.size() - 1);
        assertThat(testEventComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testEventComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingEventComment() throws Exception {
        int databaseSizeBeforeUpdate = eventCommentRepository.findAll().size();
        eventComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, eventComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventComment in the database
        List<EventComment> eventCommentList = eventCommentRepository.findAll();
        assertThat(eventCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEventComment() throws Exception {
        int databaseSizeBeforeUpdate = eventCommentRepository.findAll().size();
        eventComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventComment in the database
        List<EventComment> eventCommentList = eventCommentRepository.findAll();
        assertThat(eventCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEventComment() throws Exception {
        int databaseSizeBeforeUpdate = eventCommentRepository.findAll().size();
        eventComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventCommentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventComment in the database
        List<EventComment> eventCommentList = eventCommentRepository.findAll();
        assertThat(eventCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventCommentWithPatch() throws Exception {
        // Initialize the database
        eventCommentRepository.saveAndFlush(eventComment);

        int databaseSizeBeforeUpdate = eventCommentRepository.findAll().size();

        // Update the eventComment using partial update
        EventComment partialUpdatedEventComment = new EventComment();
        partialUpdatedEventComment.setId(eventComment.getId());

        restEventCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventComment))
            )
            .andExpect(status().isOk());

        // Validate the EventComment in the database
        List<EventComment> eventCommentList = eventCommentRepository.findAll();
        assertThat(eventCommentList).hasSize(databaseSizeBeforeUpdate);
        EventComment testEventComment = eventCommentList.get(eventCommentList.size() - 1);
        assertThat(testEventComment.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testEventComment.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateEventCommentWithPatch() throws Exception {
        // Initialize the database
        eventCommentRepository.saveAndFlush(eventComment);

        int databaseSizeBeforeUpdate = eventCommentRepository.findAll().size();

        // Update the eventComment using partial update
        EventComment partialUpdatedEventComment = new EventComment();
        partialUpdatedEventComment.setId(eventComment.getId());

        partialUpdatedEventComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restEventCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventComment))
            )
            .andExpect(status().isOk());

        // Validate the EventComment in the database
        List<EventComment> eventCommentList = eventCommentRepository.findAll();
        assertThat(eventCommentList).hasSize(databaseSizeBeforeUpdate);
        EventComment testEventComment = eventCommentList.get(eventCommentList.size() - 1);
        assertThat(testEventComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testEventComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingEventComment() throws Exception {
        int databaseSizeBeforeUpdate = eventCommentRepository.findAll().size();
        eventComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, eventComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventComment in the database
        List<EventComment> eventCommentList = eventCommentRepository.findAll();
        assertThat(eventCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEventComment() throws Exception {
        int databaseSizeBeforeUpdate = eventCommentRepository.findAll().size();
        eventComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventComment in the database
        List<EventComment> eventCommentList = eventCommentRepository.findAll();
        assertThat(eventCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEventComment() throws Exception {
        int databaseSizeBeforeUpdate = eventCommentRepository.findAll().size();
        eventComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventCommentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventComment in the database
        List<EventComment> eventCommentList = eventCommentRepository.findAll();
        assertThat(eventCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEventComment() throws Exception {
        // Initialize the database
        eventCommentRepository.saveAndFlush(eventComment);

        int databaseSizeBeforeDelete = eventCommentRepository.findAll().size();

        // Delete the eventComment
        restEventCommentMockMvc
            .perform(delete(ENTITY_API_URL_ID, eventComment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EventComment> eventCommentList = eventCommentRepository.findAll();
        assertThat(eventCommentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
