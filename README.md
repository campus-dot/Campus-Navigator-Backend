# Campus Navigator Backend

The Campus Navigator Backend provides the core API services for a campus map and navigation system, allowing users to search and locate various places on the campus. This backend is built with Node.js and Express, with MongoDB as the database to store campus locations and user data. It offers endpoints for managing locations, handling search queries, and returning optimized navigation paths.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **Location Management**: Add, update, and delete locations on campus (e.g., buildings, labs, cafeterias).
- **Search Functionality**: Allows users to search for locations by name, category, or keyword.
- **Navigation**: Provides optimized routes between selected locations.
- **Real-Time Updates**: Integrates with a frontend to provide real-time updates for users.
- **Data Storage**: Utilizes MongoDB to store location details and metadata.

---

## Getting Started

To set up the Campus Navigator Backend locally, you’ll need:
1. [Node.js](https://nodejs.org/) (v14 or higher recommended)
2. [MongoDB](https://www.mongodb.com/) instance for database storage

### Prerequisites
- **Node.js**: Make sure you have Node.js installed.
- **MongoDB**: Install MongoDB or set up a cloud database on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

---

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/campus-navigator-backend.git
    cd campus-navigator-backend
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following environment variables:

    ```plaintext
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/campusNavigatorDB
    ```

4. **Run the server**:
    ```bash
    npm start
    ```
    The server should now be running on `http://localhost:3000`.

---

## Configuration

The following environment variables are required to configure the backend:

- `PORT`: The port on which the server will run (default: 3000).
- `MONGODB_URI`: The MongoDB connection string.

---

## Usage

Once the server is running, you can interact with the Campus Navigator API using any HTTP client (like Postman or cURL) or connect it to a frontend application.

---

## API Documentation

### Endpoints

#### 1. **GET /api/locations**
   - **Description**: Retrieve a list of all available campus locations.
   - **Response**: JSON array of location objects.

#### 2. **POST /api/locations**
   - **Description**: Add a new location to the database.
   - **Request Body**:
     ```json
     {
       "name": "Library",
       "category": "Academic",
       "coordinates": { "lat": 29.864, "lng": -95.367 },
       "description": "Main campus library with extensive resources."
     }
     ```
   - **Response**: Confirmation of location addition.

#### 3. **GET /api/locations/search**
   - **Description**: Search for locations by name, category, or keyword.
   - **Query Parameters**:
     - `query` (string): The search term.
   - **Response**: JSON array of matching location objects.

#### 4. **GET /api/navigation**
   - **Description**: Retrieve an optimized route between two locations.
   - **Query Parameters**:
     - `start` (string): ID of the starting location.
     - `end` (string): ID of the destination location.
   - **Response**: JSON object containing route details.

---

## Database Schema

The backend uses MongoDB to store data. Here’s the basic schema for campus locations:

- **Location**
  - `_id` (ObjectId): Unique identifier for each location.
  - `name` (String): Name of the location (e.g., "Library").
  - `category` (String): Category of the location (e.g., "Academic", "Residential").
  - `coordinates` (Object): Geographic coordinates (latitude and longitude).
    - `lat` (Number): Latitude of the location.
    - `lng` (Number): Longitude of the location.
  - `description` (String): Brief description of the location.
  - `createdAt` (Date): Timestamp of creation.
  - `updatedAt` (Date): Timestamp of the last update.

---

## Contributing

We welcome contributions to the Campus Navigator Backend! To contribute:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to reach out with questions, suggestions, or issues! Thank you for contributing to the Campus Navigator Backend.

### API call format



### Create Building
- **Endpoint**: `POST /api/building/create-building`
- **Request Body Examples**:


A. User Registration
```json
{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "role": "user"
}

```
B. Login
```json
{
    "email": "john.doe@example.com",
    "password": "password123"
}

```

2. Detailed Building
```json
{
    "name": "Academic Block",
    "code": "ACBL2979",
    "description": "Nice building love from Ghanshala family",
    "location": {
        "type": "Point",
        "coordinates": [29.374433, 79.530625]
    },
    "facilities": [
        "classrooms",
        "lecture theatre",
        "washroom", 
        "staff room"
    ],
    "isAccessible": true,
    "operatingHours": {
        "open": "00:00",
        "close": "23:59"
    },
    "totalFloors": 4,
    "imageUrl": "fafdsfdd.sdf"
}
```


3. Creating floors
```
{
    "buildingId": "673e787421548d5434d3209e",
    "floorNumber": 5,
    "description": "Fifth floor - Academic block",
    "mapImageUrl": "url-to-map-image",
    "facilities": ["wifi", "water-cooler"],
    "isAccessible": true
}
```
4. get room by id 
GET http://localhost:4000/api/room/get-rooms/673e7d116a7ac104097a8a0d

5. PUT /room/673e7b1c567b5c74a6d54a9e
```{
    "roomNumber": "102",
    "capacity": 45,
    "facilities": ["projector", "whiteboard", "air conditioning", "smart board"]
}```


### Get Building
- **Endpoint**: `GET /api/building/get-building/:id`
- **Description**: Retrieve details of a specific building by its ID

## Map Services

### Search Nearby Locations
- **Endpoint**: `GET /api/map/search-nearby`
- **Query Parameters**:
  - `lat`: Latitude
  - `lng`: Longitude
  - `radius`: Search radius
  - `type`: Location type
  - `accessibility`: Accessibility status

### Find Route
- **Endpoint**: `GET /api/map/find-route`
- **Query Parameters**:
  - `startLat`: Starting point latitude
  - `startLng`: Starting point longitude
  - `endLat`: Destination latitude
  - `endLng`: Destination longitude
  - `mode`: Transportation mode

### Get Directions
- **Endpoint**: `GET /api/map/get-direction`
- **Request Body**:
```json
{
    "origin": { "coordinates": [72.879, 19.077] },
    "destination": { "coordinates": [72.877, 19.075] },
    "mode": "walking",
    "alternatives": true
}
```