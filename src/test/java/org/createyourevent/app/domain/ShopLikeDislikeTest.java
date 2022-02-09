package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ShopLikeDislikeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShopLikeDislike.class);
        ShopLikeDislike shopLikeDislike1 = new ShopLikeDislike();
        shopLikeDislike1.setId(1L);
        ShopLikeDislike shopLikeDislike2 = new ShopLikeDislike();
        shopLikeDislike2.setId(shopLikeDislike1.getId());
        assertThat(shopLikeDislike1).isEqualTo(shopLikeDislike2);
        shopLikeDislike2.setId(2L);
        assertThat(shopLikeDislike1).isNotEqualTo(shopLikeDislike2);
        shopLikeDislike1.setId(null);
        assertThat(shopLikeDislike1).isNotEqualTo(shopLikeDislike2);
    }
}
