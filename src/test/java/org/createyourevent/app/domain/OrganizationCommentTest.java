package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrganizationCommentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrganizationComment.class);
        OrganizationComment organizationComment1 = new OrganizationComment();
        organizationComment1.setId(1L);
        OrganizationComment organizationComment2 = new OrganizationComment();
        organizationComment2.setId(organizationComment1.getId());
        assertThat(organizationComment1).isEqualTo(organizationComment2);
        organizationComment2.setId(2L);
        assertThat(organizationComment1).isNotEqualTo(organizationComment2);
        organizationComment1.setId(null);
        assertThat(organizationComment1).isNotEqualTo(organizationComment2);
    }
}
