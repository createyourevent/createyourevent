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
import org.createyourevent.app.domain.ServiceLikeDislike;
import org.createyourevent.app.repository.ServiceLikeDislikeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ServiceLikeDislikeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ServiceLikeDislikeResourceIT {

    private static final Integer DEFAULT_LIKE = 1;
    private static final Integer UPDATED_LIKE = 2;

    private static final Integer DEFAULT_DISLIKE = 1;
    private static final Integer UPDATED_DISLIKE = 2;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/service-like-dislikes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ServiceLikeDislikeRepository serviceLikeDislikeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restServiceLikeDislikeMockMvc;

    private ServiceLikeDislike serviceLikeDislike;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceLikeDislike createEntity(EntityManager em) {
        ServiceLikeDislike serviceLikeDislike = new ServiceLikeDislike()
            .like(DEFAULT_LIKE)
            .dislike(DEFAULT_DISLIKE)
            .date(DEFAULT_DATE)
            .comment(DEFAULT_COMMENT);
        return serviceLikeDislike;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceLikeDislike createUpdatedEntity(EntityManager em) {
        ServiceLikeDislike serviceLikeDislike = new ServiceLikeDislike()
            .like(UPDATED_LIKE)
            .dislike(UPDATED_DISLIKE)
            .date(UPDATED_DATE)
            .comment(UPDATED_COMMENT);
        return serviceLikeDislike;
    }

    @BeforeEach
    public void initTest() {
        serviceLikeDislike = createEntity(em);
    }

    @Test
    @Transactional
    void createServiceLikeDislike() throws Exception {
        int databaseSizeBeforeCreate = serviceLikeDislikeRepository.findAll().size();
        // Create the ServiceLikeDislike
        restServiceLikeDislikeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceLikeDislike))
            )
            .andExpect(status().isCreated());

        // Validate the ServiceLikeDislike in the database
        List<ServiceLikeDislike> serviceLikeDislikeList = serviceLikeDislikeRepository.findAll();
        assertThat(serviceLikeDislikeList).hasSize(databaseSizeBeforeCreate + 1);
        ServiceLikeDislike testServiceLikeDislike = serviceLikeDislikeList.get(serviceLikeDislikeList.size() - 1);
        assertThat(testServiceLikeDislike.getLike()).isEqualTo(DEFAULT_LIKE);
        assertThat(testServiceLikeDislike.getDislike()).isEqualTo(DEFAULT_DISLIKE);
        assertThat(testServiceLikeDislike.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testServiceLikeDislike.getComment()).isEqualTo(DEFAULT_COMMENT);
    }

    @Test
    @Transactional
    void createServiceLikeDislikeWithExistingId() throws Exception {
        // Create the ServiceLikeDislike with an existing ID
        serviceLikeDislike.setId(1L);

        int databaseSizeBeforeCreate = serviceLikeDislikeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restServiceLikeDislikeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceLikeDislike in the database
        List<ServiceLikeDislike> serviceLikeDislikeList = serviceLikeDislikeRepository.findAll();
        assertThat(serviceLikeDislikeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllServiceLikeDislikes() throws Exception {
        // Initialize the database
        serviceLikeDislikeRepository.saveAndFlush(serviceLikeDislike);

        // Get all the serviceLikeDislikeList
        restServiceLikeDislikeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(serviceLikeDislike.getId().intValue())))
            .andExpect(jsonPath("$.[*].like").value(hasItem(DEFAULT_LIKE)))
            .andExpect(jsonPath("$.[*].dislike").value(hasItem(DEFAULT_DISLIKE)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    void getServiceLikeDislike() throws Exception {
        // Initialize the database
        serviceLikeDislikeRepository.saveAndFlush(serviceLikeDislike);

        // Get the serviceLikeDislike
        restServiceLikeDislikeMockMvc
            .perform(get(ENTITY_API_URL_ID, serviceLikeDislike.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(serviceLikeDislike.getId().intValue()))
            .andExpect(jsonPath("$.like").value(DEFAULT_LIKE))
            .andExpect(jsonPath("$.dislike").value(DEFAULT_DISLIKE))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT));
    }

    @Test
    @Transactional
    void getNonExistingServiceLikeDislike() throws Exception {
        // Get the serviceLikeDislike
        restServiceLikeDislikeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewServiceLikeDislike() throws Exception {
        // Initialize the database
        serviceLikeDislikeRepository.saveAndFlush(serviceLikeDislike);

        int databaseSizeBeforeUpdate = serviceLikeDislikeRepository.findAll().size();

        // Update the serviceLikeDislike
        ServiceLikeDislike updatedServiceLikeDislike = serviceLikeDislikeRepository.findById(serviceLikeDislike.getId()).get();
        // Disconnect from session so that the updates on updatedServiceLikeDislike are not directly saved in db
        em.detach(updatedServiceLikeDislike);
        updatedServiceLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restServiceLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedServiceLikeDislike.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedServiceLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the ServiceLikeDislike in the database
        List<ServiceLikeDislike> serviceLikeDislikeList = serviceLikeDislikeRepository.findAll();
        assertThat(serviceLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        ServiceLikeDislike testServiceLikeDislike = serviceLikeDislikeList.get(serviceLikeDislikeList.size() - 1);
        assertThat(testServiceLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testServiceLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testServiceLikeDislike.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testServiceLikeDislike.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void putNonExistingServiceLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = serviceLikeDislikeRepository.findAll().size();
        serviceLikeDislike.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, serviceLikeDislike.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceLikeDislike in the database
        List<ServiceLikeDislike> serviceLikeDislikeList = serviceLikeDislikeRepository.findAll();
        assertThat(serviceLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchServiceLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = serviceLikeDislikeRepository.findAll().size();
        serviceLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceLikeDislike in the database
        List<ServiceLikeDislike> serviceLikeDislikeList = serviceLikeDislikeRepository.findAll();
        assertThat(serviceLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamServiceLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = serviceLikeDislikeRepository.findAll().size();
        serviceLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceLikeDislikeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceLikeDislike))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceLikeDislike in the database
        List<ServiceLikeDislike> serviceLikeDislikeList = serviceLikeDislikeRepository.findAll();
        assertThat(serviceLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateServiceLikeDislikeWithPatch() throws Exception {
        // Initialize the database
        serviceLikeDislikeRepository.saveAndFlush(serviceLikeDislike);

        int databaseSizeBeforeUpdate = serviceLikeDislikeRepository.findAll().size();

        // Update the serviceLikeDislike using partial update
        ServiceLikeDislike partialUpdatedServiceLikeDislike = new ServiceLikeDislike();
        partialUpdatedServiceLikeDislike.setId(serviceLikeDislike.getId());

        partialUpdatedServiceLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restServiceLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the ServiceLikeDislike in the database
        List<ServiceLikeDislike> serviceLikeDislikeList = serviceLikeDislikeRepository.findAll();
        assertThat(serviceLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        ServiceLikeDislike testServiceLikeDislike = serviceLikeDislikeList.get(serviceLikeDislikeList.size() - 1);
        assertThat(testServiceLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testServiceLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testServiceLikeDislike.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testServiceLikeDislike.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void fullUpdateServiceLikeDislikeWithPatch() throws Exception {
        // Initialize the database
        serviceLikeDislikeRepository.saveAndFlush(serviceLikeDislike);

        int databaseSizeBeforeUpdate = serviceLikeDislikeRepository.findAll().size();

        // Update the serviceLikeDislike using partial update
        ServiceLikeDislike partialUpdatedServiceLikeDislike = new ServiceLikeDislike();
        partialUpdatedServiceLikeDislike.setId(serviceLikeDislike.getId());

        partialUpdatedServiceLikeDislike.like(UPDATED_LIKE).dislike(UPDATED_DISLIKE).date(UPDATED_DATE).comment(UPDATED_COMMENT);

        restServiceLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceLikeDislike))
            )
            .andExpect(status().isOk());

        // Validate the ServiceLikeDislike in the database
        List<ServiceLikeDislike> serviceLikeDislikeList = serviceLikeDislikeRepository.findAll();
        assertThat(serviceLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
        ServiceLikeDislike testServiceLikeDislike = serviceLikeDislikeList.get(serviceLikeDislikeList.size() - 1);
        assertThat(testServiceLikeDislike.getLike()).isEqualTo(UPDATED_LIKE);
        assertThat(testServiceLikeDislike.getDislike()).isEqualTo(UPDATED_DISLIKE);
        assertThat(testServiceLikeDislike.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testServiceLikeDislike.getComment()).isEqualTo(UPDATED_COMMENT);
    }

    @Test
    @Transactional
    void patchNonExistingServiceLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = serviceLikeDislikeRepository.findAll().size();
        serviceLikeDislike.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, serviceLikeDislike.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceLikeDislike in the database
        List<ServiceLikeDislike> serviceLikeDislikeList = serviceLikeDislikeRepository.findAll();
        assertThat(serviceLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchServiceLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = serviceLikeDislikeRepository.findAll().size();
        serviceLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceLikeDislike))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceLikeDislike in the database
        List<ServiceLikeDislike> serviceLikeDislikeList = serviceLikeDislikeRepository.findAll();
        assertThat(serviceLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamServiceLikeDislike() throws Exception {
        int databaseSizeBeforeUpdate = serviceLikeDislikeRepository.findAll().size();
        serviceLikeDislike.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceLikeDislikeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceLikeDislike))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceLikeDislike in the database
        List<ServiceLikeDislike> serviceLikeDislikeList = serviceLikeDislikeRepository.findAll();
        assertThat(serviceLikeDislikeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteServiceLikeDislike() throws Exception {
        // Initialize the database
        serviceLikeDislikeRepository.saveAndFlush(serviceLikeDislike);

        int databaseSizeBeforeDelete = serviceLikeDislikeRepository.findAll().size();

        // Delete the serviceLikeDislike
        restServiceLikeDislikeMockMvc
            .perform(delete(ENTITY_API_URL_ID, serviceLikeDislike.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ServiceLikeDislike> serviceLikeDislikeList = serviceLikeDislikeRepository.findAll();
        assertThat(serviceLikeDislikeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
