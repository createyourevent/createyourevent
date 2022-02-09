package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A GiftShoppingCart.
 */
@Entity
@Table(name = "gift_shopping_cart")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class GiftShoppingCart implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private ZonedDateTime date;

    @Column(name = "amount")
    private Integer amount;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "giftShoppingCarts" }, allowSetters = true)
    private Gift gift;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GiftShoppingCart id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public GiftShoppingCart date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Integer getAmount() {
        return this.amount;
    }

    public GiftShoppingCart amount(Integer amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public GiftShoppingCart user(User user) {
        this.setUser(user);
        return this;
    }

    public Gift getGift() {
        return this.gift;
    }

    public void setGift(Gift gift) {
        this.gift = gift;
    }

    public GiftShoppingCart gift(Gift gift) {
        this.setGift(gift);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GiftShoppingCart)) {
            return false;
        }
        return id != null && id.equals(((GiftShoppingCart) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GiftShoppingCart{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", amount=" + getAmount() +
            "}";
    }
}
