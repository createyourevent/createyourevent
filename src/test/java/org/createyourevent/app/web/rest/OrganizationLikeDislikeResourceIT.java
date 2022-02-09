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
import org.createyourevent.app.domain.OrganizationLikeDislike;
import org.createyourevent.app.repository.OrganizationLikeDislikeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OrganizationLikeDislikeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrganizationLikeDislikeResourceIT {

    private static final Integer DEFAULT_LIKE = 1;
    private static final Integer UPDATED_LIKE = 2;

    private static final Integer DEFAULT_DISLIKE = 1;
    private static final Integer UPDATED_DISLIKE = 2;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/organization-like-dislikes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrganizationLikeDislikeRepository organizationLikeDislikeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrganizationLikeDislikeMockMvc;

    private OrganizationLikeDislike organizationLikeDislike;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrganizationLikeDislike createEntity(EntityManager em) {
        OrganizationLikeDislike organizationLikeDislike = new OrganizationLikeDislike()
            .like(DEFAULT_LIKE)
            .dislike(DEFAULT_DISLIKE)
            .date(DEFAULT_DATE)
            .comment(DEFAULT_COMMENT);
        return organizationLikeDislike;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrganizationLikeDislike createUpdatedEntity(EntityManager em) {
        OrganizationLikeDislike organizationLikeDislike = new OrganizationLikeDislike()
            .like(UPDATED_LIKE)
            .dislike(UPDATED_DISLIKE)
            .date(UPDATED_DATE)
            .comment(UPDATED_COMMENT);
        return organizationLikeDislike;
    }

    @BeforeEach
    public void initTest() {
        organizationLikeDislike = createEntity(em);
    }

    @Test
    @Transactional
    void createOrganizationLikeDislike() throws Exception {
        int databaseSizeBeforeCreate = organizationLikeDislikeRepository.findAll().size();
        // Create the OrganizationLikeDislike
        restOrganizationLikeDislikeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationLikeDislike))
            )
            .andExpect(status().isCreated());

        // Validate the OrganizationLikeDislike in the database
        List<OrganizationLikeDislike> organizationLikeDislikeList = organizationLikeDislikeRepository.findAll();
        assertThat(organizationLikeDislikeList).hasSize(databaseSizeBeforeCreate + 1);
        OrganizationLikeDislike testOrganizationLikeDislike = organizationLikeDislikeList.get(organizationLikeDislikeList.size() - 1);
        assertThat(testOrganizationLikeDislike.getLike()).isEqualTo(DEFAULT_LIKE);
        assertThat(testOrganizationLikeDislike.getDislike()).isEqualTo(DEFAULT_DISLIKE);
        assertThat(testOrganizationLikeDislike.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testOrganizationLikeDislike.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createOrganizationLikeDislikeWithExistingId() throws Exception {
        // Create the OrganizationLikeDislike with an existing ID
        organizationLikeDislike.setId(1L);

        int databaseSizeBeforeCreate = organizationLikeDislikeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrganizationLikeDislikeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationLikeDislike in the database
        List<OrganizationLikeDislike> organizationLikeDislikeList = organizationLikeDislikeRepository.findAll();
        assertThat(organizationLikeDislikeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOrganizationLikeDislikes() throws Exception {
        // Initialize the database
        organizationLikeDislikeRepository.saveAndFlush(organizationLikeDislike);

        // Get all the organizationLikeDislikeList
        restOrganizationLikeDislikeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(organizationLikeDislike.getId().intValue())))
            .andExpect(jsonPath("$.[*].like").value(hasItem(DEFAULT_LIKE)))
            .andExpect(jsonPath("$.[*].dislike").value(hasItem(DEFAULT_DISLIKE)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getOrganizationLikeDislike() throws Exception {
        // Initialize the database
        organizationLikeDislikeRepository.saveAndFlush(organizationLikeDislike);

        // Get the organizationLikeDislike
        restOrganizationLikeDislikeMockMvc
            .perform(get(ENTITY_API_URL_ID, organizationLikeDislike.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(organizationLikeDislike.getId().intValue()))
            .andExpect(jsonPath("$.like").value(DEFAULT_LIKE))
            .andExpect(jsonPath("$.dislike").value(DEFAULT_DISLIKE))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingOrganizationLikeDislike() throws Exception {
        // Get the organizationLikeDislike
        restOrganizationLikeDislikeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOrganizationLikeDislike() throws Exception {
        // Initialize the database
        organizationLikeDislikeRepository.saveAndFlush(organizationLikeDislike);

        int databaseSizeBeforeUpdate = organizationLikeDislikeRepository.findAll().size();

        // Update the organizationLikeDislike
        OrganizationLikeDislike updatedOrganizationLikeDislike = organizationLikeDislikeRepository
            .findById(organizationLikeDislike.getId())
            .get();
        // Disconnect from session so that the updates on updatedOrganizationLikeDislike are not directly saved in db
        em.detach(updatedOrganizationLikeDislike);
        updatedOrganizationLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restOrganizationLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrganizationLikeDislike.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrganizationLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the OrganizationLikeDislike in the database
        List<OrganizationLikeDislike> organizationLikeDislikeList = organizationLikeDislikeRepository.findAll();
        assertThat(organizationLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        OrganizationLikeDislike testOrganizationLikeDislike = organizationLikeDislikeList.get(organizationLikeDislikeList.size() - 1);
        assertThat(testOrganizationLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testOrganizationLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testOrganizationLikeDislike.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testOrganizationLikeDislike.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingOrganizationLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = organizationLikeDislikeRepository.findAll().size();
        organizationLikeDislike.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganizationLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, organizationLikeDislike.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationLikeDislike in the database
        List<OrganizationLikeDislike> organizationLikeDislikeList = organizationLikeDislikeRepository.findAll();
        assertThat(organizationLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrganizationLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = organizationLikeDislikeRepository.findAll().size();
        organizationLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationLikeDislike in the database
        List<OrganizationLikeDislike> organizationLikeDislikeList = organizationLikeDislikeRepository.findAll();
        assertThat(organizationLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrganizationLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = organizationLikeDislikeRepository.findAll().size();
        organizationLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationLikeDislike))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrganizationLikeDislike in the database
        List<OrganizationLikeDislike> organizationLikeDislikeList = organizationLikeDislikeRepository.findAll();
        assertThat(organizationLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrganizationLikeDislikeWithPatch() throws Exception {
        // Initialize the database
        organizationLikeDislikeRepository.saveAndFlush(organizationLikeDislike);

        int databaseSizeBeforeUpdate = organizationLikeDislikeRepository.findAll().size();

        // Update the organizationLikeDislike using partial update
        OrganizationLikeDislike partialUpdatedOrganizationLikeDislike = new OrganizationLikeDislike();
        partialUpdatedOrganizationLikeDislike.setId(organizationLikeDislike.getId());

        partialUpdatedOrganizationLikeDislike.like(UPDATED_LIKE).comment(UPDATED_COMMENT);

        restOrganizationLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrganizationLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrganizationLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the OrganizationLikeDislike in the database
        List<OrganizationLikeDislike> organizationLikeDislikeList = organizationLikeDislikeRepository.findAll();
        assertThat(organizationLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        OrganizationLikeDislike testOrganizationLikeDislike = organizationLikeDislikeList.get(organizationLikeDislikeList.size() - 1);
        assertThat(testOrganizationLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testOrganizationLikeDislike.getDislike()).isEqualTo(DEFAULT_DISLIKE);
        assertThat(testOrganizationLikeDislike.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testOrganizationLikeDislike.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateOrganizationLikeDislikeWithPatch() throws Exception {
        // Initialize the database
        organizationLikeDislikeRepository.saveAndFlush(organizationLikeDislike);

        int databaseSizeBeforeUpdate = organizationLikeDislikeRepository.findAll().size();

        // Update the organizationLikeDislike using partial update
        OrganizationLikeDislike partialUpdatedOrganizationLikeDislike = new OrganizationLikeDislike();
        partialUpdatedOrganizationLikeDislike.setId(organizationLikeDislike.getId());

        partialUpdatedOrganizationLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restOrganizationLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrganizationLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrganizationLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the OrganizationLikeDislike in the database
        List<OrganizationLikeDislike> organizationLikeDislikeList = organizationLikeDislikeRepository.findAll();
        assertThat(organizationLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        OrganizationLikeDislike testOrganizationLikeDislike = organizationLikeDislikeList.get(organizationLikeDislikeList.size() - 1);
        assertThat(testOrganizationLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testOrganizationLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testOrganizationLikeDislike.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testOrganizationLikeDislike.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingOrganizationLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = organizationLikeDislikeRepository.findAll().size();
        organizationLikeDislike.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganizationLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, organizationLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organizationLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationLikeDislike in the database
        List<OrganizationLikeDislike> organizationLikeDislikeList = organizationLikeDislikeRepository.findAll();
        assertThat(organizationLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrganizationLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = organizationLikeDislikeRepository.findAll().size();
        organizationLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organizationLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationLikeDislike in the database
        List<OrganizationLikeDislike> organizationLikeDislikeList = organizationLikeDislikeRepository.findAll();
        assertThat(organizationLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrganizationLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = organizationLikeDislikeRepository.findAll().size();
        organizationLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organizationLikeDislike))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrganizationLikeDislike in the database
        List<OrganizationLikeDislike> organizationLikeDislikeList = organizationLikeDislikeRepository.findAll();
        assertThat(organizationLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrganizationLikeDislike() throws Exception {
        // Initialize the database
        organizationLikeDislikeRepository.saveAndFlush(organizationLikeDislike);

        int databaseSizeBeforeDelete = organizationLikeDislikeRepository.findAll().size();

        // Delete the organizationLikeDislike
        restOrganizationLikeDislikeMockMvc
            .perform(delete(ENTITY_API_URL_ID, organizationLikeDislike.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrganizationLikeDislike> organizationLikeDislikeList = organizationLikeDislikeRepository.findAll();
        assertThat(organizationLikeDislikeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
