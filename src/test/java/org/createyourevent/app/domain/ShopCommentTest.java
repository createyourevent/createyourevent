package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ShopCommentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShopComment.class);
        ShopComment shopComment1 = new ShopComment();
        shopComment1.setId(1L);
        ShopComment shopComment2 = new ShopComment();
        shopComment2.setId(shopComment1.getId());
        assertThat(shopComment1).isEqualTo(shopComment2);
        shopComment2.setId(2L);
        assertThat(shopComment1).isNotEqualTo(shopComment2);
        shopComment1.setId(null);
        assertThat(shopComment1).isNotEqualTo(shopComment2);
    }
}
