
// for popup
function popupForm() {
    document.getElementById("popup_form").classList.toggle("active")
}

// form






// // Open or create a database
const request = indexedDB.open('myDatabase', 1);
let db;

request.onerror = function (event) {
    console.error("Database error: " + event.target.errorCode);
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Database opened successfully");

    displayData();
};

request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('formData', { autoIncrement: true });
    objectStore.createIndex('Url', { unique: false });
    objectStore.createIndex('Title', { unique: false });
    objectStore.createIndex('Discription', { unique: false });
    objectStore.createIndex('blog_contant');
};

document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form data
    const Url = document.getElementById('post_Url').value;
    const Title = document.getElementById('title').value;
    const Discription = document.getElementById('discription').value;
    const blog_contant = document.getElementById('blog_contant').value;

    // Save form data to IndexedDB
    const transaction = db.transaction(['formData'], 'readwrite');
    const objectStore = transaction.objectStore('formData');

    const formData = {
        Id: new Date().getTime(),
        Url: Url,
        Title: Title,
        Discription: Discription,
        blog_contant: blog_contant
    };

    objectStore.add(formData);

    // Show the data on the webpage
    displayData();
    // Reset the form after adding a new blog
    document.getElementById('myForm').reset();
});

function displayData() {
    const transaction = db.transaction(['formData']);
    const objectStore = transaction.objectStore('formData');
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
        const data = event.target.result;

        const resultDiv = document.getElementById('result');


        data.forEach(function (formData) {


            resultDiv.innerHTML += `
            <div class="card">
            <img src="${formData.Url}" alt="">
               
                <strong>${formData.Title}</strong>
                <p>${formData.Discription}</p>
                
                <button onclick = "read(${formData.Id})">Read</button>
                
                
                </div>
            `;

        });
    };
}

// Read data from IndexedDB
function displaySelectedBlog(selectedBlog) {
    const selectedBlogContentDiv = document.getElementById('selectedBlogContent');
    selectedBlogContentDiv.innerHTML = `
        <nav>
        <!-- ......logo...... -->
        <div class="logo">PWSkills Blog</div>
        <!-- ......Add Blog Button...... -->
        <div class="addBlog_btn">
          <button><a href="index.html"><i class="fa-solid fa-arrow-left-long"></a></i></button>
        </div>
      </nav>
      <div class="blog">
      <div class="head">
          <div class="head_text">
      <strong class= "title">${selectedBlog.Title}</strong>
      <p class= "discription" >${selectedBlog.Discription}</p>
      </div>
      <img src="${selectedBlog.Url}" alt="">
  </div>
      <p class= "blogcontant">${selectedBlog.blog_contant}</p>
      
      
      </div>
        `;
}

function read(blogId) {
    // Read data from IndexedDB
    const transaction = db.transaction(['formData'], 'readonly');
    const objectStore = transaction.objectStore('formData');
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
        const data = event.target.result;
        if (data.length === 0) {
            alert('No data available to open.');
            return;
        }

        const selectedBlog = data.find(blog => blog.Id === blogId);
        if (!selectedBlog) {
            alert('Selected blog not found.');
            return;
        }

        // Prepare the data to be sent to the other webpage
        const dataToSend = JSON.stringify(selectedBlog);


        displaySelectedBlog(selectedBlog);


    };
};



