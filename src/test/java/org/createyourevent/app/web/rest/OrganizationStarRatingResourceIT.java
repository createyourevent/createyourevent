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
import org.createyourevent.app.domain.OrganizationStarRating;
import org.createyourevent.app.repository.OrganizationStarRatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OrganizationStarRatingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrganizationStarRatingResourceIT {

    private static final Integer DEFAULT_STARS = 1;
    private static final Integer UPDATED_STARS = 2;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/organization-star-ratings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrganizationStarRatingRepository organizationStarRatingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrganizationStarRatingMockMvc;

    private OrganizationStarRating organizationStarRating;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrganizationStarRating createEntity(EntityManager em) {
        OrganizationStarRating organizationStarRating = new OrganizationStarRating()
            .stars(DEFAULT_STARS)
            .date(DEFAULT_DATE)
            .comment(DEFAULT_COMMENT);
        return organizationStarRating;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrganizationStarRating createUpdatedEntity(EntityManager em) {
        OrganizationStarRating organizationStarRating = new OrganizationStarRating()
            .stars(UPDATED_STARS)
            .date(UPDATED_DATE)
            .comment(UPDATED_COMMENT);
        return organizationStarRating;
    }

    @BeforeEach
    public void initTest() {
        organizationStarRating = createEntity(em);
    }

    @Test
    @Transactional
    void createOrganizationStarRating() throws Exception {
        int databaseSizeBeforeCreate = organizationStarRatingRepository.findAll().size();
        // Create the OrganizationStarRating
        restOrganizationStarRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationStarRating))
            )
            .andExpect(status().isCreated());

        // Validate the OrganizationStarRating in the database
        List<OrganizationStarRating> organizationStarRatingList = organizationStarRatingRepository.findAll();
        assertThat(organizationStarRatingList).hasSize(databaseSizeBeforeCreate + 1);
        OrganizationStarRating testOrganizationStarRating = organizationStarRatingList.get(organizationStarRatingList.size() - 1);
        assertThat(testOrganizationStarRating.getStars()).isEqualTo(DEFAULT_STARS);
        assertThat(testOrganizationStarRating.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testOrganizationStarRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createOrganizationStarRatingWithExistingId() throws Exception {
        // Create the OrganizationStarRating with an existing ID
        organizationStarRating.setId(1L);

        int databaseSizeBeforeCreate = organizationStarRatingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrganizationStarRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationStarRating in the database
        List<OrganizationStarRating> organizationStarRatingList = organizationStarRatingRepository.findAll();
        assertThat(organizationStarRatingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOrganizationStarRatings() throws Exception {
        // Initialize the database
        organizationStarRatingRepository.saveAndFlush(organizationStarRating);

        // Get all the organizationStarRatingList
        restOrganizationStarRatingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(organizationStarRating.getId().intValue())))
            .andExpect(jsonPath("$.[*].stars").value(hasItem(DEFAULT_STARS)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getOrganizationStarRating() throws Exception {
        // Initialize the database
        organizationStarRatingRepository.saveAndFlush(organizationStarRating);

        // Get the organizationStarRating
        restOrganizationStarRatingMockMvc
            .perform(get(ENTITY_API_URL_ID, organizationStarRating.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(organizationStarRating.getId().intValue()))
            .andExpect(jsonPath("$.stars").value(DEFAULT_STARS))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingOrganizationStarRating() throws Exception {
        // Get the organizationStarRating
        restOrganizationStarRatingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOrganizationStarRating() throws Exception {
        // Initialize the database
        organizationStarRatingRepository.saveAndFlush(organizationStarRating);

        int databaseSizeBeforeUpdate = organizationStarRatingRepository.findAll().size();

        // Update the organizationStarRating
        OrganizationStarRating updatedOrganizationStarRating = organizationStarRatingRepository
            .findById(organizationStarRating.getId())
            .get();
        // Disconnect from session so that the updates on updatedOrganizationStarRating are not directly saved in db
        em.detach(updatedOrganizationStarRating);
        updatedOrganizationStarRating.stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restOrganizationStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrganizationStarRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrganizationStarRating))
            )
            .andExpect(status().isOk());

        // Validate the OrganizationStarRating in the database
        List<OrganizationStarRating> organizationStarRatingList = organizationStarRatingRepository.findAll();
        assertThat(organizationStarRatingList).hasSize(databaseSizeBeforeUpdate);
        OrganizationStarRating testOrganizationStarRating = organizationStarRatingList.get(organizationStarRatingList.size() - 1);
        assertThat(testOrganizationStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testOrganizationStarRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testOrganizationStarRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingOrganizationStarRating() throws Exception {
        int databaseSizeBeforeUpdate = organizationStarRatingRepository.findAll().size();
        organizationStarRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganizationStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, organizationStarRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationStarRating in the database
        List<OrganizationStarRating> organizationStarRatingList = organizationStarRatingRepository.findAll();
        assertThat(organizationStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrganizationStarRating() throws Exception {
        int databaseSizeBeforeUpdate = organizationStarRatingRepository.findAll().size();
        organizationStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationStarRating in the database
        List<OrganizationStarRating> organizationStarRatingList = organizationStarRatingRepository.findAll();
        assertThat(organizationStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrganizationStarRating() throws Exception {
        int databaseSizeBeforeUpdate = organizationStarRatingRepository.findAll().size();
        organizationStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(organizationStarRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrganizationStarRating in the database
        List<OrganizationStarRating> organizationStarRatingList = organizationStarRatingRepository.findAll();
        assertThat(organizationStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrganizationStarRatingWithPatch() throws Exception {
        // Initialize the database
        organizationStarRatingRepository.saveAndFlush(organizationStarRating);

        int databaseSizeBeforeUpdate = organizationStarRatingRepository.findAll().size();

        // Update the organizationStarRating using partial update
        OrganizationStarRating partialUpdatedOrganizationStarRating = new OrganizationStarRating();
        partialUpdatedOrganizationStarRating.setId(organizationStarRating.getId());

        partialUpdatedOrganizationStarRating.date(UPDATED_DATE);

        restOrganizationStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrganizationStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrganizationStarRating))
            )
            .andExpect(status().isOk());

        // Validate the OrganizationStarRating in the database
        List<OrganizationStarRating> organizationStarRatingList = organizationStarRatingRepository.findAll();
        assertThat(organizationStarRatingList).hasSize(databaseSizeBeforeUpdate);
        OrganizationStarRating testOrganizationStarRating = organizationStarRatingList.get(organizationStarRatingList.size() - 1);
        assertThat(testOrganizationStarRating.getStars()).isEqualTo(DEFAULT_STARS);
        assertThat(testOrganizationStarRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testOrganizationStarRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateOrganizationStarRatingWithPatch() throws Exception {
        // Initialize the database
        organizationStarRatingRepository.saveAndFlush(organizationStarRating);

        int databaseSizeBeforeUpdate = organizationStarRatingRepository.findAll().size();

        // Update the organizationStarRating using partial update
        OrganizationStarRating partialUpdatedOrganizationStarRating = new OrganizationStarRating();
        partialUpdatedOrganizationStarRating.setId(organizationStarRating.getId());

        partialUpdatedOrganizationStarRating.stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restOrganizationStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrganizationStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrganizationStarRating))
            )
            .andExpect(status().isOk());

        // Validate the OrganizationStarRating in the database
        List<OrganizationStarRating> organizationStarRatingList = organizationStarRatingRepository.findAll();
        assertThat(organizationStarRatingList).hasSize(databaseSizeBeforeUpdate);
        OrganizationStarRating testOrganizationStarRating = organizationStarRatingList.get(organizationStarRatingList.size() - 1);
        assertThat(testOrganizationStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testOrganizationStarRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testOrganizationStarRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingOrganizationStarRating() throws Exception {
        int databaseSizeBeforeUpdate = organizationStarRatingRepository.findAll().size();
        organizationStarRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganizationStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, organizationStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organizationStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationStarRating in the database
        List<OrganizationStarRating> organizationStarRatingList = organizationStarRatingRepository.findAll();
        assertThat(organizationStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrganizationStarRating() throws Exception {
        int databaseSizeBeforeUpdate = organizationStarRatingRepository.findAll().size();
        organizationStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organizationStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrganizationStarRating in the database
        List<OrganizationStarRating> organizationStarRatingList = organizationStarRatingRepository.findAll();
        assertThat(organizationStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrganizationStarRating() throws Exception {
        int databaseSizeBeforeUpdate = organizationStarRatingRepository.findAll().size();
        organizationStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrganizationStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(organizationStarRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrganizationStarRating in the database
        List<OrganizationStarRating> organizationStarRatingList = organizationStarRatingRepository.findAll();
        assertThat(organizationStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrganizationStarRating() throws Exception {
        // Initialize the database
        organizationStarRatingRepository.saveAndFlush(organizationStarRating);

        int databaseSizeBeforeDelete = organizationStarRatingRepository.findAll().size();

        // Delete the organizationStarRating
        restOrganizationStarRatingMockMvc
            .perform(delete(ENTITY_API_URL_ID, organizationStarRating.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrganizationStarRating> organizationStarRatingList = organizationStarRatingRepository.findAll();
        assertThat(organizationStarRatingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
