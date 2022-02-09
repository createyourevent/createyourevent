package org.createyourevent.app.repository;

import org.createyourevent.app.domain.Shop;
import org.createyourevent.app.domain.enumeration.ProductType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Shop entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShopExtensionRepository extends JpaRepository<Shop, Long> {

    List<Shop> findByUserIdAndActiveTrue(@Param("userId") String userId);

    // @Query(nativeQuery = true, value = "select * from createyourevent.shop s where s.active = true and s.user_id = :userId ORDER BY s.name")
    // List<Shop> findByUserIdAndActiveTrue(@Param("userId") String userId);


    @Query("select shop from Shop shop where shop.user.login = ?#{principal.preferredUsername} and shop.active = true")
    List<Shop> findByCurrentUserAndActive();


    List<Shop> findByProductType(ProductType productType);

    List<Shop> findByProductTypeAndActiveTrue(ProductType productType);

    List<Shop> findByUserId(String userId);

    List<Shop> findByActiveTrue();

    @Query("select shop from Shop shop where shop.activeOwner = true and shop.active = true")
    List<Shop> findByActiveTrueAndActiveOwnerTrue();
}
