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
 * A ShopComment.
 */
@Entity
@Table(name = "shop_comment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ShopComment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "comment")
    private String comment;

    @Column(name = "date")
    private ZonedDateTime date;

    @OneToMany(mappedBy = "shopComment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "shopComments", "shop", "user", "shopComment" }, allowSetters = true)
    private Set<ShopComment> shopComments = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "products", "eventProductOrders", "images", "mp3s", "user", "comments", "tags" }, allowSetters = true)
    private Shop shop;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "shopComments", "shop", "user", "shopComment" }, allowSetters = true)
    private ShopComment shopComment;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ShopComment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return this.comment;
    }

    public ShopComment comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public ShopComment date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Set<ShopComment> getShopComments() {
        return this.shopComments;
    }

    public void setShopComments(Set<ShopComment> shopComments) {
        if (this.shopComments != null) {
            this.shopComments.forEach(i -> i.setShopComment(null));
        }
        if (shopComments != null) {
            shopComments.forEach(i -> i.setShopComment(this));
        }
        this.shopComments = shopComments;
    }

    public ShopComment shopComments(Set<ShopComment> shopComments) {
        this.setShopComments(shopComments);
        return this;
    }

    public ShopComment addShopComments(ShopComment shopComment) {
        this.shopComments.add(shopComment);
        shopComment.setShopComment(this);
        return this;
    }

    public ShopComment removeShopComments(ShopComment shopComment) {
        this.shopComments.remove(shopComment);
        shopComment.setShopComment(null);
        return this;
    }

    public Shop getShop() {
        return this.shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public ShopComment shop(Shop shop) {
        this.setShop(shop);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ShopComment user(User user) {
        this.setUser(user);
        return this;
    }

    public ShopComment getShopComment() {
        return this.shopComment;
    }

    public void setShopComment(ShopComment shopComment) {
        this.shopComment = shopComment;
    }

    public ShopComment shopComment(ShopComment shopComment) {
        this.setShopComment(shopComment);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ShopComment)) {
            return false;
        }
        return id != null && id.equals(((ShopComment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ShopComment{" +
            "id=" + getId() +
            ", comment='" + getComment() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
