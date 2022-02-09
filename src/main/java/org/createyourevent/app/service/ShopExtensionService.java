package org.createyourevent.app.service;

import java.util.List;

import org.createyourevent.app.domain.Shop;
import org.createyourevent.app.domain.enumeration.ProductType;

public interface ShopExtensionService {

    List<Shop> findByUserIdAndActiveTrue(String userId);

    List<Shop> findByCurrentUser();

    List<Shop> findByProductType(ProductType productType);

    List<Shop> findByProductTypeAndActiveTrue(ProductType productType);

    List<Shop> findByActiveTrue();

    List<Shop> findByActiveTrueAndActiveOwnerTrue();


}
