package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A OrganizationComment.
 */
@Entity
@Table(name = "organization_comment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class OrganizationComment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "comment")
    private String comment;

    @Column(name = "date")
    private ZonedDateTime date;

    @OneToMany(mappedBy = "organizationComment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "organizationComments", "organization", "user", "event", "organizationComment" }, allowSetters = true)
    private Set<OrganizationComment> organizationComments = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "images", "organizationReservations", "user", "restaurant", "hotel", "club", "building", "tags" },
        allowSetters = true
    )
    private Organization organization;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "images", "organizationReservations", "user", "restaurant", "hotel", "club", "building", "tags" },
        allowSetters = true
    )
    private Organization event;

    @ManyToOne
    @JsonIgnoreProperties(value = { "organizationComments", "organization", "user", "event", "organizationComment" }, allowSetters = true)
    private OrganizationComment organizationComment;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OrganizationComment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return this.comment;
    }

    public OrganizationComment comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public OrganizationComment date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Set<OrganizationComment> getOrganizationComments() {
        return this.organizationComments;
    }

    public void setOrganizationComments(Set<OrganizationComment> organizationComments) {
        if (this.organizationComments != null) {
            this.organizationComments.forEach(i -> i.setOrganizationComment(null));
        }
        if (organizationComments != null) {
            organizationComments.forEach(i -> i.setOrganizationComment(this));
        }
        this.organizationComments = organizationComments;
    }

    public OrganizationComment organizationComments(Set<OrganizationComment> organizationComments) {
        this.setOrganizationComments(organizationComments);
        return this;
    }

    public OrganizationComment addOrganizationComments(OrganizationComment organizationComment) {
        this.organizationComments.add(organizationComment);
        organizationComment.setOrganizationComment(this);
        return this;
    }

    public OrganizationComment removeOrganizationComments(OrganizationComment organizationComment) {
        this.organizationComments.remove(organizationComment);
        organizationComment.setOrganizationComment(null);
        return this;
    }

    public Organization getOrganization() {
        return this.organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public OrganizationComment organization(Organization organization) {
        this.setOrganization(organization);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public OrganizationComment user(User user) {
        this.setUser(user);
        return this;
    }

    public Organization getEvent() {
        return this.event;
    }

    public void setEvent(Organization organization) {
        this.event = organization;
    }

    public OrganizationComment event(Organization organization) {
        this.setEvent(organization);
        return this;
    }

    public OrganizationComment getOrganizationComment() {
        return this.organizationComment;
    }

    public void setOrganizationComment(OrganizationComment organizationComment) {
        this.organizationComment = organizationComment;
    }

    public OrganizationComment organizationComment(OrganizationComment organizationComment) {
        this.setOrganizationComment(organizationComment);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrganizationComment)) {
            return false;
        }
        return id != null && id.equals(((OrganizationComment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrganizationComment{" +
            "id=" + getId() +
            ", comment='" + getComment() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
