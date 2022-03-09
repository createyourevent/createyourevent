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
import org.createyourevent.app.domain.Coupon;
import org.createyourevent.app.repository.CouponRepository;
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
 * Integration tests for the {@link CouponResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CouponResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final Float DEFAULT_VALUE = 1F;
    private static final Float UPDATED_VALUE = 2F;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_COUPON_NR = "AAAAAAAAAA";
    private static final String UPDATED_COUPON_NR = "BBBBBBBBBB";

    private static final Boolean DEFAULT_USED = false;
    private static final Boolean UPDATED_USED = true;

    private static final String ENTITY_API_URL = "/api/coupons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCouponMockMvc;

    private Coupon coupon;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Coupon createEntity(EntityManager em) {
        Coupon coupon = new Coupon()
            .title(DEFAULT_TITLE)
            .value(DEFAULT_VALUE)
            .description(DEFAULT_DESCRIPTION)
            .couponNr(DEFAULT_COUPON_NR)
            .used(DEFAULT_USED);
        return coupon;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Coupon createUpdatedEntity(EntityManager em) {
        Coupon coupon = new Coupon()
            .title(UPDATED_TITLE)
            .value(UPDATED_VALUE)
            .description(UPDATED_DESCRIPTION)
            .couponNr(UPDATED_COUPON_NR)
            .used(UPDATED_USED);
        return coupon;
    }

    @BeforeEach
    public void initTest() {
        coupon = createEntity(em);
    }

    @Test
    @Transactional
    void createCoupon() throws Exception {
        int databaseSizeBeforeCreate = couponRepository.findAll().size();
        // Create the Coupon
        restCouponMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coupon))
            )
            .andExpect(status().isCreated());

        // Validate the Coupon in the database
        List<Coupon> couponList = couponRepository.findAll();
        assertThat(couponList).hasSize(databaseSizeBeforeCreate + 1);
        Coupon testCoupon = couponList.get(couponList.size() - 1);
        assertThat(testCoupon.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testCoupon.getValue()).isEqualTo(DEFAULT_VALUE);
        assertThat(testCoupon.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCoupon.getCouponNr()).isEqualTo(DEFAULT_COUPON_NR);
        assertThat(testCoupon.getUsed()).isEqualTo(DEFAULT_USED);
    }

    @Test
    @Transactional
    void createCouponWithExistingId() throws Exception {
        // Create the Coupon with an existing ID
        coupon.setId(1L);

        int databaseSizeBeforeCreate = couponRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCouponMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coupon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coupon in the database
        List<Coupon> couponList = couponRepository.findAll();
        assertThat(couponList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCoupons() throws Exception {
        // Initialize the database
        couponRepository.saveAndFlush(coupon);

        // Get all the couponList
        restCouponMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(coupon.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.doubleValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].couponNr").value(hasItem(DEFAULT_COUPON_NR)))
            .andExpect(jsonPath("$.[*].used").value(hasItem(DEFAULT_USED.booleanValue())));
    }

    @Test
    @Transactional
    void getCoupon() throws Exception {
        // Initialize the database
        couponRepository.saveAndFlush(coupon);

        // Get the coupon
        restCouponMockMvc
            .perform(get(ENTITY_API_URL_ID, coupon.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(coupon.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.doubleValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.couponNr").value(DEFAULT_COUPON_NR))
            .andExpect(jsonPath("$.used").value(DEFAULT_USED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingCoupon() throws Exception {
        // Get the coupon
        restCouponMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCoupon() throws Exception {
        // Initialize the database
        couponRepository.saveAndFlush(coupon);

        int databaseSizeBeforeUpdate = couponRepository.findAll().size();

        // Update the coupon
        Coupon updatedCoupon = couponRepository.findById(coupon.getId()).get();
        // Disconnect from session so that the updates on updatedCoupon are not directly saved in db
        em.detach(updatedCoupon);
        updatedCoupon
            .title(UPDATED_TITLE)
            .value(UPDATED_VALUE)
            .description(UPDATED_DESCRIPTION)
            .couponNr(UPDATED_COUPON_NR)
            .used(UPDATED_USED);

        restCouponMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCoupon.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCoupon))
            )
            .andExpect(status().isOk());

        // Validate the Coupon in the database
        List<Coupon> couponList = couponRepository.findAll();
        assertThat(couponList).hasSize(databaseSizeBeforeUpdate);
        Coupon testCoupon = couponList.get(couponList.size() - 1);
        assertThat(testCoupon.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testCoupon.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testCoupon.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCoupon.getCouponNr()).isEqualTo(UPDATED_COUPON_NR);
        assertThat(testCoupon.getUsed()).isEqualTo(UPDATED_USED);
    }

    @Test
    @Transactional
    void putNonExistingCoupon() throws Exception {
        int databaseSizeBeforeUpdate = couponRepository.findAll().size();
        coupon.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCouponMockMvc
            .perform(
                put(ENTITY_API_URL_ID, coupon.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(coupon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coupon in the database
        List<Coupon> couponList = couponRepository.findAll();
        assertThat(couponList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCoupon() throws Exception {
        int databaseSizeBeforeUpdate = couponRepository.findAll().size();
        coupon.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCouponMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(coupon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coupon in the database
        List<Coupon> couponList = couponRepository.findAll();
        assertThat(couponList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCoupon() throws Exception {
        int databaseSizeBeforeUpdate = couponRepository.findAll().size();
        coupon.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCouponMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coupon))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Coupon in the database
        List<Coupon> couponList = couponRepository.findAll();
        assertThat(couponList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCouponWithPatch() throws Exception {
        // Initialize the database
        couponRepository.saveAndFlush(coupon);

        int databaseSizeBeforeUpdate = couponRepository.findAll().size();

        // Update the coupon using partial update
        Coupon partialUpdatedCoupon = new Coupon();
        partialUpdatedCoupon.setId(coupon.getId());

        partialUpdatedCoupon.title(UPDATED_TITLE).value(UPDATED_VALUE).couponNr(UPDATED_COUPON_NR).used(UPDATED_USED);

        restCouponMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCoupon.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCoupon))
            )
            .andExpect(status().isOk());

        // Validate the Coupon in the database
        List<Coupon> couponList = couponRepository.findAll();
        assertThat(couponList).hasSize(databaseSizeBeforeUpdate);
        Coupon testCoupon = couponList.get(couponList.size() - 1);
        assertThat(testCoupon.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testCoupon.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testCoupon.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCoupon.getCouponNr()).isEqualTo(UPDATED_COUPON_NR);
        assertThat(testCoupon.getUsed()).isEqualTo(UPDATED_USED);
    }

    @Test
    @Transactional
    void fullUpdateCouponWithPatch() throws Exception {
        // Initialize the database
        couponRepository.saveAndFlush(coupon);

        int databaseSizeBeforeUpdate = couponRepository.findAll().size();

        // Update the coupon using partial update
        Coupon partialUpdatedCoupon = new Coupon();
        partialUpdatedCoupon.setId(coupon.getId());

        partialUpdatedCoupon
            .title(UPDATED_TITLE)
            .value(UPDATED_VALUE)
            .description(UPDATED_DESCRIPTION)
            .couponNr(UPDATED_COUPON_NR)
            .used(UPDATED_USED);

        restCouponMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCoupon.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCoupon))
            )
            .andExpect(status().isOk());

        // Validate the Coupon in the database
        List<Coupon> couponList = couponRepository.findAll();
        assertThat(couponList).hasSize(databaseSizeBeforeUpdate);
        Coupon testCoupon = couponList.get(couponList.size() - 1);
        assertThat(testCoupon.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testCoupon.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testCoupon.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCoupon.getCouponNr()).isEqualTo(UPDATED_COUPON_NR);
        assertThat(testCoupon.getUsed()).isEqualTo(UPDATED_USED);
    }

    @Test
    @Transactional
    void patchNonExistingCoupon() throws Exception {
        int databaseSizeBeforeUpdate = couponRepository.findAll().size();
        coupon.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCouponMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, coupon.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(coupon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coupon in the database
        List<Coupon> couponList = couponRepository.findAll();
        assertThat(couponList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCoupon() throws Exception {
        int databaseSizeBeforeUpdate = couponRepository.findAll().size();
        coupon.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCouponMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(coupon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coupon in the database
        List<Coupon> couponList = couponRepository.findAll();
        assertThat(couponList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCoupon() throws Exception {
        int databaseSizeBeforeUpdate = couponRepository.findAll().size();
        coupon.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCouponMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(coupon))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Coupon in the database
        List<Coupon> couponList = couponRepository.findAll();
        assertThat(couponList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCoupon() throws Exception {
        // Initialize the database
        couponRepository.saveAndFlush(coupon);

        int databaseSizeBeforeDelete = couponRepository.findAll().size();

        // Delete the coupon
        restCouponMockMvc
            .perform(delete(ENTITY_API_URL_ID, coupon.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Coupon> couponList = couponRepository.findAll();
        assertThat(couponList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
