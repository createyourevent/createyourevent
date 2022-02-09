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
import org.createyourevent.app.domain.AdminFeesPrice;
import org.createyourevent.app.repository.AdminFeesPriceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AdminFeesPriceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AdminFeesPriceResourceIT {

    private static final Float DEFAULT_FEES_ORGANISATOR = 1F;
    private static final Float UPDATED_FEES_ORGANISATOR = 2F;

    private static final Float DEFAULT_FEES_SUPPLIER = 1F;
    private static final Float UPDATED_FEES_SUPPLIER = 2F;

    private static final Float DEFAULT_FEES_SERVICE = 1F;
    private static final Float UPDATED_FEES_SERVICE = 2F;

    private static final Float DEFAULT_FEES_ORGANIZATIONS = 1F;
    private static final Float UPDATED_FEES_ORGANIZATIONS = 2F;

    private static final String ENTITY_API_URL = "/api/admin-fees-prices";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AdminFeesPriceRepository adminFeesPriceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAdminFeesPriceMockMvc;

    private AdminFeesPrice adminFeesPrice;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdminFeesPrice createEntity(EntityManager em) {
        AdminFeesPrice adminFeesPrice = new AdminFeesPrice()
            .feesOrganisator(DEFAULT_FEES_ORGANISATOR)
            .feesSupplier(DEFAULT_FEES_SUPPLIER)
            .feesService(DEFAULT_FEES_SERVICE)
            .feesOrganizations(DEFAULT_FEES_ORGANIZATIONS);
        return adminFeesPrice;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdminFeesPrice createUpdatedEntity(EntityManager em) {
        AdminFeesPrice adminFeesPrice = new AdminFeesPrice()
            .feesOrganisator(UPDATED_FEES_ORGANISATOR)
            .feesSupplier(UPDATED_FEES_SUPPLIER)
            .feesService(UPDATED_FEES_SERVICE)
            .feesOrganizations(UPDATED_FEES_ORGANIZATIONS);
        return adminFeesPrice;
    }

    @BeforeEach
    public void initTest() {
        adminFeesPrice = createEntity(em);
    }

    @Test
    @Transactional
    void createAdminFeesPrice() throws Exception {
        int databaseSizeBeforeCreate = adminFeesPriceRepository.findAll().size();
        // Create the AdminFeesPrice
        restAdminFeesPriceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adminFeesPrice))
            )
            .andExpect(status().isCreated());

        // Validate the AdminFeesPrice in the database
        List<AdminFeesPrice> adminFeesPriceList = adminFeesPriceRepository.findAll();
        assertThat(adminFeesPriceList).hasSize(databaseSizeBeforeCreate + 1);
        AdminFeesPrice testAdminFeesPrice = adminFeesPriceList.get(adminFeesPriceList.size() - 1);
        assertThat(testAdminFeesPrice.getFeesOrganisator()).isEqualTo(DEFAULT_FEES_ORGANISATOR);
        assertThat(testAdminFeesPrice.getFeesSupplier()).isEqualTo(DEFAULT_FEES_SUPPLIER);
        assertThat(testAdminFeesPrice.getFeesService()).isEqualTo(DEFAULT_FEES_SERVICE);
        assertThat(testAdminFeesPrice.getFeesOrganizations()).isEqualTo(DEFAULT_FEES_ORGANIZATIONS);
    }

    @Test
    @Transactional
    void createAdminFeesPriceWithExistingId() throws Exception {
        // Create the AdminFeesPrice with an existing ID
        adminFeesPrice.setId(1L);

        int databaseSizeBeforeCreate = adminFeesPriceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdminFeesPriceMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adminFeesPrice))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdminFeesPrice in the database
        List<AdminFeesPrice> adminFeesPriceList = adminFeesPriceRepository.findAll();
        assertThat(adminFeesPriceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAdminFeesPrices() throws Exception {
        // Initialize the database
        adminFeesPriceRepository.saveAndFlush(adminFeesPrice);

        // Get all the adminFeesPriceList
        restAdminFeesPriceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(adminFeesPrice.getId().intValue())))
            .andExpect(jsonPath("$.[*].feesOrganisator").value(hasItem(DEFAULT_FEES_ORGANISATOR.doubleValue())))
            .andExpect(jsonPath("$.[*].feesSupplier").value(hasItem(DEFAULT_FEES_SUPPLIER.doubleValue())))
            .andExpect(jsonPath("$.[*].feesService").value(hasItem(DEFAULT_FEES_SERVICE.doubleValue())))
            .andExpect(jsonPath("$.[*].feesOrganizations").value(hasItem(DEFAULT_FEES_ORGANIZATIONS.doubleValue())));
    }

    @Test
    @Transactional
    void getAdminFeesPrice() throws Exception {
        // Initialize the database
        adminFeesPriceRepository.saveAndFlush(adminFeesPrice);

        // Get the adminFeesPrice
        restAdminFeesPriceMockMvc
            .perform(get(ENTITY_API_URL_ID, adminFeesPrice.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(adminFeesPrice.getId().intValue()))
            .andExpect(jsonPath("$.feesOrganisator").value(DEFAULT_FEES_ORGANISATOR.doubleValue()))
            .andExpect(jsonPath("$.feesSupplier").value(DEFAULT_FEES_SUPPLIER.doubleValue()))
            .andExpect(jsonPath("$.feesService").value(DEFAULT_FEES_SERVICE.doubleValue()))
            .andExpect(jsonPath("$.feesOrganizations").value(DEFAULT_FEES_ORGANIZATIONS.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingAdminFeesPrice() throws Exception {
        // Get the adminFeesPrice
        restAdminFeesPriceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAdminFeesPrice() throws Exception {
        // Initialize the database
        adminFeesPriceRepository.saveAndFlush(adminFeesPrice);

        int databaseSizeBeforeUpdate = adminFeesPriceRepository.findAll().size();

        // Update the adminFeesPrice
        AdminFeesPrice updatedAdminFeesPrice = adminFeesPriceRepository.findById(adminFeesPrice.getId()).get();
        // Disconnect from session so that the updates on updatedAdminFeesPrice are not directly saved in db
        em.detach(updatedAdminFeesPrice);
        updatedAdminFeesPrice
            .feesOrganisator(UPDATED_FEES_ORGANISATOR)
            .feesSupplier(UPDATED_FEES_SUPPLIER)
            .feesService(UPDATED_FEES_SERVICE)
            .feesOrganizations(UPDATED_FEES_ORGANIZATIONS);

        restAdminFeesPriceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAdminFeesPrice.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAdminFeesPrice))
            )
            .andExpect(status().isOk());

        // Validate the AdminFeesPrice in the database
        List<AdminFeesPrice> adminFeesPriceList = adminFeesPriceRepository.findAll();
        assertThat(adminFeesPriceList).hasSize(databaseSizeBeforeUpdate);
        AdminFeesPrice testAdminFeesPrice = adminFeesPriceList.get(adminFeesPriceList.size() - 1);
        assertThat(testAdminFeesPrice.getFeesOrganisator()).isEqualTo(UPDATED_FEES_ORGANISATOR);
        assertThat(testAdminFeesPrice.getFeesSupplier()).isEqualTo(UPDATED_FEES_SUPPLIER);
        assertThat(testAdminFeesPrice.getFeesService()).isEqualTo(UPDATED_FEES_SERVICE);
        assertThat(testAdminFeesPrice.getFeesOrganizations()).isEqualTo(UPDATED_FEES_ORGANIZATIONS);
    }

    @Test
    @Transactional
    void putNonExistingAdminFeesPrice() throws Exception {
        int databaseSizeBeforeUpdate = adminFeesPriceRepository.findAll().size();
        adminFeesPrice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdminFeesPriceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, adminFeesPrice.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adminFeesPrice))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdminFeesPrice in the database
        List<AdminFeesPrice> adminFeesPriceList = adminFeesPriceRepository.findAll();
        assertThat(adminFeesPriceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAdminFeesPrice() throws Exception {
        int databaseSizeBeforeUpdate = adminFeesPriceRepository.findAll().size();
        adminFeesPrice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdminFeesPriceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adminFeesPrice))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdminFeesPrice in the database
        List<AdminFeesPrice> adminFeesPriceList = adminFeesPriceRepository.findAll();
        assertThat(adminFeesPriceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAdminFeesPrice() throws Exception {
        int databaseSizeBeforeUpdate = adminFeesPriceRepository.findAll().size();
        adminFeesPrice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdminFeesPriceMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adminFeesPrice))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdminFeesPrice in the database
        List<AdminFeesPrice> adminFeesPriceList = adminFeesPriceRepository.findAll();
        assertThat(adminFeesPriceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAdminFeesPriceWithPatch() throws Exception {
        // Initialize the database
        adminFeesPriceRepository.saveAndFlush(adminFeesPrice);

        int databaseSizeBeforeUpdate = adminFeesPriceRepository.findAll().size();

        // Update the adminFeesPrice using partial update
        AdminFeesPrice partialUpdatedAdminFeesPrice = new AdminFeesPrice();
        partialUpdatedAdminFeesPrice.setId(adminFeesPrice.getId());

        partialUpdatedAdminFeesPrice
            .feesOrganisator(UPDATED_FEES_ORGANISATOR)
            .feesSupplier(UPDATED_FEES_SUPPLIER)
            .feesService(UPDATED_FEES_SERVICE)
            .feesOrganizations(UPDATED_FEES_ORGANIZATIONS);

        restAdminFeesPriceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdminFeesPrice.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdminFeesPrice))
            )
            .andExpect(status().isOk());

        // Validate the AdminFeesPrice in the database
        List<AdminFeesPrice> adminFeesPriceList = adminFeesPriceRepository.findAll();
        assertThat(adminFeesPriceList).hasSize(databaseSizeBeforeUpdate);
        AdminFeesPrice testAdminFeesPrice = adminFeesPriceList.get(adminFeesPriceList.size() - 1);
        assertThat(testAdminFeesPrice.getFeesOrganisator()).isEqualTo(UPDATED_FEES_ORGANISATOR);
        assertThat(testAdminFeesPrice.getFeesSupplier()).isEqualTo(UPDATED_FEES_SUPPLIER);
        assertThat(testAdminFeesPrice.getFeesService()).isEqualTo(UPDATED_FEES_SERVICE);
        assertThat(testAdminFeesPrice.getFeesOrganizations()).isEqualTo(UPDATED_FEES_ORGANIZATIONS);
    }

    @Test
    @Transactional
    void fullUpdateAdminFeesPriceWithPatch() throws Exception {
        // Initialize the database
        adminFeesPriceRepository.saveAndFlush(adminFeesPrice);

        int databaseSizeBeforeUpdate = adminFeesPriceRepository.findAll().size();

        // Update the adminFeesPrice using partial update
        AdminFeesPrice partialUpdatedAdminFeesPrice = new AdminFeesPrice();
        partialUpdatedAdminFeesPrice.setId(adminFeesPrice.getId());

        partialUpdatedAdminFeesPrice
            .feesOrganisator(UPDATED_FEES_ORGANISATOR)
            .feesSupplier(UPDATED_FEES_SUPPLIER)
            .feesService(UPDATED_FEES_SERVICE)
            .feesOrganizations(UPDATED_FEES_ORGANIZATIONS);

        restAdminFeesPriceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdminFeesPrice.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdminFeesPrice))
            )
            .andExpect(status().isOk());

        // Validate the AdminFeesPrice in the database
        List<AdminFeesPrice> adminFeesPriceList = adminFeesPriceRepository.findAll();
        assertThat(adminFeesPriceList).hasSize(databaseSizeBeforeUpdate);
        AdminFeesPrice testAdminFeesPrice = adminFeesPriceList.get(adminFeesPriceList.size() - 1);
        assertThat(testAdminFeesPrice.getFeesOrganisator()).isEqualTo(UPDATED_FEES_ORGANISATOR);
        assertThat(testAdminFeesPrice.getFeesSupplier()).isEqualTo(UPDATED_FEES_SUPPLIER);
        assertThat(testAdminFeesPrice.getFeesService()).isEqualTo(UPDATED_FEES_SERVICE);
        assertThat(testAdminFeesPrice.getFeesOrganizations()).isEqualTo(UPDATED_FEES_ORGANIZATIONS);
    }

    @Test
    @Transactional
    void patchNonExistingAdminFeesPrice() throws Exception {
        int databaseSizeBeforeUpdate = adminFeesPriceRepository.findAll().size();
        adminFeesPrice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdminFeesPriceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, adminFeesPrice.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(adminFeesPrice))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdminFeesPrice in the database
        List<AdminFeesPrice> adminFeesPriceList = adminFeesPriceRepository.findAll();
        assertThat(adminFeesPriceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAdminFeesPrice() throws Exception {
        int databaseSizeBeforeUpdate = adminFeesPriceRepository.findAll().size();
        adminFeesPrice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdminFeesPriceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(adminFeesPrice))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdminFeesPrice in the database
        List<AdminFeesPrice> adminFeesPriceList = adminFeesPriceRepository.findAll();
        assertThat(adminFeesPriceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAdminFeesPrice() throws Exception {
        int databaseSizeBeforeUpdate = adminFeesPriceRepository.findAll().size();
        adminFeesPrice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdminFeesPriceMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(adminFeesPrice))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdminFeesPrice in the database
        List<AdminFeesPrice> adminFeesPriceList = adminFeesPriceRepository.findAll();
        assertThat(adminFeesPriceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAdminFeesPrice() throws Exception {
        // Initialize the database
        adminFeesPriceRepository.saveAndFlush(adminFeesPrice);

        int databaseSizeBeforeDelete = adminFeesPriceRepository.findAll().size();

        // Delete the adminFeesPrice
        restAdminFeesPriceMockMvc
            .perform(delete(ENTITY_API_URL_ID, adminFeesPrice.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AdminFeesPrice> adminFeesPriceList = adminFeesPriceRepository.findAll();
        assertThat(adminFeesPriceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
