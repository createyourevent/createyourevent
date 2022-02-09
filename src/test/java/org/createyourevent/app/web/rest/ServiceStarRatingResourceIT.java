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
import org.createyourevent.app.domain.ServiceStarRating;
import org.createyourevent.app.repository.ServiceStarRatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ServiceStarRatingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ServiceStarRatingResourceIT {

    private static final Integer DEFAULT_STARS = 1;
    private static final Integer UPDATED_STARS = 2;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/service-star-ratings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ServiceStarRatingRepository serviceStarRatingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restServiceStarRatingMockMvc;

    private ServiceStarRating serviceStarRating;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceStarRating createEntity(EntityManager em) {
        ServiceStarRating serviceStarRating = new ServiceStarRating().stars(DEFAULT_STARS).date(DEFAULT_DATE).comment(DEFAULT_COMMENT);
        return serviceStarRating;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceStarRating createUpdatedEntity(EntityManager em) {
        ServiceStarRating serviceStarRating = new ServiceStarRating().stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);
        return serviceStarRating;
    }

    @BeforeEach
    public void initTest() {
        serviceStarRating = createEntity(em);
    }

    @Test
    @Transactional
    void createServiceStarRating() throws Exception {
        int databaseSizeBeforeCreate = serviceStarRatingRepository.findAll().size();
        // Create the ServiceStarRating
        restServiceStarRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceStarRating))
            )
            .andExpect(status().isCreated());

        // Validate the ServiceStarRating in the database
        List<ServiceStarRating> serviceStarRatingList = serviceStarRatingRepository.findAll();
        assertThat(serviceStarRatingList).hasSize(databaseSizeBeforeCreate + 1);
        ServiceStarRating testServiceStarRating = serviceStarRatingList.get(serviceStarRatingList.size() - 1);
        assertThat(testServiceStarRating.getStars()).isEqualTo(DEFAULT_STARS);
        assertThat(testServiceStarRating.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testServiceStarRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createServiceStarRatingWithExistingId() throws Exception {
        // Create the ServiceStarRating with an existing ID
        serviceStarRating.setId(1L);

        int databaseSizeBeforeCreate = serviceStarRatingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restServiceStarRatingMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceStarRating in the database
        List<ServiceStarRating> serviceStarRatingList = serviceStarRatingRepository.findAll();
        assertThat(serviceStarRatingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllServiceStarRatings() throws Exception {
        // Initialize the database
        serviceStarRatingRepository.saveAndFlush(serviceStarRating);

        // Get all the serviceStarRatingList
        restServiceStarRatingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(serviceStarRating.getId().intValue())))
            .andExpect(jsonPath("$.[*].stars").value(hasItem(DEFAULT_STARS)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getServiceStarRating() throws Exception {
        // Initialize the database
        serviceStarRatingRepository.saveAndFlush(serviceStarRating);

        // Get the serviceStarRating
        restServiceStarRatingMockMvc
            .perform(get(ENTITY_API_URL_ID, serviceStarRating.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(serviceStarRating.getId().intValue()))
            .andExpect(jsonPath("$.stars").value(DEFAULT_STARS))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingServiceStarRating() throws Exception {
        // Get the serviceStarRating
        restServiceStarRatingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewServiceStarRating() throws Exception {
        // Initialize the database
        serviceStarRatingRepository.saveAndFlush(serviceStarRating);

        int databaseSizeBeforeUpdate = serviceStarRatingRepository.findAll().size();

        // Update the serviceStarRating
        ServiceStarRating updatedServiceStarRating = serviceStarRatingRepository.findById(serviceStarRating.getId()).get();
        // Disconnect from session so that the updates on updatedServiceStarRating are not directly saved in db
        em.detach(updatedServiceStarRating);
        updatedServiceStarRating.stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restServiceStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedServiceStarRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedServiceStarRating))
            )
            .andExpect(status().isOk());

        // Validate the ServiceStarRating in the database
        List<ServiceStarRating> serviceStarRatingList = serviceStarRatingRepository.findAll();
        assertThat(serviceStarRatingList).hasSize(databaseSizeBeforeUpdate);
        ServiceStarRating testServiceStarRating = serviceStarRatingList.get(serviceStarRatingList.size() - 1);
        assertThat(testServiceStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testServiceStarRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testServiceStarRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingServiceStarRating() throws Exception {
        int databaseSizeBeforeUpdate = serviceStarRatingRepository.findAll().size();
        serviceStarRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, serviceStarRating.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceStarRating in the database
        List<ServiceStarRating> serviceStarRatingList = serviceStarRatingRepository.findAll();
        assertThat(serviceStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchServiceStarRating() throws Exception {
        int databaseSizeBeforeUpdate = serviceStarRatingRepository.findAll().size();
        serviceStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceStarRating in the database
        List<ServiceStarRating> serviceStarRatingList = serviceStarRatingRepository.findAll();
        assertThat(serviceStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamServiceStarRating() throws Exception {
        int databaseSizeBeforeUpdate = serviceStarRatingRepository.findAll().size();
        serviceStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceStarRatingMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceStarRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceStarRating in the database
        List<ServiceStarRating> serviceStarRatingList = serviceStarRatingRepository.findAll();
        assertThat(serviceStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateServiceStarRatingWithPatch() throws Exception {
        // Initialize the database
        serviceStarRatingRepository.saveAndFlush(serviceStarRating);

        int databaseSizeBeforeUpdate = serviceStarRatingRepository.findAll().size();

        // Update the serviceStarRating using partial update
        ServiceStarRating partialUpdatedServiceStarRating = new ServiceStarRating();
        partialUpdatedServiceStarRating.setId(serviceStarRating.getId());

        partialUpdatedServiceStarRating.stars(UPDATED_STARS);

        restServiceStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceStarRating))
            )
            .andExpect(status().isOk());

        // Validate the ServiceStarRating in the database
        List<ServiceStarRating> serviceStarRatingList = serviceStarRatingRepository.findAll();
        assertThat(serviceStarRatingList).hasSize(databaseSizeBeforeUpdate);
        ServiceStarRating testServiceStarRating = serviceStarRatingList.get(serviceStarRatingList.size() - 1);
        assertThat(testServiceStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testServiceStarRating.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testServiceStarRating.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateServiceStarRatingWithPatch() throws Exception {
        // Initialize the database
        serviceStarRatingRepository.saveAndFlush(serviceStarRating);

        int databaseSizeBeforeUpdate = serviceStarRatingRepository.findAll().size();

        // Update the serviceStarRating using partial update
        ServiceStarRating partialUpdatedServiceStarRating = new ServiceStarRating();
        partialUpdatedServiceStarRating.setId(serviceStarRating.getId());

        partialUpdatedServiceStarRating.stars(UPDATED_STARS).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restServiceStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceStarRating))
            )
            .andExpect(status().isOk());

        // Validate the ServiceStarRating in the database
        List<ServiceStarRating> serviceStarRatingList = serviceStarRatingRepository.findAll();
        assertThat(serviceStarRatingList).hasSize(databaseSizeBeforeUpdate);
        ServiceStarRating testServiceStarRating = serviceStarRatingList.get(serviceStarRatingList.size() - 1);
        assertThat(testServiceStarRating.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testServiceStarRating.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testServiceStarRating.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingServiceStarRating() throws Exception {
        int databaseSizeBeforeUpdate = serviceStarRatingRepository.findAll().size();
        serviceStarRating.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, serviceStarRating.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceStarRating in the database
        List<ServiceStarRating> serviceStarRatingList = serviceStarRatingRepository.findAll();
        assertThat(serviceStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchServiceStarRating() throws Exception {
        int databaseSizeBeforeUpdate = serviceStarRatingRepository.findAll().size();
        serviceStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceStarRating))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceStarRating in the database
        List<ServiceStarRating> serviceStarRatingList = serviceStarRatingRepository.findAll();
        assertThat(serviceStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamServiceStarRating() throws Exception {
        int databaseSizeBeforeUpdate = serviceStarRatingRepository.findAll().size();
        serviceStarRating.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceStarRatingMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceStarRating))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceStarRating in the database
        List<ServiceStarRating> serviceStarRatingList = serviceStarRatingRepository.findAll();
        assertThat(serviceStarRatingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteServiceStarRating() throws Exception {
        // Initialize the database
        serviceStarRatingRepository.saveAndFlush(serviceStarRating);

        int databaseSizeBeforeDelete = serviceStarRatingRepository.findAll().size();

        // Delete the serviceStarRating
        restServiceStarRatingMockMvc
            .perform(delete(ENTITY_API_URL_ID, serviceStarRating.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ServiceStarRating> serviceStarRatingList = serviceStarRatingRepository.findAll();
        assertThat(serviceStarRatingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
