const allLikes = document.querySelectorAll(".fa-heart");
if (logedin) {
  for (let l of allLikes) {
    l.classList.add("active-like");
  }
} else {
  for (let l of allLikes) {
    l.classList.remove("active-like");
  }
}

for (let like of allLikes) {
  loadLikes(like.id, true);
}

async function getUserId() {
  let getUrl = window.location;
  let baseUrl =
    getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split("/")[0];
  const response = await fetch(baseUrl + "getUserId");
  return await response.json();
}

async function loadLikes(id, set = false) {
  let getUrl = window.location;
  let baseUrl =
    getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split("/")[0];
  const getLikesList = await fetch(baseUrl + "likeList", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postId: id,
    }),
  });
  if (set) {
    const spanid = "span" + id;
    const likeCounter = document.getElementById(spanid);
    const heart = document.getElementById(id);
    const likeArr = await getLikesList.json();
    likeCounter.innerText = likeArr.likes.length;
    if (logedin) {
      const username = await getUserId();
      if (likeArr.likes.includes(username)) {
        heart.style.color = "red";
      } else {
        heart.style.color = "rgb(6, 53, 192)";
      }
    }
  } else {
    return Array.from(await getLikesList.json());
  }
}

async function getEl(id) {
  let getUrl = window.location;
  let baseUrl =
    getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split("/")[0];
  const like = document.getElementById(id);
  if (logedin) {
    const getLikesList = await fetch(baseUrl + "likeList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: id,
      }),
    });
    const likeArr = await getLikesList.json();
    const username = await getUserId();
    if (!likeArr.likes.includes(username)) {
      likeArr.likes.push(username);
      document.getElementById(id).style.color = "red";
      document.getElementById("span" + id).innerText =
        +document.getElementById("span" + id).innerText + 1;
      await updateLikeList(likeArr.likes, id);
      await loadLikes(id, true);
    } else {
      const index = likeArr.likes.indexOf(username);
      likeArr.likes.splice(index, 1);
      document.getElementById(id).style.color = "rgb(6, 53, 192)";
      document.getElementById("span" + id).innerText =
        +document.getElementById("span" + id).innerText - 1;
      await updateLikeList(likeArr.likes, id);
      await loadLikes(id, true);
    }
  }
}

async function updateLikeList(list, id) {
  let getUrl = window.location;
  let baseUrl =
    getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split("/")[0];
  const res = await fetch(baseUrl + "updateLikeList", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: list,
      postId: id,
    }),
  });
}
