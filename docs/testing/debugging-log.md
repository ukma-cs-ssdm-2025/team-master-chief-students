# Debugging Log

## Symptom
An error occurred while running the `register_ShouldReturnTokens` test:
The test failed on the line:
```
.andExpect(jsonPath("$.data.accessToken").value("access-token"))
```
Even though the authService.register() method returned the expected AuthResponseDto.

## Root Cause
The AuthController was returning the AuthResponseDto object without wrapping it in a data field, meaning the JSON looked like this:
```
{
  "accessToken": "access-token",
  "refreshToken": "refresh-token"
}
```
and not the format expected by the test:
```
{
  "data": {
    "accessToken": "access-token",
    "refreshToken": "refresh-token"
  }
}
```
So, the test was incorrectly checking the path $.data.accessToken instead of $.accessToken.
## Fix
It was decided to update the test to match the actual API response format:
```
.andExpect(jsonPath("$.accessToken").value("access-token"))
.andExpect(jsonPath("$.refreshToken").value("refresh-token"));
```
After this, the test passes successfully.

## Lesson learned
- Before writing a test, you need to check the expected JSON format against the actual controller response.
- It is useful to temporarily log mockMvc.perform(...).andDo(print()) to quickly identify discrepancies in the response structure.
- In the future — maintain a unified response format using an ApiResponse<T> wrapper to avoid such errors.
