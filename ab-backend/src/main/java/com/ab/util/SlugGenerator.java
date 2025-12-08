package com.ab.util;

import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.regex.Pattern;

/**
 * Utility class for string operations and slug generation.
 */
@Component
public class SlugGenerator {

    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9]+");

    /**
     * Generates a URL-friendly slug from a given string.
     *
     * @param input the input string
     * @return the generated slug
     */
    public String generate(String input) {
        if (input == null || input.trim().isEmpty()) {
            return "";
        }

        // Convert to lowercase
        String slug = input.toLowerCase().trim();

        // Remove accents
        slug = Normalizer.normalize(slug, Normalizer.Form.NFD);
        slug = slug.replaceAll("\\p{M}", "");

        // Replace spaces with hyphens
        slug = slug.replaceAll("\\s+", "-");

        // Remove all non-alphanumeric characters except hyphens
        slug = NON_ALPHANUMERIC.matcher(slug).replaceAll("-");

        // Replace multiple hyphens with single hyphen
        slug = slug.replaceAll("-+", "-");

        // Remove leading/trailing hyphens
        slug = slug.replaceAll("^-|-$", "");

        return slug;
    }
}
