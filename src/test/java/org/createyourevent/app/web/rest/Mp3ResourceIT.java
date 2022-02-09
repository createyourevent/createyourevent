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
import org.createyourevent.app.domain.Mp3;
import org.createyourevent.app.repository.Mp3Repository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link Mp3Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Mp3ResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_ARTISTS = "AAAAAAAAAA";
    private static final String UPDATED_ARTISTS = "BBBBBBBBBB";

    private static final Integer DEFAULT_DURATION = 1;
    private static final Integer UPDATED_DURATION = 2;

    private static final String DEFAULT_URL = "AAAAAAAAAA";
    private static final String UPDATED_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/mp-3-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Mp3Repository mp3Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMp3MockMvc;

    private Mp3 mp3;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mp3 createEntity(EntityManager em) {
        Mp3 mp3 = new Mp3().title(DEFAULT_TITLE).artists(DEFAULT_ARTISTS).duration(DEFAULT_DURATION).url(DEFAULT_URL);
        return mp3;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mp3 createUpdatedEntity(EntityManager em) {
        Mp3 mp3 = new Mp3().title(UPDATED_TITLE).artists(UPDATED_ARTISTS).duration(UPDATED_DURATION).url(UPDATED_URL);
        return mp3;
    }

    @BeforeEach
    public void initTest() {
        mp3 = createEntity(em);
    }

    @Test
    @Transactional
    void createMp3() throws Exception {
        int databaseSizeBeforeCreate = mp3Repository.findAll().size();
        // Create the Mp3
        restMp3MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mp3))
            )
            .andExpect(status().isCreated());

        // Validate the Mp3 in the database
        List<Mp3> mp3List = mp3Repository.findAll();
        assertThat(mp3List).hasSize(databaseSizeBeforeCreate + 1);
        Mp3 testMp3 = mp3List.get(mp3List.size() - 1);
        assertThat(testMp3.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testMp3.getArtists()).isEqualTo(DEFAULT_ARTISTS);
        assertThat(testMp3.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testMp3.getUrl()).isEqualTo(DEFAULT_URL);
    }

    @Test
    @Transactional
    void createMp3WithExistingId() throws Exception {
        // Create the Mp3 with an existing ID
        mp3.setId(1L);

        int databaseSizeBeforeCreate = mp3Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMp3MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mp3))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mp3 in the database
        List<Mp3> mp3List = mp3Repository.findAll();
        assertThat(mp3List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMp3s() throws Exception {
        // Initialize the database
        mp3Repository.saveAndFlush(mp3);

        // Get all the mp3List
        restMp3MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mp3.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].artists").value(hasItem(DEFAULT_ARTISTS)))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)))
            .andExpect(jsonPath("$.[*].url").value(hasItem(DEFAULT_URL)));
    }

    @Test
    @Transactional
    void getMp3() throws Exception {
        // Initialize the database
        mp3Repository.saveAndFlush(mp3);

        // Get the mp3
        restMp3MockMvc
            .perform(get(ENTITY_API_URL_ID, mp3.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mp3.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.artists").value(DEFAULT_ARTISTS))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION))
            .andExpect(jsonPath("$.url").value(DEFAULT_URL));
    }

    @Test
    @Transactional
    void getNonExistingMp3() throws Exception {
        // Get the mp3
        restMp3MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMp3() throws Exception {
        // Initialize the database
        mp3Repository.saveAndFlush(mp3);

        int databaseSizeBeforeUpdate = mp3Repository.findAll().size();

        // Update the mp3
        Mp3 updatedMp3 = mp3Repository.findById(mp3.getId()).get();
        // Disconnect from session so that the updates on updatedMp3 are not directly saved in db
        em.detach(updatedMp3);
        updatedMp3.title(UPDATED_TITLE).artists(UPDATED_ARTISTS).duration(UPDATED_DURATION).url(UPDATED_URL);

        restMp3MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMp3.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMp3))
            )
            .andExpect(status().isOk());

        // Validate the Mp3 in the database
        List<Mp3> mp3List = mp3Repository.findAll();
        assertThat(mp3List).hasSize(databaseSizeBeforeUpdate);
        Mp3 testMp3 = mp3List.get(mp3List.size() - 1);
        assertThat(testMp3.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testMp3.getArtists()).isEqualTo(UPDATED_ARTISTS);
        assertThat(testMp3.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testMp3.getUrl()).isEqualTo(UPDATED_URL);
    }

    @Test
    @Transactional
    void putNonExistingMp3() throws Exception {
        int databaseSizeBeforeUpdate = mp3Repository.findAll().size();
        mp3.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMp3MockMvc
            .perform(
                put(ENTITY_API_URL_ID, mp3.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mp3))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mp3 in the database
        List<Mp3> mp3List = mp3Repository.findAll();
        assertThat(mp3List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMp3() throws Exception {
        int databaseSizeBeforeUpdate = mp3Repository.findAll().size();
        mp3.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMp3MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mp3))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mp3 in the database
        List<Mp3> mp3List = mp3Repository.findAll();
        assertThat(mp3List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMp3() throws Exception {
        int databaseSizeBeforeUpdate = mp3Repository.findAll().size();
        mp3.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMp3MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mp3))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mp3 in the database
        List<Mp3> mp3List = mp3Repository.findAll();
        assertThat(mp3List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMp3WithPatch() throws Exception {
        // Initialize the database
        mp3Repository.saveAndFlush(mp3);

        int databaseSizeBeforeUpdate = mp3Repository.findAll().size();

        // Update the mp3 using partial update
        Mp3 partialUpdatedMp3 = new Mp3();
        partialUpdatedMp3.setId(mp3.getId());

        restMp3MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMp3.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMp3))
            )
            .andExpect(status().isOk());

        // Validate the Mp3 in the database
        List<Mp3> mp3List = mp3Repository.findAll();
        assertThat(mp3List).hasSize(databaseSizeBeforeUpdate);
        Mp3 testMp3 = mp3List.get(mp3List.size() - 1);
        assertThat(testMp3.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testMp3.getArtists()).isEqualTo(DEFAULT_ARTISTS);
        assertThat(testMp3.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testMp3.getUrl()).isEqualTo(DEFAULT_URL);
    }

    @Test
    @Transactional
    void fullUpdateMp3WithPatch() throws Exception {
        // Initialize the database
        mp3Repository.saveAndFlush(mp3);

        int databaseSizeBeforeUpdate = mp3Repository.findAll().size();

        // Update the mp3 using partial update
        Mp3 partialUpdatedMp3 = new Mp3();
        partialUpdatedMp3.setId(mp3.getId());

        partialUpdatedMp3.title(UPDATED_TITLE).artists(UPDATED_ARTISTS).duration(UPDATED_DURATION).url(UPDATED_URL);

        restMp3MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMp3.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMp3))
            )
            .andExpect(status().isOk());

        // Validate the Mp3 in the database
        List<Mp3> mp3List = mp3Repository.findAll();
        assertThat(mp3List).hasSize(databaseSizeBeforeUpdate);
        Mp3 testMp3 = mp3List.get(mp3List.size() - 1);
        assertThat(testMp3.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testMp3.getArtists()).isEqualTo(UPDATED_ARTISTS);
        assertThat(testMp3.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testMp3.getUrl()).isEqualTo(UPDATED_URL);
    }

    @Test
    @Transactional
    void patchNonExistingMp3() throws Exception {
        int databaseSizeBeforeUpdate = mp3Repository.findAll().size();
        mp3.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMp3MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mp3.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mp3))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mp3 in the database
        List<Mp3> mp3List = mp3Repository.findAll();
        assertThat(mp3List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMp3() throws Exception {
        int databaseSizeBeforeUpdate = mp3Repository.findAll().size();
        mp3.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMp3MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mp3))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mp3 in the database
        List<Mp3> mp3List = mp3Repository.findAll();
        assertThat(mp3List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMp3() throws Exception {
        int databaseSizeBeforeUpdate = mp3Repository.findAll().size();
        mp3.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMp3MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mp3))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mp3 in the database
        List<Mp3> mp3List = mp3Repository.findAll();
        assertThat(mp3List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMp3() throws Exception {
        // Initialize the database
        mp3Repository.saveAndFlush(mp3);

        int databaseSizeBeforeDelete = mp3Repository.findAll().size();

        // Delete the mp3
        restMp3MockMvc
            .perform(delete(ENTITY_API_URL_ID, mp3.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Mp3> mp3List = mp3Repository.findAll();
        assertThat(mp3List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
