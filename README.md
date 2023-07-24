# Template Viewer

For this assignment I did alter the given index.css file to use display=flexbox for the groups and box-sizing=border-box. This is the way I usually configure my css and I did not like having the empty objects in group:before and group:after. I adjusted the heights to be the same as the original code. It makes more sense to me to use flexbox and create div objects with the desired height when there is no templates loaded (this happens when program is first loaded and if there is a network error).

I also had to add pointer-events=none when disabling the next and previous buttons as span elements will still accept mouse clicks with disabled property set. A good test of the code is to remove the pointer-events property in the index.css and click on the disabled next or previous buttons. You can then see the error handling from the backend when an invalid page is requested.

Other testing can be done by throttling the Network in the developer tools to see the "Loading..." message while fetching the data. You can also stop the backend to see a fetch error.

I decided to only add one entry point (get-page) in the backend API. It takes 2 query parameters

- page (current page which is 0 based)
- objsPerPage (hard coded in front end to 4 but could be other values)

The get-page API call returns the following data in json:

- status ("success" or "error")
- results (length of data array)
- numTotalPages (limit of pages when divided by objsPerPage)
- data: results (array of template data for requested page)

numTotalPages could have been a separate end point but it needs to be calculated for validating the page query parameter and I decided to keep the interface simple.

## running the project

### configuration

the following parameters can be set for your environment

- .env (holds the VITE_BACKEND_URL used to fetch data which is set to http://localhost:3005. Note the port in the url must match the backend configuration)
- server/config.env (holds the listening PORT which is set to 3005)

to run the template viewer in dev or production mode

### development

- npm install (to download dependent packages)
- npm start_backend_dev (to run with the smaller template.json data and set NODE_ENV to development which causes errors with details to be sent to front end)
- npm run dev (start front end server in dev mode. This will print a url that will display the front end)

after downloading the project you can run the following npm tasks:

- npm run lint (executes lint on all source files)
- npm run test (executes unit test on backend code)

### production

- npm install (to download dependent packages. Need to have dev dependencies to build and preview with vite)
- npm run start_backend (to run with larger extendedTemplate.json and set NODE_ENV to production which limits errors reported to front end)
- npm run build (builds react distribution)
- npm run preview (runs production server and prints a url that will display the front end)
