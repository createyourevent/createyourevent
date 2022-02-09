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
import org.createyourevent.app.domain.DeliveryType;
import org.createyourevent.app.domain.enumeration.DeliveryTypes;
import org.createyourevent.app.repository.DeliveryTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DeliveryTypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DeliveryTypeResourceIT {

    private static final DeliveryTypes DEFAULT_DELIVERY_TYPE = DeliveryTypes.PICKUP;
    private static final DeliveryTypes UPDATED_DELIVERY_TYPE = DeliveryTypes.DELIVERY;

    private static final Float DEFAULT_MINIMUM_ORDER_QUANTITY = 1F;
    private static final Float UPDATED_MINIMUM_ORDER_QUANTITY = 2F;

    private static final Float DEFAULT_PRICE = 1F;
    private static final Float UPDATED_PRICE = 2F;

    private static final Float DEFAULT_PRICE_PER_KILOMETRE = 1F;
    private static final Float UPDATED_PRICE_PER_KILOMETRE = 2F;

    private static final String ENTITY_API_URL = "/api/delivery-types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DeliveryTypeRepository deliveryTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDeliveryTypeMockMvc;

    private DeliveryType deliveryType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DeliveryType createEntity(EntityManager em) {
        DeliveryType deliveryType = new DeliveryType()
            .deliveryType(DEFAULT_DELIVERY_TYPE)
            .minimumOrderQuantity(DEFAULT_MINIMUM_ORDER_QUANTITY)
            .price(DEFAULT_PRICE)
            .pricePerKilometre(DEFAULT_PRICE_PER_KILOMETRE);
        return deliveryType;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DeliveryType createUpdatedEntity(EntityManager em) {
        DeliveryType deliveryType = new DeliveryType()
            .deliveryType(UPDATED_DELIVERY_TYPE)
            .minimumOrderQuantity(UPDATED_MINIMUM_ORDER_QUANTITY)
            .price(UPDATED_PRICE)
            .pricePerKilometre(UPDATED_PRICE_PER_KILOMETRE);
        return deliveryType;
    }

    @BeforeEach
    public void initTest() {
        deliveryType = createEntity(em);
    }

    @Test
    @Transactional
    void createDeliveryType() throws Exception {
        int databaseSizeBeforeCreate = deliveryTypeRepository.findAll().size();
        // Create the DeliveryType
        restDeliveryTypeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deliveryType))
            )
            .andExpect(status().isCreated());

        // Validate the DeliveryType in the database
        List<DeliveryType> deliveryTypeList = deliveryTypeRepository.findAll();
        assertThat(deliveryTypeList).hasSize(databaseSizeBeforeCreate + 1);
        DeliveryType testDeliveryType = deliveryTypeList.get(deliveryTypeList.size() - 1);
        assertThat(testDeliveryType.getDeliveryType()).isEqualTo(DEFAULT_DELIVERY_TYPE);
        assertThat(testDeliveryType.getMinimumOrderQuantity()).isEqualTo(DEFAULT_MINIMUM_ORDER_QUANTITY);
        assertThat(testDeliveryType.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testDeliveryType.getPricePerKilometre()).isEqualTo(DEFAULT_PRICE_PER_KILOMETRE);
    }

    @Test
    @Transactional
    void createDeliveryTypeWithExistingId() throws Exception {
        // Create the DeliveryType with an existing ID
        deliveryType.setId(1L);

        int databaseSizeBeforeCreate = deliveryTypeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDeliveryTypeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deliveryType))
            )
            .andExpect(status().isBadRequest());

        // Validate the DeliveryType in the database
        List<DeliveryType> deliveryTypeList = deliveryTypeRepository.findAll();
        assertThat(deliveryTypeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDeliveryTypes() throws Exception {
        // Initialize the database
        deliveryTypeRepository.saveAndFlush(deliveryType);

        // Get all the deliveryTypeList
        restDeliveryTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(deliveryType.getId().intValue())))
            .andExpect(jsonPath("$.[*].deliveryType").value(hasItem(DEFAULT_DELIVERY_TYPE.toString())))
            .andExpect(jsonPath("$.[*].minimumOrderQuantity").value(hasItem(DEFAULT_MINIMUM_ORDER_QUANTITY.doubleValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].pricePerKilometre").value(hasItem(DEFAULT_PRICE_PER_KILOMETRE.doubleValue())));
    }

    @Test
    @Transactional
    void getDeliveryType() throws Exception {
        // Initialize the database
        deliveryTypeRepository.saveAndFlush(deliveryType);

        // Get the deliveryType
        restDeliveryTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, deliveryType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(deliveryType.getId().intValue()))
            .andExpect(jsonPath("$.deliveryType").value(DEFAULT_DELIVERY_TYPE.toString()))
            .andExpect(jsonPath("$.minimumOrderQuantity").value(DEFAULT_MINIMUM_ORDER_QUANTITY.doubleValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.pricePerKilometre").value(DEFAULT_PRICE_PER_KILOMETRE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingDeliveryType() throws Exception {
        // Get the deliveryType
        restDeliveryTypeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDeliveryType() throws Exception {
        // Initialize the database
        deliveryTypeRepository.saveAndFlush(deliveryType);

        int databaseSizeBeforeUpdate = deliveryTypeRepository.findAll().size();

        // Update the deliveryType
        DeliveryType updatedDeliveryType = deliveryTypeRepository.findById(deliveryType.getId()).get();
        // Disconnect from session so that the updates on updatedDeliveryType are not directly saved in db
        em.detach(updatedDeliveryType);
        updatedDeliveryType
            .deliveryType(UPDATED_DELIVERY_TYPE)
            .minimumOrderQuantity(UPDATED_MINIMUM_ORDER_QUANTITY)
            .price(UPDATED_PRICE)
            .pricePerKilometre(UPDATED_PRICE_PER_KILOMETRE);

        restDeliveryTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDeliveryType.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDeliveryType))
            )
            .andExpect(status().isOk());

        // Validate the DeliveryType in the database
        List<DeliveryType> deliveryTypeList = deliveryTypeRepository.findAll();
        assertThat(deliveryTypeList).hasSize(databaseSizeBeforeUpdate);
        DeliveryType testDeliveryType = deliveryTypeList.get(deliveryTypeList.size() - 1);
        assertThat(testDeliveryType.getDeliveryType()).isEqualTo(UPDATED_DELIVERY_TYPE);
        assertThat(testDeliveryType.getMinimumOrderQuantity()).isEqualTo(UPDATED_MINIMUM_ORDER_QUANTITY);
        assertThat(testDeliveryType.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testDeliveryType.getPricePerKilometre()).isEqualTo(UPDATED_PRICE_PER_KILOMETRE);
    }

    @Test
    @Transactional
    void putNonExistingDeliveryType() throws Exception {
        int databaseSizeBeforeUpdate = deliveryTypeRepository.findAll().size();
        deliveryType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeliveryTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, deliveryType.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deliveryType))
            )
            .andExpect(status().isBadRequest());

        // Validate the DeliveryType in the database
        List<DeliveryType> deliveryTypeList = deliveryTypeRepository.findAll();
        assertThat(deliveryTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDeliveryType() throws Exception {
        int databaseSizeBeforeUpdate = deliveryTypeRepository.findAll().size();
        deliveryType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeliveryTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deliveryType))
            )
            .andExpect(status().isBadRequest());

        // Validate the DeliveryType in the database
        List<DeliveryType> deliveryTypeList = deliveryTypeRepository.findAll();
        assertThat(deliveryTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDeliveryType() throws Exception {
        int databaseSizeBeforeUpdate = deliveryTypeRepository.findAll().size();
        deliveryType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeliveryTypeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(deliveryType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DeliveryType in the database
        List<DeliveryType> deliveryTypeList = deliveryTypeRepository.findAll();
        assertThat(deliveryTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDeliveryTypeWithPatch() throws Exception {
        // Initialize the database
        deliveryTypeRepository.saveAndFlush(deliveryType);

        int databaseSizeBeforeUpdate = deliveryTypeRepository.findAll().size();

        // Update the deliveryType using partial update
        DeliveryType partialUpdatedDeliveryType = new DeliveryType();
        partialUpdatedDeliveryType.setId(deliveryType.getId());

        partialUpdatedDeliveryType
            .deliveryType(UPDATED_DELIVERY_TYPE)
            .minimumOrderQuantity(UPDATED_MINIMUM_ORDER_QUANTITY)
            .pricePerKilometre(UPDATED_PRICE_PER_KILOMETRE);

        restDeliveryTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDeliveryType.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDeliveryType))
            )
            .andExpect(status().isOk());

        // Validate the DeliveryType in the database
        List<DeliveryType> deliveryTypeList = deliveryTypeRepository.findAll();
        assertThat(deliveryTypeList).hasSize(databaseSizeBeforeUpdate);
        DeliveryType testDeliveryType = deliveryTypeList.get(deliveryTypeList.size() - 1);
        assertThat(testDeliveryType.getDeliveryType()).isEqualTo(UPDATED_DELIVERY_TYPE);
        assertThat(testDeliveryType.getMinimumOrderQuantity()).isEqualTo(UPDATED_MINIMUM_ORDER_QUANTITY);
        assertThat(testDeliveryType.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testDeliveryType.getPricePerKilometre()).isEqualTo(UPDATED_PRICE_PER_KILOMETRE);
    }

    @Test
    @Transactional
    void fullUpdateDeliveryTypeWithPatch() throws Exception {
        // Initialize the database
        deliveryTypeRepository.saveAndFlush(deliveryType);

        int databaseSizeBeforeUpdate = deliveryTypeRepository.findAll().size();

        // Update the deliveryType using partial update
        DeliveryType partialUpdatedDeliveryType = new DeliveryType();
        partialUpdatedDeliveryType.setId(deliveryType.getId());

        partialUpdatedDeliveryType
            .deliveryType(UPDATED_DELIVERY_TYPE)
            .minimumOrderQuantity(UPDATED_MINIMUM_ORDER_QUANTITY)
            .price(UPDATED_PRICE)
            .pricePerKilometre(UPDATED_PRICE_PER_KILOMETRE);

        restDeliveryTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDeliveryType.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDeliveryType))
            )
            .andExpect(status().isOk());

        // Validate the DeliveryType in the database
        List<DeliveryType> deliveryTypeList = deliveryTypeRepository.findAll();
        assertThat(deliveryTypeList).hasSize(databaseSizeBeforeUpdate);
        DeliveryType testDeliveryType = deliveryTypeList.get(deliveryTypeList.size() - 1);
        assertThat(testDeliveryType.getDeliveryType()).isEqualTo(UPDATED_DELIVERY_TYPE);
        assertThat(testDeliveryType.getMinimumOrderQuantity()).isEqualTo(UPDATED_MINIMUM_ORDER_QUANTITY);
        assertThat(testDeliveryType.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testDeliveryType.getPricePerKilometre()).isEqualTo(UPDATED_PRICE_PER_KILOMETRE);
    }

    @Test
    @Transactional
    void patchNonExistingDeliveryType() throws Exception {
        int databaseSizeBeforeUpdate = deliveryTypeRepository.findAll().size();
        deliveryType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDeliveryTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, deliveryType.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(deliveryType))
            )
            .andExpect(status().isBadRequest());

        // Validate the DeliveryType in the database
        List<DeliveryType> deliveryTypeList = deliveryTypeRepository.findAll();
        assertThat(deliveryTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDeliveryType() throws Exception {
        int databaseSizeBeforeUpdate = deliveryTypeRepository.findAll().size();
        deliveryType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeliveryTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(deliveryType))
            )
            .andExpect(status().isBadRequest());

        // Validate the DeliveryType in the database
        List<DeliveryType> deliveryTypeList = deliveryTypeRepository.findAll();
        assertThat(deliveryTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDeliveryType() throws Exception {
        int databaseSizeBeforeUpdate = deliveryTypeRepository.findAll().size();
        deliveryType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDeliveryTypeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(deliveryType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DeliveryType in the database
        List<DeliveryType> deliveryTypeList = deliveryTypeRepository.findAll();
        assertThat(deliveryTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDeliveryType() throws Exception {
        // Initialize the database
        deliveryTypeRepository.saveAndFlush(deliveryType);

        int databaseSizeBeforeDelete = deliveryTypeRepository.findAll().size();

        // Delete the deliveryType
        restDeliveryTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, deliveryType.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DeliveryType> deliveryTypeList = deliveryTypeRepository.findAll();
        assertThat(deliveryTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
