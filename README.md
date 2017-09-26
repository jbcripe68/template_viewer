# README #

This project requires you to develop a website template viewer. The template viewer is modeled after the filmstrip folder view in Windows Explorer.

### Technical Requirements ###

* Develop as a Single Page Application
* Develop both a front-end component and back-end API to retrieve the data.
* Use a javascript front-end implementation of your choice, some suggestions might be ReactJS, VueJS, or AngularJS
* Create a back-end API implementation with NodeJS/Express

### Reference ###
![Example Filmstrip](https://bitbucket.org/repo/kMx7k8n/images/3768382958-2017-09-26_9-09-27.png)

### Feature Requirements ###

* Display the thumbnail images in a filmstrip view below the main large image
* Set the thumbnail to have a sliding window with 4 thumbnails visible in the window at a time. 
* Implement a "next" and "previous" link per the styles provided. The sliding window is not circular, when the first 4 thumbnails appear, the previous link should be disabled. When the end of the thumbnail set is reached, the next link should be disabled.
  Note: The sliding window may not have a total of 4 thumbnails if the total template count is not evenly divisible by 4. There are 15 templates in the reference data.
* Example: If there are 15 templates total, then the initial view would show 4 thumbnail images with previous disabled, then clicking "Next" would advance to the next 4 images, next would advance to the next 4, and so on. Finally, there wouild only be 3 images in the sliding window with next disabled and previous enabled.
* When clicking on a thumbnail, the large image corresponding to that thumbnail should appear in the main window, along with the meta data about that template (ID, Cost, Description, Thumbnail File Name, Image File Name)
* Per the reference styles and html, the thumbnail image should have a border when selected.

### Reference Data ###

* /data/templates.json - Array of templates and meta data
* /images/large - Large size images of templates
* /images/thumbnails - Thumbnail images of templates
* /images/next.png - Button image for next link
* /images/previous.png - Button image for previous link
* index.html - reference HTML
* /style/style.css - reference CSS


### What if I have questions? ###

* Take your interpretation of the requirements. As long as your interpretation is defensible.

### How do I submit the project ###

* Upload to a bitbucket repo and provide us with the URL 
* Submit as a zip file via email
* Make sure to include a readme on any installation steps to run the project
