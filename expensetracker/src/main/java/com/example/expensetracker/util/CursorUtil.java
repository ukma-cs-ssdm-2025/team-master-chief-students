package com.example.expensetracker.util;

import com.example.expensetracker.exception.ValidationException;
import java.time.Instant;
import java.util.Base64;
import java.util.Optional;

/**
 * Utility class for encoding/decoding cursor for cursor-based pagination.
 * Cursor format: base64url("createdAtEpochMillis:id")
 * Example: "1730706625965:12345" -> "MTczMDcwNjYyNTk2NToxMjM0NQ"
 */
public class CursorUtil {

    private static final String DELIMITER = ":";

    /**
     * Encodes cursor from createdAt and id using URL-safe base64 encoding.
     *
     * @param createdAt the creation timestamp
     * @param id the entity id
     * @return base64url-encoded cursor string
     */
    public static String encodeCursor(Instant createdAt, Long id) {
        if (createdAt == null || id == null) {
            return null;
        }
        String cursorValue = createdAt.toEpochMilli() + DELIMITER + id;
        return Base64.getUrlEncoder().withoutPadding().encodeToString(cursorValue.getBytes());
    }

    /**
     * Decodes cursor to createdAt and id.
     * Throws ValidationException if cursor is invalid (according to requirements).
     *
     * @param cursor base64url-encoded cursor string
     * @return Optional containing a CursorInfo with createdAt and id, or empty if cursor is null/blank
     * @throws ValidationException if cursor format is invalid
     */
    public static Optional<CursorInfo> decodeCursor(String cursor) {
        if (cursor == null || cursor.isBlank()) {
            return Optional.empty();
        }

        try {
            byte[] decodedBytes = Base64.getUrlDecoder().decode(cursor);
            String decoded = new String(decodedBytes);
            String[] parts = decoded.split(DELIMITER, 2);
            if (parts.length != 2) {
                throw new ValidationException("Invalid cursor format");
            }

            long epochMillis = Long.parseLong(parts[0]);
            long id = Long.parseLong(parts[1]);

            return Optional.of(new CursorInfo(Instant.ofEpochMilli(epochMillis), id));
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid cursor format: " + e.getMessage());
        }
    }

    /**
     * Represents decoded cursor information.
     */
    public static class CursorInfo {
        private final Instant createdAt;
        private final Long id;

        public CursorInfo(Instant createdAt, Long id) {
            this.createdAt = createdAt;
            this.id = id;
        }

        public Instant getCreatedAt() {
            return createdAt;
        }

        public Long getId() {
            return id;
        }
    }
}

