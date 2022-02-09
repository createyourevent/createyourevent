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
import org.createyourevent.app.domain.ServiceComment;
import org.createyourevent.app.repository.ServiceCommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ServiceCommentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ServiceCommentResourceIT {

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/service-comments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ServiceCommentRepository serviceCommentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restServiceCommentMockMvc;

    private ServiceComment serviceComment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceComment createEntity(EntityManager em) {
        ServiceComment serviceComment = new ServiceComment().comment(DEFAULT_COMMENT).date(DEFAULT_DATE);
        return serviceComment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceComment createUpdatedEntity(EntityManager em) {
        ServiceComment serviceComment = new ServiceComment().comment(UPDATED_COMMENT).date(UPDATED_DATE);
        return serviceComment;
    }

    @BeforeEach
    public void initTest() {
        serviceComment = createEntity(em);
    }

    @Test
    @Transactional
    void createServiceComment() throws Exception {
        int databaseSizeBeforeCreate = serviceCommentRepository.findAll().size();
        // Create the ServiceComment
        restServiceCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceComment))
            )
            .andExpect(status().isCreated());

        // Validate the ServiceComment in the database
        List<ServiceComment> serviceCommentList = serviceCommentRepository.findAll();
        assertThat(serviceCommentList).hasSize(databaseSizeBeforeCreate + 1);
        ServiceComment testServiceComment = serviceCommentList.get(serviceCommentList.size() - 1);
        assertThat(testServiceComment.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testServiceComment.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createServiceCommentWithExistingId() throws Exception {
        // Create the ServiceComment with an existing ID
        serviceComment.setId(1L);

        int databaseSizeBeforeCreate = serviceCommentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restServiceCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceComment in the database
        List<ServiceComment> serviceCommentList = serviceCommentRepository.findAll();
        assertThat(serviceCommentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllServiceComments() throws Exception {
        // Initialize the database
        serviceCommentRepository.saveAndFlush(serviceComment);

        // Get all the serviceCommentList
        restServiceCommentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(serviceComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    @Transactional
    void getServiceComment() throws Exception {
        // Initialize the database
        serviceCommentRepository.saveAndFlush(serviceComment);

        // Get the serviceComment
        restServiceCommentMockMvc
            .perform(get(ENTITY_API_URL_ID, serviceComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(serviceComment.getId().intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingServiceComment() throws Exception {
        // Get the serviceComment
        restServiceCommentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewServiceComment() throws Exception {
        // Initialize the database
        serviceCommentRepository.saveAndFlush(serviceComment);

        int databaseSizeBeforeUpdate = serviceCommentRepository.findAll().size();

        // Update the serviceComment
        ServiceComment updatedServiceComment = serviceCommentRepository.findById(serviceComment.getId()).get();
        // Disconnect from session so that the updates on updatedServiceComment are not directly saved in db
        em.detach(updatedServiceComment);
        updatedServiceComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restServiceCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedServiceComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedServiceComment))
            )
            .andExpect(status().isOk());

        // Validate the ServiceComment in the database
        List<ServiceComment> serviceCommentList = serviceCommentRepository.findAll();
        assertThat(serviceCommentList).hasSize(databaseSizeBeforeUpdate);
        ServiceComment testServiceComment = serviceCommentList.get(serviceCommentList.size() - 1);
        assertThat(testServiceComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testServiceComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingServiceComment() throws Exception {
        int databaseSizeBeforeUpdate = serviceCommentRepository.findAll().size();
        serviceComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, serviceComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceComment in the database
        List<ServiceComment> serviceCommentList = serviceCommentRepository.findAll();
        assertThat(serviceCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchServiceComment() throws Exception {
        int databaseSizeBeforeUpdate = serviceCommentRepository.findAll().size();
        serviceComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceComment in the database
        List<ServiceComment> serviceCommentList = serviceCommentRepository.findAll();
        assertThat(serviceCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamServiceComment() throws Exception {
        int databaseSizeBeforeUpdate = serviceCommentRepository.findAll().size();
        serviceComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceCommentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceComment in the database
        List<ServiceComment> serviceCommentList = serviceCommentRepository.findAll();
        assertThat(serviceCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateServiceCommentWithPatch() throws Exception {
        // Initialize the database
        serviceCommentRepository.saveAndFlush(serviceComment);

        int databaseSizeBeforeUpdate = serviceCommentRepository.findAll().size();

        // Update the serviceComment using partial update
        ServiceComment partialUpdatedServiceComment = new ServiceComment();
        partialUpdatedServiceComment.setId(serviceComment.getId());

        partialUpdatedServiceComment.comment(UPDATED_COMMENT);

        restServiceCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceComment))
            )
            .andExpect(status().isOk());

        // Validate the ServiceComment in the database
        List<ServiceComment> serviceCommentList = serviceCommentRepository.findAll();
        assertThat(serviceCommentList).hasSize(databaseSizeBeforeUpdate);
        ServiceComment testServiceComment = serviceCommentList.get(serviceCommentList.size() - 1);
        assertThat(testServiceComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testServiceComment.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateServiceCommentWithPatch() throws Exception {
        // Initialize the database
        serviceCommentRepository.saveAndFlush(serviceComment);

        int databaseSizeBeforeUpdate = serviceCommentRepository.findAll().size();

        // Update the serviceComment using partial update
        ServiceComment partialUpdatedServiceComment = new ServiceComment();
        partialUpdatedServiceComment.setId(serviceComment.getId());

        partialUpdatedServiceComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restServiceCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceComment))
            )
            .andExpect(status().isOk());

        // Validate the ServiceComment in the database
        List<ServiceComment> serviceCommentList = serviceCommentRepository.findAll();
        assertThat(serviceCommentList).hasSize(databaseSizeBeforeUpdate);
        ServiceComment testServiceComment = serviceCommentList.get(serviceCommentList.size() - 1);
        assertThat(testServiceComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testServiceComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingServiceComment() throws Exception {
        int databaseSizeBeforeUpdate = serviceCommentRepository.findAll().size();
        serviceComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, serviceComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceComment in the database
        List<ServiceComment> serviceCommentList = serviceCommentRepository.findAll();
        assertThat(serviceCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchServiceComment() throws Exception {
        int databaseSizeBeforeUpdate = serviceCommentRepository.findAll().size();
        serviceComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceComment in the database
        List<ServiceComment> serviceCommentList = serviceCommentRepository.findAll();
        assertThat(serviceCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamServiceComment() throws Exception {
        int databaseSizeBeforeUpdate = serviceCommentRepository.findAll().size();
        serviceComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceCommentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceComment in the database
        List<ServiceComment> serviceCommentList = serviceCommentRepository.findAll();
        assertThat(serviceCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteServiceComment() throws Exception {
        // Initialize the database
        serviceCommentRepository.saveAndFlush(serviceComment);

        int databaseSizeBeforeDelete = serviceCommentRepository.findAll().size();

        // Delete the serviceComment
        restServiceCommentMockMvc
            .perform(delete(ENTITY_API_URL_ID, serviceComment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ServiceComment> serviceCommentList = serviceCommentRepository.findAll();
        assertThat(serviceCommentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
