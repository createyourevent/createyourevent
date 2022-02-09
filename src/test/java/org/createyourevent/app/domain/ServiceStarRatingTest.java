package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ServiceStarRatingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ServiceStarRating.class);
        ServiceStarRating serviceStarRating1 = new ServiceStarRating();
        serviceStarRating1.setId(1L);
        ServiceStarRating serviceStarRating2 = new ServiceStarRating();
        serviceStarRating2.setId(serviceStarRating1.getId());
        assertThat(serviceStarRating1).isEqualTo(serviceStarRating2);
        serviceStarRating2.setId(2L);
        assertThat(serviceStarRating1).isNotEqualTo(serviceStarRating2);
        serviceStarRating1.setId(null);
        assertThat(serviceStarRating1).isNotEqualTo(serviceStarRating2);
    }
}
