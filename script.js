"use strict";

const shortenContainer = document.querySelector(".shorten__container");
const shortenForm = document.querySelector(".shorten__form");
const shortenInput = document.querySelector(".shorten__input");
const shortenCopyBtn = document.querySelector(".shorten__box-btn");
const shortenError = document.querySelector(".shorten__error");

const shortenLinkContent = document.querySelector(".shorten__link");
const originalLinkContent = document.querySelector(".shorten__link-original");

let shortLink;

////////////////////////////////////////////////////////////

// LOCAL STORAGE
const shortLinksArr = [];

const getLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem("shortenedURLS"));
  if (!data) return;

  data.forEach((shortURL) => {
    shortLinksArr.push(shortURL);
    shortenContainer.insertAdjacentHTML("afterbegin", shortURL);
  });
};

getLocalStorage();

// RESET LOCAL STORAGE
const reset = function () {
  localStorage.removeItem("shortenedURLS");
  location.reload();
};

////////////////////////////////////////////////////////////

const shortenLink = async function (link) {
  try {
    const response = await fetch(
      `https://api.shrtco.de/v2/shorten?url=${link}`
    );

    const data = await response.json();
    if (!data.ok) throw new Error(`Error: ${data.error}`);

    shortLink = data.result.full_short_link;

    const html = `
    <div class="shorten__link-container">
    <a href="#" class="shorten__link-original">${link}</a>

    <div class="shorten__box">
      <a href="${shortLink}" class="shorten__link">${shortLink}</a>
      <button class="shorten__box-btn" data-clipboard-text="${shortLink}">Copy</button>
    </div>
  </div>
    `;

    shortLinksArr.push(html);

    localStorage.setItem("shortenedURLS", JSON.stringify(shortLinksArr));

    shortenContainer.insertAdjacentHTML("afterbegin", html);
  } catch (err) {
    console.error(err.message);
    shortenInput.style.outlineColor = "hsl(0, 87%, 67%)";
    shortenError.style.display = "block";
    shortenError.textContent = err.message;
  }
};

shortenContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("shorten__box-btn")) return;
  e.target.textContent = "Copied!";
  e.target.style.backgroundColor = "hsl(257, 27%, 26%)";

  navigator.clipboard.writeText(shortLink);
  setTimeout(() => {
    e.target.textContent = "Copy";
    e.target.style.backgroundColor = "hsl(180, 66%, 49%)";
  }, 3000);
});

shortenForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const link = shortenInput.value;
  shortenLink(link);
});
