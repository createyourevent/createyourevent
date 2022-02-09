package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RideCostsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RideCosts.class);
        RideCosts rideCosts1 = new RideCosts();
        rideCosts1.setId(1L);
        RideCosts rideCosts2 = new RideCosts();
        rideCosts2.setId(rideCosts1.getId());
        assertThat(rideCosts1).isEqualTo(rideCosts2);
        rideCosts2.setId(2L);
        assertThat(rideCosts1).isNotEqualTo(rideCosts2);
        rideCosts1.setId(null);
        assertThat(rideCosts1).isNotEqualTo(rideCosts2);
    }
}
