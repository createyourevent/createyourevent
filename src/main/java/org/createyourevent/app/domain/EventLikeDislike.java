package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EventLikeDislike.
 */
@Entity
@Table(name = "event_like_dislike")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EventLikeDislike implements Serializable {

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
        value = {
            "location",
            "eventDetail",
            "eventProductOrders",
            "reservations",
            "comments",
            "worksheets",
            "eventServiceMapOrders",
            "images",
            "mp3s",
            "user",
            "reservedUsers",
            "feeTransaction",
            "tags",
            "organizationReservations",
        },
        allowSetters = true
    )
    private Event event;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EventLikeDislike id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getLike() {
        return this.like;
    }

    public EventLikeDislike like(Integer like) {
        this.setLike(like);
        return this;
    }

    public void setLike(Integer like) {
        this.like = like;
    }

    public Integer getDislike() {
        return this.dislike;
    }

    public EventLikeDislike dislike(Integer dislike) {
        this.setDislike(dislike);
        return this;
    }

    public void setDislike(Integer dislike) {
        this.dislike = dislike;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public EventLikeDislike date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getComment() {
        return this.comment;
    }

    public EventLikeDislike comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public EventLikeDislike event(Event event) {
        this.setEvent(event);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public EventLikeDislike user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventLikeDislike)) {
            return false;
        }
        return id != null && id.equals(((EventLikeDislike) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EventLikeDislike{" +
            "id=" + getId() +
            ", like=" + getLike() +
            ", dislike=" + getDislike() +
            ", date='" + getDate() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
