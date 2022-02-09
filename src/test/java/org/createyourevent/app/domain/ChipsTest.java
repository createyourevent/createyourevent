package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChipsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Chips.class);
        Chips chips1 = new Chips();
        chips1.setId(1L);
        Chips chips2 = new Chips();
        chips2.setId(chips1.getId());
        assertThat(chips1).isEqualTo(chips2);
        chips2.setId(2L);
        assertThat(chips1).isNotEqualTo(chips2);
        chips1.setId(null);
        assertThat(chips1).isNotEqualTo(chips2);
    }
}
