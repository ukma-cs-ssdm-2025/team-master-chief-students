# Debugging Log

## Symptom
Під час запуску тесту `register_ShouldReturnTokens` з’являлася помилка:
Тест падав на рядку:
```
.andExpect(jsonPath("$.data.accessToken").value("access-token"))
```
Попри те, що метод authService.register() повертав очікуваний AuthResponseDto.

## Root Cause
Контролер AuthController повертав об’єкт AuthResponseDto без обгортки у поле data, тобто JSON мав вигляд:
```
{
  "accessToken": "access-token",
  "refreshToken": "refresh-token"
}
```
а не очікуваний тестом формат:
```
{
  "data": {
    "accessToken": "access-token",
    "refreshToken": "refresh-token"
  }
}
```
Отже, тест помилково перевіряв шлях $.data.accessToken замість $.accessToken.
## Fix
Було вирішено оновити тест, щоб він відповідав фактичному формату відповіді API:
```
.andExpect(jsonPath("$.accessToken").value("access-token"))
.andExpect(jsonPath("$.refreshToken").value("refresh-token"));
```
Після цього тест проходить успішно

## Lesson learned
- Перед написанням тесту потрібно звіряти очікуваний формат JSON із реальною відповіддю контролера.
- Корисно тимчасово логувати mockMvc.perform(...).andDo(print()) для швидкого виявлення розбіжностей у структурі відповіді.
- У подальшому — підтримувати єдиний формат відповідей через обгортку ApiResponse<T>, щоб уникати таких помилок.
