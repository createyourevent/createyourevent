package org.createyourevent.app.repository;

import java.util.List;

import org.createyourevent.app.domain.Product;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Product entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductExtensionRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByShopId(Long shopId);

    List<Product> findAllByShopIdAndActiveTrue(Long shopId);

    @Query("select product from Product product where product.shop.active = true and product.active = true")
    List<Product> findAllByShopActiveAndActiveTrue();

    @Query(nativeQuery = true, value = "select * from createyourevent.product p left join createyourevent.eventproductorder epo on p.id = epo.product_id left join createyourevent.event e on e.id = epo.event_id")
    List<Product> findAllCrossSellingProducts();

}
