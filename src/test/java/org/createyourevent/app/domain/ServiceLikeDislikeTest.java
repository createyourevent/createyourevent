package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ServiceLikeDislikeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ServiceLikeDislike.class);
        ServiceLikeDislike serviceLikeDislike1 = new ServiceLikeDislike();
        serviceLikeDislike1.setId(1L);
        ServiceLikeDislike serviceLikeDislike2 = new ServiceLikeDislike();
        serviceLikeDislike2.setId(serviceLikeDislike1.getId());
        assertThat(serviceLikeDislike1).isEqualTo(serviceLikeDislike2);
        serviceLikeDislike2.setId(2L);
        assertThat(serviceLikeDislike1).isNotEqualTo(serviceLikeDislike2);
        serviceLikeDislike1.setId(null);
        assertThat(serviceLikeDislike1).isNotEqualTo(serviceLikeDislike2);
    }
}
