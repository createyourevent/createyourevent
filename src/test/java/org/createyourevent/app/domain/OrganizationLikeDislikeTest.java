package org.createyourevent.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.createyourevent.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrganizationLikeDislikeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrganizationLikeDislike.class);
        OrganizationLikeDislike organizationLikeDislike1 = new OrganizationLikeDislike();
        organizationLikeDislike1.setId(1L);
        OrganizationLikeDislike organizationLikeDislike2 = new OrganizationLikeDislike();
        organizationLikeDislike2.setId(organizationLikeDislike1.getId());
        assertThat(organizationLikeDislike1).isEqualTo(organizationLikeDislike2);
        organizationLikeDislike2.setId(2L);
        assertThat(organizationLikeDislike1).isNotEqualTo(organizationLikeDislike2);
        organizationLikeDislike1.setId(null);
        assertThat(organizationLikeDislike1).isNotEqualTo(organizationLikeDislike2);
    }
}
