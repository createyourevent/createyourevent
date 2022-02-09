package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductCommentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductComment.class);
        ProductComment productComment1 = new ProductComment();
        productComment1.setId(1L);
        ProductComment productComment2 = new ProductComment();
        productComment2.setId(productComment1.getId());
        assertThat(productComment1).isEqualTo(productComment2);
        productComment2.setId(2L);
        assertThat(productComment1).isNotEqualTo(productComment2);
        productComment1.setId(null);
        assertThat(productComment1).isNotEqualTo(productComment2);
    }
}
