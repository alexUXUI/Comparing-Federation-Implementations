import "./index.css";

const serviceEl = document.createElement("div");
// give it the id service
serviceEl.id = "service";
document.body.appendChild(serviceEl);
document.querySelector("#service")!.innerHTML = `
    <div class="content">
      <h1>Service 🧩</h1>
    </div>
`;
