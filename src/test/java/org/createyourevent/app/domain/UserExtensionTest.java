package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserExtensionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserExtension.class);
        UserExtension userExtension1 = new UserExtension();
        userExtension1.setId(1L);
        UserExtension userExtension2 = new UserExtension();
        userExtension2.setId(userExtension1.getId());
        assertThat(userExtension1).isEqualTo(userExtension2);
        userExtension2.setId(2L);
        assertThat(userExtension1).isNotEqualTo(userExtension2);
        userExtension1.setId(null);
        assertThat(userExtension1).isNotEqualTo(userExtension2);
    }
}
