package com.example.expensetracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for cursor-based pagination.
 *
 * @param <T> the type of items in the page
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CursorPageResponse<T> {
    /**
     * List of items in the current page.
     */
    private List<T> items;

    /**
     * Cursor for the next page (base64-encoded).
     * Null if there is no next page.
     */
    private String nextCursor;

    /**
     * Whether there are more items available.
     */
    private boolean hasNext;

    /**
     * Number of items in the current page.
     */
    private int size;

    public static <T> CursorPageResponse<T> of(List<T> items, String nextCursor, boolean hasNext) {
        return CursorPageResponse.<T>builder()
                .items(items)
                .nextCursor(nextCursor)
                .hasNext(hasNext)
                .size(items != null ? items.size() : 0)
                .build();
    }
}

