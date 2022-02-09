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
import org.createyourevent.app.domain.ChipsAdmin;
import org.createyourevent.app.repository.ChipsAdminRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ChipsAdminResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChipsAdminResourceIT {

    private static final Boolean DEFAULT_GAME_ACTIVE = false;
    private static final Boolean UPDATED_GAME_ACTIVE = true;

    private static final String ENTITY_API_URL = "/api/chips-admins";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChipsAdminRepository chipsAdminRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChipsAdminMockMvc;

    private ChipsAdmin chipsAdmin;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChipsAdmin createEntity(EntityManager em) {
        ChipsAdmin chipsAdmin = new ChipsAdmin().gameActive(DEFAULT_GAME_ACTIVE);
        return chipsAdmin;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChipsAdmin createUpdatedEntity(EntityManager em) {
        ChipsAdmin chipsAdmin = new ChipsAdmin().gameActive(UPDATED_GAME_ACTIVE);
        return chipsAdmin;
    }

    @BeforeEach
    public void initTest() {
        chipsAdmin = createEntity(em);
    }

    @Test
    @Transactional
    void createChipsAdmin() throws Exception {
        int databaseSizeBeforeCreate = chipsAdminRepository.findAll().size();
        // Create the ChipsAdmin
        restChipsAdminMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsAdmin))
            )
            .andExpect(status().isCreated());

        // Validate the ChipsAdmin in the database
        List<ChipsAdmin> chipsAdminList = chipsAdminRepository.findAll();
        assertThat(chipsAdminList).hasSize(databaseSizeBeforeCreate + 1);
        ChipsAdmin testChipsAdmin = chipsAdminList.get(chipsAdminList.size() - 1);
        assertThat(testChipsAdmin.getGameActive()).isEqualTo(DEFAULT_GAME_ACTIVE);
    }

    @Test
    @Transactional
    void createChipsAdminWithExistingId() throws Exception {
        // Create the ChipsAdmin with an existing ID
        chipsAdmin.setId(1L);

        int databaseSizeBeforeCreate = chipsAdminRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChipsAdminMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsAdmin))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsAdmin in the database
        List<ChipsAdmin> chipsAdminList = chipsAdminRepository.findAll();
        assertThat(chipsAdminList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChipsAdmins() throws Exception {
        // Initialize the database
        chipsAdminRepository.saveAndFlush(chipsAdmin);

        // Get all the chipsAdminList
        restChipsAdminMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chipsAdmin.getId().intValue())))
            .andExpect(jsonPath("$.[*].gameActive").value(hasItem(DEFAULT_GAME_ACTIVE.booleanValue())));
    }

    @Test
    @Transactional
    void getChipsAdmin() throws Exception {
        // Initialize the database
        chipsAdminRepository.saveAndFlush(chipsAdmin);

        // Get the chipsAdmin
        restChipsAdminMockMvc
            .perform(get(ENTITY_API_URL_ID, chipsAdmin.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chipsAdmin.getId().intValue()))
            .andExpect(jsonPath("$.gameActive").value(DEFAULT_GAME_ACTIVE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingChipsAdmin() throws Exception {
        // Get the chipsAdmin
        restChipsAdminMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewChipsAdmin() throws Exception {
        // Initialize the database
        chipsAdminRepository.saveAndFlush(chipsAdmin);

        int databaseSizeBeforeUpdate = chipsAdminRepository.findAll().size();

        // Update the chipsAdmin
        ChipsAdmin updatedChipsAdmin = chipsAdminRepository.findById(chipsAdmin.getId()).get();
        // Disconnect from session so that the updates on updatedChipsAdmin are not directly saved in db
        em.detach(updatedChipsAdmin);
        updatedChipsAdmin.gameActive(UPDATED_GAME_ACTIVE);

        restChipsAdminMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChipsAdmin.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChipsAdmin))
            )
            .andExpect(status().isOk());

        // Validate the ChipsAdmin in the database
        List<ChipsAdmin> chipsAdminList = chipsAdminRepository.findAll();
        assertThat(chipsAdminList).hasSize(databaseSizeBeforeUpdate);
        ChipsAdmin testChipsAdmin = chipsAdminList.get(chipsAdminList.size() - 1);
        assertThat(testChipsAdmin.getGameActive()).isEqualTo(UPDATED_GAME_ACTIVE);
    }

    @Test
    @Transactional
    void putNonExistingChipsAdmin() throws Exception {
        int databaseSizeBeforeUpdate = chipsAdminRepository.findAll().size();
        chipsAdmin.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChipsAdminMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chipsAdmin.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsAdmin))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsAdmin in the database
        List<ChipsAdmin> chipsAdminList = chipsAdminRepository.findAll();
        assertThat(chipsAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChipsAdmin() throws Exception {
        int databaseSizeBeforeUpdate = chipsAdminRepository.findAll().size();
        chipsAdmin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsAdminMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsAdmin))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsAdmin in the database
        List<ChipsAdmin> chipsAdminList = chipsAdminRepository.findAll();
        assertThat(chipsAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChipsAdmin() throws Exception {
        int databaseSizeBeforeUpdate = chipsAdminRepository.findAll().size();
        chipsAdmin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsAdminMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsAdmin))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChipsAdmin in the database
        List<ChipsAdmin> chipsAdminList = chipsAdminRepository.findAll();
        assertThat(chipsAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChipsAdminWithPatch() throws Exception {
        // Initialize the database
        chipsAdminRepository.saveAndFlush(chipsAdmin);

        int databaseSizeBeforeUpdate = chipsAdminRepository.findAll().size();

        // Update the chipsAdmin using partial update
        ChipsAdmin partialUpdatedChipsAdmin = new ChipsAdmin();
        partialUpdatedChipsAdmin.setId(chipsAdmin.getId());

        restChipsAdminMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChipsAdmin.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChipsAdmin))
            )
            .andExpect(status().isOk());

        // Validate the ChipsAdmin in the database
        List<ChipsAdmin> chipsAdminList = chipsAdminRepository.findAll();
        assertThat(chipsAdminList).hasSize(databaseSizeBeforeUpdate);
        ChipsAdmin testChipsAdmin = chipsAdminList.get(chipsAdminList.size() - 1);
        assertThat(testChipsAdmin.getGameActive()).isEqualTo(DEFAULT_GAME_ACTIVE);
    }

    @Test
    @Transactional
    void fullUpdateChipsAdminWithPatch() throws Exception {
        // Initialize the database
        chipsAdminRepository.saveAndFlush(chipsAdmin);

        int databaseSizeBeforeUpdate = chipsAdminRepository.findAll().size();

        // Update the chipsAdmin using partial update
        ChipsAdmin partialUpdatedChipsAdmin = new ChipsAdmin();
        partialUpdatedChipsAdmin.setId(chipsAdmin.getId());

        partialUpdatedChipsAdmin.gameActive(UPDATED_GAME_ACTIVE);

        restChipsAdminMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChipsAdmin.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChipsAdmin))
            )
            .andExpect(status().isOk());

        // Validate the ChipsAdmin in the database
        List<ChipsAdmin> chipsAdminList = chipsAdminRepository.findAll();
        assertThat(chipsAdminList).hasSize(databaseSizeBeforeUpdate);
        ChipsAdmin testChipsAdmin = chipsAdminList.get(chipsAdminList.size() - 1);
        assertThat(testChipsAdmin.getGameActive()).isEqualTo(UPDATED_GAME_ACTIVE);
    }

    @Test
    @Transactional
    void patchNonExistingChipsAdmin() throws Exception {
        int databaseSizeBeforeUpdate = chipsAdminRepository.findAll().size();
        chipsAdmin.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChipsAdminMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chipsAdmin.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chipsAdmin))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsAdmin in the database
        List<ChipsAdmin> chipsAdminList = chipsAdminRepository.findAll();
        assertThat(chipsAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChipsAdmin() throws Exception {
        int databaseSizeBeforeUpdate = chipsAdminRepository.findAll().size();
        chipsAdmin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsAdminMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chipsAdmin))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsAdmin in the database
        List<ChipsAdmin> chipsAdminList = chipsAdminRepository.findAll();
        assertThat(chipsAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChipsAdmin() throws Exception {
        int databaseSizeBeforeUpdate = chipsAdminRepository.findAll().size();
        chipsAdmin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsAdminMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chipsAdmin))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChipsAdmin in the database
        List<ChipsAdmin> chipsAdminList = chipsAdminRepository.findAll();
        assertThat(chipsAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChipsAdmin() throws Exception {
        // Initialize the database
        chipsAdminRepository.saveAndFlush(chipsAdmin);

        int databaseSizeBeforeDelete = chipsAdminRepository.findAll().size();

        // Delete the chipsAdmin
        restChipsAdminMockMvc
            .perform(delete(ENTITY_API_URL_ID, chipsAdmin.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChipsAdmin> chipsAdminList = chipsAdminRepository.findAll();
        assertThat(chipsAdminList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
