import { init } from "@module-federation/enhanced/runtime";

init({
  name: "product",
  remotes: [
    {
      name: "service",
      entry: "http://localhost:5002/mf-manifest.json",
    },
    {
      name: "services",
      entry: "http://localhost:5003/mf-manifest.json",
    },
  ],
});

import("./main");

const productEl = document.createElement("div");
productEl.id = "product";
document.body.appendChild(productEl);
document.querySelector("#product")!.innerHTML = `
<div class="content">
  <h1>Product 📦</h1>
</div>
`;
