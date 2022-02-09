package org.createyourevent.app;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.createyourevent.app.CreateyoureventApp;
import org.createyourevent.app.config.TestSecurityConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { CreateyoureventApp.class, TestSecurityConfiguration.class })
public @interface IntegrationTest {
}
