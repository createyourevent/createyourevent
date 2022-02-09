package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ShopStarRatingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShopStarRating.class);
        ShopStarRating shopStarRating1 = new ShopStarRating();
        shopStarRating1.setId(1L);
        ShopStarRating shopStarRating2 = new ShopStarRating();
        shopStarRating2.setId(shopStarRating1.getId());
        assertThat(shopStarRating1).isEqualTo(shopStarRating2);
        shopStarRating2.setId(2L);
        assertThat(shopStarRating1).isNotEqualTo(shopStarRating2);
        shopStarRating1.setId(null);
        assertThat(shopStarRating1).isNotEqualTo(shopStarRating2);
    }
}
