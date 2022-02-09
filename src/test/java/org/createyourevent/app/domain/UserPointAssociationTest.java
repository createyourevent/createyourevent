package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserPointAssociationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserPointAssociation.class);
        UserPointAssociation userPointAssociation1 = new UserPointAssociation();
        userPointAssociation1.setId(1L);
        UserPointAssociation userPointAssociation2 = new UserPointAssociation();
        userPointAssociation2.setId(userPointAssociation1.getId());
        assertThat(userPointAssociation1).isEqualTo(userPointAssociation2);
        userPointAssociation2.setId(2L);
        assertThat(userPointAssociation1).isNotEqualTo(userPointAssociation2);
        userPointAssociation1.setId(null);
        assertThat(userPointAssociation1).isNotEqualTo(userPointAssociation2);
    }
}
