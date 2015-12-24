const el = document.getElementById("status");

export default function updateStatus ({text, color}) {
  return function (data) {
    el.textContent = text;
    // el.style.backgroundColor = color;
    return data;
  }
}