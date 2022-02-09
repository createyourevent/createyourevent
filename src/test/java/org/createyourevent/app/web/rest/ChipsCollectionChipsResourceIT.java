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
import org.createyourevent.app.domain.ChipsCollectionChips;
import org.createyourevent.app.repository.ChipsCollectionChipsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ChipsCollectionChipsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChipsCollectionChipsResourceIT {

    private static final String ENTITY_API_URL = "/api/chips-collection-chips";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChipsCollectionChipsRepository chipsCollectionChipsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChipsCollectionChipsMockMvc;

    private ChipsCollectionChips chipsCollectionChips;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChipsCollectionChips createEntity(EntityManager em) {
        ChipsCollectionChips chipsCollectionChips = new ChipsCollectionChips();
        return chipsCollectionChips;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChipsCollectionChips createUpdatedEntity(EntityManager em) {
        ChipsCollectionChips chipsCollectionChips = new ChipsCollectionChips();
        return chipsCollectionChips;
    }

    @BeforeEach
    public void initTest() {
        chipsCollectionChips = createEntity(em);
    }

    @Test
    @Transactional
    void createChipsCollectionChips() throws Exception {
        int databaseSizeBeforeCreate = chipsCollectionChipsRepository.findAll().size();
        // Create the ChipsCollectionChips
        restChipsCollectionChipsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollectionChips))
            )
            .andExpect(status().isCreated());

        // Validate the ChipsCollectionChips in the database
        List<ChipsCollectionChips> chipsCollectionChipsList = chipsCollectionChipsRepository.findAll();
        assertThat(chipsCollectionChipsList).hasSize(databaseSizeBeforeCreate + 1);
        ChipsCollectionChips testChipsCollectionChips = chipsCollectionChipsList.get(chipsCollectionChipsList.size() - 1);
    }

    @Test
    @Transactional
    void createChipsCollectionChipsWithExistingId() throws Exception {
        // Create the ChipsCollectionChips with an existing ID
        chipsCollectionChips.setId(1L);

        int databaseSizeBeforeCreate = chipsCollectionChipsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChipsCollectionChipsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollectionChips))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsCollectionChips in the database
        List<ChipsCollectionChips> chipsCollectionChipsList = chipsCollectionChipsRepository.findAll();
        assertThat(chipsCollectionChipsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChipsCollectionChips() throws Exception {
        // Initialize the database
        chipsCollectionChipsRepository.saveAndFlush(chipsCollectionChips);

        // Get all the chipsCollectionChipsList
        restChipsCollectionChipsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chipsCollectionChips.getId().intValue())));
    }

    @Test
    @Transactional
    void getChipsCollectionChips() throws Exception {
        // Initialize the database
        chipsCollectionChipsRepository.saveAndFlush(chipsCollectionChips);

        // Get the chipsCollectionChips
        restChipsCollectionChipsMockMvc
            .perform(get(ENTITY_API_URL_ID, chipsCollectionChips.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chipsCollectionChips.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingChipsCollectionChips() throws Exception {
        // Get the chipsCollectionChips
        restChipsCollectionChipsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewChipsCollectionChips() throws Exception {
        // Initialize the database
        chipsCollectionChipsRepository.saveAndFlush(chipsCollectionChips);

        int databaseSizeBeforeUpdate = chipsCollectionChipsRepository.findAll().size();

        // Update the chipsCollectionChips
        ChipsCollectionChips updatedChipsCollectionChips = chipsCollectionChipsRepository.findById(chipsCollectionChips.getId()).get();
        // Disconnect from session so that the updates on updatedChipsCollectionChips are not directly saved in db
        em.detach(updatedChipsCollectionChips);

        restChipsCollectionChipsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChipsCollectionChips.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChipsCollectionChips))
            )
            .andExpect(status().isOk());

        // Validate the ChipsCollectionChips in the database
        List<ChipsCollectionChips> chipsCollectionChipsList = chipsCollectionChipsRepository.findAll();
        assertThat(chipsCollectionChipsList).hasSize(databaseSizeBeforeUpdate);
        ChipsCollectionChips testChipsCollectionChips = chipsCollectionChipsList.get(chipsCollectionChipsList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingChipsCollectionChips() throws Exception {
        int databaseSizeBeforeUpdate = chipsCollectionChipsRepository.findAll().size();
        chipsCollectionChips.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChipsCollectionChipsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chipsCollectionChips.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollectionChips))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsCollectionChips in the database
        List<ChipsCollectionChips> chipsCollectionChipsList = chipsCollectionChipsRepository.findAll();
        assertThat(chipsCollectionChipsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChipsCollectionChips() throws Exception {
        int databaseSizeBeforeUpdate = chipsCollectionChipsRepository.findAll().size();
        chipsCollectionChips.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsCollectionChipsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollectionChips))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsCollectionChips in the database
        List<ChipsCollectionChips> chipsCollectionChipsList = chipsCollectionChipsRepository.findAll();
        assertThat(chipsCollectionChipsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChipsCollectionChips() throws Exception {
        int databaseSizeBeforeUpdate = chipsCollectionChipsRepository.findAll().size();
        chipsCollectionChips.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsCollectionChipsMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollectionChips))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChipsCollectionChips in the database
        List<ChipsCollectionChips> chipsCollectionChipsList = chipsCollectionChipsRepository.findAll();
        assertThat(chipsCollectionChipsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChipsCollectionChipsWithPatch() throws Exception {
        // Initialize the database
        chipsCollectionChipsRepository.saveAndFlush(chipsCollectionChips);

        int databaseSizeBeforeUpdate = chipsCollectionChipsRepository.findAll().size();

        // Update the chipsCollectionChips using partial update
        ChipsCollectionChips partialUpdatedChipsCollectionChips = new ChipsCollectionChips();
        partialUpdatedChipsCollectionChips.setId(chipsCollectionChips.getId());

        restChipsCollectionChipsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChipsCollectionChips.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChipsCollectionChips))
            )
            .andExpect(status().isOk());

        // Validate the ChipsCollectionChips in the database
        List<ChipsCollectionChips> chipsCollectionChipsList = chipsCollectionChipsRepository.findAll();
        assertThat(chipsCollectionChipsList).hasSize(databaseSizeBeforeUpdate);
        ChipsCollectionChips testChipsCollectionChips = chipsCollectionChipsList.get(chipsCollectionChipsList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateChipsCollectionChipsWithPatch() throws Exception {
        // Initialize the database
        chipsCollectionChipsRepository.saveAndFlush(chipsCollectionChips);

        int databaseSizeBeforeUpdate = chipsCollectionChipsRepository.findAll().size();

        // Update the chipsCollectionChips using partial update
        ChipsCollectionChips partialUpdatedChipsCollectionChips = new ChipsCollectionChips();
        partialUpdatedChipsCollectionChips.setId(chipsCollectionChips.getId());

        restChipsCollectionChipsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChipsCollectionChips.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChipsCollectionChips))
            )
            .andExpect(status().isOk());

        // Validate the ChipsCollectionChips in the database
        List<ChipsCollectionChips> chipsCollectionChipsList = chipsCollectionChipsRepository.findAll();
        assertThat(chipsCollectionChipsList).hasSize(databaseSizeBeforeUpdate);
        ChipsCollectionChips testChipsCollectionChips = chipsCollectionChipsList.get(chipsCollectionChipsList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingChipsCollectionChips() throws Exception {
        int databaseSizeBeforeUpdate = chipsCollectionChipsRepository.findAll().size();
        chipsCollectionChips.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChipsCollectionChipsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chipsCollectionChips.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollectionChips))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsCollectionChips in the database
        List<ChipsCollectionChips> chipsCollectionChipsList = chipsCollectionChipsRepository.findAll();
        assertThat(chipsCollectionChipsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChipsCollectionChips() throws Exception {
        int databaseSizeBeforeUpdate = chipsCollectionChipsRepository.findAll().size();
        chipsCollectionChips.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsCollectionChipsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollectionChips))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsCollectionChips in the database
        List<ChipsCollectionChips> chipsCollectionChipsList = chipsCollectionChipsRepository.findAll();
        assertThat(chipsCollectionChipsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChipsCollectionChips() throws Exception {
        int databaseSizeBeforeUpdate = chipsCollectionChipsRepository.findAll().size();
        chipsCollectionChips.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsCollectionChipsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollectionChips))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChipsCollectionChips in the database
        List<ChipsCollectionChips> chipsCollectionChipsList = chipsCollectionChipsRepository.findAll();
        assertThat(chipsCollectionChipsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChipsCollectionChips() throws Exception {
        // Initialize the database
        chipsCollectionChipsRepository.saveAndFlush(chipsCollectionChips);

        int databaseSizeBeforeDelete = chipsCollectionChipsRepository.findAll().size();

        // Delete the chipsCollectionChips
        restChipsCollectionChipsMockMvc
            .perform(delete(ENTITY_API_URL_ID, chipsCollectionChips.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChipsCollectionChips> chipsCollectionChipsList = chipsCollectionChipsRepository.findAll();
        assertThat(chipsCollectionChipsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
