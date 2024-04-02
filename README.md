This is the code for CCAPDEV MCO. It uses React + Vite and gets data from the TMDB API and uses MongoDB Atlas for the database.

About the Website:

Cineshare is a user-driven social media platform that allows it's users to interact with others through their love of movies. Below are Cineshare's features:

Personalized Profiles: Each user on Cineshare has a personalized profile where they can showcase their favorite movies and posts. Users can customize their profiles to reflect their  personalities, allowing them to connect with others who share similar interests.

Movie Reviews: Cineshare provides a platform for users to write detailed reviews on movies they've watched. Users are able to share their insights, opinions, and critiques to help others discover hidden gems or avoid disappointing films.

Watchlist: Users can create their own watchlist, allowing them to keep track of a list of movies they would like to watch.

Community Discussions: Cineshare allows users to post and comment, encouraging its users to engage in conversations about their favorite movies, movies they've watched, and more. From in-depth analysis of film themes to casual conversations about their insights on movies, there will always be something that will pique a cinephile's interest.

To access the MongoDB Atlas Database:
1. Contact the administrator of the database to whitelist the IP address of the system being used to access the database.
2. Install MongoDB for Visual Studio Code. (In VS Code, open "Extensions" in the left navigation and search for "MongoDB for VS Code." Select the extension and click install.)
3. In VS Code, open the Command Palette. (Click on "View" and open "Command Palette". Search "MongoDB: Connect" on the Command Palette and click on "Connect with Connection String.")
4. Connect to the MongoDB deployment. (Paste your connection string with the password of the user who is the owner of the cluster into the Command Palette.)

To run the application:
1. Clone the repository in Visual Studio Code.
2. Download Vite (usually I npm install)
3. Navigate to the directory wherein you cloned the repository.
4. Create a split-terminal of 2 terminals and navigate to "backend" directory in one and "frontend" directory in the other
5. Execute the "npm run dev" command in both terminals to run.
6. Navigate to "http:localhost:3000" to access the website

DEVELOPED BY:

Del Rosario, Javier Vicente Miguel L.
Gan, Austin Philippe V.
Santos, Stefano Nicholas E.
Suarez, Philipp Matthew B.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
