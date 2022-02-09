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
import org.createyourevent.app.domain.Bond;
import org.createyourevent.app.repository.BondRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link BondResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BondResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final Long DEFAULT_POINTS = 1L;
    private static final Long UPDATED_POINTS = 2L;

    private static final ZonedDateTime DEFAULT_CREATION_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATION_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_REDEMPTION_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_REDEMPTION_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/bonds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BondRepository bondRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBondMockMvc;

    private Bond bond;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bond createEntity(EntityManager em) {
        Bond bond = new Bond()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .code(DEFAULT_CODE)
            .points(DEFAULT_POINTS)
            .creationDate(DEFAULT_CREATION_DATE)
            .redemptionDate(DEFAULT_REDEMPTION_DATE);
        return bond;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bond createUpdatedEntity(EntityManager em) {
        Bond bond = new Bond()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .code(UPDATED_CODE)
            .points(UPDATED_POINTS)
            .creationDate(UPDATED_CREATION_DATE)
            .redemptionDate(UPDATED_REDEMPTION_DATE);
        return bond;
    }

    @BeforeEach
    public void initTest() {
        bond = createEntity(em);
    }

    @Test
    @Transactional
    void createBond() throws Exception {
        int databaseSizeBeforeCreate = bondRepository.findAll().size();
        // Create the Bond
        restBondMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bond))
            )
            .andExpect(status().isCreated());

        // Validate the Bond in the database
        List<Bond> bondList = bondRepository.findAll();
        assertThat(bondList).hasSize(databaseSizeBeforeCreate + 1);
        Bond testBond = bondList.get(bondList.size() - 1);
        assertThat(testBond.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBond.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testBond.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testBond.getPoints()).isEqualTo(DEFAULT_POINTS);
        assertThat(testBond.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
        assertThat(testBond.getRedemptionDate()).isEqualTo(DEFAULT_REDEMPTION_DATE);
    }

    @Test
    @Transactional
    void createBondWithExistingId() throws Exception {
        // Create the Bond with an existing ID
        bond.setId(1L);

        int databaseSizeBeforeCreate = bondRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBondMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bond))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bond in the database
        List<Bond> bondList = bondRepository.findAll();
        assertThat(bondList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBonds() throws Exception {
        // Initialize the database
        bondRepository.saveAndFlush(bond);

        // Get all the bondList
        restBondMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bond.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS.intValue())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(sameInstant(DEFAULT_CREATION_DATE))))
            .andExpect(jsonPath("$.[*].redemptionDate").value(hasItem(sameInstant(DEFAULT_REDEMPTION_DATE))));
    }

    @Test
    @Transactional
    void getBond() throws Exception {
        // Initialize the database
        bondRepository.saveAndFlush(bond);

        // Get the bond
        restBondMockMvc
            .perform(get(ENTITY_API_URL_ID, bond.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bond.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS.intValue()))
            .andExpect(jsonPath("$.creationDate").value(sameInstant(DEFAULT_CREATION_DATE)))
            .andExpect(jsonPath("$.redemptionDate").value(sameInstant(DEFAULT_REDEMPTION_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingBond() throws Exception {
        // Get the bond
        restBondMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBond() throws Exception {
        // Initialize the database
        bondRepository.saveAndFlush(bond);

        int databaseSizeBeforeUpdate = bondRepository.findAll().size();

        // Update the bond
        Bond updatedBond = bondRepository.findById(bond.getId()).get();
        // Disconnect from session so that the updates on updatedBond are not directly saved in db
        em.detach(updatedBond);
        updatedBond
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .code(UPDATED_CODE)
            .points(UPDATED_POINTS)
            .creationDate(UPDATED_CREATION_DATE)
            .redemptionDate(UPDATED_REDEMPTION_DATE);

        restBondMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBond.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBond))
            )
            .andExpect(status().isOk());

        // Validate the Bond in the database
        List<Bond> bondList = bondRepository.findAll();
        assertThat(bondList).hasSize(databaseSizeBeforeUpdate);
        Bond testBond = bondList.get(bondList.size() - 1);
        assertThat(testBond.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBond.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testBond.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testBond.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testBond.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testBond.getRedemptionDate()).isEqualTo(UPDATED_REDEMPTION_DATE);
    }

    @Test
    @Transactional
    void putNonExistingBond() throws Exception {
        int databaseSizeBeforeUpdate = bondRepository.findAll().size();
        bond.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBondMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bond.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bond))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bond in the database
        List<Bond> bondList = bondRepository.findAll();
        assertThat(bondList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBond() throws Exception {
        int databaseSizeBeforeUpdate = bondRepository.findAll().size();
        bond.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBondMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bond))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bond in the database
        List<Bond> bondList = bondRepository.findAll();
        assertThat(bondList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBond() throws Exception {
        int databaseSizeBeforeUpdate = bondRepository.findAll().size();
        bond.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBondMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bond))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bond in the database
        List<Bond> bondList = bondRepository.findAll();
        assertThat(bondList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBondWithPatch() throws Exception {
        // Initialize the database
        bondRepository.saveAndFlush(bond);

        int databaseSizeBeforeUpdate = bondRepository.findAll().size();

        // Update the bond using partial update
        Bond partialUpdatedBond = new Bond();
        partialUpdatedBond.setId(bond.getId());

        partialUpdatedBond.code(UPDATED_CODE).points(UPDATED_POINTS).redemptionDate(UPDATED_REDEMPTION_DATE);

        restBondMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBond.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBond))
            )
            .andExpect(status().isOk());

        // Validate the Bond in the database
        List<Bond> bondList = bondRepository.findAll();
        assertThat(bondList).hasSize(databaseSizeBeforeUpdate);
        Bond testBond = bondList.get(bondList.size() - 1);
        assertThat(testBond.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBond.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testBond.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testBond.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testBond.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
        assertThat(testBond.getRedemptionDate()).isEqualTo(UPDATED_REDEMPTION_DATE);
    }

    @Test
    @Transactional
    void fullUpdateBondWithPatch() throws Exception {
        // Initialize the database
        bondRepository.saveAndFlush(bond);

        int databaseSizeBeforeUpdate = bondRepository.findAll().size();

        // Update the bond using partial update
        Bond partialUpdatedBond = new Bond();
        partialUpdatedBond.setId(bond.getId());

        partialUpdatedBond
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .code(UPDATED_CODE)
            .points(UPDATED_POINTS)
            .creationDate(UPDATED_CREATION_DATE)
            .redemptionDate(UPDATED_REDEMPTION_DATE);

        restBondMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBond.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBond))
            )
            .andExpect(status().isOk());

        // Validate the Bond in the database
        List<Bond> bondList = bondRepository.findAll();
        assertThat(bondList).hasSize(databaseSizeBeforeUpdate);
        Bond testBond = bondList.get(bondList.size() - 1);
        assertThat(testBond.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBond.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testBond.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testBond.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testBond.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testBond.getRedemptionDate()).isEqualTo(UPDATED_REDEMPTION_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingBond() throws Exception {
        int databaseSizeBeforeUpdate = bondRepository.findAll().size();
        bond.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBondMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bond.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bond))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bond in the database
        List<Bond> bondList = bondRepository.findAll();
        assertThat(bondList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBond() throws Exception {
        int databaseSizeBeforeUpdate = bondRepository.findAll().size();
        bond.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBondMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bond))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bond in the database
        List<Bond> bondList = bondRepository.findAll();
        assertThat(bondList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBond() throws Exception {
        int databaseSizeBeforeUpdate = bondRepository.findAll().size();
        bond.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBondMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bond))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bond in the database
        List<Bond> bondList = bondRepository.findAll();
        assertThat(bondList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBond() throws Exception {
        // Initialize the database
        bondRepository.saveAndFlush(bond);

        int databaseSizeBeforeDelete = bondRepository.findAll().size();

        // Delete the bond
        restBondMockMvc
            .perform(delete(ENTITY_API_URL_ID, bond.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bond> bondList = bondRepository.findAll();
        assertThat(bondList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
