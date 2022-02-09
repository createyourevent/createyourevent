package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Reservation.
 */
@Entity
@Table(name = "reservation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Reservation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private ZonedDateTime date;

    @Column(name = "billed")
    private Boolean billed;

    @Column(name = "access_event")
    private Boolean accessEvent;

    @Column(name = "access_date")
    private ZonedDateTime accessDate;

    @Column(name = "td_tx_id")
    private String tdTxId;

    @JsonIgnoreProperties(value = { "reservation" }, allowSetters = true)
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(unique = true)
    private ReservationTransactionId transactionId;

    @JsonIgnoreProperties(value = { "event", "user", "reservation" }, allowSetters = true)
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(unique = true)
    private Ticket ticket;

    @ManyToOne
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(
        value = {
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
        },
        allowSetters = true
    )
    private Event event;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Reservation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Reservation date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Boolean getBilled() {
        return this.billed;
    }

    public Reservation billed(Boolean billed) {
        this.setBilled(billed);
        return this;
    }

    public void setBilled(Boolean billed) {
        this.billed = billed;
    }

    public Boolean getAccessEvent() {
        return this.accessEvent;
    }

    public Reservation accessEvent(Boolean accessEvent) {
        this.setAccessEvent(accessEvent);
        return this;
    }

    public void setAccessEvent(Boolean accessEvent) {
        this.accessEvent = accessEvent;
    }

    public ZonedDateTime getAccessDate() {
        return this.accessDate;
    }

    public Reservation accessDate(ZonedDateTime accessDate) {
        this.setAccessDate(accessDate);
        return this;
    }

    public void setAccessDate(ZonedDateTime accessDate) {
        this.accessDate = accessDate;
    }

    public String getTdTxId() {
        return this.tdTxId;
    }

    public Reservation tdTxId(String tdTxId) {
        this.setTdTxId(tdTxId);
        return this;
    }

    public void setTdTxId(String tdTxId) {
        this.tdTxId = tdTxId;
    }

    public ReservationTransactionId getTransactionId() {
        return this.transactionId;
    }

    public void setTransactionId(ReservationTransactionId reservationTransactionId) {
        this.transactionId = reservationTransactionId;
    }

    public Reservation transactionId(ReservationTransactionId reservationTransactionId) {
        this.setTransactionId(reservationTransactionId);
        return this;
    }

    public Ticket getTicket() {
        return this.ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public Reservation ticket(Ticket ticket) {
        this.setTicket(ticket);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Reservation user(User user) {
        this.setUser(user);
        return this;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Reservation event(Event event) {
        this.setEvent(event);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Reservation)) {
            return false;
        }
        return id != null && id.equals(((Reservation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Reservation{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", billed='" + getBilled() + "'" +
            ", accessEvent='" + getAccessEvent() + "'" +
            ", accessDate='" + getAccessDate() + "'" +
            ", tdTxId='" + getTdTxId() + "'" +
            "}";
    }
}
