package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GiftShoppingCartTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GiftShoppingCart.class);
        GiftShoppingCart giftShoppingCart1 = new GiftShoppingCart();
        giftShoppingCart1.setId(1L);
        GiftShoppingCart giftShoppingCart2 = new GiftShoppingCart();
        giftShoppingCart2.setId(giftShoppingCart1.getId());
        assertThat(giftShoppingCart1).isEqualTo(giftShoppingCart2);
        giftShoppingCart2.setId(2L);
        assertThat(giftShoppingCart1).isNotEqualTo(giftShoppingCart2);
        giftShoppingCart1.setId(null);
        assertThat(giftShoppingCart1).isNotEqualTo(giftShoppingCart2);
    }
}
