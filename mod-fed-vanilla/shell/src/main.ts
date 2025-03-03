import { loadRemote } from "@module-federation/enhanced/runtime";
import "./index.css";

loadRemote("product/component")
  .then((module: any) => {
    return module;
  })
  .catch((err: any) => {
    console.error(err);
  });

loadRemote("services/user")
  .then((module: any) => {
    console.log("user serivce loaded in shell");
    console.log(module);
    module.User.setName("Alex Shell");
    const name = module.User.getName();
    console.log(name);
    return module;
  })
  .catch((err: any) => {
    console.error(err);
  });

document.querySelector("#root")!.innerHTML = `
<div class="content">
  <h1>Shell 🐚</h1>
</div>
`;
