package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.createyourevent.app.domain.enumeration.RentStatus;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EventProductOrder.
 */
@Entity
@Table(name = "event_product_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EventProductOrder implements Serializable {

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

    @Column(name = "rental_period")
    private Integer rentalPeriod;

    @Column(name = "date_from")
    private ZonedDateTime dateFrom;

    @Column(name = "date_until")
    private ZonedDateTime dateUntil;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RentStatus status;

    @Column(name = "billed")
    private Boolean billed;

    @Column(name = "seen")
    private Boolean seen;

    @Column(name = "approved")
    private Boolean approved;

    @Column(name = "selling_price")
    private Float sellingPrice;

    @ManyToOne
    private User user;

    @JsonIgnoreProperties(
        value = { "eventProductOrder", "eventServiceMapOrder", "event", "organizationReservation", "entries" },
        allowSetters = true
    )
    @OneToOne(mappedBy = "eventProductOrder")
    private FeeTransaction feeTransaction;

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
    @JsonIgnoreProperties(
        value = { "eventProductOrders", "comments", "worksheets", "images", "mp3s", "shop", "tags", "deliveryTypes" },
        allowSetters = true
    )
    private Product product;

    @ManyToOne
    @JsonIgnoreProperties(value = { "products", "eventProductOrders", "images", "mp3s", "user", "comments", "tags" }, allowSetters = true)
    private Shop shop;

    @ManyToOne
    @JsonIgnoreProperties(value = { "products", "services" }, allowSetters = true)
    private Cart cart;

    @ManyToOne
    @JsonIgnoreProperties(value = { "eventProductOrders", "product" }, allowSetters = true)
    private DeliveryType deliveryType;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EventProductOrder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getAmount() {
        return this.amount;
    }

    public EventProductOrder amount(Integer amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public Float getTotal() {
        return this.total;
    }

    public EventProductOrder total(Float total) {
        this.setTotal(total);
        return this;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public EventProductOrder date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Integer getRentalPeriod() {
        return this.rentalPeriod;
    }

    public EventProductOrder rentalPeriod(Integer rentalPeriod) {
        this.setRentalPeriod(rentalPeriod);
        return this;
    }

    public void setRentalPeriod(Integer rentalPeriod) {
        this.rentalPeriod = rentalPeriod;
    }

    public ZonedDateTime getDateFrom() {
        return this.dateFrom;
    }

    public EventProductOrder dateFrom(ZonedDateTime dateFrom) {
        this.setDateFrom(dateFrom);
        return this;
    }

    public void setDateFrom(ZonedDateTime dateFrom) {
        this.dateFrom = dateFrom;
    }

    public ZonedDateTime getDateUntil() {
        return this.dateUntil;
    }

    public EventProductOrder dateUntil(ZonedDateTime dateUntil) {
        this.setDateUntil(dateUntil);
        return this;
    }

    public void setDateUntil(ZonedDateTime dateUntil) {
        this.dateUntil = dateUntil;
    }

    public RentStatus getStatus() {
        return this.status;
    }

    public EventProductOrder status(RentStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(RentStatus status) {
        this.status = status;
    }

    public Boolean getBilled() {
        return this.billed;
    }

    public EventProductOrder billed(Boolean billed) {
        this.setBilled(billed);
        return this;
    }

    public void setBilled(Boolean billed) {
        this.billed = billed;
    }

    public Boolean getSeen() {
        return this.seen;
    }

    public EventProductOrder seen(Boolean seen) {
        this.setSeen(seen);
        return this;
    }

    public void setSeen(Boolean seen) {
        this.seen = seen;
    }

    public Boolean getApproved() {
        return this.approved;
    }

    public EventProductOrder approved(Boolean approved) {
        this.setApproved(approved);
        return this;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public Float getSellingPrice() {
        return this.sellingPrice;
    }

    public EventProductOrder sellingPrice(Float sellingPrice) {
        this.setSellingPrice(sellingPrice);
        return this;
    }

    public void setSellingPrice(Float sellingPrice) {
        this.sellingPrice = sellingPrice;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public EventProductOrder user(User user) {
        this.setUser(user);
        return this;
    }

    public FeeTransaction getFeeTransaction() {
        return this.feeTransaction;
    }

    public void setFeeTransaction(FeeTransaction feeTransaction) {
        if (this.feeTransaction != null) {
            this.feeTransaction.setEventProductOrder(null);
        }
        if (feeTransaction != null) {
            feeTransaction.setEventProductOrder(this);
        }
        this.feeTransaction = feeTransaction;
    }

    public EventProductOrder feeTransaction(FeeTransaction feeTransaction) {
        this.setFeeTransaction(feeTransaction);
        return this;
    }

    public Event getEvent() {
        return this.event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public EventProductOrder event(Event event) {
        this.setEvent(event);
        return this;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public EventProductOrder product(Product product) {
        this.setProduct(product);
        return this;
    }

    public Shop getShop() {
        return this.shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public EventProductOrder shop(Shop shop) {
        this.setShop(shop);
        return this;
    }

    public Cart getCart() {
        return this.cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public EventProductOrder cart(Cart cart) {
        this.setCart(cart);
        return this;
    }

    public DeliveryType getDeliveryType() {
        return this.deliveryType;
    }

    public void setDeliveryType(DeliveryType deliveryType) {
        this.deliveryType = deliveryType;
    }

    public EventProductOrder deliveryType(DeliveryType deliveryType) {
        this.setDeliveryType(deliveryType);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EventProductOrder)) {
            return false;
        }
        return id != null && id.equals(((EventProductOrder) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EventProductOrder{" +
            "id=" + getId() +
            ", amount=" + getAmount() +
            ", total=" + getTotal() +
            ", date='" + getDate() + "'" +
            ", rentalPeriod=" + getRentalPeriod() +
            ", dateFrom='" + getDateFrom() + "'" +
            ", dateUntil='" + getDateUntil() + "'" +
            ", status='" + getStatus() + "'" +
            ", billed='" + getBilled() + "'" +
            ", seen='" + getSeen() + "'" +
            ", approved='" + getApproved() + "'" +
            ", sellingPrice=" + getSellingPrice() +
            "}";
    }
}
