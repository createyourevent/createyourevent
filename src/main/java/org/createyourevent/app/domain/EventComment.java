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
 * A EventComment.
 */
@Entity
@Table(name = "event_comment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EventComment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "comment")
    private String comment;

    @Column(name = "date")
    private ZonedDateTime date;

    @OneToMany(mappedBy = "eventComment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "eventComments", "event", "user", "eventComment" }, allowSetters = true)
    private Set<EventComment> eventComments = new HashSet<>();

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

    @ManyToOne
    @JsonIgnoreProperties(value = { "eventComments", "event", "user", "eventComment" }, allowSetters = true)
    private EventComment eventComment;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EventComment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return this.comment;
    }

    public EventComment comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public EventComment date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Set<EventComment> getEventComments() {
        return this.eventComments;
    }

    public void setEventComments(Set<EventComment> eventComments) {
        if (this.eventComments != null) {
            this.eventComments.forEach(i -> i.setEventComment(null));
        }
        if (eventComments != null) {
            eventComments.forEach(i -> i.setEventComment(this));
        }
        this.eventComments = eventComments;
    }

    public EventComment eventComments(Set<EventComment> eventComments) {
        this.setEventComments(eventComments);
        return this;
    }

    public EventComment addEventComments(EventComment eventComment) {
        this.eventComments.add(eventComment);
        eventComment.setEventComment(this);
        return this;
    }

    public EventComment removeEventComments(EventComment eventComment) {
        this.eventComments.remove(eventComment);
        eventComment.setEventComment(null);
        return this;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public EventComment event(Event event) {
        this.setEvent(event);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public EventComment user(User user) {
        this.setUser(user);
        return this;
    }

    public EventComment getEventComment() {
        return this.eventComment;
    }

    public void setEventComment(EventComment eventComment) {
        this.eventComment = eventComment;
    }

    public EventComment eventComment(EventComment eventComment) {
        this.setEventComment(eventComment);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventComment)) {
            return false;
        }
        return id != null && id.equals(((EventComment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EventComment{" +
            "id=" + getId() +
            ", comment='" + getComment() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
