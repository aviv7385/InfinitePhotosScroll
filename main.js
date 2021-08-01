// Unsplash API
const count = 30;
const apiKey = 'YXJb2xTxaKNg1oURzcg6FGbuFo4z6FGUDQFflQMT8Hk';
//const topic = "architecture";
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// check if all images were loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}

// helper function to set attributes on DOM elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}


// create elements for links & photos and add to DOM
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    // run function for each object in photosArray
    photosArray.forEach(photo => {
        // create <div> to contain each photo
        const container = document.createElement('div');
        setAttributes(container, {
            class: 'container',
        });

        // create <a> to link to unsplash.com
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank', // open link in a new tab
        });

        // create <img> for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        });

        //create <div> for the overlay effect
        const overlayDiv = document.createElement('div');
        setAttributes(overlayDiv, {
            class: 'overlay',
        });
        overlayDiv.innerHTML = `<div>
                                    <p>Photo By 
                                    <a href="https://unsplash.com/@${photo.user.username}?utm_source=Infinite_Photos_Scroll&utm_medium=referral" target="_blank">${photo.user.name}</a> on 
                                    <a href="https://unsplash.com/?utm_source=Infinite_Photos_Scroll&utm_medium=referral" target="_blank">Unsplash</a></p>
                                </div>`;

        // event listener - check when each is finished loading
        img.addEventListener('load', imageLoaded);

        // put <img> inside the <a>, then put both inside imageContainer
        item.appendChild(img);
        container.appendChild(overlayDiv);
        container.appendChild(item)
        imageContainer.appendChild(container);
    });
}

// get photos from api
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        console.log(response);
        displayPhotos();
    }
    catch (err) {
        console.log(err);
    }
}

// if scrolling near bottom of the the page - load more photos
window.addEventListener('scroll', () => {
    // innerHeight = the height of the browser window
    // scrollY = how high we are from the tpo of the page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
});

// on load
getPhotos();