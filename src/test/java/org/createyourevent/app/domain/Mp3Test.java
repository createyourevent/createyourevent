package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class Mp3Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Mp3.class);
        Mp3 mp31 = new Mp3();
        mp31.setId(1L);
        Mp3 mp32 = new Mp3();
        mp32.setId(mp31.getId());
        assertThat(mp31).isEqualTo(mp32);
        mp32.setId(2L);
        assertThat(mp31).isNotEqualTo(mp32);
        mp31.setId(null);
        assertThat(mp31).isNotEqualTo(mp32);
    }
}
