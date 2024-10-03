// Fetch Category
function getCategory() {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => showCategory(data.categories))
    .catch((error) => console.log("something went wrong in getCategory"));
}

// Show Category
const categoryContainer = document.querySelector("#categoryContainer");
const showCategory = (categories) => {
  categories.map((item) => {
    const container = document.createElement("div");
    container.innerHTML = `
        <button id="btn-${item.category_id}" onclick="getCategoryVideo(${item.category_id})" class="btn w-20 rounded btn-sm button-active">${item.category}</button>
    `;
    categoryContainer.appendChild(container);
  });
};

// Fetch Videos
const getVideos = async (title = "") => {
  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/phero-tube/videos?title=${title}`
    );
    const data = await res.json();

    const buttons = document.getElementsByClassName("button-active");
    for (const btn of buttons) {
      btn.classList.remove("btn-error", "text-white");
    }
    document.querySelector("#allBtn").classList.add("btn-error", "text-white");

    showVideos(data.videos);
  } catch (error) {
    console.log("something went wrong in getVideos");
  }
};

// Get Category Video
const getCategoryVideo = async (id) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/category/${id}`
  );
  const data = await response.json();

  // Set Active Button
  const buttons = document.getElementsByClassName("button-active");
  for (const btn of buttons) {
    btn.classList.remove("btn-error", "text-white");
  }
  document.querySelector(`#btn-${id}`).classList.add("btn-error", "text-white");

  showVideos(data.category);
};

// Show Videos
const videoContainer = document.querySelector("#videoContainer");
const showVideos = (videos) => {
  // Container will be empty
  videoContainer.innerHTML = "";

  // If videos is empty
  if (videos.length === 0) {
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML = `
        <div class="flex items-center justify-center flex-col">
            <img src="./assets/Icon.png" class="mt-20" />
            <h1 class="font-bold text-2xl mt-4">Oops!! Sorry, There is no content here</h1>
        </div>
    `;
    return;
  }

  videoContainer.classList.add("grid");
  videos.map((item) => {
    const container = document.createElement("div");
    container.innerHTML = `
        <div class="card rounded-md">
            <figure class="rounded-md">
                <img src=${
                  item.thumbnail
                } class="w-full h-[200px] object-cover " />
            </figure>

            <div class="my-3 flex gap-3">
                <div>
                    <img src=${
                      item.authors[0].profile_picture
                    } class="w-10 h-10 object-cover rounded-full" />
                </div>
                <div>
                    <h2 class="font-bold text-lg">${item.title}</h2>
                    <div class="flex items-center gap-2">
                     <p class="text-sm text-gray-500 font-medium">${
                       item.authors[0].profile_name
                     }</p>
                     ${
                       item.authors[0].verified
                         ? `<img class="w-5 h-5" src=${"https://img.icons8.com/?size=100&id=SRJUuaAShjVD&format=png&color=000000"} />`
                         : ""
                     }
                    </div>
                    <p class="text-sm text-gray-500 mt-1">${
                      item.others.views
                    } views</p>
                </div>
            </div>
        </div>
    `;
    videoContainer.appendChild(container);
  });
};

// Search
document.querySelector("#searchInput").addEventListener("keyup", (e) => {
  getVideos(e.target.value);
});

// Sort

getCategory();
getVideos();
