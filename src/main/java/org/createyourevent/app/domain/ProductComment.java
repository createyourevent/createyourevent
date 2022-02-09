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
 * A ProductComment.
 */
@Entity
@Table(name = "product_comment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProductComment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "comment")
    private String comment;

    @Column(name = "date")
    private ZonedDateTime date;

    @OneToMany(mappedBy = "productComment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "productComments", "product", "user", "productComment" }, allowSetters = true)
    private Set<ProductComment> productComments = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "eventProductOrders", "comments", "worksheets", "images", "mp3s", "shop", "tags", "deliveryTypes" },
        allowSetters = true
    )
    private Product product;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "productComments", "product", "user", "productComment" }, allowSetters = true)
    private ProductComment productComment;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProductComment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return this.comment;
    }

    public ProductComment comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public ProductComment date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Set<ProductComment> getProductComments() {
        return this.productComments;
    }

    public void setProductComments(Set<ProductComment> productComments) {
        if (this.productComments != null) {
            this.productComments.forEach(i -> i.setProductComment(null));
        }
        if (productComments != null) {
            productComments.forEach(i -> i.setProductComment(this));
        }
        this.productComments = productComments;
    }

    public ProductComment productComments(Set<ProductComment> productComments) {
        this.setProductComments(productComments);
        return this;
    }

    public ProductComment addProductComments(ProductComment productComment) {
        this.productComments.add(productComment);
        productComment.setProductComment(this);
        return this;
    }

    public ProductComment removeProductComments(ProductComment productComment) {
        this.productComments.remove(productComment);
        productComment.setProductComment(null);
        return this;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public ProductComment product(Product product) {
        this.setProduct(product);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ProductComment user(User user) {
        this.setUser(user);
        return this;
    }

    public ProductComment getProductComment() {
        return this.productComment;
    }

    public void setProductComment(ProductComment productComment) {
        this.productComment = productComment;
    }

    public ProductComment productComment(ProductComment productComment) {
        this.setProductComment(productComment);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductComment)) {
            return false;
        }
        return id != null && id.equals(((ProductComment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductComment{" +
            "id=" + getId() +
            ", comment='" + getComment() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
