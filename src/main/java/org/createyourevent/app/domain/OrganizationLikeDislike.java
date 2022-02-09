package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A OrganizationLikeDislike.
 */
@Entity
@Table(name = "organization_like_dislike")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class OrganizationLikeDislike implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "jhi_like")
    private Integer like;

    @Column(name = "dislike")
    private Integer dislike;

    @Column(name = "date")
    private ZonedDateTime date;

    @Column(name = "comment")
    private String comment;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "images", "organizationReservations", "user", "restaurant", "hotel", "club", "building", "tags" },
        allowSetters = true
    )
    private Organization organization;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "images", "organizationReservations", "user", "restaurant", "hotel", "club", "building", "tags" },
        allowSetters = true
    )
    private Organization event;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OrganizationLikeDislike id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getLike() {
        return this.like;
    }

    public OrganizationLikeDislike like(Integer like) {
        this.setLike(like);
        return this;
    }

    public void setLike(Integer like) {
        this.like = like;
    }

    public Integer getDislike() {
        return this.dislike;
    }

    public OrganizationLikeDislike dislike(Integer dislike) {
        this.setDislike(dislike);
        return this;
    }

    public void setDislike(Integer dislike) {
        this.dislike = dislike;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public OrganizationLikeDislike date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getComment() {
        return this.comment;
    }

    public OrganizationLikeDislike comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Organization getOrganization() {
        return this.organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public OrganizationLikeDislike organization(Organization organization) {
        this.setOrganization(organization);
        return this;
    }

    public Organization getEvent() {
        return this.event;
    }

    public void setEvent(Organization organization) {
        this.event = organization;
    }

    public OrganizationLikeDislike event(Organization organization) {
        this.setEvent(organization);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public OrganizationLikeDislike user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrganizationLikeDislike)) {
            return false;
        }
        return id != null && id.equals(((OrganizationLikeDislike) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrganizationLikeDislike{" +
            "id=" + getId() +
            ", like=" + getLike() +
            ", dislike=" + getDislike() +
            ", date='" + getDate() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
