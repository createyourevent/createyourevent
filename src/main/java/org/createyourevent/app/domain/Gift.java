package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Gift.
 */
@Entity
@Table(name = "gift")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Gift implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @Lob
    @Column(name = "photo", nullable = false)
    private byte[] photo;

    @NotNull
    @Column(name = "photo_content_type", nullable = false)
    private String photoContentType;

    @NotNull
    @Column(name = "points", nullable = false)
    private Integer points;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "stock")
    private Long stock;

    @OneToMany(mappedBy = "gift")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "gift" }, allowSetters = true)
    private Set<GiftShoppingCart> giftShoppingCarts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Gift id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Gift title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Gift description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getPhoto() {
        return this.photo;
    }

    public Gift photo(byte[] photo) {
        this.setPhoto(photo);
        return this;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getPhotoContentType() {
        return this.photoContentType;
    }

    public Gift photoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
        return this;
    }

    public void setPhotoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
    }

    public Integer getPoints() {
        return this.points;
    }

    public Gift points(Integer points) {
        this.setPoints(points);
        return this;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Boolean getActive() {
        return this.active;
    }

    public Gift active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Long getStock() {
        return this.stock;
    }

    public Gift stock(Long stock) {
        this.setStock(stock);
        return this;
    }

    public void setStock(Long stock) {
        this.stock = stock;
    }

    public Set<GiftShoppingCart> getGiftShoppingCarts() {
        return this.giftShoppingCarts;
    }

    public void setGiftShoppingCarts(Set<GiftShoppingCart> giftShoppingCarts) {
        if (this.giftShoppingCarts != null) {
            this.giftShoppingCarts.forEach(i -> i.setGift(null));
        }
        if (giftShoppingCarts != null) {
            giftShoppingCarts.forEach(i -> i.setGift(this));
        }
        this.giftShoppingCarts = giftShoppingCarts;
    }

    public Gift giftShoppingCarts(Set<GiftShoppingCart> giftShoppingCarts) {
        this.setGiftShoppingCarts(giftShoppingCarts);
        return this;
    }

    public Gift addGiftShoppingCarts(GiftShoppingCart giftShoppingCart) {
        this.giftShoppingCarts.add(giftShoppingCart);
        giftShoppingCart.setGift(this);
        return this;
    }

    public Gift removeGiftShoppingCarts(GiftShoppingCart giftShoppingCart) {
        this.giftShoppingCarts.remove(giftShoppingCart);
        giftShoppingCart.setGift(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Gift)) {
            return false;
        }
        return id != null && id.equals(((Gift) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Gift{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", photo='" + getPhoto() + "'" +
            ", photoContentType='" + getPhotoContentType() + "'" +
            ", points=" + getPoints() +
            ", active='" + getActive() + "'" +
            ", stock=" + getStock() +
            "}";
    }
}
