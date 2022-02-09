package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ServiceCommentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ServiceComment.class);
        ServiceComment serviceComment1 = new ServiceComment();
        serviceComment1.setId(1L);
        ServiceComment serviceComment2 = new ServiceComment();
        serviceComment2.setId(serviceComment1.getId());
        assertThat(serviceComment1).isEqualTo(serviceComment2);
        serviceComment2.setId(2L);
        assertThat(serviceComment1).isNotEqualTo(serviceComment2);
        serviceComment1.setId(null);
        assertThat(serviceComment1).isNotEqualTo(serviceComment2);
    }
}
