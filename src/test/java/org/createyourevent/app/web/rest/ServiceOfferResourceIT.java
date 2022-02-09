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
import org.createyourevent.app.domain.ServiceOffer;
import org.createyourevent.app.repository.ServiceOfferRepository;
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
 * Integration tests for the {@link ServiceOfferResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ServiceOfferResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Float DEFAULT_COST_HOUR = 1F;
    private static final Float UPDATED_COST_HOUR = 2F;

    private static final String ENTITY_API_URL = "/api/service-offers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ServiceOfferRepository serviceOfferRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restServiceOfferMockMvc;

    private ServiceOffer serviceOffer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceOffer createEntity(EntityManager em) {
        ServiceOffer serviceOffer = new ServiceOffer().title(DEFAULT_TITLE).description(DEFAULT_DESCRIPTION).costHour(DEFAULT_COST_HOUR);
        return serviceOffer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceOffer createUpdatedEntity(EntityManager em) {
        ServiceOffer serviceOffer = new ServiceOffer().title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).costHour(UPDATED_COST_HOUR);
        return serviceOffer;
    }

    @BeforeEach
    public void initTest() {
        serviceOffer = createEntity(em);
    }

    @Test
    @Transactional
    void createServiceOffer() throws Exception {
        int databaseSizeBeforeCreate = serviceOfferRepository.findAll().size();
        // Create the ServiceOffer
        restServiceOfferMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceOffer))
            )
            .andExpect(status().isCreated());

        // Validate the ServiceOffer in the database
        List<ServiceOffer> serviceOfferList = serviceOfferRepository.findAll();
        assertThat(serviceOfferList).hasSize(databaseSizeBeforeCreate + 1);
        ServiceOffer testServiceOffer = serviceOfferList.get(serviceOfferList.size() - 1);
        assertThat(testServiceOffer.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testServiceOffer.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testServiceOffer.getCostHour()).isEqualTo(DEFAULT_COST_HOUR);
    }

    @Test
    @Transactional
    void createServiceOfferWithExistingId() throws Exception {
        // Create the ServiceOffer with an existing ID
        serviceOffer.setId(1L);

        int databaseSizeBeforeCreate = serviceOfferRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restServiceOfferMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceOffer))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceOffer in the database
        List<ServiceOffer> serviceOfferList = serviceOfferRepository.findAll();
        assertThat(serviceOfferList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = serviceOfferRepository.findAll().size();
        // set the field null
        serviceOffer.setTitle(null);

        // Create the ServiceOffer, which fails.

        restServiceOfferMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceOffer))
            )
            .andExpect(status().isBadRequest());

        List<ServiceOffer> serviceOfferList = serviceOfferRepository.findAll();
        assertThat(serviceOfferList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCostHourIsRequired() throws Exception {
        int databaseSizeBeforeTest = serviceOfferRepository.findAll().size();
        // set the field null
        serviceOffer.setCostHour(null);

        // Create the ServiceOffer, which fails.

        restServiceOfferMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceOffer))
            )
            .andExpect(status().isBadRequest());

        List<ServiceOffer> serviceOfferList = serviceOfferRepository.findAll();
        assertThat(serviceOfferList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllServiceOffers() throws Exception {
        // Initialize the database
        serviceOfferRepository.saveAndFlush(serviceOffer);

        // Get all the serviceOfferList
        restServiceOfferMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(serviceOffer.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].costHour").value(hasItem(DEFAULT_COST_HOUR.doubleValue())));
    }

    @Test
    @Transactional
    void getServiceOffer() throws Exception {
        // Initialize the database
        serviceOfferRepository.saveAndFlush(serviceOffer);

        // Get the serviceOffer
        restServiceOfferMockMvc
            .perform(get(ENTITY_API_URL_ID, serviceOffer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(serviceOffer.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.costHour").value(DEFAULT_COST_HOUR.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingServiceOffer() throws Exception {
        // Get the serviceOffer
        restServiceOfferMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewServiceOffer() throws Exception {
        // Initialize the database
        serviceOfferRepository.saveAndFlush(serviceOffer);

        int databaseSizeBeforeUpdate = serviceOfferRepository.findAll().size();

        // Update the serviceOffer
        ServiceOffer updatedServiceOffer = serviceOfferRepository.findById(serviceOffer.getId()).get();
        // Disconnect from session so that the updates on updatedServiceOffer are not directly saved in db
        em.detach(updatedServiceOffer);
        updatedServiceOffer.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).costHour(UPDATED_COST_HOUR);

        restServiceOfferMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedServiceOffer.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedServiceOffer))
            )
            .andExpect(status().isOk());

        // Validate the ServiceOffer in the database
        List<ServiceOffer> serviceOfferList = serviceOfferRepository.findAll();
        assertThat(serviceOfferList).hasSize(databaseSizeBeforeUpdate);
        ServiceOffer testServiceOffer = serviceOfferList.get(serviceOfferList.size() - 1);
        assertThat(testServiceOffer.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testServiceOffer.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testServiceOffer.getCostHour()).isEqualTo(UPDATED_COST_HOUR);
    }

    @Test
    @Transactional
    void putNonExistingServiceOffer() throws Exception {
        int databaseSizeBeforeUpdate = serviceOfferRepository.findAll().size();
        serviceOffer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceOfferMockMvc
            .perform(
                put(ENTITY_API_URL_ID, serviceOffer.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceOffer))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceOffer in the database
        List<ServiceOffer> serviceOfferList = serviceOfferRepository.findAll();
        assertThat(serviceOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchServiceOffer() throws Exception {
        int databaseSizeBeforeUpdate = serviceOfferRepository.findAll().size();
        serviceOffer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceOfferMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceOffer))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceOffer in the database
        List<ServiceOffer> serviceOfferList = serviceOfferRepository.findAll();
        assertThat(serviceOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamServiceOffer() throws Exception {
        int databaseSizeBeforeUpdate = serviceOfferRepository.findAll().size();
        serviceOffer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceOfferMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceOffer))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceOffer in the database
        List<ServiceOffer> serviceOfferList = serviceOfferRepository.findAll();
        assertThat(serviceOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateServiceOfferWithPatch() throws Exception {
        // Initialize the database
        serviceOfferRepository.saveAndFlush(serviceOffer);

        int databaseSizeBeforeUpdate = serviceOfferRepository.findAll().size();

        // Update the serviceOffer using partial update
        ServiceOffer partialUpdatedServiceOffer = new ServiceOffer();
        partialUpdatedServiceOffer.setId(serviceOffer.getId());

        restServiceOfferMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceOffer.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceOffer))
            )
            .andExpect(status().isOk());

        // Validate the ServiceOffer in the database
        List<ServiceOffer> serviceOfferList = serviceOfferRepository.findAll();
        assertThat(serviceOfferList).hasSize(databaseSizeBeforeUpdate);
        ServiceOffer testServiceOffer = serviceOfferList.get(serviceOfferList.size() - 1);
        assertThat(testServiceOffer.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testServiceOffer.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testServiceOffer.getCostHour()).isEqualTo(DEFAULT_COST_HOUR);
    }

    @Test
    @Transactional
    void fullUpdateServiceOfferWithPatch() throws Exception {
        // Initialize the database
        serviceOfferRepository.saveAndFlush(serviceOffer);

        int databaseSizeBeforeUpdate = serviceOfferRepository.findAll().size();

        // Update the serviceOffer using partial update
        ServiceOffer partialUpdatedServiceOffer = new ServiceOffer();
        partialUpdatedServiceOffer.setId(serviceOffer.getId());

        partialUpdatedServiceOffer.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).costHour(UPDATED_COST_HOUR);

        restServiceOfferMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedServiceOffer.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedServiceOffer))
            )
            .andExpect(status().isOk());

        // Validate the ServiceOffer in the database
        List<ServiceOffer> serviceOfferList = serviceOfferRepository.findAll();
        assertThat(serviceOfferList).hasSize(databaseSizeBeforeUpdate);
        ServiceOffer testServiceOffer = serviceOfferList.get(serviceOfferList.size() - 1);
        assertThat(testServiceOffer.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testServiceOffer.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testServiceOffer.getCostHour()).isEqualTo(UPDATED_COST_HOUR);
    }

    @Test
    @Transactional
    void patchNonExistingServiceOffer() throws Exception {
        int databaseSizeBeforeUpdate = serviceOfferRepository.findAll().size();
        serviceOffer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceOfferMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, serviceOffer.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceOffer))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceOffer in the database
        List<ServiceOffer> serviceOfferList = serviceOfferRepository.findAll();
        assertThat(serviceOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchServiceOffer() throws Exception {
        int databaseSizeBeforeUpdate = serviceOfferRepository.findAll().size();
        serviceOffer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceOfferMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceOffer))
            )
            .andExpect(status().isBadRequest());

        // Validate the ServiceOffer in the database
        List<ServiceOffer> serviceOfferList = serviceOfferRepository.findAll();
        assertThat(serviceOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamServiceOffer() throws Exception {
        int databaseSizeBeforeUpdate = serviceOfferRepository.findAll().size();
        serviceOffer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceOfferMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceOffer))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ServiceOffer in the database
        List<ServiceOffer> serviceOfferList = serviceOfferRepository.findAll();
        assertThat(serviceOfferList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteServiceOffer() throws Exception {
        // Initialize the database
        serviceOfferRepository.saveAndFlush(serviceOffer);

        int databaseSizeBeforeDelete = serviceOfferRepository.findAll().size();

        // Delete the serviceOffer
        restServiceOfferMockMvc
            .perform(delete(ENTITY_API_URL_ID, serviceOffer.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ServiceOffer> serviceOfferList = serviceOfferRepository.findAll();
        assertThat(serviceOfferList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
