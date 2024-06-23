# URL Shortener Project

This project includes both a backend API built with Ruby on Rails and a frontend interface built with React. The backend handles URL shortening functionalities, while the frontend allows users to interact with the API.

## Backend

The backend code repository can be found at [dpksingh24/linkshort](https://github.com/dpksingh24/linkshort). It provides a set of RESTful APIs for managing shortened URLs.

### Setup Instructions

1. **Clone the Repository**

   ```sh
   git clone https://github.com/dpksingh24/linkshort.git
   cd linkshort
   ```

2. **Install Dependencies**

   ```sh
   bundle install
   ```

3. **Database Setup**

   ```sh
   rails db:create
   rails db:migrate
   ```

4. **Start the Server**

   ```sh
   rails server
   ```

   The backend API will be accessible at `http://localhost:3000`.

### API Endpoints

- `POST /urls`: Create a new short URL
- `GET /urls`: Retrieve all URLs (newest first)
- `GET /urls/top_urls`: Get top 3 URLs by access count
- `GET /urls/top_level_domain`: Count top-level domains
- `DELETE /urls/:id`: Delete a URL by ID
- `GET /:slug`: Redirect to the original URL based on the short URL slug

## Frontend

The frontend is built using React and communicates with the backend API to provide a user-friendly interface for URL shortening.

### Getting Started with the Frontend

1. **Create a New React App**

   ```sh
   npx create-react-app url-shortener-frontend
   cd url-shortener-frontend
   ```

2. **Install Axios for API Requests**

   ```sh
   npm install axios
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root of your React project:

   ```plaintext
   REACT_APP_API_BASE_URL=''
   ```

4. **Start the React Development Server**

   ```sh
   npm start
   ```

   The React frontend will be served at `http://localhost:3001`.

### Features

- **URLForm Component**: Allows users to input a long URL and receive a shortened URL.
- **URLList Component**: Displays a list of shortened URLs with their corresponding original URLs and creation timestamps.

---

This README provides a high-level overview of your URL shortener project, guiding both developers and users on how to set up and interact with both the backend API and the React frontend. Adjust the URLs and setup instructions as per your specific project details.
