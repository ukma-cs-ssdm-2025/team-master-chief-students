# Test Plan Review

## Reviewing Team
Found a screenshot in Teams, and then accordingly in the repository of team [team-kod-pisat-dyploit-pushit](https://github.com/ukma-cs-ssdm-2025/team-kod-pisat-dyploit-pushit/blob/main/docs/validations/test-plan.md)

## This Team's Test Plan 
| №   | Component / Function                          | Test Level | Type (Positive / Negative) | Expected Result / Acceptance Criterion                                              | Test Owner |
| --- | -------------------------------------------- | ------------ | ----------------------------- | -------------------------------------------------------------------------------------- | ------------- |
| 1   | User Authentication (Login/Register) | Unit         | Positive                    | User with valid data successfully registers or logs in, receives access token | Oleksandr     |
| 1.1 | User Authentication (Login/Register)     | Integration  | Negative                    | Login with incorrect credentials -> system rejects request and returns status 401 Unauthorized                        | Oleksandr     |
| 2   | Creating and Editing Review        | Unit         | Positive                    | Review with valid data is successfully created, saved in DB                     | Ostap         |
| 2.1 | Creating and Editing Review            | Integration  | Negative                    | No authentication token -> API returns 403 Forbidden                               | Ostap         |
| 3   | Rating Movie (Rating System)        | Unit         | Positive                    | User can set rating from 1 to 10, average rating updates correctly    | Oleksandr     |
| 3.1 | Rating Movie (Rating System)            | Integration  | Negative                    | Rating outside 1–10 range -> returns 400 Bad Request                                 | Oleksandr     |
| 4   | API Performance                       | Performance  | Positive                    | 90% of requests to `/api/reviews` execute in less than 1.5 s                           | Ostap         |
| 5   | Token Security (JWT)                    | Security     | Negative                    | Requests with expired or forged tokens are rejected (401 Unauthorized)       | Oleksandr     |

## Review Process

|  №  | Criterion                                   | Yes/No | Comment                                                                                   |
| :-: | ------------------------------------------ | :----: | ------------------------------------------------------------------------------------------ |
|  1  | Key requirements and critical paths covered  |   Yes   | Test plan covers main functions: authentication, reviews, rating, performance, security |
|  2  | Clearly formulated acceptance criteria     |   Yes   | Expected results are clearly stated, response codes are included                                |
|  3  | Negative scenario tests exist           |   Yes   | Errors 401, 403, 400 are provided for incorrect requests                                  |
|  4  | Traceability to requirements (Lab 02) |  Yes/No   | It would be good to add links to specific user stories or FR/NFR ID                      |
|  5  | Plan is realistic and executable in CI       |   Yes   | Tests are short, clear, can be implemented via Postman                  |

### Brief Feedback:
#### Positives:
- Very well structured — includes both unit and integration levels.
- Balance between positive and negative scenarios.
- Acceptance criteria are clearly stated with HTTP status codes.
  
#### Improvement Suggestions:
- Add a column or links to requirements (FR-001, US-002...), to make traceability easier.
- Can expand Performance testing with additional metrics, e.g., latency or throughput.
