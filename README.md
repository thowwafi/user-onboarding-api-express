### Getting Started with User Onboarding API Project
#### Steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/thowwafi/user-onboarding-api-express.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd user-onboarding-api-express
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Start the Server:**

   ```bash
   npm start
   ```

   This will start the server at `http://localhost:3000`.

5. **Run Tests:**

   ```bash
   npm test
   ```

   This will execute the unit tests using Jest.


### API Documentation

---

### 1. **Register a New User**

#### Endpoint:

```
POST /api/register
```

#### Request Payload:

```json
{
  "profileName": "John Doe",
  "profilePicture": "base64EncodedImageString", // Optional
  "username": "john_doe123",
  "password": "secure_password"
}
```

#### Response:

- **Success (201 Created):**

```json
{
  "message": "User registered successfully.",
  "userProfile": {
    "userId": "unique_user_id",
    "profileName": "John Doe",
    "profilePictureUrl": "https://path/to/profile-picture.jpg",
    "username": "john_doe123"
  }
}
```

- **Error (4xx/5xx):**

```json
{
  "error": "Error message describing the issue."
}
```

---

### 2. **User Login**

#### Endpoint:

```
POST /api/login
```

#### Request Payload:

```json
{
  "username": "john_doe123",
  "password": "secure_password"
}
```

#### Response:

- **Success (200 OK):**

```json
{
  "message": "Login successful.",
  "accessToken": "JWT_access_token"
}
```

- **Error (4xx/5xx):**

```json
{
  "error": "Error message describing the issue."
}
```

---

### 3. **Get User Profile**

#### Endpoint:

```
GET /api/profile
```

#### Request Headers:

- `Authorization: Bearer JWT_access_token`

#### Response:

- **Success (200 OK):**

```json
{
  "userId": "unique_user_id",
  "profileName": "John Doe",
  "profilePictureUrl": "https://path/to/profile-picture.jpg",
  "username": "john_doe123"
}
```

- **Error (4xx/5xx):**

```json
{
  "error": "Error message describing the issue."
}
```

---

### 4. **Update User Profile**

#### Endpoint:

```
PUT /api/profile
```

#### Request Headers:

- `Authorization: Bearer JWT_access_token`

#### Request Payload:

```json
{
  "profileName": "Updated Name",
  "profilePicture": "base64EncodedImageString" // Optional
}
```

#### Response:

- **Success (200 OK):**

```json
{
  "message": "User profile updated successfully.",
  "userProfile": {
    "userId": "unique_user_id",
    "profileName": "Updated Name",
    "profilePictureUrl": "https://path/to/updated-profile-picture.jpg",
    "username": "john_doe123"
  }
}
```

- **Error (4xx/5xx):**

```json
{
  "error": "Error message describing the issue."
}
```