package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PointsExchangeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PointsExchange.class);
        PointsExchange pointsExchange1 = new PointsExchange();
        pointsExchange1.setId(1L);
        PointsExchange pointsExchange2 = new PointsExchange();
        pointsExchange2.setId(pointsExchange1.getId());
        assertThat(pointsExchange1).isEqualTo(pointsExchange2);
        pointsExchange2.setId(2L);
        assertThat(pointsExchange1).isNotEqualTo(pointsExchange2);
        pointsExchange1.setId(null);
        assertThat(pointsExchange1).isNotEqualTo(pointsExchange2);
    }
}
