package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ticket.
 */
@Entity
@Table(name = "ticket")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Ticket implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "amount")
    private Integer amount;

    @Column(name = "total")
    private Float total;

    @Column(name = "date")
    private ZonedDateTime date;

    @Column(name = "ref_no")
    private String refNo;

    @Column(name = "access_date")
    private ZonedDateTime accessDate;

    @Column(name = "tickets_used")
    private Integer ticketsUsed;

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

    @JsonIgnoreProperties(value = { "transactionId", "ticket", "user", "event" }, allowSetters = true)
    @OneToOne(mappedBy = "ticket")
    private Reservation reservation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Ticket id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getAmount() {
        return this.amount;
    }

    public Ticket amount(Integer amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public Float getTotal() {
        return this.total;
    }

    public Ticket total(Float total) {
        this.setTotal(total);
        return this;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public Ticket date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getRefNo() {
        return this.refNo;
    }

    public Ticket refNo(String refNo) {
        this.setRefNo(refNo);
        return this;
    }

    public void setRefNo(String refNo) {
        this.refNo = refNo;
    }

    public ZonedDateTime getAccessDate() {
        return this.accessDate;
    }

    public Ticket accessDate(ZonedDateTime accessDate) {
        this.setAccessDate(accessDate);
        return this;
    }

    public void setAccessDate(ZonedDateTime accessDate) {
        this.accessDate = accessDate;
    }

    public Integer getTicketsUsed() {
        return this.ticketsUsed;
    }

    public Ticket ticketsUsed(Integer ticketsUsed) {
        this.setTicketsUsed(ticketsUsed);
        return this;
    }

    public void setTicketsUsed(Integer ticketsUsed) {
        this.ticketsUsed = ticketsUsed;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Ticket event(Event event) {
        this.setEvent(event);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Ticket user(User user) {
        this.setUser(user);
        return this;
    }

    public Reservation getReservation() {
        return this.reservation;
    }

    public void setReservation(Reservation reservation) {
        if (this.reservation != null) {
            this.reservation.setTicket(null);
        }
        if (reservation != null) {
            reservation.setTicket(this);
        }
        this.reservation = reservation;
    }

    public Ticket reservation(Reservation reservation) {
        this.setReservation(reservation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ticket)) {
            return false;
        }
        return id != null && id.equals(((Ticket) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ticket{" +
            "id=" + getId() +
            ", amount=" + getAmount() +
            ", total=" + getTotal() +
            ", date='" + getDate() + "'" +
            ", refNo='" + getRefNo() + "'" +
            ", accessDate='" + getAccessDate() + "'" +
            ", ticketsUsed=" + getTicketsUsed() +
            "}";
    }
}
