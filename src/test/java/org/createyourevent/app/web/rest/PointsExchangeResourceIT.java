package org.createyourevent.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.createyourevent.app.IntegrationTest;
import org.createyourevent.app.domain.PointsExchange;
import org.createyourevent.app.repository.PointsExchangeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PointsExchangeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PointsExchangeResourceIT {

    private static final Long DEFAULT_POINTS_TOTAL = 1L;
    private static final Long UPDATED_POINTS_TOTAL = 2L;

    private static final Long DEFAULT_BOND_POINTS_TOTAL = 1L;
    private static final Long UPDATED_BOND_POINTS_TOTAL = 2L;

    private static final String ENTITY_API_URL = "/api/points-exchanges";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PointsExchangeRepository pointsExchangeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPointsExchangeMockMvc;

    private PointsExchange pointsExchange;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PointsExchange createEntity(EntityManager em) {
        PointsExchange pointsExchange = new PointsExchange().pointsTotal(DEFAULT_POINTS_TOTAL).bondPointsTotal(DEFAULT_BOND_POINTS_TOTAL);
        return pointsExchange;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PointsExchange createUpdatedEntity(EntityManager em) {
        PointsExchange pointsExchange = new PointsExchange().pointsTotal(UPDATED_POINTS_TOTAL).bondPointsTotal(UPDATED_BOND_POINTS_TOTAL);
        return pointsExchange;
    }

    @BeforeEach
    public void initTest() {
        pointsExchange = createEntity(em);
    }

    @Test
    @Transactional
    void createPointsExchange() throws Exception {
        int databaseSizeBeforeCreate = pointsExchangeRepository.findAll().size();
        // Create the PointsExchange
        restPointsExchangeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pointsExchange))
            )
            .andExpect(status().isCreated());

        // Validate the PointsExchange in the database
        List<PointsExchange> pointsExchangeList = pointsExchangeRepository.findAll();
        assertThat(pointsExchangeList).hasSize(databaseSizeBeforeCreate + 1);
        PointsExchange testPointsExchange = pointsExchangeList.get(pointsExchangeList.size() - 1);
        assertThat(testPointsExchange.getPointsTotal()).isEqualTo(DEFAULT_POINTS_TOTAL);
        assertThat(testPointsExchange.getBondPointsTotal()).isEqualTo(DEFAULT_BOND_POINTS_TOTAL);
    }

    @Test
    @Transactional
    void createPointsExchangeWithExistingId() throws Exception {
        // Create the PointsExchange with an existing ID
        pointsExchange.setId(1L);

        int databaseSizeBeforeCreate = pointsExchangeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPointsExchangeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pointsExchange))
            )
            .andExpect(status().isBadRequest());

        // Validate the PointsExchange in the database
        List<PointsExchange> pointsExchangeList = pointsExchangeRepository.findAll();
        assertThat(pointsExchangeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPointsExchanges() throws Exception {
        // Initialize the database
        pointsExchangeRepository.saveAndFlush(pointsExchange);

        // Get all the pointsExchangeList
        restPointsExchangeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pointsExchange.getId().intValue())))
            .andExpect(jsonPath("$.[*].pointsTotal").value(hasItem(DEFAULT_POINTS_TOTAL.intValue())))
            .andExpect(jsonPath("$.[*].bondPointsTotal").value(hasItem(DEFAULT_BOND_POINTS_TOTAL.intValue())));
    }

    @Test
    @Transactional
    void getPointsExchange() throws Exception {
        // Initialize the database
        pointsExchangeRepository.saveAndFlush(pointsExchange);

        // Get the pointsExchange
        restPointsExchangeMockMvc
            .perform(get(ENTITY_API_URL_ID, pointsExchange.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(pointsExchange.getId().intValue()))
            .andExpect(jsonPath("$.pointsTotal").value(DEFAULT_POINTS_TOTAL.intValue()))
            .andExpect(jsonPath("$.bondPointsTotal").value(DEFAULT_BOND_POINTS_TOTAL.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingPointsExchange() throws Exception {
        // Get the pointsExchange
        restPointsExchangeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPointsExchange() throws Exception {
        // Initialize the database
        pointsExchangeRepository.saveAndFlush(pointsExchange);

        int databaseSizeBeforeUpdate = pointsExchangeRepository.findAll().size();

        // Update the pointsExchange
        PointsExchange updatedPointsExchange = pointsExchangeRepository.findById(pointsExchange.getId()).get();
        // Disconnect from session so that the updates on updatedPointsExchange are not directly saved in db
        em.detach(updatedPointsExchange);
        updatedPointsExchange.pointsTotal(UPDATED_POINTS_TOTAL).bondPointsTotal(UPDATED_BOND_POINTS_TOTAL);

        restPointsExchangeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPointsExchange.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPointsExchange))
            )
            .andExpect(status().isOk());

        // Validate the PointsExchange in the database
        List<PointsExchange> pointsExchangeList = pointsExchangeRepository.findAll();
        assertThat(pointsExchangeList).hasSize(databaseSizeBeforeUpdate);
        PointsExchange testPointsExchange = pointsExchangeList.get(pointsExchangeList.size() - 1);
        assertThat(testPointsExchange.getPointsTotal()).isEqualTo(UPDATED_POINTS_TOTAL);
        assertThat(testPointsExchange.getBondPointsTotal()).isEqualTo(UPDATED_BOND_POINTS_TOTAL);
    }

    @Test
    @Transactional
    void putNonExistingPointsExchange() throws Exception {
        int databaseSizeBeforeUpdate = pointsExchangeRepository.findAll().size();
        pointsExchange.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPointsExchangeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, pointsExchange.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pointsExchange))
            )
            .andExpect(status().isBadRequest());

        // Validate the PointsExchange in the database
        List<PointsExchange> pointsExchangeList = pointsExchangeRepository.findAll();
        assertThat(pointsExchangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPointsExchange() throws Exception {
        int databaseSizeBeforeUpdate = pointsExchangeRepository.findAll().size();
        pointsExchange.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPointsExchangeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pointsExchange))
            )
            .andExpect(status().isBadRequest());

        // Validate the PointsExchange in the database
        List<PointsExchange> pointsExchangeList = pointsExchangeRepository.findAll();
        assertThat(pointsExchangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPointsExchange() throws Exception {
        int databaseSizeBeforeUpdate = pointsExchangeRepository.findAll().size();
        pointsExchange.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPointsExchangeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(pointsExchange))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PointsExchange in the database
        List<PointsExchange> pointsExchangeList = pointsExchangeRepository.findAll();
        assertThat(pointsExchangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePointsExchangeWithPatch() throws Exception {
        // Initialize the database
        pointsExchangeRepository.saveAndFlush(pointsExchange);

        int databaseSizeBeforeUpdate = pointsExchangeRepository.findAll().size();

        // Update the pointsExchange using partial update
        PointsExchange partialUpdatedPointsExchange = new PointsExchange();
        partialUpdatedPointsExchange.setId(pointsExchange.getId());

        partialUpdatedPointsExchange.pointsTotal(UPDATED_POINTS_TOTAL);

        restPointsExchangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPointsExchange.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPointsExchange))
            )
            .andExpect(status().isOk());

        // Validate the PointsExchange in the database
        List<PointsExchange> pointsExchangeList = pointsExchangeRepository.findAll();
        assertThat(pointsExchangeList).hasSize(databaseSizeBeforeUpdate);
        PointsExchange testPointsExchange = pointsExchangeList.get(pointsExchangeList.size() - 1);
        assertThat(testPointsExchange.getPointsTotal()).isEqualTo(UPDATED_POINTS_TOTAL);
        assertThat(testPointsExchange.getBondPointsTotal()).isEqualTo(DEFAULT_BOND_POINTS_TOTAL);
    }

    @Test
    @Transactional
    void fullUpdatePointsExchangeWithPatch() throws Exception {
        // Initialize the database
        pointsExchangeRepository.saveAndFlush(pointsExchange);

        int databaseSizeBeforeUpdate = pointsExchangeRepository.findAll().size();

        // Update the pointsExchange using partial update
        PointsExchange partialUpdatedPointsExchange = new PointsExchange();
        partialUpdatedPointsExchange.setId(pointsExchange.getId());

        partialUpdatedPointsExchange.pointsTotal(UPDATED_POINTS_TOTAL).bondPointsTotal(UPDATED_BOND_POINTS_TOTAL);

        restPointsExchangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPointsExchange.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPointsExchange))
            )
            .andExpect(status().isOk());

        // Validate the PointsExchange in the database
        List<PointsExchange> pointsExchangeList = pointsExchangeRepository.findAll();
        assertThat(pointsExchangeList).hasSize(databaseSizeBeforeUpdate);
        PointsExchange testPointsExchange = pointsExchangeList.get(pointsExchangeList.size() - 1);
        assertThat(testPointsExchange.getPointsTotal()).isEqualTo(UPDATED_POINTS_TOTAL);
        assertThat(testPointsExchange.getBondPointsTotal()).isEqualTo(UPDATED_BOND_POINTS_TOTAL);
    }

    @Test
    @Transactional
    void patchNonExistingPointsExchange() throws Exception {
        int databaseSizeBeforeUpdate = pointsExchangeRepository.findAll().size();
        pointsExchange.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPointsExchangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, pointsExchange.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pointsExchange))
            )
            .andExpect(status().isBadRequest());

        // Validate the PointsExchange in the database
        List<PointsExchange> pointsExchangeList = pointsExchangeRepository.findAll();
        assertThat(pointsExchangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPointsExchange() throws Exception {
        int databaseSizeBeforeUpdate = pointsExchangeRepository.findAll().size();
        pointsExchange.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPointsExchangeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pointsExchange))
            )
            .andExpect(status().isBadRequest());

        // Validate the PointsExchange in the database
        List<PointsExchange> pointsExchangeList = pointsExchangeRepository.findAll();
        assertThat(pointsExchangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPointsExchange() throws Exception {
        int databaseSizeBeforeUpdate = pointsExchangeRepository.findAll().size();
        pointsExchange.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPointsExchangeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(pointsExchange))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PointsExchange in the database
        List<PointsExchange> pointsExchangeList = pointsExchangeRepository.findAll();
        assertThat(pointsExchangeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePointsExchange() throws Exception {
        // Initialize the database
        pointsExchangeRepository.saveAndFlush(pointsExchange);

        int databaseSizeBeforeDelete = pointsExchangeRepository.findAll().size();

        // Delete the pointsExchange
        restPointsExchangeMockMvc
            .perform(delete(ENTITY_API_URL_ID, pointsExchange.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PointsExchange> pointsExchangeList = pointsExchangeRepository.findAll();
        assertThat(pointsExchangeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
