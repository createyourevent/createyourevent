package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductStarRatingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductStarRating.class);
        ProductStarRating productStarRating1 = new ProductStarRating();
        productStarRating1.setId(1L);
        ProductStarRating productStarRating2 = new ProductStarRating();
        productStarRating2.setId(productStarRating1.getId());
        assertThat(productStarRating1).isEqualTo(productStarRating2);
        productStarRating2.setId(2L);
        assertThat(productStarRating1).isNotEqualTo(productStarRating2);
        productStarRating1.setId(null);
        assertThat(productStarRating1).isNotEqualTo(productStarRating2);
    }
}
