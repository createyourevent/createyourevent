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
import org.createyourevent.app.domain.EventProductRatingComment;
import org.createyourevent.app.repository.EventProductRatingCommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EventProductRatingCommentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EventProductRatingCommentResourceIT {

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/event-product-rating-comments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EventProductRatingCommentRepository eventProductRatingCommentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventProductRatingCommentMockMvc;

    private EventProductRatingComment eventProductRatingComment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventProductRatingComment createEntity(EntityManager em) {
        EventProductRatingComment eventProductRatingComment = new EventProductRatingComment().comment(DEFAULT_COMMENT).date(DEFAULT_DATE);
        return eventProductRatingComment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventProductRatingComment createUpdatedEntity(EntityManager em) {
        EventProductRatingComment eventProductRatingComment = new EventProductRatingComment().comment(UPDATED_COMMENT).date(UPDATED_DATE);
        return eventProductRatingComment;
    }

    @BeforeEach
    public void initTest() {
        eventProductRatingComment = createEntity(em);
    }

    @Test
    @Transactional
    void createEventProductRatingComment() throws Exception {
        int databaseSizeBeforeCreate = eventProductRatingCommentRepository.findAll().size();
        // Create the EventProductRatingComment
        restEventProductRatingCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRatingComment))
            )
            .andExpect(status().isCreated());

        // Validate the EventProductRatingComment in the database
        List<EventProductRatingComment> eventProductRatingCommentList = eventProductRatingCommentRepository.findAll();
        assertThat(eventProductRatingCommentList).hasSize(databaseSizeBeforeCreate + 1);
        EventProductRatingComment testEventProductRatingComment = eventProductRatingCommentList.get(
            eventProductRatingCommentList.size() - 1
        );
        assertThat(testEventProductRatingComment.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testEventProductRatingComment.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createEventProductRatingCommentWithExistingId() throws Exception {
        // Create the EventProductRatingComment with an existing ID
        eventProductRatingComment.setId(1L);

        int databaseSizeBeforeCreate = eventProductRatingCommentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventProductRatingCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRatingComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductRatingComment in the database
        List<EventProductRatingComment> eventProductRatingCommentList = eventProductRatingCommentRepository.findAll();
        assertThat(eventProductRatingCommentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEventProductRatingComments() throws Exception {
        // Initialize the database
        eventProductRatingCommentRepository.saveAndFlush(eventProductRatingComment);

        // Get all the eventProductRatingCommentList
        restEventProductRatingCommentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventProductRatingComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    @Transactional
    void getEventProductRatingComment() throws Exception {
        // Initialize the database
        eventProductRatingCommentRepository.saveAndFlush(eventProductRatingComment);

        // Get the eventProductRatingComment
        restEventProductRatingCommentMockMvc
            .perform(get(ENTITY_API_URL_ID, eventProductRatingComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(eventProductRatingComment.getId().intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingEventProductRatingComment() throws Exception {
        // Get the eventProductRatingComment
        restEventProductRatingCommentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEventProductRatingComment() throws Exception {
        // Initialize the database
        eventProductRatingCommentRepository.saveAndFlush(eventProductRatingComment);

        int databaseSizeBeforeUpdate = eventProductRatingCommentRepository.findAll().size();

        // Update the eventProductRatingComment
        EventProductRatingComment updatedEventProductRatingComment = eventProductRatingCommentRepository
            .findById(eventProductRatingComment.getId())
            .get();
        // Disconnect from session so that the updates on updatedEventProductRatingComment are not directly saved in db
        em.detach(updatedEventProductRatingComment);
        updatedEventProductRatingComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restEventProductRatingCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEventProductRatingComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEventProductRatingComment))
            )
            .andExpect(status().isOk());

        // Validate the EventProductRatingComment in the database
        List<EventProductRatingComment> eventProductRatingCommentList = eventProductRatingCommentRepository.findAll();
        assertThat(eventProductRatingCommentList).hasSize(databaseSizeBeforeUpdate);
        EventProductRatingComment testEventProductRatingComment = eventProductRatingCommentList.get(
            eventProductRatingCommentList.size() - 1
        );
        assertThat(testEventProductRatingComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testEventProductRatingComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingEventProductRatingComment() throws Exception {
        int databaseSizeBeforeUpdate = eventProductRatingCommentRepository.findAll().size();
        eventProductRatingComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventProductRatingCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, eventProductRatingComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRatingComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductRatingComment in the database
        List<EventProductRatingComment> eventProductRatingCommentList = eventProductRatingCommentRepository.findAll();
        assertThat(eventProductRatingCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEventProductRatingComment() throws Exception {
        int databaseSizeBeforeUpdate = eventProductRatingCommentRepository.findAll().size();
        eventProductRatingComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventProductRatingCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRatingComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductRatingComment in the database
        List<EventProductRatingComment> eventProductRatingCommentList = eventProductRatingCommentRepository.findAll();
        assertThat(eventProductRatingCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEventProductRatingComment() throws Exception {
        int databaseSizeBeforeUpdate = eventProductRatingCommentRepository.findAll().size();
        eventProductRatingComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventProductRatingCommentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRatingComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventProductRatingComment in the database
        List<EventProductRatingComment> eventProductRatingCommentList = eventProductRatingCommentRepository.findAll();
        assertThat(eventProductRatingCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventProductRatingCommentWithPatch() throws Exception {
        // Initialize the database
        eventProductRatingCommentRepository.saveAndFlush(eventProductRatingComment);

        int databaseSizeBeforeUpdate = eventProductRatingCommentRepository.findAll().size();

        // Update the eventProductRatingComment using partial update
        EventProductRatingComment partialUpdatedEventProductRatingComment = new EventProductRatingComment();
        partialUpdatedEventProductRatingComment.setId(eventProductRatingComment.getId());

        partialUpdatedEventProductRatingComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restEventProductRatingCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventProductRatingComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventProductRatingComment))
            )
            .andExpect(status().isOk());

        // Validate the EventProductRatingComment in the database
        List<EventProductRatingComment> eventProductRatingCommentList = eventProductRatingCommentRepository.findAll();
        assertThat(eventProductRatingCommentList).hasSize(databaseSizeBeforeUpdate);
        EventProductRatingComment testEventProductRatingComment = eventProductRatingCommentList.get(
            eventProductRatingCommentList.size() - 1
        );
        assertThat(testEventProductRatingComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testEventProductRatingComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateEventProductRatingCommentWithPatch() throws Exception {
        // Initialize the database
        eventProductRatingCommentRepository.saveAndFlush(eventProductRatingComment);

        int databaseSizeBeforeUpdate = eventProductRatingCommentRepository.findAll().size();

        // Update the eventProductRatingComment using partial update
        EventProductRatingComment partialUpdatedEventProductRatingComment = new EventProductRatingComment();
        partialUpdatedEventProductRatingComment.setId(eventProductRatingComment.getId());

        partialUpdatedEventProductRatingComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restEventProductRatingCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventProductRatingComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventProductRatingComment))
            )
            .andExpect(status().isOk());

        // Validate the EventProductRatingComment in the database
        List<EventProductRatingComment> eventProductRatingCommentList = eventProductRatingCommentRepository.findAll();
        assertThat(eventProductRatingCommentList).hasSize(databaseSizeBeforeUpdate);
        EventProductRatingComment testEventProductRatingComment = eventProductRatingCommentList.get(
            eventProductRatingCommentList.size() - 1
        );
        assertThat(testEventProductRatingComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testEventProductRatingComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingEventProductRatingComment() throws Exception {
        int databaseSizeBeforeUpdate = eventProductRatingCommentRepository.findAll().size();
        eventProductRatingComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventProductRatingCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, eventProductRatingComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRatingComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductRatingComment in the database
        List<EventProductRatingComment> eventProductRatingCommentList = eventProductRatingCommentRepository.findAll();
        assertThat(eventProductRatingCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEventProductRatingComment() throws Exception {
        int databaseSizeBeforeUpdate = eventProductRatingCommentRepository.findAll().size();
        eventProductRatingComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventProductRatingCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRatingComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventProductRatingComment in the database
        List<EventProductRatingComment> eventProductRatingCommentList = eventProductRatingCommentRepository.findAll();
        assertThat(eventProductRatingCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEventProductRatingComment() throws Exception {
        int databaseSizeBeforeUpdate = eventProductRatingCommentRepository.findAll().size();
        eventProductRatingComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventProductRatingCommentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventProductRatingComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventProductRatingComment in the database
        List<EventProductRatingComment> eventProductRatingCommentList = eventProductRatingCommentRepository.findAll();
        assertThat(eventProductRatingCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEventProductRatingComment() throws Exception {
        // Initialize the database
        eventProductRatingCommentRepository.saveAndFlush(eventProductRatingComment);

        int databaseSizeBeforeDelete = eventProductRatingCommentRepository.findAll().size();

        // Delete the eventProductRatingComment
        restEventProductRatingCommentMockMvc
            .perform(delete(ENTITY_API_URL_ID, eventProductRatingComment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EventProductRatingComment> eventProductRatingCommentList = eventProductRatingCommentRepository.findAll();
        assertThat(eventProductRatingCommentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
