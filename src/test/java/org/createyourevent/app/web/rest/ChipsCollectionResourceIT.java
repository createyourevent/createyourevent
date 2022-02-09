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
import org.createyourevent.app.domain.ChipsCollection;
import org.createyourevent.app.repository.ChipsCollectionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ChipsCollectionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChipsCollectionResourceIT {

    private static final String ENTITY_API_URL = "/api/chips-collections";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChipsCollectionRepository chipsCollectionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChipsCollectionMockMvc;

    private ChipsCollection chipsCollection;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChipsCollection createEntity(EntityManager em) {
        ChipsCollection chipsCollection = new ChipsCollection();
        return chipsCollection;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChipsCollection createUpdatedEntity(EntityManager em) {
        ChipsCollection chipsCollection = new ChipsCollection();
        return chipsCollection;
    }

    @BeforeEach
    public void initTest() {
        chipsCollection = createEntity(em);
    }

    @Test
    @Transactional
    void createChipsCollection() throws Exception {
        int databaseSizeBeforeCreate = chipsCollectionRepository.findAll().size();
        // Create the ChipsCollection
        restChipsCollectionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollection))
            )
            .andExpect(status().isCreated());

        // Validate the ChipsCollection in the database
        List<ChipsCollection> chipsCollectionList = chipsCollectionRepository.findAll();
        assertThat(chipsCollectionList).hasSize(databaseSizeBeforeCreate + 1);
        ChipsCollection testChipsCollection = chipsCollectionList.get(chipsCollectionList.size() - 1);
    }

    @Test
    @Transactional
    void createChipsCollectionWithExistingId() throws Exception {
        // Create the ChipsCollection with an existing ID
        chipsCollection.setId(1L);

        int databaseSizeBeforeCreate = chipsCollectionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChipsCollectionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollection))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsCollection in the database
        List<ChipsCollection> chipsCollectionList = chipsCollectionRepository.findAll();
        assertThat(chipsCollectionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChipsCollections() throws Exception {
        // Initialize the database
        chipsCollectionRepository.saveAndFlush(chipsCollection);

        // Get all the chipsCollectionList
        restChipsCollectionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chipsCollection.getId().intValue())));
    }

    @Test
    @Transactional
    void getChipsCollection() throws Exception {
        // Initialize the database
        chipsCollectionRepository.saveAndFlush(chipsCollection);

        // Get the chipsCollection
        restChipsCollectionMockMvc
            .perform(get(ENTITY_API_URL_ID, chipsCollection.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chipsCollection.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingChipsCollection() throws Exception {
        // Get the chipsCollection
        restChipsCollectionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewChipsCollection() throws Exception {
        // Initialize the database
        chipsCollectionRepository.saveAndFlush(chipsCollection);

        int databaseSizeBeforeUpdate = chipsCollectionRepository.findAll().size();

        // Update the chipsCollection
        ChipsCollection updatedChipsCollection = chipsCollectionRepository.findById(chipsCollection.getId()).get();
        // Disconnect from session so that the updates on updatedChipsCollection are not directly saved in db
        em.detach(updatedChipsCollection);

        restChipsCollectionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChipsCollection.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChipsCollection))
            )
            .andExpect(status().isOk());

        // Validate the ChipsCollection in the database
        List<ChipsCollection> chipsCollectionList = chipsCollectionRepository.findAll();
        assertThat(chipsCollectionList).hasSize(databaseSizeBeforeUpdate);
        ChipsCollection testChipsCollection = chipsCollectionList.get(chipsCollectionList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingChipsCollection() throws Exception {
        int databaseSizeBeforeUpdate = chipsCollectionRepository.findAll().size();
        chipsCollection.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChipsCollectionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chipsCollection.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollection))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsCollection in the database
        List<ChipsCollection> chipsCollectionList = chipsCollectionRepository.findAll();
        assertThat(chipsCollectionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChipsCollection() throws Exception {
        int databaseSizeBeforeUpdate = chipsCollectionRepository.findAll().size();
        chipsCollection.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsCollectionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollection))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsCollection in the database
        List<ChipsCollection> chipsCollectionList = chipsCollectionRepository.findAll();
        assertThat(chipsCollectionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChipsCollection() throws Exception {
        int databaseSizeBeforeUpdate = chipsCollectionRepository.findAll().size();
        chipsCollection.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsCollectionMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollection))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChipsCollection in the database
        List<ChipsCollection> chipsCollectionList = chipsCollectionRepository.findAll();
        assertThat(chipsCollectionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChipsCollectionWithPatch() throws Exception {
        // Initialize the database
        chipsCollectionRepository.saveAndFlush(chipsCollection);

        int databaseSizeBeforeUpdate = chipsCollectionRepository.findAll().size();

        // Update the chipsCollection using partial update
        ChipsCollection partialUpdatedChipsCollection = new ChipsCollection();
        partialUpdatedChipsCollection.setId(chipsCollection.getId());

        restChipsCollectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChipsCollection.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChipsCollection))
            )
            .andExpect(status().isOk());

        // Validate the ChipsCollection in the database
        List<ChipsCollection> chipsCollectionList = chipsCollectionRepository.findAll();
        assertThat(chipsCollectionList).hasSize(databaseSizeBeforeUpdate);
        ChipsCollection testChipsCollection = chipsCollectionList.get(chipsCollectionList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateChipsCollectionWithPatch() throws Exception {
        // Initialize the database
        chipsCollectionRepository.saveAndFlush(chipsCollection);

        int databaseSizeBeforeUpdate = chipsCollectionRepository.findAll().size();

        // Update the chipsCollection using partial update
        ChipsCollection partialUpdatedChipsCollection = new ChipsCollection();
        partialUpdatedChipsCollection.setId(chipsCollection.getId());

        restChipsCollectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChipsCollection.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChipsCollection))
            )
            .andExpect(status().isOk());

        // Validate the ChipsCollection in the database
        List<ChipsCollection> chipsCollectionList = chipsCollectionRepository.findAll();
        assertThat(chipsCollectionList).hasSize(databaseSizeBeforeUpdate);
        ChipsCollection testChipsCollection = chipsCollectionList.get(chipsCollectionList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingChipsCollection() throws Exception {
        int databaseSizeBeforeUpdate = chipsCollectionRepository.findAll().size();
        chipsCollection.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChipsCollectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chipsCollection.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollection))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsCollection in the database
        List<ChipsCollection> chipsCollectionList = chipsCollectionRepository.findAll();
        assertThat(chipsCollectionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChipsCollection() throws Exception {
        int databaseSizeBeforeUpdate = chipsCollectionRepository.findAll().size();
        chipsCollection.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsCollectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollection))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChipsCollection in the database
        List<ChipsCollection> chipsCollectionList = chipsCollectionRepository.findAll();
        assertThat(chipsCollectionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChipsCollection() throws Exception {
        int databaseSizeBeforeUpdate = chipsCollectionRepository.findAll().size();
        chipsCollection.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChipsCollectionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chipsCollection))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChipsCollection in the database
        List<ChipsCollection> chipsCollectionList = chipsCollectionRepository.findAll();
        assertThat(chipsCollectionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChipsCollection() throws Exception {
        // Initialize the database
        chipsCollectionRepository.saveAndFlush(chipsCollection);

        int databaseSizeBeforeDelete = chipsCollectionRepository.findAll().size();

        // Delete the chipsCollection
        restChipsCollectionMockMvc
            .perform(delete(ENTITY_API_URL_ID, chipsCollection.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChipsCollection> chipsCollectionList = chipsCollectionRepository.findAll();
        assertThat(chipsCollectionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
