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
        <div onclick="showDetails('${item.video_id}')" class="card rounded-md">
            <figure class="rounded-md relative">
                <img src=${
                  item.thumbnail
                } class="w-full h-[200px] object-cover " />

                ${
                  item.others.posted_date.length == 0
                    ? ""
                    : `<div class="absolute right-2 bottom-2 bg-black text-white text-xs py-1 px-2 rounded">
                      ${convert(Number(item.others.posted_date))}
                    </div>`
                }

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

// Show modal
const showDetails = async (id) => {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/video/${id}`
  );
  const data = await res.json();

  const modal = document.querySelector("#modal-container");
  modal.innerHTML = `
      <figure class="rounded-md">
        <img src=${data.video.thumbnail} class="w-full h-[300px] object-cover " />
      </figure>
      <h1 class="font-bold text-xl my-5">${data.video.title}</h1>
      <p>${data.video.description}</p>
  `;

  // Way 1:
  // document.querySelector("#showModalBtn").click();
  // way 2:
  document.querySelector("#detailsVideo").showModal();
};

// Convert number to Data
const convert = (number) => {
  const year = parseInt(number / 31556952);
  number %= 31556952;
  const month = parseInt(number / 2629746);
  number = number % 2629746;
  const day = parseInt(number / 86400);
  number %= 86400;
  const hour = parseInt(number / 3600);
  number %= 3600;
  const minute = parseInt(number / 60);

  if (year !== 0) {
    return `${year} years ${month} months ago`;
  } else if (month !== 0) {
    return `${month} months ${day} days ago`;
  } else if (day !== 0) {
    return `${day} days ${hour} hours ago`;
  } else {
    return `${hour} hours ${minute} minutes ago`;
  }
};

// Search
document.querySelector("#searchInput").addEventListener("keyup", (e) => {
  getVideos(e.target.value);
});

// Sort
const sortVideo = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/videos")
    .then((res) => res.json())
    .then((data) => sortObj(data.videos))
    .catch((err) => console.log(err));
};

// Sort Object
const sortObj = (item) => {
  item.sort((a, b) => {
    const viewA = parseInt(a.others.views.slice(0, a.others.views.length - 1));
    const viewB = parseInt(b.others.views.slice(0, b.others.views.length - 1));

    return viewB - viewA;
  });

  showVideos(item);
};

getCategory();
getVideos();
