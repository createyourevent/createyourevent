package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BondTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bond.class);
        Bond bond1 = new Bond();
        bond1.setId(1L);
        Bond bond2 = new Bond();
        bond2.setId(bond1.getId());
        assertThat(bond1).isEqualTo(bond2);
        bond2.setId(2L);
        assertThat(bond1).isNotEqualTo(bond2);
        bond1.setId(null);
        assertThat(bond1).isNotEqualTo(bond2);
    }
}
