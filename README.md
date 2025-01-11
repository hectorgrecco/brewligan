
# Homebrew Package Manager API

This project is a Nest.js-based API that allows users to manage their Homebrew installed packages. Users can retrieve a list of installed packages or remove a package by its name.

## Features

- List all user-installed packages.
- Remove a specific package by its name.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   yarn
   ```
4. Start the development server:
   ```bash
   yarn start:dev
   ```

## Usage

The API provides the following endpoints:

- `GET /packages`: Retrieve a list of installed packages.
- `DELETE /packages/:name`: Remove a specific package by its name.

Use a tool like [Postman](https://www.postman.com/) or [cURL](https://curl.se/) to test the endpoints.

## To-Do

- [ ] Implement pagination for the `GET /packages` endpoint.
- [ ] Implement caching for packages retrieval.
- [ ] Show package size.
- [ ] Show packages that were installed by another packages.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the [MIT License](LICENSE).
