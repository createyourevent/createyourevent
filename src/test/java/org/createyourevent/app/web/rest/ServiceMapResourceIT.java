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
import org.createyourevent.app.domain.ServiceMap;
import org.createyourevent.app.repository.ServiceMapRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ServiceMapResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ServiceMapResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/service-maps";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ServiceMapRepository serviceMapRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restServiceMapMockMvc;

    private ServiceMap serviceMap;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceMap createEntity(EntityManager em) {
        ServiceMap serviceMap = new ServiceMap().title(DEFAULT_TITLE);
        return serviceMap;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceMap createUpdatedEntity(EntityManager em) {
        ServiceMap serviceMap = new ServiceMap().title(UPDATED_TITLE);
        return serviceMap;
    }

    @BeforeEach
    public void initTest() {
        serviceMap = createEntity(em);
    }

    @Test
    @Transactional
    void createServiceMap() throws Exception {
        int databaseSizeBeforeCreate = serviceMapRepository.findAll().size();
        // Create the ServiceMap
        restServiceMapMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceMap))
            )
            .andExpect(status().isCreated());

        // Validate the ServiceMap in the database
        List<ServiceMap> serviceMapList = serviceMapRepository.findAll();
        assertThat(serviceMapList).hasSize(databaseSizeBeforeCreate + 1);
        ServiceMap testServiceMap = serviceMapList.get(serviceMapList.size() - 1);
        assertThat(testServiceMap.getTitle()).isEqualTo(DEFAULT_TITLE);
    }

    @Test
    @Transactional
    void createServiceMapWithExistingId() throws Exception {
        // Create the ServiceMap with an existing ID
        serviceMap.setId(1L);

        int databaseSizeBeforeCreate = serviceMapRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restServiceMapMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceMap))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceMap in the database
        List<ServiceMap> serviceMapList = serviceMapRepository.findAll();
        assertThat(serviceMapList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = serviceMapRepository.findAll().size();
        // set the field null
        serviceMap.setTitle(null);

        // Create the ServiceMap, which fails.

        restServiceMapMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceMap))
            )
            .andExpect(status().isBadRequest());

        List<ServiceMap> serviceMapList = serviceMapRepository.findAll();
        assertThat(serviceMapList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllServiceMaps() throws Exception {
        // Initialize the database
        serviceMapRepository.saveAndFlush(serviceMap);

        // Get all the serviceMapList
        restServiceMapMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(serviceMap.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)));
    }

    @Test
    @Transactional
    void getServiceMap() throws Exception {
        // Initialize the database
        serviceMapRepository.saveAndFlush(serviceMap);

        // Get the serviceMap
        restServiceMapMockMvc
            .perform(get(ENTITY_API_URL_ID, serviceMap.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(serviceMap.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE));
    }

    @Test
    @Transactional
    void getNonExistingServiceMap() throws Exception {
        // Get the serviceMap
        restServiceMapMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewServiceMap() throws Exception {
        // Initialize the database
        serviceMapRepository.saveAndFlush(serviceMap);

        int databaseSizeBeforeUpdate = serviceMapRepository.findAll().size();

        // Update the serviceMap
        ServiceMap updatedServiceMap = serviceMapRepository.findById(serviceMap.getId()).get();
        // Disconnect from session so that the updates on updatedServiceMap are not directly saved in db
        em.detach(updatedServiceMap);
        updatedServiceMap.title(UPDATED_TITLE);

        restServiceMapMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedServiceMap.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedServiceMap))
            )
            .andExpect(status().isOk());

        // Validate the ServiceMap in the database
        List<ServiceMap> serviceMapList = serviceMapRepository.findAll();
        assertThat(serviceMapList).hasSize(databaseSizeBeforeUpdate);
        ServiceMap testServiceMap = serviceMapList.get(serviceMapList.size() - 1);
        assertThat(testServiceMap.getTitle()).isEqualTo(UPDATED_TITLE);
    }

    @Test
    @Transactional
    void putNonExistingServiceMap() throws Exception {
        int databaseSizeBeforeUpdate = serviceMapRepository.findAll().size();
        serviceMap.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceMapMockMvc
            .perform(
                put(ENTITY_API_URL_ID, serviceMap.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceMap))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceMap in the database
        List<ServiceMap> serviceMapList = serviceMapRepository.findAll();
        assertThat(serviceMapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchServiceMap() throws Exception {
        int databaseSizeBeforeUpdate = serviceMapRepository.findAll().size();
        serviceMap.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceMapMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceMap))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceMap in the database
        List<ServiceMap> serviceMapList = serviceMapRepository.findAll();
        assertThat(serviceMapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamServiceMap() throws Exception {
        int databaseSizeBeforeUpdate = serviceMapRepository.findAll().size();
        serviceMap.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceMapMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceMap))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceMap in the database
        List<ServiceMap> serviceMapList = serviceMapRepository.findAll();
        assertThat(serviceMapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateServiceMapWithPatch() throws Exception {
        // Initialize the database
        serviceMapRepository.saveAndFlush(serviceMap);

        int databaseSizeBeforeUpdate = serviceMapRepository.findAll().size();

        // Update the serviceMap using partial update
        ServiceMap partialUpdatedServiceMap = new ServiceMap();
        partialUpdatedServiceMap.setId(serviceMap.getId());

        restServiceMapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceMap.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceMap))
            )
            .andExpect(status().isOk());

        // Validate the ServiceMap in the database
        List<ServiceMap> serviceMapList = serviceMapRepository.findAll();
        assertThat(serviceMapList).hasSize(databaseSizeBeforeUpdate);
        ServiceMap testServiceMap = serviceMapList.get(serviceMapList.size() - 1);
        assertThat(testServiceMap.getTitle()).isEqualTo(DEFAULT_TITLE);
    }

    @Test
    @Transactional
    void fullUpdateServiceMapWithPatch() throws Exception {
        // Initialize the database
        serviceMapRepository.saveAndFlush(serviceMap);

        int databaseSizeBeforeUpdate = serviceMapRepository.findAll().size();

        // Update the serviceMap using partial update
        ServiceMap partialUpdatedServiceMap = new ServiceMap();
        partialUpdatedServiceMap.setId(serviceMap.getId());

        partialUpdatedServiceMap.title(UPDATED_TITLE);

        restServiceMapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceMap.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceMap))
            )
            .andExpect(status().isOk());

        // Validate the ServiceMap in the database
        List<ServiceMap> serviceMapList = serviceMapRepository.findAll();
        assertThat(serviceMapList).hasSize(databaseSizeBeforeUpdate);
        ServiceMap testServiceMap = serviceMapList.get(serviceMapList.size() - 1);
        assertThat(testServiceMap.getTitle()).isEqualTo(UPDATED_TITLE);
    }

    @Test
    @Transactional
    void patchNonExistingServiceMap() throws Exception {
        int databaseSizeBeforeUpdate = serviceMapRepository.findAll().size();
        serviceMap.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceMapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, serviceMap.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceMap))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceMap in the database
        List<ServiceMap> serviceMapList = serviceMapRepository.findAll();
        assertThat(serviceMapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchServiceMap() throws Exception {
        int databaseSizeBeforeUpdate = serviceMapRepository.findAll().size();
        serviceMap.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceMapMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceMap))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceMap in the database
        List<ServiceMap> serviceMapList = serviceMapRepository.findAll();
        assertThat(serviceMapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamServiceMap() throws Exception {
        int databaseSizeBeforeUpdate = serviceMapRepository.findAll().size();
        serviceMap.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceMapMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceMap))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceMap in the database
        List<ServiceMap> serviceMapList = serviceMapRepository.findAll();
        assertThat(serviceMapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteServiceMap() throws Exception {
        // Initialize the database
        serviceMapRepository.saveAndFlush(serviceMap);

        int databaseSizeBeforeDelete = serviceMapRepository.findAll().size();

        // Delete the serviceMap
        restServiceMapMockMvc
            .perform(delete(ENTITY_API_URL_ID, serviceMap.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ServiceMap> serviceMapList = serviceMapRepository.findAll();
        assertThat(serviceMapList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
