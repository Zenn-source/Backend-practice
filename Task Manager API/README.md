# 📝 Tasks API
A simple practice API built with **Node.js + Express** for managing tasks.  
This project is part of the **Backend Practice** repository.  

---

## 🚀 Features
- View all tasks (`GET /tasks`)  
- View a task by ID (`GET /tasks/:id`)  
- Create a new task (`POST /tasks`)  
- Delete a task (`DELETE /tasks/:id`)  
- Update a task dynamically (`PATCH /tasks/:id`)  
- Mark a task as completed (`PATCH /tasks/:id/complete`)  

---

## ⚙️ Installation & Setup

1. **Navigate into this project folder:**
   ```bash
   cd Backend-Practice/Task-Manager-API

2. **Install dependencies**
   ```bash
    npm install

3. **Run the server**
   ```bash
   npm start
  
## 📌 API Endpoints

## 1. Get all tasks

This endpoint retrieves a list of all available tasks.

-   **Method:**  `GET`
    
-   **Endpoint:**  `/tasks`
    

### Response:

```
[
  {
    "id": 1,
    "title": "Learn Express",
    "completed": false
  }
]

```

## 2. Get task by ID

This endpoint retrieves a single task by its unique identifier.

-   **Method:**  `GET`
    
-   **Endpoint:**  `/tasks/:id`
    

## 3. Create a new task

This endpoint allows you to create a new task.

-   **Method:**  `POST`
    
-   **Endpoint:**  `/tasks`
    

### Request Body:

```
{
  "title": "New Task",
  "completed": false
}

```

## 4. Delete a task

This endpoint deletes a task by its unique identifier.

-   **Method:**  `DELETE`
    
-   **Endpoint:**  `/tasks/:id`


## 5. Update a task (Dynamic PATCH)

`PATCH /tasks/:id` 

**Request Body (send only fields to update):**

`{  "title":  "Updated title"  }` 

----------

## 6. Mark task as completed (Specific PATCH)

`PATCH /tasks/:id/complete` 

----------

## 📚 Notes

-   This is for **practice only**.
    
-   Data is stored **in-memory** (resets when server restarts).
    
-   For real apps, you would connect this to a **database**.