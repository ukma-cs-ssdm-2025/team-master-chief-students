## US-001: Authentication by Login and Password

**As** a user,  
**I want** to be able to log in to the system using login and password,  
**So that** I can access my data and service functions.

**Acceptance Criteria:**

1. **Given:** Unauthenticated user on the login page  
    **When:** User enters valid login and password and clicks "Login"  
    **Then:** User is authenticated and lands on the main page
    
2. **Given:** Unauthenticated user on the login page  
    **When:** User enters incorrect login credentials  
    **Then:** An error message is displayed
    

---

## US-002: Adding an Expense

**As** a user,  
**I want** to be able to add a new expense to the system,  
**So that** I can track my financial operations.

**Acceptance Criteria:**

1. **Given:** Authenticated user is in their account  
    **When:** User clicks "Add Expense" and fills out the form (amount, category, date, description)  
    **Then:** Expense is saved in the system and displayed in the expense list
    
2. **Given:** Authenticated user adds an expense  
    **When:** User leaves a required field empty (e.g., amount)  
    **Then:** System shows an error message and does not allow saving
    
3. **Given:** Successfully added expense  
    **When:** User views the expense list  
    **Then:** New expense is displayed among others with correct amount, category, and date



---

## US-003: Viewing Expense Statistics in Chart Form

**As** a user,
**I want** to see expenses in the form of charts by categories and periods,
**So that** I can analyze my financial habits.

**Acceptance Criteria:**

1. **Given:** User has saved expenses in different categories
    **When:** They open the "Statistics" tab
    **Then:** System displays a chart with expense distribution by categories

2. **Given:** User changes the filter period (e.g., from "Month" to "Week")
    **When:** System updates the data
    **Then:** Chart displays expenses only for the selected period



---

## US-004: Searching Expenses

**As** a user,
**I want** to quickly find expenses through search,
**So that** I don't have to manually browse through the entire list.

**Acceptance Criteria:**

1. **Given:** User is in the "Expenses" section
    **When:** They enter a keyword in the search field (e.g., "coffee")
    **Then:** System displays only those expenses that contain this word in the name or description

2. **Given:** User enters part of a word (e.g., "coff")
    **When:** System performs the search
    **Then:** All expenses matching this word fragment are displayed

3. **Given:** User enters a word or part of it
    **When:** Search finds no data matching these letters
    **Then:** Message "No expenses found for your query" is displayed

4. **Given:** User clears the search field
    **When:** System updates the list
    **Then:** All expenses are displayed without filtering


   
---

## US-005: Financial Analytics

**As** a user,  
**I want** to be able to see my expenses and income for a certain period,  
**So that** I can analyze my finances and plan my budget more effectively.

**Acceptance Criteria:**

1. **Given:** User is logged in
    **When:** User selects a certain period (day, week, month, year)
    **Then:** System displays all expenses and income for the selected period
    
2. **Given:** User selected a period
    **When:** Data for this period is missing
    **Then:** Message about missing data is displayed



---

## US-006: Searching Expenses by Amount

**As** a user,  
**I want** to quickly find specific expenses by amount,  
**So that** I don't waste time manually browsing through a large number of records.

**Acceptance Criteria:**

1. **Given:** User is logged in
    **When:** User enters a search amount
    **Then:** System displays a list of expenses matching the specified amount
    
2. **Given:** User performed a search by amount
    **When:** Data for the specified amount is missing
    **Then:** Message "No results for the specified amount" is displayed
    