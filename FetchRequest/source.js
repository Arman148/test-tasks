const API = " https://dummyjson.com/products"; //API for fetch request

let dataArray = []; // array to copy data
let renderItems = 4; // how many items will render on screen
let isSortedByPrice = false; // default not sorting by price
let isSortByName = false; // default not sorting by name

const products = document.getElementById("products");   // getting "product" element
const loadMoreBtn = document.getElementById("loadMore");    //  getting "loadMore" button
const sortByPrice = document.getElementById("sortByPrice"); // getting "sortByPrice" button
const sortByName = document.getElementById("sortByName");

// functionality of "Load More" button
loadMoreBtn.addEventListener("click", () => {
    // cleaing products
    cleanProducts();
    // add 4 more products
    renderItems += 4; 
    // do fetch request
    getAllItems(API);
})

// functionality of "Sort by Price" button
sortByPrice.addEventListener("click", () => {
    // cleaing products
    cleanProducts();
    if (isSortedByPrice) {
        isSortedByPrice = false;
    } else {
        isSortedByPrice = true
    }    
    // do fetch request
    getAllItems(API);

})

// functionality of "sort by name" button
sortByName.addEventListener("click", () => {
    // cleaing products
    cleanProducts();
    if (isSortByName) {
        isSortByName = false;
    } else {
        isSortByName = true
    }
       
    // do fetch request
    getAllItems(API);

})

// clean products
const cleanProducts = () => {
    while (products.firstChild) {
        products.removeChild(products.firstChild);
    }
}

//fetch requet function
const getAllItems = (API) => {
    fetch(API)
    .then(res => res.json())
    .then(data => {
        dataArray = data.products;
        processAndRenderData(dataArray); //rendering function
    });
}


// render function to separate fetch request from rendering and processing
const processAndRenderData = (data) => {

    // cheking if data is sorted by price
    if (isSortedByPrice) {
        data = data.sort((a, b) => a.price - b.price);
    }

    if (isSortByName) {
        data = data.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    // rendering products 
    for (let i = 0; i < renderItems; i++) {
        
        // getting main information about each product
        let productName = data[i].title;
        let productBrand = data[i].brand;

        let productPrise = data[i].price;
        let discountPercentage = data[i].discountPercentage;
        
        let productDescription = data[i].description;
        let productPicture = data[i].images[0];
        let inStock = data[i].stock;
        
        // creating product box
        let itemBox = document.createElement("div");
        itemBox.classList.add("item");

        // creating picture box
        let pictureBox = document.createElement("div");
        pictureBox.classList.add("productPicture");       

        // creating picture 
        let picture = document.createElement("img");
        picture.classList.add("image");
        picture.src = `${productPicture}`
        pictureBox.appendChild(picture);

        // creating information box
        let informationBox = document.createElement("div");
        informationBox.classList.add("information");

        // creating nane 
        let nameElement = document.createElement("h4");
        nameElement.textContent = productName;
    
        // creating brand 
        let brandElement = document.createElement("p");
        brandElement.textContent = productBrand;

        // creating description 
        let descriptionElement = document.createElement("p");
        descriptionElement.textContent = limitString(productDescription);

        // creating box with price and "ADD" button
        let priceAndButtonBox = document.createElement("div");
        priceAndButtonBox.classList.add("priceAndButtonBox");

        // creating price
        let price = document.createElement("div");
        price.classList.add("price")


        // if discount percentage is more then 5%, displayin discaunt
        if (discountPercentage > 5) {
            let oldPrice = document.createElement("s");
            oldPrice.textContent = `${productPrise}$`;

            let newPrice = Math.ceil(productPrise - (( productPrise * discountPercentage ) / 100))

            let newPriceAndPercent = document.createElement("h3");
            newPriceAndPercent.textContent = ` ${newPrice}$`;

            let percent = document.createElement("span");
            percent.classList.add("percent")
            percent.textContent = ` ${Math.ceil(discountPercentage)}%`;
            
            newPriceAndPercent.insertBefore(oldPrice, newPriceAndPercent.firstChild)
            newPriceAndPercent.appendChild(percent);
            price.appendChild(newPriceAndPercent);
        } else {
            price.textContent = `${productPrise}$`;
        }

        // creating "ADD" button
        let addButton = document.createElement("button");
        addButton.textContent = "ADD";

        // functionality of "ADD" button (returing all information of product like in ENDPOINT)        
        addButton.addEventListener("click", () => {
            console.log(data[i]);
            return data[i];
        })

        // building elements inside product box
        priceAndButtonBox.appendChild(price);
        priceAndButtonBox.appendChild(addButton);

        informationBox.appendChild(brandElement);
        informationBox.appendChild(nameElement);
        informationBox.appendChild(descriptionElement);

        // if product is in stock displaying it on screen
        if (inStock > 0) {
            itemBox.appendChild(pictureBox);
            itemBox.appendChild(informationBox);
            itemBox.appendChild(priceAndButtonBox);
        
            products.appendChild(itemBox);
        }       
    }
}

// function to limit string (in description)
const limitString = (string) => {
    const maxLength = 60; // length of characters
    if (string.length > maxLength) {
        return string.substring(0, maxLength) + '...';
    }

    return string;
}

// doing fetch request
getAllItems(API);
