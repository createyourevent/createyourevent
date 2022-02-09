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
import org.createyourevent.app.domain.OrganizationComment;
import org.createyourevent.app.repository.OrganizationCommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OrganizationCommentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrganizationCommentResourceIT {

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/organization-comments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrganizationCommentRepository organizationCommentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrganizationCommentMockMvc;

    private OrganizationComment organizationComment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrganizationComment createEntity(EntityManager em) {
        OrganizationComment organizationComment = new OrganizationComment().comment(DEFAULT_COMMENT).date(DEFAULT_DATE);
        return organizationComment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrganizationComment createUpdatedEntity(EntityManager em) {
        OrganizationComment organizationComment = new OrganizationComment().comment(UPDATED_COMMENT).date(UPDATED_DATE);
        return organizationComment;
    }

    @BeforeEach
    public void initTest() {
        organizationComment = createEntity(em);
    }

    @Test
    @Transactional
    void createOrganizationComment() throws Exception {
        int databaseSizeBeforeCreate = organizationCommentRepository.findAll().size();
        // Create the OrganizationComment
        restOrganizationCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationComment))
            )
            .andExpect(status().isCreated());

        // Validate the OrganizationComment in the database
        List<OrganizationComment> organizationCommentList = organizationCommentRepository.findAll();
        assertThat(organizationCommentList).hasSize(databaseSizeBeforeCreate + 1);
        OrganizationComment testOrganizationComment = organizationCommentList.get(organizationCommentList.size() - 1);
        assertThat(testOrganizationComment.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testOrganizationComment.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createOrganizationCommentWithExistingId() throws Exception {
        // Create the OrganizationComment with an existing ID
        organizationComment.setId(1L);

        int databaseSizeBeforeCreate = organizationCommentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrganizationCommentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationComment in the database
        List<OrganizationComment> organizationCommentList = organizationCommentRepository.findAll();
        assertThat(organizationCommentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOrganizationComments() throws Exception {
        // Initialize the database
        organizationCommentRepository.saveAndFlush(organizationComment);

        // Get all the organizationCommentList
        restOrganizationCommentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(organizationComment.getId().intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    @Transactional
    void getOrganizationComment() throws Exception {
        // Initialize the database
        organizationCommentRepository.saveAndFlush(organizationComment);

        // Get the organizationComment
        restOrganizationCommentMockMvc
            .perform(get(ENTITY_API_URL_ID, organizationComment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(organizationComment.getId().intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingOrganizationComment() throws Exception {
        // Get the organizationComment
        restOrganizationCommentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOrganizationComment() throws Exception {
        // Initialize the database
        organizationCommentRepository.saveAndFlush(organizationComment);

        int databaseSizeBeforeUpdate = organizationCommentRepository.findAll().size();

        // Update the organizationComment
        OrganizationComment updatedOrganizationComment = organizationCommentRepository.findById(organizationComment.getId()).get();
        // Disconnect from session so that the updates on updatedOrganizationComment are not directly saved in db
        em.detach(updatedOrganizationComment);
        updatedOrganizationComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restOrganizationCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrganizationComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrganizationComment))
            )
            .andExpect(status().isOk());

        // Validate the OrganizationComment in the database
        List<OrganizationComment> organizationCommentList = organizationCommentRepository.findAll();
        assertThat(organizationCommentList).hasSize(databaseSizeBeforeUpdate);
        OrganizationComment testOrganizationComment = organizationCommentList.get(organizationCommentList.size() - 1);
        assertThat(testOrganizationComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testOrganizationComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingOrganizationComment() throws Exception {
        int databaseSizeBeforeUpdate = organizationCommentRepository.findAll().size();
        organizationComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganizationCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, organizationComment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationComment in the database
        List<OrganizationComment> organizationCommentList = organizationCommentRepository.findAll();
        assertThat(organizationCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrganizationComment() throws Exception {
        int databaseSizeBeforeUpdate = organizationCommentRepository.findAll().size();
        organizationComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationCommentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationComment in the database
        List<OrganizationComment> organizationCommentList = organizationCommentRepository.findAll();
        assertThat(organizationCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrganizationComment() throws Exception {
        int databaseSizeBeforeUpdate = organizationCommentRepository.findAll().size();
        organizationComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationCommentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrganizationComment in the database
        List<OrganizationComment> organizationCommentList = organizationCommentRepository.findAll();
        assertThat(organizationCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrganizationCommentWithPatch() throws Exception {
        // Initialize the database
        organizationCommentRepository.saveAndFlush(organizationComment);

        int databaseSizeBeforeUpdate = organizationCommentRepository.findAll().size();

        // Update the organizationComment using partial update
        OrganizationComment partialUpdatedOrganizationComment = new OrganizationComment();
        partialUpdatedOrganizationComment.setId(organizationComment.getId());

        partialUpdatedOrganizationComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restOrganizationCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrganizationComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrganizationComment))
            )
            .andExpect(status().isOk());

        // Validate the OrganizationComment in the database
        List<OrganizationComment> organizationCommentList = organizationCommentRepository.findAll();
        assertThat(organizationCommentList).hasSize(databaseSizeBeforeUpdate);
        OrganizationComment testOrganizationComment = organizationCommentList.get(organizationCommentList.size() - 1);
        assertThat(testOrganizationComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testOrganizationComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateOrganizationCommentWithPatch() throws Exception {
        // Initialize the database
        organizationCommentRepository.saveAndFlush(organizationComment);

        int databaseSizeBeforeUpdate = organizationCommentRepository.findAll().size();

        // Update the organizationComment using partial update
        OrganizationComment partialUpdatedOrganizationComment = new OrganizationComment();
        partialUpdatedOrganizationComment.setId(organizationComment.getId());

        partialUpdatedOrganizationComment.comment(UPDATED_COMMENT).date(UPDATED_DATE);

        restOrganizationCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrganizationComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrganizationComment))
            )
            .andExpect(status().isOk());

        // Validate the OrganizationComment in the database
        List<OrganizationComment> organizationCommentList = organizationCommentRepository.findAll();
        assertThat(organizationCommentList).hasSize(databaseSizeBeforeUpdate);
        OrganizationComment testOrganizationComment = organizationCommentList.get(organizationCommentList.size() - 1);
        assertThat(testOrganizationComment.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testOrganizationComment.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingOrganizationComment() throws Exception {
        int databaseSizeBeforeUpdate = organizationCommentRepository.findAll().size();
        organizationComment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganizationCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, organizationComment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organizationComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationComment in the database
        List<OrganizationComment> organizationCommentList = organizationCommentRepository.findAll();
        assertThat(organizationCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrganizationComment() throws Exception {
        int databaseSizeBeforeUpdate = organizationCommentRepository.findAll().size();
        organizationComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationCommentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organizationComment))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationComment in the database
        List<OrganizationComment> organizationCommentList = organizationCommentRepository.findAll();
        assertThat(organizationCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrganizationComment() throws Exception {
        int databaseSizeBeforeUpdate = organizationCommentRepository.findAll().size();
        organizationComment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationCommentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organizationComment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrganizationComment in the database
        List<OrganizationComment> organizationCommentList = organizationCommentRepository.findAll();
        assertThat(organizationCommentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrganizationComment() throws Exception {
        // Initialize the database
        organizationCommentRepository.saveAndFlush(organizationComment);

        int databaseSizeBeforeDelete = organizationCommentRepository.findAll().size();

        // Delete the organizationComment
        restOrganizationCommentMockMvc
            .perform(delete(ENTITY_API_URL_ID, organizationComment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrganizationComment> organizationCommentList = organizationCommentRepository.findAll();
        assertThat(organizationCommentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
