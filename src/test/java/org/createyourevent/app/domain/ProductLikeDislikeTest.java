package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductLikeDislikeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductLikeDislike.class);
        ProductLikeDislike productLikeDislike1 = new ProductLikeDislike();
        productLikeDislike1.setId(1L);
        ProductLikeDislike productLikeDislike2 = new ProductLikeDislike();
        productLikeDislike2.setId(productLikeDislike1.getId());
        assertThat(productLikeDislike1).isEqualTo(productLikeDislike2);
        productLikeDislike2.setId(2L);
        assertThat(productLikeDislike1).isNotEqualTo(productLikeDislike2);
        productLikeDislike1.setId(null);
        assertThat(productLikeDislike1).isNotEqualTo(productLikeDislike2);
    }
}
