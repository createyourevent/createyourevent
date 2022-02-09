package org.createyourevent.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.createyourevent.app.domain.enumeration.OrderStatus;
import org.createyourevent.app.domain.enumeration.PriceType;
import org.createyourevent.app.domain.enumeration.ProductType;
import org.createyourevent.app.domain.enumeration.RentType;
import org.createyourevent.app.domain.enumeration.Unit;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Product.
 */
@Entity
@Table(name = "product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "keywords")
    private String keywords;

    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "date_added")
    private ZonedDateTime dateAdded;

    @Column(name = "date_modified")
    private ZonedDateTime dateModified;

    @Enumerated(EnumType.STRING)
    @Column(name = "price_type")
    private PriceType priceType;

    @Enumerated(EnumType.STRING)
    @Column(name = "rent_type")
    private RentType rentType;

    @NotNull
    @Column(name = "price", nullable = false)
    private Float price;

    @Lob
    @Column(name = "photo", nullable = false)
    private byte[] photo;

    @NotNull
    @Column(name = "photo_content_type", nullable = false)
    private String photoContentType;

    @Lob
    @Column(name = "photo_2")
    private byte[] photo2;

    @Column(name = "photo_2_content_type")
    private String photo2ContentType;

    @Lob
    @Column(name = "photo_3")
    private byte[] photo3;

    @Column(name = "photo_3_content_type")
    private String photo3ContentType;

    @Column(name = "youtube")
    private String youtube;

    @Column(name = "active")
    private Boolean active;

    @NotNull
    @Column(name = "stock", nullable = false)
    private Float stock;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_type")
    private ProductType productType;

    @Column(name = "item_number")
    private String itemNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "unit", nullable = false)
    private Unit unit;

    @Column(name = "amount")
    private Float amount;

    @NotNull
    @Column(name = "motto", nullable = false)
    private String motto;

    @OneToMany(mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "feeTransaction", "event", "product", "shop", "cart", "deliveryType" }, allowSetters = true)
    private Set<EventProductOrder> eventProductOrders = new HashSet<>();

    @OneToMany(mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "event", "product" }, allowSetters = true)
    private Set<EventProductRatingComment> comments = new HashSet<>();

    @OneToMany(mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "event", "product" }, allowSetters = true)
    private Set<Worksheet> worksheets = new HashSet<>();

    @OneToMany(mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "product", "shop", "event", "service", "organization" }, allowSetters = true)
    private Set<Image> images = new HashSet<>();

    @OneToMany(mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "product", "shop", "event", "service" }, allowSetters = true)
    private Set<Mp3> mp3s = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "products", "eventProductOrders", "images", "mp3s", "user", "comments", "tags" }, allowSetters = true)
    private Shop shop;

    @OneToMany(mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "event", "product", "shop", "service", "organization" }, allowSetters = true)
    private Set<Tags> tags = new HashSet<>();

    @OneToMany(mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "eventProductOrders", "product" }, allowSetters = true)
    private Set<DeliveryType> deliveryTypes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Product id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Product title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getKeywords() {
        return this.keywords;
    }

    public Product keywords(String keywords) {
        this.setKeywords(keywords);
        return this;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public String getDescription() {
        return this.description;
    }

    public Product description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getDateAdded() {
        return this.dateAdded;
    }

    public Product dateAdded(ZonedDateTime dateAdded) {
        this.setDateAdded(dateAdded);
        return this;
    }

    public void setDateAdded(ZonedDateTime dateAdded) {
        this.dateAdded = dateAdded;
    }

    public ZonedDateTime getDateModified() {
        return this.dateModified;
    }

    public Product dateModified(ZonedDateTime dateModified) {
        this.setDateModified(dateModified);
        return this;
    }

    public void setDateModified(ZonedDateTime dateModified) {
        this.dateModified = dateModified;
    }

    public PriceType getPriceType() {
        return this.priceType;
    }

    public Product priceType(PriceType priceType) {
        this.setPriceType(priceType);
        return this;
    }

    public void setPriceType(PriceType priceType) {
        this.priceType = priceType;
    }

    public RentType getRentType() {
        return this.rentType;
    }

    public Product rentType(RentType rentType) {
        this.setRentType(rentType);
        return this;
    }

    public void setRentType(RentType rentType) {
        this.rentType = rentType;
    }

    public Float getPrice() {
        return this.price;
    }

    public Product price(Float price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public byte[] getPhoto() {
        return this.photo;
    }

    public Product photo(byte[] photo) {
        this.setPhoto(photo);
        return this;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getPhotoContentType() {
        return this.photoContentType;
    }

    public Product photoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
        return this;
    }

    public void setPhotoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
    }

    public byte[] getPhoto2() {
        return this.photo2;
    }

    public Product photo2(byte[] photo2) {
        this.setPhoto2(photo2);
        return this;
    }

    public void setPhoto2(byte[] photo2) {
        this.photo2 = photo2;
    }

    public String getPhoto2ContentType() {
        return this.photo2ContentType;
    }

    public Product photo2ContentType(String photo2ContentType) {
        this.photo2ContentType = photo2ContentType;
        return this;
    }

    public void setPhoto2ContentType(String photo2ContentType) {
        this.photo2ContentType = photo2ContentType;
    }

    public byte[] getPhoto3() {
        return this.photo3;
    }

    public Product photo3(byte[] photo3) {
        this.setPhoto3(photo3);
        return this;
    }

    public void setPhoto3(byte[] photo3) {
        this.photo3 = photo3;
    }

    public String getPhoto3ContentType() {
        return this.photo3ContentType;
    }

    public Product photo3ContentType(String photo3ContentType) {
        this.photo3ContentType = photo3ContentType;
        return this;
    }

    public void setPhoto3ContentType(String photo3ContentType) {
        this.photo3ContentType = photo3ContentType;
    }

    public String getYoutube() {
        return this.youtube;
    }

    public Product youtube(String youtube) {
        this.setYoutube(youtube);
        return this;
    }

    public void setYoutube(String youtube) {
        this.youtube = youtube;
    }

    public Boolean getActive() {
        return this.active;
    }

    public Product active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Float getStock() {
        return this.stock;
    }

    public Product stock(Float stock) {
        this.setStock(stock);
        return this;
    }

    public void setStock(Float stock) {
        this.stock = stock;
    }

    public ProductType getProductType() {
        return this.productType;
    }

    public Product productType(ProductType productType) {
        this.setProductType(productType);
        return this;
    }

    public void setProductType(ProductType productType) {
        this.productType = productType;
    }

    public String getItemNumber() {
        return this.itemNumber;
    }

    public Product itemNumber(String itemNumber) {
        this.setItemNumber(itemNumber);
        return this;
    }

    public void setItemNumber(String itemNumber) {
        this.itemNumber = itemNumber;
    }

    public OrderStatus getStatus() {
        return this.status;
    }

    public Product status(OrderStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public Unit getUnit() {
        return this.unit;
    }

    public Product unit(Unit unit) {
        this.setUnit(unit);
        return this;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }

    public Float getAmount() {
        return this.amount;
    }

    public Product amount(Float amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public String getMotto() {
        return this.motto;
    }

    public Product motto(String motto) {
        this.setMotto(motto);
        return this;
    }

    public void setMotto(String motto) {
        this.motto = motto;
    }

    public Set<EventProductOrder> getEventProductOrders() {
        return this.eventProductOrders;
    }

    public void setEventProductOrders(Set<EventProductOrder> eventProductOrders) {
        if (this.eventProductOrders != null) {
            this.eventProductOrders.forEach(i -> i.setProduct(null));
        }
        if (eventProductOrders != null) {
            eventProductOrders.forEach(i -> i.setProduct(this));
        }
        this.eventProductOrders = eventProductOrders;
    }

    public Product eventProductOrders(Set<EventProductOrder> eventProductOrders) {
        this.setEventProductOrders(eventProductOrders);
        return this;
    }

    public Product addEventProductOrders(EventProductOrder eventProductOrder) {
        this.eventProductOrders.add(eventProductOrder);
        eventProductOrder.setProduct(this);
        return this;
    }

    public Product removeEventProductOrders(EventProductOrder eventProductOrder) {
        this.eventProductOrders.remove(eventProductOrder);
        eventProductOrder.setProduct(null);
        return this;
    }

    public Set<EventProductRatingComment> getComments() {
        return this.comments;
    }

    public void setComments(Set<EventProductRatingComment> eventProductRatingComments) {
        if (this.comments != null) {
            this.comments.forEach(i -> i.setProduct(null));
        }
        if (eventProductRatingComments != null) {
            eventProductRatingComments.forEach(i -> i.setProduct(this));
        }
        this.comments = eventProductRatingComments;
    }

    public Product comments(Set<EventProductRatingComment> eventProductRatingComments) {
        this.setComments(eventProductRatingComments);
        return this;
    }

    public Product addComments(EventProductRatingComment eventProductRatingComment) {
        this.comments.add(eventProductRatingComment);
        eventProductRatingComment.setProduct(this);
        return this;
    }

    public Product removeComments(EventProductRatingComment eventProductRatingComment) {
        this.comments.remove(eventProductRatingComment);
        eventProductRatingComment.setProduct(null);
        return this;
    }

    public Set<Worksheet> getWorksheets() {
        return this.worksheets;
    }

    public void setWorksheets(Set<Worksheet> worksheets) {
        if (this.worksheets != null) {
            this.worksheets.forEach(i -> i.setProduct(null));
        }
        if (worksheets != null) {
            worksheets.forEach(i -> i.setProduct(this));
        }
        this.worksheets = worksheets;
    }

    public Product worksheets(Set<Worksheet> worksheets) {
        this.setWorksheets(worksheets);
        return this;
    }

    public Product addWorksheets(Worksheet worksheet) {
        this.worksheets.add(worksheet);
        worksheet.setProduct(this);
        return this;
    }

    public Product removeWorksheets(Worksheet worksheet) {
        this.worksheets.remove(worksheet);
        worksheet.setProduct(null);
        return this;
    }

    public Set<Image> getImages() {
        return this.images;
    }

    public void setImages(Set<Image> images) {
        if (this.images != null) {
            this.images.forEach(i -> i.setProduct(null));
        }
        if (images != null) {
            images.forEach(i -> i.setProduct(this));
        }
        this.images = images;
    }

    public Product images(Set<Image> images) {
        this.setImages(images);
        return this;
    }

    public Product addImages(Image image) {
        this.images.add(image);
        image.setProduct(this);
        return this;
    }

    public Product removeImages(Image image) {
        this.images.remove(image);
        image.setProduct(null);
        return this;
    }

    public Set<Mp3> getMp3s() {
        return this.mp3s;
    }

    public void setMp3s(Set<Mp3> mp3s) {
        if (this.mp3s != null) {
            this.mp3s.forEach(i -> i.setProduct(null));
        }
        if (mp3s != null) {
            mp3s.forEach(i -> i.setProduct(this));
        }
        this.mp3s = mp3s;
    }

    public Product mp3s(Set<Mp3> mp3s) {
        this.setMp3s(mp3s);
        return this;
    }

    public Product addMp3s(Mp3 mp3) {
        this.mp3s.add(mp3);
        mp3.setProduct(this);
        return this;
    }

    public Product removeMp3s(Mp3 mp3) {
        this.mp3s.remove(mp3);
        mp3.setProduct(null);
        return this;
    }

    public Shop getShop() {
        return this.shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public Product shop(Shop shop) {
        this.setShop(shop);
        return this;
    }

    public Set<Tags> getTags() {
        return this.tags;
    }

    public void setTags(Set<Tags> tags) {
        if (this.tags != null) {
            this.tags.forEach(i -> i.setProduct(null));
        }
        if (tags != null) {
            tags.forEach(i -> i.setProduct(this));
        }
        this.tags = tags;
    }

    public Product tags(Set<Tags> tags) {
        this.setTags(tags);
        return this;
    }

    public Product addTags(Tags tags) {
        this.tags.add(tags);
        tags.setProduct(this);
        return this;
    }

    public Product removeTags(Tags tags) {
        this.tags.remove(tags);
        tags.setProduct(null);
        return this;
    }

    public Set<DeliveryType> getDeliveryTypes() {
        return this.deliveryTypes;
    }

    public void setDeliveryTypes(Set<DeliveryType> deliveryTypes) {
        if (this.deliveryTypes != null) {
            this.deliveryTypes.forEach(i -> i.setProduct(null));
        }
        if (deliveryTypes != null) {
            deliveryTypes.forEach(i -> i.setProduct(this));
        }
        this.deliveryTypes = deliveryTypes;
    }

    public Product deliveryTypes(Set<DeliveryType> deliveryTypes) {
        this.setDeliveryTypes(deliveryTypes);
        return this;
    }

    public Product addDeliveryTypes(DeliveryType deliveryType) {
        this.deliveryTypes.add(deliveryType);
        deliveryType.setProduct(this);
        return this;
    }

    public Product removeDeliveryTypes(DeliveryType deliveryType) {
        this.deliveryTypes.remove(deliveryType);
        deliveryType.setProduct(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Product)) {
            return false;
        }
        return id != null && id.equals(((Product) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", keywords='" + getKeywords() + "'" +
            ", description='" + getDescription() + "'" +
            ", dateAdded='" + getDateAdded() + "'" +
            ", dateModified='" + getDateModified() + "'" +
            ", priceType='" + getPriceType() + "'" +
            ", rentType='" + getRentType() + "'" +
            ", price=" + getPrice() +
            ", photo='" + getPhoto() + "'" +
            ", photoContentType='" + getPhotoContentType() + "'" +
            ", photo2='" + getPhoto2() + "'" +
            ", photo2ContentType='" + getPhoto2ContentType() + "'" +
            ", photo3='" + getPhoto3() + "'" +
            ", photo3ContentType='" + getPhoto3ContentType() + "'" +
            ", youtube='" + getYoutube() + "'" +
            ", active='" + getActive() + "'" +
            ", stock=" + getStock() +
            ", productType='" + getProductType() + "'" +
            ", itemNumber='" + getItemNumber() + "'" +
            ", status='" + getStatus() + "'" +
            ", unit='" + getUnit() + "'" +
            ", amount=" + getAmount() +
            ", motto='" + getMotto() + "'" +
            "}";
    }
}
